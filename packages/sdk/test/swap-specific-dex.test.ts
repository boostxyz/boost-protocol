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
import { base } from 'viem/chains';
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
// This is the aerodrome universal router contract we're going to push a transaction against
const targetContract = '0x6Cb442acF35158D5eDa88fe602221b67B400Be3E';
// We take the raw inputData off of an existing historical transaction
// https://basescan.org/tx/0x17a4d7e08acec16f385d2a038b948359919e3675eca22a09789b462a9178a769
const inputData =
  '0x24856bc30000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000030b000800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000001e000000000000000000000000000000000000000000000000000000000000000400000000000000000000000006cb442acf35158d5eda88fe602221b67b400be3e00000000000000000000000000000000000000000000000000005af3107a40000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000b543a23ebf95b35f7e472076c34705821e3b081700000000000000000000000000000000000000000000000000005af3107a4000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002b42000000000000000000000000000000000000060000c8940181a94a35a4569e4529a3cdfb74e38fd986310000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000180000000000000000000000000865c301c46d64de5c9b124ec1a97ef1efc1bcbd100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000041c1f00000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000940181a94a35a4569e4529a3cdfb74e38fd98631000000000000000000000000ff8adec2221f9f4d8dfbafa6b9a297d17603493d0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000ff8adec2221f9f4d8dfbafa6b9a297d17603493d000000000000000000000000833589fcd6edb6e08f4c7c32d4f71b54bda029130000000000000000000000000000000000000000000000000000000000000000';
// For this test the incentiveData doesn't matter but we'll use a random value to ensure the signing is working as expected
const incentiveData = pad('0xdef456232173821931823712381232131391321934');
// This is only for a single incentive boost
const incentiveQuantity = 1;
const referrer = accounts[1].account;

// We take the address of the imposter from the transaction above
const boostImpostor = '0x865C301c46d64DE5c9B124Ec1a97eF1EFC1bcbd1' as Address;
const trustedSigner = accounts[0];
const BASE_CHAIN_URL =
  'https://base-mainnet.g.alchemy.com/v2/' + process.env.VITE_ALCHEMY_API_KEY;
const BASE_CHAIN_BLOCK = 20166633;
// const selector = selectors['execute(bytes commands,bytes[] inputs)'] as Hex;
const selector =
  '0x24856bc300000000000000000000000000000000000000000000000000000000' as Hex;

describe.skipIf(!process.env.VITE_ALCHEMY_API_KEY)(
  'Boost for Swapping on a Specific DEX (aerodrome)',
  () => {
    beforeAll(async () => {
      await reset(BASE_CHAIN_URL, BASE_CHAIN_BLOCK);
      fixtures = await loadFixture(deployFixtures);
      budgets = await loadFixture(fundBudget(defaultOptions, fixtures));
    });

    test('should create a boost for swapping on a specific DEX', async () => {
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
        chainid: base.id,
        signature: selector, // execute(bytes commands,bytes[] inputs)
        signatureType: SignatureType.FUNC, // We're working with a function signature
        actionType: 0, // Custom action type (set as 0 for now)
        targetContract: targetContract, // Address of the universal router contract
        actionParameter: {
          filterType: FilterType.NOT_EQUAL, // Filter to check for equality
          fieldType: PrimitiveType.BYTES, // The field we're filtering is an address
          fieldIndex: 1,
          filterData: '0x0', // Filtering based on the core address
        },
      };

      // Define EventActionPayload manually
      const eventActionPayload = {
        actionClaimant: {
          chainid: base.id,
          signatureType: SignatureType.FUNC,
          signature: selector, // execute(bytes commands,bytes[] inputs)
          fieldIndex: 0, // Targeting the 'from' address
          targetContract: targetContract as Address, // The universal router contract
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
        chain: base,
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
        value: parseEther('0.0001'),
      });

      // Make sure that the transaction was sent as expected and validates the action
      expect(testReceipt).toBeDefined();
      const validation = await action.validateActionSteps();
      expect(validation).toBe(true);
      // Generate the signature using the trusted signer
      const claimDataPayload = await prepareSignerValidatorClaimDataPayload({
        signer: trustedSigner,
        incentiveData,
        chainId: base.id,
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
