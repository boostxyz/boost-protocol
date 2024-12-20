import { accounts } from "@boostxyz/test/accounts";
import {
  type Fixtures,
  defaultOptions,
  deployFixtures,
  freshBoost,
} from "@boostxyz/test/helpers";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { isAddress, pad, parseEther, zeroAddress } from "viem";
import { beforeAll, describe, expect, test } from "vitest";
import { Roles } from "../Deployable/DeployableTargetWithRBAC";
import { PointsIncentive } from "./PointsIncentive";

let fixtures: Fixtures;

function freshAllowList(fixtures: Fixtures) {
  return function freshAllowList() {
    return fixtures.registry.initialize(
      crypto.randomUUID(),
      fixtures.core.SimpleAllowList({
        owner: defaultOptions.account.address,
        allowed: [],
      }),
    );
  };
}

describe("AllowListIncentive", () => {
  beforeAll(async () => {
    fixtures = await loadFixture(deployFixtures(defaultOptions));
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
    const referrer = accounts.at(1)?.account!;
    // biome-ignore lint/style/noNonNullAssertion: we know this is defined
    const trustedSigner = accounts.at(0)!;
    const allowList = await loadFixture(freshAllowList(fixtures));
    const allowListIncentive = new fixtures.bases.AllowListIncentive(
      defaultOptions,
      {
        allowList: allowList.assertValidAddress(),
        limit: 3n,
      },
    );
    const boost = await freshBoost(fixtures, {
      incentives: [allowListIncentive],
    });
    await allowList.grantManyRoles(
      [allowListIncentive.assertValidAddress()],
      [Roles.MANAGER],
    );

    const claimant = trustedSigner.account;
    const incentiveData = pad("0xdef456232173821931823712381232131391321934");
    console.log(claimant);

    const claimDataPayload = await boost.validator.encodeClaimData({
      signer: trustedSigner,
      incentiveData,
      chainId: defaultOptions.config.chains[0].id,
      incentiveQuantity: boost.incentives.length,
      claimant,
      boostId: boost.id,
    });

    //await boost.validator.setValidatorCaller(boost.assertValidAddress());
    await fixtures.core.claimIncentive(
      boost.id,
      0n,
      referrer,
      claimDataPayload,
      { value: parseEther("0.000075"), account: trustedSigner.privateKey },
    );
    expect(await allowList.isAllowed(trustedSigner.account)).toBe(true);
  });

  test("can test claimability", async () => {
    // biome-ignore lint/style/noNonNullAssertion: we know this is defined
    const referrer = accounts.at(1)?.account!;
    // biome-ignore lint/style/noNonNullAssertion: we know this is defined
    const trustedSigner = accounts.at(0)!;
    const allowList = await loadFixture(freshAllowList(fixtures));
    const allowListIncentive = new fixtures.bases.AllowListIncentive(
      defaultOptions,
      {
        allowList: allowList.assertValidAddress(),
        limit: 1n,
      },
    );
    const boost = await freshBoost(fixtures, {
      incentives: [allowListIncentive],
    });
    await allowList.grantManyRoles(
      [allowListIncentive.assertValidAddress()],
      [Roles.MANAGER],
    );

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

    //await boost.validator.setValidatorCaller(boost.assertValidAddress());
    await fixtures.core.claimIncentive(
      boost.id,
      0n,
      referrer,
      claimDataPayload,
      { value: parseEther("0.000075"), account: trustedSigner.privateKey },
    );
    expect(await boost.incentives.at(0)!.getRemainingClaimPotential()).toBe(0n)
    expect(await boost.incentives.at(0)!.canBeClaimed()).toBe(false)
  });

  test("cannot claim twice", async () => {
    // biome-ignore lint/style/noNonNullAssertion: we know this is defined
    const referrer = accounts.at(1)?.account!;
    // biome-ignore lint/style/noNonNullAssertion: we know this is defined
    const trustedSigner = accounts.at(0)!;
    const allowList = await loadFixture(freshAllowList(fixtures));
    const allowListIncentive = new fixtures.bases.AllowListIncentive(
      defaultOptions,
      {
        allowList: allowList.assertValidAddress(),
        limit: 3n,
      },
    );
    const boost = await freshBoost(fixtures, {
      incentives: [allowListIncentive],
    });
    await allowList.grantManyRoles(
      [allowListIncentive.assertValidAddress()],
      [Roles.MANAGER],
    );
    const claimant = trustedSigner.account;
    const incentiveData = pad("0xdef456232173821931823712381232131391321934");
    console.log(claimant);

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
      { value: parseEther("0.000075"), account: trustedSigner.privateKey },
    );
    try {
      await fixtures.core.claimIncentive(
        boost.id,
        0n,
        referrer,
        claimDataPayload,
        { value: parseEther("0.000075"), account: trustedSigner.privateKey },
      );
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
    }
  });

  test("isClaimable returns expected values", async () => {
    const referrer = accounts[1].account;
    const trustedSigner = accounts[0];
    const allowList = await loadFixture(freshAllowList(fixtures));
    const allowListIncentive = new fixtures.bases.AllowListIncentive(
      defaultOptions,
      {
        allowList: allowList.assertValidAddress(),
        limit: 1n,
      },
    );
    const boost = await freshBoost(fixtures, {
      incentives: [allowListIncentive],
    });
    await allowList.grantManyRoles(
      [allowListIncentive.assertValidAddress()],
      [Roles.MANAGER],
    );

    const claimant = trustedSigner.account;
    const incentiveData = allowListIncentive.buildClaimData();

    // Should be claimable before claiming
    expect(await boost.incentives[0]!.isClaimable({ target: claimant })).toBe(true);

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
      { value: parseEther("0.000075"), account: trustedSigner.privateKey },
    );

    // Should not be claimable after claiming
    expect(await boost.incentives[0]!.isClaimable({ target: claimant })).toBe(false);
  });
});
