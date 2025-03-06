import { writeMockErc1155SetApprovalForAll } from "@boostxyz/evm";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { isAddress, parseEther, zeroAddress } from "viem";
import { beforeAll, beforeEach, describe, expect, test } from "vitest";
import type { MockERC20 } from "@boostxyz/test/MockERC20";
import type { MockERC1155 } from "@boostxyz/test/MockERC1155";
import { accounts } from "@boostxyz/test/accounts";
import {
  type Fixtures,
  defaultOptions,
  deployFixtures,
  freshTransparentBudget,
  fundErc20,
  fundErc1155,
  fundTransparentBudget,
} from "@boostxyz/test/helpers";
import { testAccount } from "@boostxyz/test/viem";
import { TransparentBudget } from "./TransparentBudget";
import { Roles } from "../Deployable/DeployableTargetWithRBAC";

let fixtures: Fixtures,
  budget: TransparentBudget,
  erc20: MockERC20,
  erc1155: MockERC1155;

beforeAll(async () => {
  fixtures = await loadFixture(deployFixtures(defaultOptions));
});

describe("TransparentBudget", () => {
  test("can successfully be deployed", async () => {
    const budget = new TransparentBudget(defaultOptions);
    //@ts-expect-error internal but need to testing
    await budget.deploy();
    expect(isAddress(budget.assertValidAddress())).toBe(true);
  });

  test("can grant manager role to many users", async () => {
    const budget = await loadFixture(
      freshTransparentBudget(defaultOptions, fixtures),
    );
    const one = accounts[1].account;
    const two = accounts[2].account;
    await budget.setAuthorized([one, two], [true, true]);
    expect(await budget.hasAllRoles(one, Roles.ADMIN)).toBe(false);
    expect(await budget.hasAllRoles(one, Roles.MANAGER)).toBe(true);
    expect(await budget.hasAllRoles(two, Roles.MANAGER)).toBe(true);
  });

  test("can grant role", async () => {
    const budget = await loadFixture(
      freshTransparentBudget(defaultOptions, fixtures),
    );
    const manager = accounts[1].account;
    await budget.grantRoles(manager, Roles.MANAGER);
    expect(await budget.hasAllRoles(manager, Roles.ADMIN)).toBe(false);
    expect(await budget.hasAllRoles(manager, Roles.MANAGER)).toBe(true);
  });

  test("can revoke role", async () => {
    const budget = await loadFixture(
      freshTransparentBudget(defaultOptions, fixtures),
    );
    const manager = accounts[1].account;
    await budget.grantRoles(manager, Roles.MANAGER);
    await budget.grantRoles(manager, Roles.ADMIN);
    await budget.revokeRoles(manager, Roles.MANAGER);
    expect(await budget.hasAllRoles(manager, Roles.MANAGER)).toBe(false);
    expect(await budget.hasAllRoles(manager, Roles.ADMIN)).toBe(true);
    await budget.revokeRoles(manager, Roles.ADMIN);
    expect(await budget.hasAllRoles(manager, Roles.ADMIN)).toBe(false);
  });

  test("can grant many roles", async () => {
    const budget = await loadFixture(
      freshTransparentBudget(defaultOptions, fixtures),
    );
    const admin = accounts[1].account;
    const manager = accounts[2].account;
    await budget.grantManyRoles([admin, manager], [Roles.ADMIN, Roles.MANAGER]);
    expect(await budget.hasAllRoles(admin, Roles.ADMIN)).toBe(true);
    expect(await budget.hasAllRoles(manager, Roles.MANAGER)).toBe(true);
  });

  test("can revoke many roles", async () => {
    const budget = await loadFixture(
      freshTransparentBudget(defaultOptions, fixtures),
    );
    const admin = accounts[1].account;
    const manager = accounts[2].account;
    await budget.grantManyRoles([admin, manager], [Roles.ADMIN, Roles.MANAGER]);
    await budget.revokeManyRoles(
      [admin, manager],
      [Roles.ADMIN, Roles.MANAGER],
    );
    expect(await budget.hasAllRoles(admin, Roles.ADMIN)).toBe(false);
    expect(await budget.hasAllRoles(manager, Roles.MANAGER)).toBe(false);
  });

  test("can be owned", async () => {
    const budget = await loadFixture(
      freshTransparentBudget(defaultOptions, fixtures),
    );
    expect(await budget.owner()).toBe(defaultOptions.account.address);
  });

  test("can have authorized users", async () => {
    const budget = await loadFixture(
      freshTransparentBudget(defaultOptions, fixtures),
    );
    expect(await budget.isAuthorized(defaultOptions.account.address)).toBe(
      true,
    );
    expect(await budget.isAuthorized(zeroAddress)).toBe(false);
  });

  describe("can disburse", () => {
    beforeEach(async () => {
      const budgetFixtures = await loadFixture(
        fundTransparentBudget(defaultOptions, fixtures),
      );
      budget = budgetFixtures.budget as TransparentBudget;
      erc20 = budgetFixtures.erc20;
      erc1155 = budgetFixtures.erc1155;
    });

    test("native assets", async () => {
      await budget.disburse({
        amount: parseEther("1.0"),
        asset: zeroAddress,
        target: defaultOptions.account.address,
      });

      expect(await budget.distributed()).toBe(parseEther("1.0"));
    });

    test("erc20 assets", async () => {
      await budget.disburse({
        amount: parseEther("10"),
        asset: erc20.assertValidAddress(),
        target: defaultOptions.account.address,
      });

      expect(await budget.distributed(erc20.assertValidAddress())).toBe(
        parseEther("100"),
      );
    });

    test("erc1155 assets", async () => {
      await budget.disburse({
        tokenId: 1n,
        amount: 5n,
        asset: erc1155.assertValidAddress(),
        target: defaultOptions.account.address,
      });

      expect(await budget.distributed(erc1155.assertValidAddress(), 1n)).to.equal(
        5n,
      );
    });
  });
});
