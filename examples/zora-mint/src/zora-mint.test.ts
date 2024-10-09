import { selectors } from "@boostxyz/signatures/events";
import {
  loadFixture,
  mine,
  reset,
} from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import {
  http,
  type Address,
  type Hex,
  createTestClient,
  pad,
  parseEther,
  publicActions,
  walletActions,
} from "viem";
import { base } from "viem/chains";
import { beforeAll, describe, expect, test } from "vitest";
import {
  type ActionStep,
  FilterType,
  PrimitiveType,
  SignatureType,
} from "@boostxyz/sdk";
import { StrategyType } from "@boostxyz/sdk/claiming";
import { accounts } from "@boostxyz/test/accounts";
import {
  type BudgetFixtures,
  type Fixtures,
  deployFixtures,
  fundBudget,
} from "@boostxyz/test/helpers";
import { setupConfig, testAccount } from "@boostxyz/test/viem";

const walletClient = createTestClient({
  transport: http("http://127.0.0.1:8545"),
  chain: base,
  mode: "hardhat",
})
  .extend(publicActions)
  .extend(walletActions);

const defaultOptions = {
  account: testAccount,
  config: setupConfig(walletClient),
};

let fixtures: Fixtures, budgets: BudgetFixtures;
// This is the zora contract we're going to push a transaction against
const targetContract: Address = "0x9D2FC5fFE5939Efd1d573f975BC5EEFd364779ae";
// We take the raw inputData off of an existing historical transaction
// https://basescan.org/tx/0x17a4d7e08acec16f385d2a038b948359919e3675eca22a09789b462a9178a769
const inputData =
  "0x359f130200000000000000000000000004e2516a2c207e84a1839755675dfd8ef6302f0a0000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000e000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000084dc02a3b41ff6fb0b9288234b2b8051b641bf00";
// For this test the incentiveData doesn't matter but we'll use a random value to ensure the signing is working as expected
const incentiveData = pad("0xdef456232173821931823712381232131391321934");
// This is only for a single incentive boost
const incentiveQuantity = 1;
const referrer = accounts[1].account;

// We take the address of the imposter from the transaction above
const boostImpostor = "0x84DC02a3B41ff6Fb0B9288234B2B8051B641bF00" as Address;
const trustedSigner = accounts[0];
const BASE_CHAIN_URL =
  "https://base-mainnet.g.alchemy.com/v2/" + process.env.VITE_ALCHEMY_API_KEY;
const BASE_CHAIN_BLOCK = 17519193;
const selector = selectors[
  "Purchased(address indexed,address indexed,uint256 indexed,uint256,uint256)"
] as Hex;

describe("Boost with NFT Minting Incentive", () => {
  beforeAll(async () => {
    await reset(BASE_CHAIN_URL, BASE_CHAIN_BLOCK);
    fixtures = await loadFixture(deployFixtures(defaultOptions, 8453));
    budgets = await loadFixture(fundBudget(defaultOptions, fixtures));
  });

  test("should create a boost for incentivizing NFT minting", async () => {
    const { budget, erc20 } = budgets;
    const { core } = fixtures;

    const owner = defaultOptions.account.address;
    // This is a workaround to this known issue: https://github.com/NomicFoundation/hardhat/issues/5511
    await mine();

    // Step defining the action for Purchased event
    const eventActionStep: ActionStep = {
      chainid: base.id,
      signature: selector, // Purchased(address,address,uint256,uint256,uint256) event
      signatureType: SignatureType.EVENT, // We're working with an event
      targetContract: targetContract, // Address of the zora NFT contract
      // We want to target the 'sender' property on the Purchase event
      actionParameter: {
        filterType: FilterType.EQUAL, // Filter to check for equality
        fieldType: PrimitiveType.ADDRESS, // The field we're filtering is an address
        fieldIndex: 0, // We want to target the first argument (index 0)
        filterData: boostImpostor, // Filtering based on the imposters address
      },
    };

    // Define EventActionPayload manually
    const eventActionPayload = {
      actionClaimant: {
        chainid: base.id,
        signatureType: SignatureType.EVENT,
        signature: selector, // Purchased(address,address,uint256,uint256,uint256) event
        fieldIndex: 0, // Targeting the 'from' address
        targetContract: targetContract, // The Zora NFT contract we're monitoring
      },
      actionSteps: [eventActionStep],
    };
    // Initialize EventAction with the custom payload
    const eventAction = core.EventAction(eventActionPayload);
    // Create the boost using the custom EventAction
    await core.createBoost({
      protocolFee: 1n,
      referralFee: 2n,
      maxParticipants: 100n,
      budget: budget, // Use the ManagedBudget
      action: eventAction, // Pass the manually created EventAction
      validator: core.SignerValidator({
        signers: [owner, trustedSigner.account], // Whichever account we're going to sign with needs to be a signer
        validatorCaller: core.assertValidAddress(), // Only core should be calling into the validate otherwise it's possible to burn signatures
      }),
      allowList: core.SimpleAllowList({
        owner: owner,
        allowed: [owner, boostImpostor],
      }),
      incentives: [
        core.ERC20Incentive({
          asset: erc20.assertValidAddress(),
          reward: parseEther("1"),
          limit: 100n,
          strategy: StrategyType.POOL,
          manager: budget.assertValidAddress(),
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
      value: parseEther("10"),
    });
    const txHash = await walletClient.sendTransaction({
      data: inputData,
      account: boostImpostor,
      to: targetContract,
      value: parseEther("0.029777"),
    });
    const chainId = await walletClient.getChainId();

    // Make sure that the transaction was sent as expected and validates the action
    expect(txHash).toBeDefined();
    const validation = await action.validateActionSteps({ hash: txHash, chainId });
    expect(validation).toBe(true);
    // Generate the signature using the trusted signer
    const claimDataPayload = await boost.validator.encodeClaimData({
      signer: trustedSigner,
      incentiveData,
      chainId: base.id,
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
      { value: parseEther("0.000075") },
    );
  });
});
