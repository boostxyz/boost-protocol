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
  freshManagedBudgetWithFees,
  fundErc20,
  fundErc1155,
  freshBoostWithV1Validator,
  freshBoostWithV2Validator,
  fundManagedBudgetWithFees,
} from "@boostxyz/test/helpers";
import { testAccount } from "@boostxyz/test/viem";
import { ManagedBudgetWithFees } from "./ManagedBudgetWithFees";
import { Roles } from "../Deployable/DeployableTargetWithRBAC";
import { StrategyType } from "../claiming";

let fixtures: Fixtures,
  budget: ManagedBudgetWithFees,
  erc20: MockERC20,
  erc1155: MockERC1155;

beforeAll(async () => {
  fixtures = await loadFixture(deployFixtures(defaultOptions));
});

describe("ManagedBudgetWithFees", () => {
  test("can successfully be deployed", async () => {
    const action = new ManagedBudgetWithFees(defaultOptions, {
      owner: testAccount.address,
      authorized: [],
      roles: [],
      managementFee: 100n,
    });
    await action.deploy();
    expect(isAddress(action.assertValidAddress())).toBe(true);
  });

  test("can set ManagementFee", async () => {
    const budget = await loadFixture(
      freshManagedBudgetWithFees(defaultOptions, fixtures),
    );
    await budget.setManagementFee(5000n);
    const fee = await budget.managementFee();
    expect(fee).toBe(5000n);
  });
    

  test("can grant manager role to many users", async () => {
    const budget = await loadFixture(
      freshManagedBudgetWithFees(defaultOptions, fixtures),
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
      freshManagedBudgetWithFees(defaultOptions, fixtures),
    );
    const manager = accounts[1].account;
    await budget.grantRoles(manager, Roles.MANAGER);
    expect(await budget.hasAllRoles(manager, Roles.ADMIN)).toBe(false);
    expect(await budget.hasAllRoles(manager, Roles.MANAGER)).toBe(true);
  });

  test("can revoke role", async () => {
    const budget = await loadFixture(
      freshManagedBudgetWithFees(defaultOptions, fixtures),
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
      freshManagedBudgetWithFees(defaultOptions, fixtures),
    );
    const admin = accounts[1].account;
    const manager = accounts[2].account;
    await budget.grantManyRoles([admin, manager], [Roles.ADMIN, Roles.MANAGER]);
    expect(await budget.hasAllRoles(admin, Roles.ADMIN)).toBe(true);
    expect(await budget.hasAllRoles(manager, Roles.MANAGER)).toBe(true);
  });

  test("can revoke many roles", async () => {
    const budget = await loadFixture(
      freshManagedBudgetWithFees(defaultOptions, fixtures),
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
      freshManagedBudgetWithFees(defaultOptions, fixtures),
    );
    expect(await budget.owner()).toBe(defaultOptions.account.address);
  });

  test("can have authorized users", async () => {
    const budget = await loadFixture(
      freshManagedBudgetWithFees(defaultOptions, fixtures),
    );
    expect(await budget.isAuthorized(defaultOptions.account.address)).toBe(
      true,
    );
    expect(await budget.isAuthorized(zeroAddress)).toBe(false);
  });

  test("can have no initial balance", async () => {
    const budget = await loadFixture(
      freshManagedBudgetWithFees(defaultOptions, fixtures),
    );
    expect(await budget.available()).toBe(0n);
  });

  describe("can allocate", () => {
    beforeEach(async () => {
      budget = await loadFixture(freshManagedBudgetWithFees(defaultOptions, fixtures));
      erc20 = await loadFixture(fundErc20(defaultOptions));
      erc1155 = await loadFixture(fundErc1155(defaultOptions));
    });

    test("native assets", async () => {
      await budget.allocate(
        {
          amount: parseEther("1.0"),
          asset: zeroAddress,
          target: defaultOptions.account.address,
        },
        {
          value: parseEther("1.0"),
        },
      );
      expect(await budget.available()).toBe(parseEther("1.0"));
    });

    test("erc20", async () => {
      await erc20.approve(budget.assertValidAddress(), parseEther("110"));
      await budget.allocate({
        amount: parseEther("110"),
        asset: erc20.assertValidAddress(),
        target: defaultOptions.account.address,
      });
      expect(await budget.available(erc20.assertValidAddress())).toBe(
        parseEther("110"),
      );
    });

    test("erc1155", async () => {
      await writeMockErc1155SetApprovalForAll(defaultOptions.config, {
        args: [budget.assertValidAddress(), true],
        address: erc1155.assertValidAddress(),
        account: defaultOptions.account,
      });
      await budget.allocate({
        tokenId: 1n,
        amount: 110n,
        asset: erc1155.assertValidAddress(),
        target: defaultOptions.account.address,
      });
      expect(await budget.available(erc1155.assertValidAddress(), 1n)).toBe(
        110n,
      );
    });
  });

  describe("can disburse", () => {
    beforeEach(async () => {
      const budgetFixtures = await loadFixture(
        fundManagedBudgetWithFees(defaultOptions, fixtures),
      );
      budget = budgetFixtures.budget as ManagedBudgetWithFees;
      erc20 = budgetFixtures.erc20;
      erc1155 = budgetFixtures.erc1155;
    });

    test("to a fee-compatible incentive", async () => {
      const reward = 1_000_000_000n;
      const fee = await budget.managementFee();
      const erc20Incentive = fixtures.core.ERC20Incentive({
        asset: erc20.assertValidAddress(),
        strategy: StrategyType.POOL,
        reward: 1_000_000_000n,
        limit: 1n,
        manager: budget.assertValidAddress(),
      });
      await budget.grantRoles(fixtures.core.assertValidAddress(), Roles.MANAGER);
      const boost = await freshBoostWithV1Validator(fixtures, {
        budget: budget,
        incentives: [erc20Incentive],
      });

      const trustedSigner = accounts.at(0)!;
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
        trustedSigner.account,
        claimDataPayload,
      );
      let originalBalance = await erc20.balanceOf(accounts[0].account);

      await budget.payManagementFee(boost.id, 0n);
      let balance = await erc20.balanceOf(accounts[0].account);

      expect(balance - originalBalance).toBe(reward*fee/10_000n);
    })


    test("native assets", async () => {
      const originalAmount = await budget.available();
      const disbursalAmount = parseEther("0.5");
      const fee = await budget.managementFee();
      await budget.disburse({
        amount: disbursalAmount,
        asset: zeroAddress,
        target: defaultOptions.account.address,
      });

      expect(await budget.available()).toBe(originalAmount - disbursalAmount - disbursalAmount*fee / 10_000n);
    });

    test("erc20 assets", async () => {
      const originalAmount = await budget.available(erc20.assertValidAddress());
      const disbursalAmount = parseEther("10");
      const fee = await budget.managementFee();
      await budget.disburse({
        amount: disbursalAmount,
        asset: erc20.assertValidAddress(),
        target: defaultOptions.account.address,
      });

      expect(await budget.available(erc20.assertValidAddress())).toBe(
        originalAmount - disbursalAmount - disbursalAmount*fee / 10_000n
      );
    });

    test("erc1155 assets", async () => {
      await budget.disburse({
        tokenId: 1n,
        amount: 5n,
        asset: erc1155.assertValidAddress(),
        target: defaultOptions.account.address,
      });

      expect(await budget.available(erc1155.assertValidAddress(), 1n)).to.equal(
        105n,
      );
    });
  });
});
