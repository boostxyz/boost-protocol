import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { isAddress, parseEther, zeroAddress } from 'viem';
import { beforeAll, beforeEach, describe, expect, test } from 'vitest';
import type { MockERC20 } from '../../test/MockERC20';
import {
  type Fixtures,
  defaultOptions,
  deployFixtures,
  freshVestingBudget,
  fundErc20,
  fundVestingBudget,
} from '../../test/helpers';
import { testAccount } from '../../test/viem';
import { VestingBudget } from './VestingBudget';

let fixtures: Fixtures, budget: VestingBudget, erc20: MockERC20;

beforeAll(async () => {
  fixtures = await loadFixture(deployFixtures);
});

describe('VestingBudget', () => {
  test('can successfully be deployed', async () => {
    const budget = new VestingBudget(defaultOptions, {
      owner: testAccount.address,
      authorized: [],
      start: 0n,
      duration: 100n,
      cliff: 5n,
    });
    await budget.deploy();
    expect(isAddress(budget.assertValidAddress())).toBe(true);
  });

  test('can be owned', async () => {
    const budget = await loadFixture(
      freshVestingBudget(defaultOptions, fixtures),
    );
    expect(await budget.owner()).toBe(defaultOptions.account.address);
  });

  test('can have authorized users', async () => {
    const budget = await loadFixture(
      freshVestingBudget(defaultOptions, fixtures),
    );
    expect(await budget.isAuthorized(defaultOptions.account.address)).toBe(
      true,
    );
    expect(await budget.isAuthorized(zeroAddress)).toBe(false);
  });

  test('can have no initial balance', async () => {
    const budget = await loadFixture(
      freshVestingBudget(defaultOptions, fixtures),
    );
    expect(await budget.available(zeroAddress)).toBe(0n);
  });

  describe('can allocate', () => {
    beforeEach(async () => {
      budget = await loadFixture(freshVestingBudget(defaultOptions, fixtures));
      erc20 = await loadFixture(fundErc20(defaultOptions));
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
      expect(await budget.available(zeroAddress)).toBe(parseEther('1.0'));
    });

    test('erc20', async () => {
      await erc20.approve(budget.assertValidAddress(), parseEther('100'));
      await budget.allocate({
        amount: parseEther('100'),
        asset: erc20.assertValidAddress(),
        target: defaultOptions.account.address,
      });
      expect(await budget.available(erc20.assertValidAddress())).toBe(
        parseEther('100'),
      );
    });
  });

  describe('can disburse', () => {
    beforeEach(async () => {
      const budgetFixtures = await loadFixture(
        fundVestingBudget(defaultOptions, fixtures),
      );
      budget = budgetFixtures.budget;
      erc20 = budgetFixtures.erc20;
    });

    test('native assets', async () => {
      await budget.disburse({
        amount: parseEther('1.0'),
        asset: zeroAddress,
        target: defaultOptions.account.address,
      });

      expect(await budget.available(zeroAddress)).toBe(0n);
    });

    test('erc20 assets', async () => {
      await budget.disburse({
        amount: parseEther('10'),
        asset: erc20.assertValidAddress(),
        target: defaultOptions.account.address,
      });

      expect(await budget.available(erc20.assertValidAddress())).toBe(
        parseEther('90'),
      );
    });
  });
});
