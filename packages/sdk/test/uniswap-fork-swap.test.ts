import { selectors as eventSelectors } from '@boostxyz/signatures/events';
import { selectors as funcSelectors } from '@boostxyz/signatures/functions';
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
import {
  type ActionStep,
  FilterType,
  PrimitiveType,
  SignatureType,
  prepareSignerValidatorClaimDataPayload,
} from '../src';
import { BoostCore } from '../src/BoostCore';
import { StrategyType } from '../src/claiming';
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
const uniswapRouter = '0xCb1355ff08Ab38bBCE60111F1bb2B784bE25D7e8';
// We take the raw inputData off of an existing historical transaction
// https://optimistic.etherscan.io/tx/0x47a5d7b1b6e2866fcebd731fba5fa0b5386815db6002013e7e1dd43a0538bc04
const inputData =
  '0x3593564c000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000066f6e3fb00000000000000000000000000000000000000000000000000000000000000040b000604000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000e00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000028000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000028db3066eac000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000028db3066eac000000000000000000000000000000000000000000000000000deab85555214488b700000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002b42000000000000000000000000000000000000060001f44200000000000000000000000000000000000042000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006000000000000000000000000042000000000000000000000000000000000000420000000000000000000000003d83ec320541ae96c4c91e9202643870458fb290000000000000000000000000000000000000000000000000000000000000001900000000000000000000000000000000000000000000000000000000000000600000000000000000000000004200000000000000000000000000000000000042000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000deab85555214488b7';
// For this test the incentiveData doesn't matter but we'll use a random value to ensure the signing is working as expected
const incentiveData = pad('0xdef456232173821931823712381232131391321934');
// This is only for a single incentive boost
const incentiveQuantity = 1;
const referrer = accounts[1].account;

// We take the address of the imposter from the transaction above
const boostImpostor = '0xc25fef376784E9BcaD3E1472575c1E10079c56d1' as Address;
const trustedSigner = accounts[0];
const RPC_URL =
  'https://opt-mainnet.g.alchemy.com/v2/' + process.env.VITE_ALCHEMY_API_KEY;
const OPT_CHAIN_BLOCK = BigInt('125928596');

const funcSelector = funcSelectors[
  'execute(bytes commands, bytes[] inputs, uint256 deadline)'
] as Hex;
const eventSelector = eventSelectors[
  'Transfer(address,address,uint256)'
] as Hex;

describe.skipIf(!process.env.VITE_ALCHEMY_API_KEY)(
  'Boost with Swapping on Uniswap Incentive',
  () => {
    const walletClient = createTestClient({
      transport: http('http://127.0.0.1:8545'),
      chain: optimism,
      mode: 'hardhat',
    })
      .extend(publicActions)
      .extend(walletActions);

    beforeAll(async () => {
      fixtures = await loadFixture(deployFixtures);
      budgets = await loadFixture(fundBudget(defaultOptions, fixtures));

      await walletClient.reset({
        // jsonRpcUrl: RPC_URL,
        jsonRpcUrl: 'http://127.0.0.1:8545', // getting timeout when requesting eth_chainId
        blockNumber: OPT_CHAIN_BLOCK - 1n,
      });
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

      // OP token address
      const erc20TokenAddress =
        '0x4200000000000000000000000000000000000042' as Address;

      // Step for defining the action for the execute function (loose validation to ensure the address calls the function)
      const eventActionStepOne: ActionStep = {
        signature: pad(funcSelector), // execute(bytes commands,bytes[] inputs,uint256 deadline) function signature
        signatureType: SignatureType.FUNC, // We're working with a fuction
        actionType: 0, // Custom action type (set as 0 for now)
        targetContract: uniswapRouter, // Address of the Uniswap router contract
        // We want to target the commands property on the execute function
        actionParameter: {
          filterType: FilterType.NOT_EQUAL,
          fieldType: PrimitiveType.BYTES, // The field we're filtering is a bytes type
          fieldIndex: 0,
          filterData: '0x0', // since we're using NOT_EQUAL, we can put anything but '0x0b000604'
        },
        chainid: optimism.id,
      };

      // Two steps defining the action for Transfer event (transfer of OP from Uniswap Router -> boostImpostor)
      const eventActionStepTwo: ActionStep = {
        signature: eventSelector, // Transfer(address,address,uint256) event signature
        signatureType: SignatureType.EVENT, // We're working with an event
        actionType: 0, // Custom action type (set as 0 for now)
        targetContract: erc20TokenAddress, // Address of the ERC20 token address
        actionParameter: {
          filterType: FilterType.EQUAL, // Filter to check for equality
          fieldType: PrimitiveType.ADDRESS, // The field we're filtering is an address
          fieldIndex: 1, // we want to target the first event, but the topic[0] is reserved for the event hash
          filterData: uniswapRouter, // Filtering based on the Uniswap Router address
        },
        chainid: optimism.id,
      };
      const eventActionStepThree: ActionStep = {
        signature: eventSelector, // Transfer(address,address,uint256) event signature
        signatureType: SignatureType.EVENT, // We're working with an event
        actionType: 0, // Custom action type (set as 0 for now)
        targetContract: erc20TokenAddress, // Address of the ERC20 token address
        actionParameter: {
          filterType: FilterType.EQUAL, // Filter to check for equality
          fieldType: PrimitiveType.ADDRESS, // The field we're filtering is an address
          fieldIndex: 2,
          filterData: boostImpostor, // Filtering based on the boost impostor's address
        },
        chainid: optimism.id,
      };

      // Define EventActionPayload manually
      const eventActionPayload = {
        actionClaimant: {
          signatureType: SignatureType.FUNC,
          signature: eventSelector, // Transfer(address,address,uint256) event signature
          fieldIndex: 1, // Targeting the 'to' address
          targetContract: erc20TokenAddress, // The ERC20 contract we're monitoring
          chainid: optimism.id,
        },
        actionSteps: [
          eventActionStepOne,
          eventActionStepTwo,
          eventActionStepThree,
        ],
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
        to: uniswapRouter,
        value: parseEther('0.184'),
      });

      // Make sure that the transaction was sent as expected and validates the action
      expect(testReceipt).toBeDefined();

      // validation doesn't work against functions, ideally will validate here
      const validation = await action.validateActionSteps({
        hash: '0x57b2f3c07d6705bae18fd7129d5ea1c3f3c903447f92b206689593487daf1abb',
      });
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
