import { selectors } from '@boostxyz/signatures/events';
import {
  loadFixture,
  mine,
  reset,
} from '@nomicfoundation/hardhat-toolbox-viem/network-helpers';
import dotenv from 'dotenv';
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

dotenv.config();

let fixtures: Fixtures, budgets: BudgetFixtures;

describe('Boost with NFT Minting Incentive', () => {
  if (!process.env.ALCHEMY_API_KEY) {
    console.warn('Skipping tests: ALCHEMY_API_KEY is not defined');
    test.skip('Skipping tests: ALCHEMY_API_KEY is not defined');
    return;
  }
  // We take the address of the imposter from the transaction above
  const boostImpostor = '0xE59C9Ca7FFA00471AA2ADA42C0a65C6CaabD06B8' as Address;
  const BASE_CHAIN_URL =
    'https://base-mainnet.g.alchemy.com/v2/' + process.env.ALCHEMY_API_KEY;
  const BASE_CHAIN_BLOCK = 13300000;
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
    const targetContract = '0xDa8dD2807A33FDA5983F56812765a88B46f0B90B';

    // This is the zora contract we're going to push a transaction against
    //const contractEntryPoint = '0x9D2FC5fFE5939Efd1d573f975BC5EEFd364779ae';
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
