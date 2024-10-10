import {
  type ActionStep,
  FilterType,
  PrimitiveType,
  SignatureType,
} from '@boostxyz/sdk';
import events from '@boostxyz/signatures/events';
import functions from '@boostxyz/signatures/functions';
import { accounts } from '@boostxyz/test/accounts';
import {
  type BudgetFixtures,
  type Fixtures,
  deployFixtures,
  fundBudget,
} from '@boostxyz/test/helpers';
import { setupConfig, testAccount } from '@boostxyz/test/viem';
import {
  loadFixture,
  mine,
  reset,
} from '@nomicfoundation/hardhat-toolbox-viem/network-helpers';
import {
  http,
  type AbiEvent,
  type Address,
  type Hex,
  createTestClient,
  encodeAbiParameters,
  parseEther,
  publicActions,
  toHex,
  walletActions,
} from 'viem';
import { optimism } from 'viem/chains';
import { beforeAll, describe, expect, test } from 'vitest';

const walletClient = createTestClient({
  transport: http('http://127.0.0.1:8545'),
  chain: optimism,
  mode: 'hardhat',
})
  .extend(publicActions)
  .extend(walletActions);

const defaultOptions = {
  account: testAccount,
  config: setupConfig(walletClient),
};

let fixtures: Fixtures, budgets: BudgetFixtures;
// This is the Agora contract we're going to push a transaction against
const targetContract: Address = '0xcDF27F107725988f2261Ce2256bDfCdE8B382B10';
// We take the raw inputData off of an existing historical transaction
// https://optimistic.etherscan.io/tx/0x3d281344e4d0578dfc5af517c59e87770d4ded9465456cee0bd1e93484976e88
const inputData =
  '0x5678138877d106504340c0bb50e5748cc9bd714e946816c7726ae7b15f132a7daa0705c40000000000000000000000000000000000000000000000000000000000000001';
// This is only for a single incentive boost
const incentiveQuantity = 1;
const referrer = accounts[1].account;

// We take the address of the imposter from the transaction above
const boostImpostor: Address = '0xc47F2266b6076b79C0a6a9906C6592b34C03c914';
const trustedSigner = accounts[0];
const OPT_CHAIN_BLOCK = BigInt('125541463');
const selector = events.selectors[
  'VoteCast(address indexed,uint256,uint8,uint256,string)'
] as Hex;

describe('Boost with Voting Incentive', () => {
  beforeAll(async () => {
    await walletClient.reset({
      jsonRpcUrl: optimism.rpcUrls.default.http[0],
      blockNumber: OPT_CHAIN_BLOCK - 1n,
    });
    fixtures = await loadFixture(deployFixtures(defaultOptions, optimism.id));
    budgets = await loadFixture(fundBudget(defaultOptions, fixtures));
  });

  test('should create a boost for incentivizing votes', async () => {
    const { budget, erc20 } = budgets;
    const { core } = fixtures;

    const owner = defaultOptions.account.address;

    // Step defining the action for VoteCast event, targeting the proposal
    const filterProposalIdStep: ActionStep = {
      chainid: optimism.id,
      signature: selector, // VoteCast event signature
      signatureType: SignatureType.EVENT, // We're working with an event
      targetContract: targetContract, // Address of the ERC20 contract
      // We want to target the ProposalId property on the VoteCast event
      actionParameter: {
        filterType: FilterType.EQUAL, // Filter to check for equality
        fieldType: PrimitiveType.UINT, // The field we're filtering is a uint
        fieldIndex: 1, // Targeting the 'proposalId' uint
        filterData: toHex(
          BigInt(
            '54194543592303757979358957212312678549449891089859364558242427871997305750980',
          ),
        ), // Filtering based on the proposal id
      },
    };

    // Step defining the action for VoteCast event, targeting the support
    const filterSupportStep: ActionStep = {
      chainid: optimism.id,
      signature: selector, // VoteCast event signature
      signatureType: SignatureType.EVENT, // We're working with an event
      targetContract: targetContract, // Address of the ERC20 contract
      // We want to target the Support property on the VoteCast event
      actionParameter: {
        filterType: FilterType.EQUAL, // Filter to check for equality
        fieldType: PrimitiveType.UINT, // The field we're filtering is a uint
        fieldIndex: 2, // Targeting the 'support' uint
        filterData: toHex(1n, { size: 1 }), // Filtering based on the support value (uint8 is 1 byte)
      },
    };

    // Define EventActionPayload manually
    const eventActionPayload = {
      actionClaimant: {
        chainid: optimism.id,
        signatureType: SignatureType.EVENT,
        signature: selector, // VoteCast(address,uint256,uint8,uint256,string) event signature
        fieldIndex: 0, // Targeting the 'voter' address
        targetContract: targetContract, // The Agora vote contract we're monitoring
      },
      actionSteps: [filterProposalIdStep, filterSupportStep],
    };
    // Initialize EventAction with the custom payload
    const eventAction = core.EventAction(eventActionPayload);
    // Create the boost using the custom EventAction
    await core.createBoost({
      protocolFee: 1n,
      maxParticipants: 100n,
      budget: budget, // Use the ManagedBudget
      action: eventAction, // Pass the manually created EventAction
      validator: core.SignerValidator({
        signers: [owner, trustedSigner.account], // Whichever account we're going to sign with needs to be a signer
        validatorCaller: fixtures.core.assertValidAddress(), // Only core should be calling into the validate otherwise it's possible to burn signatures
      }),
      allowList: core.SimpleAllowList({
        owner: owner,
        allowed: [owner],
      }),
      incentives: [
        core.ERC20VariableIncentive({
          asset: erc20.assertValidAddress(),
          reward: parseEther('0.1'),
          limit: parseEther('1'),
        }),
      ],
    });

    // Make sure the boost was created as expected
    expect(await core.getBoostCount()).toBe(1n);
    const boost = await core.getBoost(0n);
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

    const txHash = await walletClient.sendTransaction({
      data: inputData,
      account: boostImpostor,
      to: targetContract,
    });
    const txReceipt = await walletClient.getTransactionReceipt({
      hash: txHash,
    });
    await walletClient.mine({ blocks: 1 });

    // Make sure that the transaction was sent as expected and validates the action
    expect(txHash).toBeDefined();

    const event = (events.abi as Record<Hex, AbiEvent>)[selector] as AbiEvent;

    if (!event) {
      throw new Error(`No known ABI for given event signature: ${selector}`);
    }

    const logs = await walletClient.getLogs({
      address: targetContract,
      event,
      fromBlock: OPT_CHAIN_BLOCK,
      toBlock: 'latest',
    });
    const validation = await action.validateActionSteps({
      logs,
    });
    expect(validation).toBe(true);

    const getVotesAbi =
      functions.abi[
        functions.selectors[
          'getVotes(address account, uint256 blockNumber) view returns (uint256)'
        ] as '0x00000000000000000000000000000000000000000000000000000000eb9019d4'
      ];
    const amountOfVotes = (await walletClient.readContract({
      address: '0xcdf27f107725988f2261ce2256bdfcde8b382b10',
      abi: [getVotesAbi],
      functionName: 'getVotes',
      args: [boostImpostor, txReceipt.blockNumber],
    })) as bigint;

    // If the amountOfVotes is greater than 100, then the reward should be 0.1 ETH, otherwise it will be 0.01 ETH
    const rewardAmount =
      amountOfVotes >= parseEther('100')
        ? parseEther('0.1')
        : parseEther('0.01');

    // Generate the signature using the trusted signer
    const claimDataPayload = await boost.validator.encodeClaimData({
      signer: trustedSigner,
      incentiveData: encodeAbiParameters(
        [{ name: '', type: 'uint256' }],
        [rewardAmount],
      ),
      chainId: optimism.id,
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
