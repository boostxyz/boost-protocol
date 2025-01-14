import { readPointsBalanceOf, writePointsGrantRoles } from "@boostxyz/evm";
import type { MockPoints } from "@boostxyz/test/MockPoints";
import { accounts } from "@boostxyz/test/accounts";
import {
  type Fixtures,
  defaultOptions,
  deployFixtures,
  freshBoost,
  freshPoints,
} from "@boostxyz/test/helpers";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { isAddress, pad, parseEther, zeroAddress } from "viem";
import { beforeAll, beforeEach, describe, expect, test } from "vitest";
import { bytes4 } from "../utils";
import { PointsIncentive } from "./PointsIncentive";

let fixtures: Fixtures, points: MockPoints;

describe("PointsIncentive", () => {
  beforeAll(async () => {
    fixtures = await loadFixture(deployFixtures(defaultOptions));
  });

  beforeEach(async () => {
    points = await loadFixture(freshPoints);
  });

  test("can successfully be deployed", async () => {
    const action = new PointsIncentive(defaultOptions, {
      venue: zeroAddress,
      selector: "0xdeadb33f",
      reward: 1n,
      limit: 1n,
    });
    // @ts-expect-error
    await action.deploy();
    expect(isAddress(action.assertValidAddress())).toBe(true);
  });

  test("can claim", async () => {
    // biome-ignore lint/style/noNonNullAssertion: we know this is defined
    const referrer = accounts.at(1)!.account!;
    // biome-ignore lint/style/noNonNullAssertion: we know this is defined
    const trustedSigner = accounts.at(0)!;
    const pointsIncentive = fixtures.core.PointsIncentive({
      venue: points.assertValidAddress(),
      selector: bytes4("issue(address,uint256)"),
      reward: 1n,
      limit: 10n,
    });
    const boost = await freshBoost(fixtures, {
      incentives: [pointsIncentive],
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

    await writePointsGrantRoles(defaultOptions.config, {
      address: points.assertValidAddress(),
      args: [pointsIncentive.assertValidAddress(), 2n],
      account: defaultOptions.account,
    });
    await fixtures.core.claimIncentive(
      boost.id,
      0n,
      referrer,
      claimDataPayload,
    );
    expect(
      await readPointsBalanceOf(defaultOptions.config, {
        address: points.assertValidAddress(),
        args: [defaultOptions.account.address],
      }),
    ).toBe(1n);
  });

  test("can test claimability", async () => {
    // biome-ignore lint/style/noNonNullAssertion: we know this is defined
    const referrer = accounts.at(1)!.account!;
    // biome-ignore lint/style/noNonNullAssertion: we know this is defined
    const trustedSigner = accounts.at(0)!;
    const pointsIncentive = fixtures.core.PointsIncentive({
      venue: points.assertValidAddress(),
      selector: bytes4("issue(address,uint256)"),
      reward: 1n,
      limit: 1n,
    });
    const boost = await freshBoost(fixtures, {
      incentives: [pointsIncentive],
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

    expect(await boost.incentives.at(0)!.getRemainingClaimPotential()).toBeGreaterThan(0n)
    expect(await boost.incentives.at(0)!.canBeClaimed()).toBe(true)

    await writePointsGrantRoles(defaultOptions.config, {
      address: points.assertValidAddress(),
      args: [pointsIncentive.assertValidAddress(), 2n],
      account: defaultOptions.account,
    });
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
    const reward = 1n;
    // biome-ignore lint/style/noNonNullAssertion: we know this is defined
    const referrer = accounts.at(1)!.account!;
    // biome-ignore lint/style/noNonNullAssertion: we know this is defined
    const trustedSigner = accounts.at(0)!;

    const pointsIncentive = fixtures.core.PointsIncentive({
      venue: points.assertValidAddress(),
      selector: bytes4("issue(address,uint256)"),
      reward,
      limit: 10n,
    });
    const boost = await freshBoost(fixtures, {
      incentives: [pointsIncentive],
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

    await writePointsGrantRoles(defaultOptions.config, {
      address: points.assertValidAddress(),
      args: [pointsIncentive.assertValidAddress(), 2n],
      account: defaultOptions.account,
    });
    await fixtures.core.claimIncentive(
      boost.id,
      0n,
      referrer,
      claimDataPayload,
      { value: parseEther("0.000075") },
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

  test("isClaimable returns expected values", async () => {
    const referrer = accounts[1].account;
    const trustedSigner = accounts[0];
    const pointsIncentive = fixtures.core.PointsIncentive({
      venue: points.assertValidAddress(),
      selector: bytes4("issue(address,uint256)"),
      reward: 1n,
      limit: 1n,
    });
    const boost = await freshBoost(fixtures, {
      incentives: [pointsIncentive],
    });

    const claimant = trustedSigner.account;
    const incentiveData = pointsIncentive.buildClaimData();

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

    await writePointsGrantRoles(defaultOptions.config, {
      address: points.assertValidAddress(),
      args: [pointsIncentive.assertValidAddress(), 2n],
      account: defaultOptions.account,
    });
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
