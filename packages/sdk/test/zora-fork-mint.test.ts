import {
  loadFixture,
  reset,
} from '@nomicfoundation/hardhat-toolbox-viem/network-helpers';
import { type Address, type Hex, parseEther } from 'viem';
import { beforeAll, beforeEach, describe, expect, test, vi } from 'vitest';
import { BoostCore } from '../src/BoostCore';
import {
  type ActionStep,
  FilterType,
  PrimitiveType,
  SignatureType,
  StrategyType,
} from '../src/utils';
import {
  type BudgetFixtures,
  type Fixtures,
  defaultOptions,
  deployFixtures,
  fundBudget,
} from './helpers';

let fixtures: Fixtures, budgets: BudgetFixtures;

describe('Boost with NFT Minting Incentive', () => {
  const ZORA_CHAIN_URL = process.env.VITE_BASE_MAINNET_RPC;
  const ZORA_CHAIN_BLOCK = 19694536; // Replace with actual block number

  beforeAll(async () => {
    await reset(ZORA_CHAIN_URL, ZORA_CHAIN_BLOCK);
    fixtures = await loadFixture(deployFixtures);
  });
  beforeEach(async () => {
    budgets = await loadFixture(fundBudget(defaultOptions, fixtures));
  });

  test('should create a boost for incentivizing NFT minting', async () => {
    const { budget, erc20 } = budgets;
    const targetContract = '0xDa8dD2807A33FDA5983F56812765a88B46f0B90B';

    const { core, bases } = fixtures;
    const client = new BoostCore({
      ...defaultOptions,
      address: core.assertValidAddress(),
    });
    const owner = defaultOptions.account.address;

    // Step defining the action for Transfer event
    const eventActionStep: ActionStep = {
      signature: '0xddf252ad', // Transfer(address,address,uint256) event signature
      signatureType: SignatureType.EVENT, // We're working with an event
      actionType: 0, // Custom action type (set as 0 for now)
      targetContract: targetContract, // Address of the ERC20 contract
      actionParameter: {
        filterType: FilterType.EQUAL, // Filter to check for equality
        fieldType: PrimitiveType.ADDRESS, // The field we're filtering is an address
        fieldIndex: 0, // Field 0 is the 'from' address in the event
        filterData: targetContract, // Filtering based on the core address
      },
    };

    // Define EventActionPayload manually
    const eventActionPayload = {
      actionClaimant: {
        signatureType: SignatureType.EVENT,
        signature: '0xddf252ad' as Hex, // Transfer(address,address,uint256) event signature
        fieldIndex: 0, // Targeting the 'from' address
        targetContract: targetContract as Address, // The ERC20 contract we're monitoring
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

    console.log('Creating boost with EventAction');
    console.log('owner:', owner);
    console.log('budget:', budget);
    console.log('eventAction:', eventAction);
    console.log('erc20:', erc20);
    // Create the boost using the custom EventAction
    await client.createBoost({
      protocolFee: 1n,
      referralFee: 2n,
      maxParticipants: 100n,
      budget: budget, // Use the ManagedBudget
      action: eventAction, // Pass the manually created EventAction
      validator: new bases.SignerValidator(defaultOptions, {
        signers: [owner],
        validatorCaller: owner,
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
    expect(await client.getBoostCount()).toBe(1n);
  });
});
