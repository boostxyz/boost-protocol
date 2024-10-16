import { writeMockErc1155SetApprovalForAll } from '@boostxyz/evm';
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { isAddress, parseEther, zeroAddress } from 'viem';
import { beforeAll, beforeEach, describe, expect, test } from 'vitest';
import type { MockERC20 } from '@boostxyz/test/MockERC20';
import type { MockERC1155 } from '@boostxyz/test/MockERC1155';
import { accounts } from '@boostxyz/test/accounts';
import {
  type Fixtures,
  defaultOptions,
  deployFixtures,
  freshBudget,
  freshManagedBudget,
  fundErc20,
  fundErc1155,
  fundManagedBudget,
} from '@boostxyz/test/helpers';
import { testAccount } from '@boostxyz/test/viem';
import { ManagedBudget, ManagedBudgetRoles } from './ManagedBudget';

let fixtures: Fixtures,
  budget: ManagedBudget,
  erc20: MockERC20,
  erc1155: MockERC1155;

beforeAll(async () => {
  fixtures = await loadFixture(deployFixtures(defaultOptions));
});

describe('ManagedBudget', () => {
  test('can successfully be deployed', async () => {
    const action = new ManagedBudget(defaultOptions, {
      owner: testAccount.address,
      authorized: [],
      roles: [],
    });
    await action.deploy();
    expect(isAddress(action.assertValidAddress())).toBe(true);
  });

  test('can grant manager role to many users', async () => {
    const budget = await loadFixture(
      freshManagedBudget(defaultOptions, fixtures),
    );
    const one = accounts[1].account;
    const two = accounts[2].account;
    await budget.setAuthorized([one, two], [true, true]);
    expect(await budget.hasAllRoles(one, ManagedBudgetRoles.ADMIN)).toBe(false);
    expect(await budget.hasAllRoles(one, ManagedBudgetRoles.MANAGER)).toBe(
      true,
    );
    expect(await budget.hasAllRoles(two, ManagedBudgetRoles.MANAGER)).toBe(
      true,
    );
  });

  test('can grant roles', async () => {
    const budget = await loadFixture(
      freshManagedBudget(defaultOptions, fixtures),
    );
    const admin = accounts[1].account;
    const manager = accounts[2].account;
    await budget.grantRoles(
      [admin, manager],
      [ManagedBudgetRoles.ADMIN, ManagedBudgetRoles.MANAGER],
    );
    expect(await budget.hasAllRoles(admin, ManagedBudgetRoles.ADMIN)).toBe(
      true,
    );
    expect(await budget.hasAllRoles(manager, ManagedBudgetRoles.MANAGER)).toBe(
      true,
    );
  });

  test('can revoke roles', async () => {
    const budget = await loadFixture(
      freshManagedBudget(defaultOptions, fixtures),
    );
    const admin = accounts[1].account;
    const manager = accounts[2].account;
    await budget.grantRoles(
      [admin, manager],
      [ManagedBudgetRoles.ADMIN, ManagedBudgetRoles.MANAGER],
    );
    await budget.revokeRoles(
      [admin, manager],
      [ManagedBudgetRoles.ADMIN, ManagedBudgetRoles.MANAGER],
    );
    expect(await budget.hasAllRoles(admin, ManagedBudgetRoles.ADMIN)).toBe(
      false,
    );
    expect(await budget.hasAllRoles(manager, ManagedBudgetRoles.MANAGER)).toBe(
      false,
    );
  });

  test('can be owned', async () => {
    const budget = await loadFixture(
      freshManagedBudget(defaultOptions, fixtures),
    );
    expect(await budget.owner()).toBe(defaultOptions.account.address);
  });

  test('can have authorized users', async () => {
    const budget = await loadFixture(
      freshManagedBudget(defaultOptions, fixtures),
    );
    expect(await budget.isAuthorized(defaultOptions.account.address)).toBe(
      true,
    );
    expect(await budget.isAuthorized(zeroAddress)).toBe(false);
  });

  test('can have no initial balance', async () => {
    const budget = await loadFixture(
      freshManagedBudget(defaultOptions, fixtures),
    );
    expect(await budget.available()).toBe(0n);
  });

  describe('can allocate', () => {
    beforeEach(async () => {
      budget = await loadFixture(freshManagedBudget(defaultOptions, fixtures));
      erc20 = await loadFixture(fundErc20(defaultOptions));
      erc1155 = await loadFixture(fundErc1155(defaultOptions));
    });

    test('native assets', async () => {
      await budget.allocate(
        {
          amount: parseEther('1.0'),
          asset: zeroAddress,
          target: defaultOptions.account.address,
        },
        {
          value: parseEther('1.0'),
        },
      );
      expect(await budget.available()).toBe(parseEther('1.0'));
    });

    test('erc20', async () => {
      await erc20.approve(budget.assertValidAddress(), parseEther('110'));
      await budget.allocate({
        amount: parseEther('110'),
        asset: erc20.assertValidAddress(),
        target: defaultOptions.account.address,
      });
      expect(await budget.available(erc20.assertValidAddress())).toBe(
        parseEther('110'),
      );
    });

    test('erc1155', async () => {
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

  describe('can disburse', () => {
    beforeEach(async () => {
      const budgetFixtures = await loadFixture(
        fundManagedBudget(defaultOptions, fixtures),
      );
      budget = budgetFixtures.budget as ManagedBudget;
      erc20 = budgetFixtures.erc20;
      erc1155 = budgetFixtures.erc1155;
    });

    test('native assets', async () => {
      await budget.disburse({
        amount: parseEther('1.0'),
        asset: zeroAddress,
        target: defaultOptions.account.address,
      });

      expect(await budget.available()).toBe(0n);
    });

    test('erc20 assets', async () => {
      await budget.disburse({
        amount: parseEther('10'),
        asset: erc20.assertValidAddress(),
        target: defaultOptions.account.address,
      });

      expect(await budget.available(erc20.assertValidAddress())).toBe(
        parseEther('100'),
      );
    });

    test('erc1155 assets', async () => {
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
