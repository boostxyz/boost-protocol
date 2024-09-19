import { selectors } from '@boostxyz/signatures/events';
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
import { base, sepolia } from 'viem/chains';
import { beforeAll, describe, expect, test } from 'vitest';
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
// This is the ens register controller contract
const targetContract = '0xFED6a969AaA60E4961FCD3EBF1A2e8913ac65B72';
// We take the raw inputData off of an existing historical transaction
// https://sepolia.etherscan.io/tx/0xe527caab33384a58780aa12218c159c0b1910921aca0bc311a9dd7c39efb3316
const inputData =
  '0x74694a2b0000000000000000000000000000000000000000000000000000000000000100000000000000000000000000d11dd72b7555205746fa537928d87dec6bd262750000000000000000000000000000000000000000000000000000000007861f809923eb9400000003d38704f2585fb75b2bf96a1c277a5cee490aadc929f777b50000000000000000000000008fade66b79cc9f707ab26799354482eb93a5b7dd000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000430303030000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000a48b95dd719506df1a6b44c5457e2eff373a7bfa88acc5f9788983f78b6ee96c989d53193c000000000000000000000000000000000000000000000000000000000000003c00000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000014d11dd72b7555205746fa537928d87dec6bd2627500000000000000000000000000000000000000000000000000000000000000000000000000000000';
// For this test the incentiveData doesn't matter but we'll use a random value to ensure the signing is working as expected
const incentiveData = pad('0xdef456232173821931823712381232131391321934');
// This is only for a single incentive boost
const incentiveQuantity = 1;
const referrer = accounts.at(1)!.account!;

// We take the address of the imposter from the transaction above
const boostImpostor = '0xd11dD72b7555205746fa537928D87DeC6bD26275' as Address;
const trustedSigner = accounts.at(0)!;
const CHAIN_URL =
  'https://eth-sepolia.g.alchemy.com/v2/' + process.env.VITE_ALCHEMY_API_KEY;
const CHAIN_BLOCK = 6717978;
const selector = selectors[
  'NameRegistered(string,bytes32,address,uint256,uint256,uint256)'
] as Hex;

describe.skipIf(!process.env.VITE_ALCHEMY_API_KEY)(
  'Boost with ENS Registration Incentive',
  () => {
    beforeAll(async () => {
      await reset(CHAIN_URL, CHAIN_BLOCK);
      fixtures = await loadFixture(deployFixtures);
      budgets = await loadFixture(fundBudget(defaultOptions, fixtures));
    });

    test('should create a boost for incentivizing ENS registration', async () => {
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
        signature: selector, // NameRegistered(string,bytes32,address,uint256,uint256,uint256)
        signatureType: SignatureType.EVENT, // We're working with an event
        actionType: 0, // Custom action type (set as 0 for now)
        targetContract: targetContract, // Address of the targetContract
        // We want to target the Minter property on the Purchase event
        actionParameter: {
          filterType: FilterType.EQUAL, // Filter to check for equality
          fieldType: PrimitiveType.ADDRESS, // The field we're filtering is an address
          fieldIndex: 2, // The topic for the parameter we're filtering
          filterData: boostImpostor, // Filtering based on minters address
        },
      };

      // Define EventActionPayload manually
      const eventActionPayload = {
        actionClaimant: {
          signatureType: SignatureType.EVENT,
          signature: selector, // NameRegistered(string,bytes32,address,uint256,uint256,uint256)
          fieldIndex: 0, // Targeting the 'from' address
          targetContract: boostImpostor, // The ERC20 contract we're monitoring
        },
        actionSteps: [eventActionStep],
      };
      // Initialize EventAction with the custom payload
      const eventAction = new bases.EventAction(
        defaultOptions,
        eventActionPayload,
      );
      // Create the boost using the custom EventAction
      await client.createBoost({
        protocolFee: 250n,
        referralFee: 250n,
        maxParticipants: 100n,
        budget: budget,
        action: eventAction,
        validator: new bases.SignerValidator(defaultOptions, {
          signers: [owner, trustedSigner.account!],
          validatorCaller: fixtures.core.assertValidAddress(), // only core should be calling into the validate otherwise it's possible to burn signatures
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
      const walletClient = createTestClient({
        transport: http('http://127.0.0.1:8545'),
        chain: sepolia,
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
        value: 408279452054767655n,
      });

      // Make sure that the transaction was sent as expected and validates the action
      expect(testReceipt).toBeDefined();
      const validation = await action.validateActionSteps();
      expect(validation).toBe(true);
      // Generate the signature using the trusted signer
      const claimDataPayload = await prepareSignerValidatorClaimDataPayload({
        signer: trustedSigner,
        incentiveData,
        chainId: sepolia.id,
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
