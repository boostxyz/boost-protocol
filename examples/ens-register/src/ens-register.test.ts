import {
  type ActionStep,
  FilterType,
  PrimitiveType,
  SignatureType,
} from '@boostxyz/sdk';
import { StrategyType } from '@boostxyz/sdk/claiming';
import { selectors } from '@boostxyz/signatures/functions';
import { accounts } from '@boostxyz/test/accounts';
import {
  type BudgetFixtures,
  type Fixtures,
  defaultOptions,
  deployFixtures,
  fundBudget,
} from '@boostxyz/test/helpers';
import {
  loadFixture,
  mine,
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
import { sepolia } from 'viem/chains';
import { beforeAll, describe, expect, test } from 'vitest';

let fixtures: Fixtures;
let budgets: BudgetFixtures;

// This is the ens register controller contract
const targetContract: Address = '0xFED6a969AaA60E4961FCD3EBF1A2e8913ac65B72';

// For this test the incentiveData doesn't matter but we'll use a random value to ensure the signing is working as expected
const incentiveData = pad('0xdef456232173821931823712381232131391321934');

// This is only for a single incentive boost
const incentiveQuantity = 1;
const referrer = accounts[1].account;

// We take the address of the imposter from the transaction above
const boostImpostor = '0xd11dD72b7555205746fa537928D87DeC6bD26275' as Address;
const trustedSigner = accounts[0];
const CHAIN_URL =
  'https://eth-sepolia.g.alchemy.com/v2/' + process.env.VITE_ALCHEMY_API_KEY;
const CHAIN_BLOCK = 6717970n; // block before the commit transaction
const selector = selectors[
  'register(string name,address owner,uint256 duration,bytes32 secret,address resolver,bytes[] data,bool reverseRecord,uint16 ownerControlledFuses)'
] as Hex;

// https://sepolia.etherscan.io/tx/0xe527caab33384a58780aa12218c159c0b1910921aca0bc311a9dd7c39efb3316
const inputData =
  '0x74694a2b0000000000000000000000000000000000000000000000000000000000000100000000000000000000000000d11dd72b7555205746fa537928d87dec6bd262750000000000000000000000000000000000000000000000000000000007861f809923eb9400000003d38704f2585fb75b2bf96a1c277a5cee490aadc929f777b50000000000000000000000008fade66b79cc9f707ab26799354482eb93a5b7dd000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000430303030000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000a48b95dd719506df1a6b44c5457e2eff373a7bfa88acc5f9788983f78b6ee96c989d53193c000000000000000000000000000000000000000000000000000000000000003c00000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000014d11dd72b7555205746fa537928d87dec6bd2627500000000000000000000000000000000000000000000000000000000000000000000000000000000';
const commitData =
  '0xf14fcbc80eaeb279d6cd9d8e9917cb69abaf18adb26cfa42ee7fa24301ac6a915d504f4b';

describe('Boost with ENS Registration Incentive', () => {
  const walletClient = createTestClient({
    transport: http('http://127.0.0.1:8545'),
    chain: sepolia,
    mode: 'hardhat',
  })
    .extend(publicActions)
    .extend(walletActions);

  beforeAll(async () => {
    await walletClient.reset({
      jsonRpcUrl: CHAIN_URL,
      blockNumber: CHAIN_BLOCK,
    });
    fixtures = await loadFixture(deployFixtures(defaultOptions, 11155111));
    budgets = await loadFixture(fundBudget(defaultOptions, fixtures));
  });

  test('should create a boost for incentivizing ENS registration', async () => {
    const { budget, erc20 } = budgets;

    const { core } = fixtures;
    const owner = defaultOptions.account.address;
    // This is a workaround to this known issue: https://github.com/NomicFoundation/hardhat/issues/5511
    await mine();

    // Step defining the action
    const eventActionStep: ActionStep = {
      chainid: sepolia.id,
      signature: selector, // register function selector
      signatureType: SignatureType.FUNC, // We're working with a function
      targetContract: targetContract, // Address of the targetContract
      actionParameter: {
        filterType: FilterType.EQUAL, // Filter to check for equality
        fieldType: PrimitiveType.ADDRESS, // The field we're filtering is an address
        fieldIndex: 1, // The owner function parameter
        filterData: boostImpostor, // Filtering based on minters address
      },
    };

    // Define EventActionPayload manually
    const eventActionPayload = {
      actionClaimant: {
        chainid: sepolia.id,
        signatureType: SignatureType.FUNC,
        signature: selector, // register function selector
        fieldIndex: 1, // Targeting the 'from' address
        targetContract: targetContract, // The ERC20 contract we're monitoring
      },
      actionSteps: [eventActionStep],
    };
    // Initialize EventAction with the custom payload
    const eventAction = core.EventAction(eventActionPayload);

    // Create the boost using the custom EventAction
    await core.createBoost({
      protocolFee: 250n,
      maxParticipants: 100n,
      budget: budget,
      action: eventAction,
      validator: core.SignerValidator({
        signers: [owner, trustedSigner.account],
        validatorCaller: fixtures.core.assertValidAddress(), // only core should be calling into the validate otherwise it's possible to burn signatures
      }),
      allowList: core.OpenAllowList(),
      incentives: [
        core.ERC20Incentive({
          asset: erc20.assertValidAddress(),
          reward: parseEther('1'),
          limit: 100n,
          strategy: StrategyType.POOL,
        }),
      ],
    });

    // Make sure the boost was created as expected
    expect(await core.getBoostCount()).toBe(1n);
    const boost = await core.getBoost(0n);
    const action = boost.action;
    expect(action).toBeDefined();

    await walletClient.impersonateAccount({
      address: boostImpostor,
    });
    await walletClient.setBalance({
      address: boostImpostor,
      value: parseEther('10'),
    });

    // submit the commit transaction
    const commitReceipt = await walletClient.sendTransaction({
      data: commitData,
      account: boostImpostor,
      to: targetContract,
      value: parseEther('0'),
    });
    expect(commitReceipt).toBeDefined();

    // allow for 60 seconds to pass before registering ENS name
    await walletClient.request({
      method: 'evm_increaseTime',
      params: ['0x3c'], // increase time by 60 seconds
    });

    const hash = await walletClient.sendTransaction({
      data: inputData,
      account: boostImpostor,
      to: targetContract,
      value: parseEther('0.408279452054767655'),
    });
    // Make sure that the transaction was sent as expected and validates the action
    expect(hash).toBeDefined();

    const validation = await action.validateActionSteps({ hash });
    expect(validation).toBe(true);
    // Generate the signature using the trusted signer
    const claimDataPayload = await boost.validator.encodeClaimData({
      signer: trustedSigner,
      incentiveData,
      chainId: sepolia.id,
      incentiveQuantity,
      claimant: boostImpostor,
      boostId: boost.id,
    });

    // Claim the incentive for the imposter
    await core.claimIncentiveFor(
      boost.id,
      0n,
      referrer,
      claimDataPayload,
      boostImpostor,
      { value: parseEther('0.000075') },
    );
  });
});
