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
  createPublicClient,
  pad,
  parseEther,
} from 'viem';
import { sepolia } from 'viem/chains';
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

let fixtures: Fixtures;
let budgets: BudgetFixtures;

// This is the ens register controller contract
const targetContract = '0xFED6a969AaA60E4961FCD3EBF1A2e8913ac65B72';

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
const CHAIN_BLOCK = 6717979;
const selector = selectors[
  'NameRegistered(string,bytes32,address,uint256,uint256,uint256)'
] as Hex;

describe.skipIf(!process.env.VITE_ALCHEMY_API_KEY)(
  'Boost with ENS Registration Incentive',
  () => {
    beforeAll(async () => {
      await reset(CHAIN_URL, CHAIN_BLOCK);
      fixtures = await loadFixture(deployFixtures);
      budgets = await loadFixture(fundBudget(defaultOptions, fixtures));
    });

    test('should create a boost for incentivizing ENS registration', async () => {
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
        chainid: sepolia.id,
        signature: selector, // NameRegistered(string,bytes32,address,uint256,uint256,uint256)
        signatureType: SignatureType.EVENT, // We're working with an event
        actionType: 0, // Custom action type (set as 0 for now)
        targetContract: targetContract, // Address of the targetContract
        // We want to target the Minter property on the Purchase event
        actionParameter: {
          filterType: FilterType.EQUAL, // Filter to check for equality
          fieldType: PrimitiveType.ADDRESS, // The field we're filtering is an address
          fieldIndex: 2, // The topic for the parameter we're filtering
          filterData: boostImpostor, // Filtering based on minters address
        },
      };

      // Define EventActionPayload manually
      const eventActionPayload = {
        actionClaimant: {
          chainid: sepolia.id,
          signatureType: SignatureType.EVENT,
          signature: selector, // NameRegistered(string,bytes32,address,uint256,uint256,uint256)
          fieldIndex: 0, // Targeting the 'from' address
          targetContract: boostImpostor, // The ERC20 contract we're monitoring
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
        protocolFee: 250n,
        referralFee: 250n,
        maxParticipants: 100n,
        budget: budget,
        action: eventAction,
        validator: new bases.SignerValidator(defaultOptions, {
          signers: [owner, trustedSigner.account],
          validatorCaller: fixtures.core.assertValidAddress(), // only core should be calling into the validate otherwise it's possible to burn signatures
        }),
        allowList: new bases.SimpleDenyList(defaultOptions, {
          owner: owner,
          denied: [],
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

      // Fetch logs for historic transaction
      const sepoliaClient = createPublicClient({
        chain: sepolia,
        transport: http(CHAIN_URL),
      });

      const logs = await sepoliaClient.getLogs({
        address: targetContract as Address,
        fromBlock: BigInt(CHAIN_BLOCK), // target the exact block of the transaction
        toBlock: BigInt(CHAIN_BLOCK),
      });

      const validation = await action.validateActionSteps({ logs });
      expect(validation).toBe(true);
      // Generate the signature using the trusted signer
      const claimDataPayload = await prepareSignerValidatorClaimDataPayload({
        signer: trustedSigner,
        incentiveData,
        chainId: sepolia.id,
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
