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

let fixtures: Fixtures, budgets: BudgetFixtures;
// This is the Wormhole (W) token contract we're going to push delegate transaction against
const targetContract = "0xB0fFa8000886e57F86dd5264b9582b2Ad87b2b91" as Address;
// We take the raw inputData off of an existing historical transaction
// https://basescan.org/tx/0xd680f8ba2ec95d01822554850d0e976839138f1583b838872e042e3b04b7eafb
const inputData =
  "0x5c19a95c00000000000000000000000071cb1dc5ae0389f1828a5dfefb8476bd3bea2af2";
// For this test the incentiveData doesn't matter but we'll use a random value to ensure the signing is working as expected
const incentiveData = pad("0xdef456232173821931823712381232131391321934");
// This is only for a single incentive boost
const incentiveQuantity = 1;
const referrer = accounts[1].account;

// We take the address of the imposter from the transaction above
const boostImpostor = "0xb629c117faB3BAa951a220F2175A02a4bDbCf734" as Address; // from address
const delegatee = "0x71CB1dc5AE0389F1828a5dFefB8476bd3BEA2AF2" as Address;
const trustedSigner = accounts[0];
const BASE_CHAIN_URL =
  "https://base-mainnet.g.alchemy.com/v2/" + process.env.VITE_ALCHEMY_API_KEY;
const BASE_CHAIN_BLOCK = 20160592;
const selector = selectors[
  "DelegateChanged(address indexed,address indexed,address indexed)"
] as Hex;

const walletClient = createTestClient({
  transport: http('http://localhost:8545'),
  chain: base,
  mode: "hardhat",
})
  .extend(publicActions)
  .extend(walletActions);

const defaultOptions = {
  account: testAccount,
  config: setupConfig(walletClient),
};

describe("Boost with Delegate Action Incentive", () => {
  beforeAll(async () => {
    await reset(BASE_CHAIN_URL, BASE_CHAIN_BLOCK);
    fixtures = await loadFixture(deployFixtures(defaultOptions, 8453));
    budgets = await loadFixture(fundBudget(defaultOptions, fixtures));
  });

  test("should create a boost for incentivizing delegation to a specific address", async () => {
    const { budget, erc20 } = budgets;
    const { core } = fixtures;

    const owner = defaultOptions.account.address;
    // This is a workaround to this known issue: https://github.com/NomicFoundation/hardhat/issues/5511
    await mine();

    // Step defining the action for Transfer event
    const eventActionStep: ActionStep = {
      chainid: base.id,
      signature: selector, // DelegateChanged(address,address,address)
      signatureType: SignatureType.EVENT, // We're working with an event
      targetContract: targetContract, // Address of the ERC20 contract
      // We want to target the toDelegate property on the DelegateChanged event
      actionParameter: {
        filterType: FilterType.EQUAL, // Filter to check for equality
        fieldType: PrimitiveType.ADDRESS, // The field we're filtering is an address
        fieldIndex: 2, // toDelegate event argument
        filterData: delegatee, // Filtering based on the delegatee address
      },
    };

    // Define EventActionPayload manually
    const eventActionPayload = {
      actionClaimant: {
        chainid: base.id,
        signatureType: SignatureType.EVENT,
        signature: selector, // DelegateChanged(address,address,address)
        fieldIndex: 0, // Targeting the 'delegator' address
        targetContract: targetContract, // The ERC20 contract we're monitoring
      },
      actionSteps: [eventActionStep],
    };
    // Initialize EventAction with the custom payload
    const eventAction = core.EventAction(eventActionPayload);
    // Create the boost using the custom EventAction
    await core.createBoost({
      protocolFee: 250n,
      referralFee: 250n,
      maxParticipants: 100n,
      budget: budget, // Use the ManagedBudget
      action: eventAction, // Pass the manually created EventAction
      validator: core.SignerValidator({
        signers: [owner, trustedSigner.account!], // Whichever account we're going to sign with needs to be a signer
        validatorCaller: core.assertValidAddress(), // Only core should be calling into the validate otherwise it's possible to burn signatures
      }),
      allowList: core.SimpleAllowList({
        owner: owner,
        allowed: [owner],
      }),
      incentives: [
        core.ERC20Incentive({
          asset: erc20.assertValidAddress(),
          reward: parseEther("1"),
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
      value: parseEther("10"),
    });
    const hash = await walletClient.sendTransaction({
      data: inputData,
      account: boostImpostor,
      to: targetContract,
      value: 0n,
    });

    // Make sure that the transaction was sent as expected and validates the action
    expect(hash).toBeDefined();
    const validation = await action.validateActionSteps({ hash });
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
