import { selectors } from '@boostxyz/signatures/functions';
// ! todo: add func signature to signatures package
import {
  loadFixture,
  mine,
  reset,
} from '@nomicfoundation/hardhat-toolbox-viem/network-helpers';
import {
  http,
  type Address,
  type Hex,
  createTestClient,
  pad,
  parseEther,
  publicActions,
  walletActions,
} from 'viem';
import { base, optimism } from 'viem/chains';
import { beforeAll, beforeEach, describe, expect, test, vi } from 'vitest';
import { BoostCore } from '../src/BoostCore';
import {
  type ActionStep,
  FilterType,
  PrimitiveType,
  SignatureType,
  StrategyType,
  prepareSignerValidatorClaimDataPayload,
} from '../src/utils';
import { accounts } from './accounts';
import {
  type BudgetFixtures,
  type Fixtures,
  defaultOptions,
  deployFixtures,
  fundBudget,
} from './helpers';

let fixtures: Fixtures, budgets: BudgetFixtures;
// This is the optimism token contract we're going to push delegate transaction against
const targetContract = '0x4200000000000000000000000000000000000042' as Address;
// We take the raw inputData off of an existing historical transaction
// https://optimistic.etherscan.io/tx/0x4dfde81b78f109ffefb1baef990b1a430048a4a4fad087af0baf5d89ee9c2e98
const inputData =
  '0x5c19a95c000000000000000000000000cdf27f107725988f2261ce2256bdfcde8b382b10';
// For this test the incentiveData doesn't matter but we'll use a random value to ensure the signing is working as expected
const incentiveData = pad('0xdef456232173821931823712381232131391321934');
// This is only for a single incentive boost
const incentiveQuantity = 1;
const referrer = accounts.at(1)!.account!;

// We take the address of the imposter from the transaction above
const boostImpostor = '0xD9B11f4B57606147227ca34cAeb64d606De21408' as Address; // from address
const delegatee = '0xcDF27F107725988f2261Ce2256bDfCdE8B382B10' as Address;
const trustedSigner = accounts.at(0)!;
const BASE_CHAIN_URL =
  'https://opt-mainnet.g.alchemy.com/v2/' + process.env.VITE_ALCHEMY_API_KEY;
const BASE_CHAIN_BLOCK = 125543723;
const selector = '0x5c19a95c' as Hex;

describe.skipIf(!process.env.VITE_ALCHEMY_API_KEY)(
  'Boost with Delegate Action Incentive',
  () => {
    beforeAll(async () => {
      await reset(BASE_CHAIN_URL, BASE_CHAIN_BLOCK);
      fixtures = await loadFixture(deployFixtures);
      budgets = await loadFixture(fundBudget(defaultOptions, fixtures));
    });

    test('should create a boost for incentivizing delegation to a specific address', async () => {
      const { budget, erc20 } = budgets;

      const { core, bases } = fixtures;

      const client = new BoostCore({
        ...defaultOptions,
        address: core.assertValidAddress(),
      });
      const owner = defaultOptions.account.address;
      // This is a workaround to this known issue: https://github.com/NomicFoundation/hardhat/issues/5511
      await mine();

      // Step defining the action for Transfer event
      const eventActionStep: ActionStep = {
        signature: selector, // delegate(address delegatee) function signature
        signatureType: SignatureType.EVENT, // We're working with an function
        actionType: 0, // Custom action type (set as 0 for now)
        targetContract: targetContract, // Address of the ERC20 contract
        // We want to target the Minter property on the Purchase event
        actionParameter: {
          filterType: FilterType.EQUAL, // Filter to check for equality
          fieldType: PrimitiveType.ADDRESS, // The field we're filtering is an address
          fieldIndex: 0, // Might need to be 2, we'll see - let's log this
          filterData: delegatee, // Filtering based on the delegatee address
        },
      };

      // Define EventActionPayload manually
      const eventActionPayload = {
        actionClaimant: {
          signatureType: SignatureType.FUNC,
          signature: selector, // delegate(address delegatee) function signature
          fieldIndex: 0, // Targeting the 'delegatee' address
          targetContract: targetContract, // The ERC20 contract we're monitoring
        },
        actionStepOne: eventActionStep,
        actionStepTwo: eventActionStep,
        actionStepThree: eventActionStep,
        actionStepFour: eventActionStep,
      };
      // Initialize EventAction with the custom payload
      const eventAction = new bases.EventAction(
        defaultOptions,
        eventActionPayload,
      );
      // Create the boost using the custom EventAction
      await client.createBoost({
        protocolFee: 1n,
        referralFee: 2n,
        maxParticipants: 100n,
        budget: budget, // Use the ManagedBudget
        action: eventAction, // Pass the manually created EventAction
        validator: new bases.SignerValidator(defaultOptions, {
          signers: [owner, trustedSigner.account!], // Whichever account we're going to sign with needs to be a signer
          validatorCaller: fixtures.core.assertValidAddress(), // Only core should be calling into the validate otherwise it's possible to burn signatures
        }),
        allowList: new bases.SimpleAllowList(defaultOptions, {
          owner: owner,
          allowed: [owner],
        }),
        incentives: [
          new bases.ERC20Incentive(defaultOptions, {
            asset: erc20.assertValidAddress(),
            reward: parseEther('1'),
            limit: 100n,
            strategy: StrategyType.POOL,
          }),
        ],
      });

      // Make sure the boost was created as expected
      expect(await client.getBoostCount()).toBe(1n);
      const boost = await client.getBoost(0n);
      const action = boost.action;
      expect(action).toBeDefined();

      // Use viem to send the transaction from the impersonated account
      const walletClient = await createTestClient({
        transport: http('http://127.0.0.1:8545'),
        chain: optimism,
        mode: 'hardhat',
      })
        .extend(publicActions)
        .extend(walletActions);
      await walletClient.impersonateAccount({
        address: boostImpostor,
      });
      await walletClient.setBalance({
        address: boostImpostor,
        value: parseEther('10'),
      });
      const testReceipt = await walletClient.sendTransaction({
        data: inputData,
        account: boostImpostor,
        to: targetContract,
        value: 0n,
      });

      // Make sure that the transaction was sent as expected and validates the action
      expect(testReceipt).toBeDefined();
      const validation = await action.validateActionSteps();
      expect(validation).toBe(true);
      // Generate the signature using the trusted signer
      const claimDataPayload = await prepareSignerValidatorClaimDataPayload({
        signer: trustedSigner,
        incentiveData,
        chainId: 10,
        validator: boost.validator.assertValidAddress(),
        incentiveQuantity,
        claimant: boostImpostor,
        boostId: boost.id,
      });

      // Claim the incentive for the imposter
      await fixtures.core.claimIncentiveFor(
        boost.id,
        0n,
        referrer,
        claimDataPayload,
        boostImpostor,
        { value: parseEther('0.000075') },
      );
    });
  },
);
