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
  toHex,
} from 'viem';
import { arbitrum } from 'viem/chains';
import { beforeAll, describe, expect, test } from 'vitest';
import {
  type ActionStep,
  FilterType,
  PrimitiveType,
  SignatureType,
} from '@boostxyz/sdk';
import { StrategyType } from '@boostxyz/sdk/claiming';
import { accounts } from '@boostxyz/test/accounts';
import {
  type BudgetFixtures,
  type Fixtures,
  deployFixtures,
  fundBudget,
} from '@boostxyz/test/helpers';
import { setupConfig, testAccount } from '@boostxyz/test/viem';

const walletClient = createTestClient({
  transport: http('http://localhost:8545'),
  chain: arbitrum,
  mode: "hardhat",
})
  .extend(publicActions)
  .extend(walletActions);

const defaultOptions = {
  account: testAccount,
  config: setupConfig(walletClient),
};

let fixtures: Fixtures, budgets: BudgetFixtures;
// This is the paraswap Augustus Swapper contract we're going to push a transaction against
const targetContract: Address = '0xdef171fe48cf0115b1d80b88dc8eab59176fee57';
// We take the raw inputData off of an existing historical transaction
// https://arbiscan.io/tx/0x0b4a6de84ce4067864681adf7a4e314fea2ac098d29b146d4019a9dc2fd78a29
const inputData =
  '0x54e3f31b0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000ff970a61a04b1ca14834a43f5de4533ebddb5cc8000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee00000000000000000000000000000000000000000000000000000000000f2be200000000000000000000000000000000000000000000000000017c3d1f4d4b2600000000000000000000000000000000000000000000000000017e26460d5c4000000000000000000000000000000000000000000000000000000000000001e0000000000000000000000000000000000000000000000000000000000000024000000000000000000000000000000000000000000000000000000000000003c00000000000000000000000000000000000000000000000000000000000000440000000000000000000000000865c301c46d64de5c9b124ec1a97ef1efc1bcbd1000000000000000000000000353d2d14bb674892910685520ac040f560ccbc06010000000000000000000000000000000000000000000000000000000003138800000000000000000000000000000000000000000000000000000000000004a00000000000000000000000000000000000000000000000000000000066fdbe3aea598193afcc47f9b7f749876129f8840000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000020000000000000000000000001f721e2e82f6676fce4ea07a5958cf098d339e18000000000000000000000000def171fe48cf0115b1d80b88dc8eab59176fee570000000000000000000000000000000000000000000000000000000000000148c04b8d59000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000def171fe48cf0115b1d80b88dc8eab59176fee57000000000000000000000000000000000000000000000000000000006706f40900000000000000000000000000000000000000000000000000000000000f2be200000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000028ff970a61a04b1ca14834a43f5de4533ebddb5cc882af49447d8a07e3bd95bd0d56f35241523fbab1000000000000000000000000000000000000000000000000e1829cfe00000000000000000000000082af49447d8a07e3bd95bd0d56f35241523fbab100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000012400000000000000000000000000000000000000000000000000000000000001480000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';
// For this test the incentiveData doesn't matter but we'll use a random value to ensure the signing is working as expected
const incentiveData = pad('0xdef456232173821931823712381232131391321934');
// This is only for a single incentive boost
const incentiveQuantity = 1;
const referrer = accounts[1].account;

// We take the address of the imposter from the transaction above
const boostImpostor = '0x865C301c46d64DE5c9B124Ec1a97eF1EFC1bcbd1' as Address;
const trustedSigner = accounts[0];
const CHAIN_URL =
  'https://arb-mainnet.g.alchemy.com/v2/' + process.env.VITE_ALCHEMY_API_KEY;
const CHAIN_BLOCK = 259734460n; // block before the swap transaction
const selector = selectors[
  'SwappedV3(bytes16,address,uint256,address,address indexed,address indexed,address indexed,uint256,uint256,uint256)'
] as Hex;

describe('Boost for Swapping on a Specific DEX (paraswap)', () => {
    beforeAll(async () => {
      await walletClient.reset({
        jsonRpcUrl: CHAIN_URL,
        blockNumber: CHAIN_BLOCK,
      });
      fixtures = await loadFixture(deployFixtures(defaultOptions, 42161));
      budgets = await loadFixture(fundBudget(defaultOptions, fixtures));
    });

    test('should create a boost for swapping on a specific DEX', async () => {
      const { budget, erc20 } = budgets;

      const { core } = fixtures;

      const owner = defaultOptions.account.address;
      // This is a workaround to this known issue: https://github.com/NomicFoundation/hardhat/issues/5511
      await mine();

      const eventActionStep: ActionStep = {
        chainid: arbitrum.id,
        signature: pad(selector),
        signatureType: SignatureType.EVENT, // We're working with a function signature
        targetContract: targetContract, // Address of the universal router contract
        actionParameter: {
          filterType: FilterType.GREATER_THAN, // Filter to check for equality
          fieldType: PrimitiveType.UINT, // The field we're filtering is an address
          fieldIndex: 7,
          filterData: toHex(0n, { size: 1 }), // Filtering based on the core address
        },
      };

      // Define EventActionPayload manually
      const eventActionPayload = {
        actionClaimant: {
          chainid: arbitrum.id,
          signatureType: SignatureType.EVENT,
          signature: pad(selector),
          fieldIndex: 4, // Targeting the 'from' address
          targetContract: targetContract, // The universal router contract
        },
        actionSteps: [eventActionStep],
      };
      // Initialize EventAction with the custom payload
      const eventAction = core.EventAction(eventActionPayload);
      // Create the boost using the custom EventAction
      await core.createBoost({
        maxParticipants: 10n,
        budget: budget, // Use the ManagedBudget
        action: eventAction, // Pass the manually created EventAction
        validator: core.SignerValidator({
          signers: [owner, trustedSigner.account], // Whichever account we're going to sign with needs to be a signer
          validatorCaller: core.assertValidAddress(), // Only core should be calling into the validate otherwise it's possible to burn signatures
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
      const hash = await walletClient.sendTransaction({
        data: inputData,
        account: boostImpostor,
        to: targetContract,
        value: parseEther('0'),
      });

      // Make sure that the transaction was sent as expected and validates the action
      expect(hash).toBeDefined();
      const validation = await action.validateActionSteps({ hash });
      expect(validation).toBe(true);
      // Generate the signature using the trusted signer
      const claimDataPayload = await boost.validator.encodeClaimData({
        signer: trustedSigner,
        incentiveData,
        chainId: arbitrum.id,
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
  },
);
