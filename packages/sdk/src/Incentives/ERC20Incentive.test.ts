import { readMockErc20BalanceOf } from "@boostxyz/evm";
import { accounts } from "@boostxyz/test/accounts";
import {
  type BudgetFixtures,
  type Fixtures,
  defaultOptions,
  deployFixtures,
  freshBoost,
  fundBudget,
} from "@boostxyz/test/helpers";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import {
  isAddress,
  isAddressEqual,
  pad,
  parseEther,
  zeroAddress
} from "viem";
import { beforeAll, beforeEach, describe, expect, test } from "vitest";
import { StrategyType } from "../claiming";
import { ERC20Incentive } from "./ERC20Incentive";

let fixtures: Fixtures, budgets: BudgetFixtures;

describe("ERC20Incentive", () => {
  beforeAll(async () => {
    fixtures = await loadFixture(deployFixtures(defaultOptions));
  });

  beforeEach(async () => {
    budgets = await loadFixture(fundBudget(defaultOptions, fixtures));
  });

  test("can successfully be deployed", async () => {
    const action = new ERC20Incentive(defaultOptions, {
      asset: zeroAddress,
      strategy: StrategyType.POOL,
      reward: 1n,
      limit: 1n,
      manager: zeroAddress,
    });
    // @ts-expect-error
    await action.deploy();
    expect(isAddress(action.assertValidAddress())).toBe(true);
  });

  test("can claim", async () => {
    // biome-ignore lint/style/noNonNullAssertion: we know this is defined
    const referrer = accounts.at(1)!.account!,
      // biome-ignore lint/style/noNonNullAssertion: we know this is defined
      trustedSigner = accounts.at(0)!;
    const erc20Incentive = fixtures.core.ERC20Incentive({
      asset: budgets.erc20.assertValidAddress(),
      strategy: StrategyType.POOL,
      reward: 1n,
      limit: 1n,
      manager: budgets.budget.assertValidAddress(),
    });
    const boost = await freshBoost(fixtures, {
      budget: budgets.budget,
      incentives: [erc20Incentive],
    });

    const claimant = trustedSigner.account;
    const incentiveData = erc20Incentive.buildClaimData();
    const claimDataPayload = await boost.validator.encodeClaimData({
      signer: trustedSigner,
      incentiveData,
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
    );
    expect(
      await readMockErc20BalanceOf(defaultOptions.config, {
        address: budgets.erc20.assertValidAddress(),
        args: [defaultOptions.account.address],
      }),
    ).toBe(1n);
  });

  test("can test claimability", async () => {
    // biome-ignore lint/style/noNonNullAssertion: we know this is defined
    const referrer = accounts.at(1)!.account!,
      // biome-ignore lint/style/noNonNullAssertion: we know this is defined
      trustedSigner = accounts.at(0)!;
    const erc20Incentive = fixtures.core.ERC20Incentive({
      asset: budgets.erc20.assertValidAddress(),
      strategy: StrategyType.POOL,
      reward: 1n,
      limit: 1n,
      manager: budgets.budget.assertValidAddress(),
    });
    const boost = await freshBoost(fixtures, {
      budget: budgets.budget,
      incentives: [erc20Incentive],
    });

    const claimant = trustedSigner.account;
    const incentiveData = erc20Incentive.buildClaimData();
    const claimDataPayload = await boost.validator.encodeClaimData({
      signer: trustedSigner,
      incentiveData,
      chainId: defaultOptions.config.chains[0].id,
      incentiveQuantity: boost.incentives.length,
      claimant,
      boostId: boost.id,
    });

    expect(await boost.incentives.at(0)!.getRemainingClaimPotential()).toBeGreaterThan(0n)
    expect(await boost.incentives.at(0)!.canBeClaimed()).toBe(true)

    await fixtures.core.claimIncentive(
      boost.id,
      0n,
      referrer,
      claimDataPayload,
    );

    expect(await boost.incentives.at(0)!.getRemainingClaimPotential()).toBe(0n)
    expect(await boost.incentives.at(0)!.canBeClaimed()).toBe(false)
  });

  test("cannot claim twice", async () => {
    // biome-ignore lint/style/noNonNullAssertion: we know this is defined
    const referrer = accounts.at(1)!.account!;
    // biome-ignore lint/style/noNonNullAssertion: we know this is defined
    const trustedSigner = accounts.at(0)!;
    const erc20Incentive = fixtures.core.ERC20Incentive({
      asset: budgets.erc20.assertValidAddress(),
      strategy: StrategyType.POOL,
      reward: 1n,
      limit: 1n,
      manager: budgets.budget.assertValidAddress(),
    });
    const boost = await freshBoost(fixtures, {
      budget: budgets.budget,
      incentives: [erc20Incentive],
    });

    const claimant = trustedSigner.account;
    const incentiveData = pad("0xdef456232173821931823712381232131391321934");
    const claimDataPayload = await boost.validator.encodeClaimData({
      signer: trustedSigner,
      incentiveData,
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
    );
    try {
      await fixtures.core.claimIncentive(
        boost.id,
        0n,
        referrer,
        claimDataPayload,
        { value: parseEther("0.000075") },
      );
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
    }
  });

  test("can properly encode a uint256", () => {
    //@ts-ignore
    const incentive = fixtures.core.ERC20Incentive();
    expect(incentive.buildClawbackData(1n)).toBe(
      "0x0000000000000000000000000000000000000000000000000000000000000001",
    );
  });

  test("can clawback via a budget", async () => {
    const erc20Incentive = fixtures.core.ERC20Incentive({
      asset: budgets.erc20.assertValidAddress(),
      strategy: StrategyType.POOL,
      reward: 1n,
      limit: 10n,
      manager: budgets.budget.assertValidAddress(),
    });
    const boost = await freshBoost(fixtures, {
      budget: budgets.budget,
      incentives: [erc20Incentive],
    });
    const [amount, address] = await budgets.budget.clawbackFromTarget(
      fixtures.core.assertValidAddress(),
      erc20Incentive.buildClawbackData(1n),
      boost.id,
      0,
    );
    expect(amount).toBe(1n);
    expect(isAddressEqual(address, budgets.erc20.assertValidAddress())).toBe(
      true,
    );
  });

  test("isClaimable returns expected values", async () => {
    const referrer = accounts[1].account;
    const trustedSigner = accounts[0];
    const erc20Incentive = fixtures.core.ERC20Incentive({
      asset: budgets.erc20.assertValidAddress(),
      strategy: StrategyType.POOL,
      reward: 1n,
      limit: 1n,
      manager: budgets.budget.assertValidAddress(),
    });
    const boost = await freshBoost(fixtures, {
      budget: budgets.budget,
      incentives: [erc20Incentive],
    });

    const claimant = trustedSigner.account;
    const incentiveData = erc20Incentive.buildClaimData();

    // Should be claimable before claiming
    expect(await boost.incentives[0]!.isClaimable({
      target: claimant,
      data: incentiveData
    })).toBe(true);

    const claimDataPayload = await boost.validator.encodeClaimData({
      signer: trustedSigner,
      incentiveData,
      chainId: defaultOptions.config.chains[0].id,
      incentiveQuantity: boost.incentives.length,
      claimant,
      boostId: boost.id,
    });

    // Claim the incentive
    await fixtures.core.claimIncentive(
      boost.id,
      0n,
      referrer,
      claimDataPayload,
    );

    // Should not be claimable after claiming
    expect(await boost.incentives[0]!.isClaimable({
      target: claimant,
      data: incentiveData
    })).toBe(false);
  });
});
