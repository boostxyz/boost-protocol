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
  rpcSchema,
  toHex,
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
// This is the zora contract we're going to push a transaction against
const targetContract = '0xcDF27F107725988f2261Ce2256bDfCdE8B382B10' as Address;
// We take the raw inputData off of an existing historical transaction
// https://optimistic.etherscan.io/tx/0x3d281344e4d0578dfc5af517c59e87770d4ded9465456cee0bd1e93484976e88
const inputData =
  '0x5678138877d106504340c0bb50e5748cc9bd714e946816c7726ae7b15f132a7daa0705c40000000000000000000000000000000000000000000000000000000000000001';
// For this test the incentiveData doesn't matter but we'll use a random value to ensure the signing is working as expected
const incentiveData = pad('0xdef456232173821931823712381232131391321934');
// This is only for a single incentive boost
const incentiveQuantity = 1;
const referrer = accounts[1].account;

// We take the address of the imposter from the transaction above
const boostImpostor = '0xc47F2266b6076b79C0a6a9906C6592b34C03c914' as Address;
const trustedSigner = accounts[0];
const RPC_URL =
  'https://opt-mainnet.g.alchemy.com/v2/' + process.env.VITE_ALCHEMY_API_KEY;
const OPT_CHAIN_BLOCK = BigInt('125541463');
const selector = selectors[
  'VoteCast(address,uint256,uint8,uint256,string)'
] as Hex;

describe.skipIf(!process.env.VITE_ALCHEMY_API_KEY)(
  'Boost with Voting Incentive',
  () => {
    beforeAll(async () => {
      await reset(RPC_URL, OPT_CHAIN_BLOCK - 1n);
      fixtures = await loadFixture(deployFixtures);
      budgets = await loadFixture(fundBudget(defaultOptions, fixtures));
    });

    test('should create a boost for incentivizing votes', async () => {
      const { budget, erc20 } = budgets;

      const { core, bases } = fixtures;

      const client = new BoostCore({
        ...defaultOptions,
        address: core.assertValidAddress(),
      });
      const owner = defaultOptions.account.address;
      // This is a workaround to this known issue: https://github.com/NomicFoundation/hardhat/issues/5511
      await mine();

      // Step defining the action for VoteCast event
      const eventActionStep: ActionStep = {
        signature: selector, // VoteCast(address,uint256,uint8,uint256,string) event signature
        signatureType: SignatureType.EVENT, // We're working with an event
        actionType: 0, // Custom action type (set as 0 for now)
        targetContract: targetContract, // Address of the ERC20 contract
        // We want to target the ProposalId property on the VoteCast event
        actionParameter: {
          filterType: FilterType.NOT_EQUAL, // Filter to check for equality
          fieldType: PrimitiveType.UINT, // The field we're filtering is a uint
          fieldIndex: 0, // Might need to be 1, we'll see - let's log this
          filterData: toHex(
            '54194543592303757979358957212312678549449891089859364558242427871997305750980',
          ), // Filtering based on the proposal id
        },
        chainid: optimism.id,
      };

      // TODO: Add another step to check for support

      // Define EventActionPayload manually
      const eventActionPayload = {
        actionClaimant: {
          signatureType: SignatureType.EVENT,
          signature: selector, // VoteCast(address,uint256,uint8,uint256,string) event signature
          fieldIndex: 0, // Targeting the 'proposalId' uint
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
      console.log('boost created');

      // Make sure the boost was created as expected
      expect(await client.getBoostCount()).toBe(1n);
      const boost = await client.getBoost(0n);
      const action = boost.action;
      expect(action).toBeDefined();

      const actionSteps = await action.getActionSteps();
      console.log(action.address);
      console.log({ actionSteps });

      const isActionStepValid = await action.isActionStepValid(actionSteps[0]);
      console.log({ isActionStepValid });

      // Use viem to send the transaction from the impersonated account
      const walletClient = createTestClient({
        transport: http('http://127.0.0.1:8545'),
        chain: optimism,
        mode: 'hardhat',
      })
        .extend(publicActions)
        .extend(walletActions);
      console.log('created test client walletClient');

      await walletClient.reset({
        jsonRpcUrl: RPC_URL,
        // jsonRpcUrl: 'http://127.0.0.1:8545', // getting timeout when requesting eth_chainId
        blockNumber: OPT_CHAIN_BLOCK - 1n,
      });
      console.log('walletClient reset');
      await walletClient.impersonateAccount({
        address: boostImpostor,
      });
      console.log('impersonateAccount');
      await walletClient.setBalance({
        address: boostImpostor,
        value: parseEther('10'),
      });
      console.log('setBalance');
      const testReceipt = await walletClient.sendTransaction({
        data: inputData,
        account: boostImpostor,
        to: targetContract,
      });

      const transaction = await walletClient.getTransactionReceipt({
        hash: testReceipt,
      });
      const logs = transaction.logs;
      console.log(transaction.logs);

      // Make sure that the transaction was sent as expected and validates the action
      expect(testReceipt).toBeDefined();
      const validation = await action.validateActionSteps({
        logs, // do we need to pass the logs in, in order to validate them?
      }); // this doesn't work for some reason
      expect(validation).toBe(true);
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
