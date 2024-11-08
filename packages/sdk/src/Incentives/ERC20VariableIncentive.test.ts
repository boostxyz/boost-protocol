import { readMockErc20BalanceOf } from "@boostxyz/evm";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import {
  encodeAbiParameters,
  isAddress,
  isAddressEqual,
  parseEther,
  zeroAddress,
} from "viem";
import { beforeAll, beforeEach, describe, expect, test } from "vitest";
import { accounts } from "@boostxyz/test/accounts";
import {
  type BudgetFixtures,
  type Fixtures,
  defaultOptions,
  deployFixtures,
  freshBoost,
  fundBudget,
} from "@boostxyz/test/helpers";
import { ERC20VariableIncentive } from "./ERC20VariableIncentive";

const BOOST_CORE_CLAIM_FEE = parseEther("0.000075");

let fixtures: Fixtures, budgets: BudgetFixtures;

describe("ERC20VariableIncentive", () => {
  beforeAll(async () => {
    fixtures = await loadFixture(deployFixtures(defaultOptions));
  });

  beforeEach(async () => {
    budgets = await loadFixture(fundBudget(defaultOptions, fixtures));
  });

  test("can successfully be deployed", async () => {
    const action = new ERC20VariableIncentive(defaultOptions, {
      asset: zeroAddress,
      reward: 1n,
      limit: 1n,
      manager: zeroAddress,
    });
    await action.deploy();
    expect(isAddress(action.assertValidAddress())).toBe(true);
  });

  test("can claim", async () => {
    // biome-ignore lint/style/noNonNullAssertion: we know this is defined
    const referrer = accounts.at(1)!.account!,
      // biome-ignore lint/style/noNonNullAssertion: we know this is defined
      trustedSigner = accounts.at(0)!;
    const erc20VariableIncentive = new fixtures.bases.ERC20VariableIncentive(
      defaultOptions,
      {
        asset: budgets.erc20.assertValidAddress(),
        reward: 1n,
        limit: 1n,
        manager: zeroAddress,
      },
    );
    const boost = await freshBoost(fixtures, {
      budget: budgets.budget,
      incentives: [erc20VariableIncentive],
    });

    const claimant = trustedSigner.account;
    const claimDataPayload = await boost.validator.encodeClaimData({
      signer: trustedSigner,
      incentiveData: erc20VariableIncentive.buildClaimData(parseEther("1")),
      chainId: defaultOptions.config.chains[0].id,
      incentiveQuantity: boost.incentives.length,
      claimant,
      boostId: boost.id,
    });
    await fixtures.core.claimIncentive(
      boost.id,
      0n,
      referrer,
      claimDataPayload,
      { value: BOOST_CORE_CLAIM_FEE },
    );
    expect(
      await readMockErc20BalanceOf(defaultOptions.config, {
        address: budgets.erc20.assertValidAddress(),
        args: [claimant],
      }),
    ).toBe(1n);
  });

  test("cannot claim twice", async () => {
    // biome-ignore lint/style/noNonNullAssertion: we know this is defined
    const referrer = accounts.at(1)!.account!;
    // biome-ignore lint/style/noNonNullAssertion: we know this is defined
    const trustedSigner = accounts.at(0)!;
    const erc20VariableIncentive = new fixtures.bases.ERC20VariableIncentive(
      defaultOptions,
      {
        asset: budgets.erc20.assertValidAddress(),
        reward: 1n,
        limit: 1n,
        manager: zeroAddress,
      },
    );
    const boost = await freshBoost(fixtures, {
      budget: budgets.budget,
      incentives: [erc20VariableIncentive],
    });

    const claimant = trustedSigner.account;
    const claimDataPayload = await boost.validator.encodeClaimData({
      signer: trustedSigner,
      incentiveData: erc20VariableIncentive.buildClaimData(parseEther("1")),
      chainId: defaultOptions.config.chains[0].id,
      incentiveQuantity: boost.incentives.length,
      claimant,
      boostId: boost.id,
    });

    await fixtures.core.claimIncentive(
      boost.id,
      0n,
      referrer,
      claimDataPayload,
      { value: BOOST_CORE_CLAIM_FEE },
    );
    try {
      await fixtures.core.claimIncentive(
        boost.id,
        0n,
        referrer,
        claimDataPayload,
        { value: BOOST_CORE_CLAIM_FEE },
      );
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
    }
  });

  test("can properly encode a uint256", () => {
    //@ts-ignore
    const incentive = fixtures.core.ERC20VariableIncentive();
    expect(incentive.buildClawbackData(1n)).toBe(
      "0x0000000000000000000000000000000000000000000000000000000000000001",
    );
  });

  test("can clawback via a budget", async () => {
    const erc20VariableIncentive = new fixtures.bases.ERC20VariableIncentive(
      defaultOptions,
      {
        asset: budgets.erc20.assertValidAddress(),
        reward: 1n,
        limit: 1n,
        manager: zeroAddress,
      },
    );
    const boost = await freshBoost(fixtures, {
      budget: budgets.budget,
      incentives: [erc20VariableIncentive],
    });
    const [amount, address] = await budgets.budget.clawbackFromTarget(
      fixtures.core.assertValidAddress(),
      erc20VariableIncentive.buildClawbackData(1n),
      boost.id,
      0,
    );
    expect(amount).toBe(1n);
    expect(isAddressEqual(address, budgets.erc20.assertValidAddress())).toBe(
      true,
    );
  });
});
