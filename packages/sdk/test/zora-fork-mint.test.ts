import { selectors } from '@boostxyz/signatures/events';
import {
  loadFixture,
  mine,
  reset,
} from '@nomicfoundation/hardhat-toolbox-viem/network-helpers';
import dotenv from 'dotenv';
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

dotenv.config();

let fixtures: Fixtures, budgets: BudgetFixtures;

describe('Boost with NFT Minting Incentive', () => {
  if (!process.env.ALCHEMY_API_KEY) {
    console.warn('Skipping tests: ALCHEMY_API_KEY is not defined');
    test.skip('Skipping tests: ALCHEMY_API_KEY is not defined');
    return;
  }
  // We take the address of the imposter from the transaction above
  const boostImpostor = '0x84DC02a3B41ff6Fb0B9288234B2B8051B641bF00' as Address;
  const trustedSigner = accounts.at(0)!;
  const BASE_CHAIN_URL =
    'https://base-mainnet.g.alchemy.com/v2/' + process.env.ALCHEMY_API_KEY;
  const BASE_CHAIN_BLOCK = 17519193;
  const selector = selectors[
    'Purchased(address,address,uint256,uint256,uint256)'
  ] as Hex;
  beforeAll(async () => {
    await reset(BASE_CHAIN_URL, BASE_CHAIN_BLOCK);
    fixtures = await loadFixture(deployFixtures);
  });

  beforeEach(async () => {
    budgets = await loadFixture(fundBudget(defaultOptions, fixtures));
  });

  test('should create a boost for incentivizing NFT minting', async () => {
    const { budget, erc20 } = budgets;
    const targetContract = '0x9D2FC5fFE5939Efd1d573f975BC5EEFd364779ae';
    const inputData =
      '0x359f130200000000000000000000000004e2516a2c207e84a1839755675dfd8ef6302f0a0000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000e000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000084dc02a3b41ff6fb0b9288234b2b8051b641bf00';
    // This is the zora contract we're going to push a transaction against
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
      signature: selector, // Transfer(address,address,uint256) event signature
      signatureType: SignatureType.EVENT, // We're working with an event
      actionType: 0, // Custom action type (set as 0 for now)
      targetContract: targetContract, // Address of the ERC20 contract
      // We want to target the Minter property on the Purchase event
      actionParameter: {
        filterType: FilterType.EQUAL, // Filter to check for equality
        fieldType: PrimitiveType.ADDRESS, // The field we're filtering is an address
        fieldIndex: 1, // Might need to be 2, we'll see - let's log this
        filterData: boostImpostor, // Filtering based on the core address
      },
    };

    // Define EventActionPayload manually
    const eventActionPayload = {
      actionClaimant: {
        signatureType: SignatureType.EVENT,
        signature: selector, // Transfer(address,address,uint256) event signature
        fieldIndex: 0, // Targeting the 'from' address
        targetContract: boostImpostor, // The ERC20 contract we're monitoring
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

    console.log('Event Action:', eventAction);
    // Create the boost using the custom EventAction
    await client.createBoost({
      protocolFee: 1n,
      referralFee: 2n,
      maxParticipants: 100n,
      budget: budget, // Use the ManagedBudget
      action: eventAction, // Pass the manually created EventAction
      validator: new bases.SignerValidator(defaultOptions, {
        signers: [owner, trustedSigner.account!],
        validatorCaller: fixtures.core.assertValidAddress(),
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

    // Use viem to send the transaction from the impersonated account
    const walletClient = await createTestClient({
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
    expect(await client.getBoostCount()).toBe(1n);
    const boost = await client.getBoost(0n);
    console.log('Boost:', boost);
    const action = boost.action;
    expect(action).toBeDefined();
    const testReceipt = await walletClient.sendTransaction({
      data: inputData,
      account: boostImpostor,
      to: targetContract,
      value: 29_777_000_000_000_000n,
    });
    const validation = await action.validateActionSteps();
    console.log('Action:', testReceipt);
    console.log('Validation:', validation);
    const incentiveData = pad('0xdef456232173821931823712381232131391321934');
    const incentiveQuantity = 1;
    const referrer = accounts.at(1)!.account!;

    const claimDataPayload = await prepareSignerValidatorClaimDataPayload({
      signer: trustedSigner,
      incentiveData,
      chainId: 8453,
      validator: boost.validator.assertValidAddress(),
      incentiveQuantity,
      claimant: boostImpostor,
      boostId: boost.id,
    });

    await fixtures.core.claimIncentiveFor(
      boost.id,
      0n,
      referrer,
      claimDataPayload,
      boostImpostor,
      { value: parseEther('0.000075') },
    );
  });
});
