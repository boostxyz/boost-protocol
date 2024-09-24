import { selectors } from '@boostxyz/signatures/functions';
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
import { optimism } from 'viem/chains';
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
// This is the uniswap contract we're going to push a transaction against
const targetContract = '0x88cbDF306C53b31cb1Dc5b465503d8C70d57bd3C' as Address;
// We take the raw inputData off of an existing historical transaction
// https://optimistic.etherscan.io/tx/0x57b2f3c07d6705bae18fd7129d5ea1c3f3c903447f92b206689593487daf1abb
const inputData =
  '0x3593564c000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000066f1d9d5000000000000000000000000000000000000000000000000000000000000000300060c00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000001800000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000056bc75e2d631000000000000000000000000000000000000000000000000000000219ca7b261cc76e00000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002b6985884c4392d348587b19cb9eaaf157f13271cd000bb842000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000060000000000000000000000000420000000000000000000000000000000000000600000000000000000000000077777d91c0b8ec9984a05302e4ef041dccf77fee0000000000000000000000000000000000000000000000000000000000000050000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000216d28496122ce4';
// For this test the incentiveData doesn't matter but we'll use a random value to ensure the signing is working as expected
const incentiveData = pad('0xdef456232173821931823712381232131391321934');
// This is only for a single incentive boost
const incentiveQuantity = 1;
const referrer = accounts[1].account;

// We take the address of the imposter from the transaction above
const boostImpostor = '0x8652B4598A997dfdf5809344B3b2Ba709A65A786' as Address;
const trustedSigner = accounts[0];
const RPC_URL =
  'https://opt-mainnet.g.alchemy.com/v2/' + process.env.VITE_ALCHEMY_API_KEY;
const OPTIMISM_CHAIN_BLOCK = 125763452;
const selector = selectors[
  'execute(bytes commands, bytes[] inputs, uint256 deadline)'
] as Hex;

describe.skipIf(!process.env.VITE_ALCHEMY_API_KEY)(
  'Boost with Swapping on Uniswap Incentive',
  () => {
    beforeAll(async () => {
      await reset(RPC_URL, OPTIMISM_CHAIN_BLOCK);
      fixtures = await loadFixture(deployFixtures);
      budgets = await loadFixture(fundBudget(defaultOptions, fixtures));
    });

    test('should create a boost for incentivizing swapping on Uniswap', async () => {
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
        signature: pad(selector), // execute(bytes commands,bytes[] inputs,uint256 deadline) function signature
        signatureType: SignatureType.FUNC, // We're working with a fuction
        actionType: 0, // Custom action type (set as 0 for now)
        targetContract: targetContract, // Address of the Uniswap router contract
        // We want to target the inputs property on the execute function
        actionParameter: {
          filterType: FilterType.CONTAINS, // Filter to check for equality
          fieldType: PrimitiveType.BYTES, // The field we're filtering is an address
          fieldIndex: 1, // Might need to be 2, we'll see - let's log this
          filterData: '0x6985884c4392d348587b19cb9eaaf157f13271cd', // Filtering based on swapTo contract (ZRO)
        },
        chainid: optimism.id,
      };

      // Define EventActionPayload manually
      const eventActionPayload = {
        actionClaimant: {
          signatureType: SignatureType.FUNC,
          signature: pad(selector), // execute(bytes commands,bytes[] inputs,uint256 deadline) function signature
          fieldIndex: 0, // Targeting the 'from' address
          targetContract: targetContract, // The ERC20 contract we're monitoring
          chainid: optimism.id,
        },
        actionStepOne: eventActionStep, // Use the custom step for action
        actionStepTwo: eventActionStep, // Repeat the action step if necessary
        actionStepThree: eventActionStep, // You can expand for more steps if needed
        actionStepFour: eventActionStep, // Up to 4 action steps
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
          signers: [owner, trustedSigner.account], // Whichever account we're going to sign with needs to be a signer
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
      const walletClient = createTestClient({
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
        value: 29_777_000_000_000_000n,
      });

      // Make sure that the transaction was sent as expected and validates the action
      expect(testReceipt).toBeDefined();

      // validation doesn't work against functions, ideally will validate here
      // const validation = await action.validateActionSteps();
      // expect(validation).toBe(true);

      // Generate the signature using the trusted signer
      const claimDataPayload = await prepareSignerValidatorClaimDataPayload({
        signer: trustedSigner,
        incentiveData,
        chainId: optimism.id,
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
