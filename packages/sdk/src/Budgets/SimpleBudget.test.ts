import { writeMockErc1155SetApprovalForAll } from '@boostxyz/evm';
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { isAddress, parseEther, zeroAddress } from 'viem';
import { beforeAll, beforeEach, describe, expect, test } from 'vitest';
import type { MockERC20 } from '../../test/MockERC20';
import type { MockERC1155 } from '../../test/MockERC1155';
import {
  type Fixtures,
  defaultOptions,
  deployFixtures,
  freshBudget,
  fundBudget,
  fundErc20,
  fundErc1155,
} from '../../test/helpers';
import { testAccount } from '../../test/viem';
import { SimpleBudget } from './SimpleBudget';

let fixtures: Fixtures,
  budget: SimpleBudget,
  erc20: MockERC20,
  erc1155: MockERC1155;

beforeAll(async () => {
  fixtures = await loadFixture(deployFixtures);
});

describe('SimpleBudget', () => {
  test('can successfully be deployed', async () => {
    const action = new SimpleBudget(defaultOptions, {
      owner: testAccount.address,
      authorized: [],
    });
    await action.deploy();
    expect(isAddress(action.assertValidAddress())).toBe(true);
  });

  test('can be owned', async () => {
    const budget = await loadFixture(freshBudget(defaultOptions, fixtures));
    expect(await budget.owner()).toBe(defaultOptions.account.address);
  });

  test('can have authorized users', async () => {
    const budget = await loadFixture(freshBudget(defaultOptions, fixtures));
    expect(await budget.isAuthorized(defaultOptions.account.address)).toBe(
      true,
    );
    expect(await budget.isAuthorized(zeroAddress)).toBe(false);
  });

  test('can have no initial balance', async () => {
    const budget = await loadFixture(freshBudget(defaultOptions, fixtures));
    expect(await budget.available(zeroAddress)).toBe(0n);
  });

  describe('can allocate', () => {
    beforeEach(async () => {
      budget = await loadFixture(freshBudget(defaultOptions, fixtures));
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

    test('erc1155', async () => {
      await writeMockErc1155SetApprovalForAll(defaultOptions.config, {
        args: [budget.assertValidAddress(), true],
        address: erc1155.assertValidAddress(),
        account: defaultOptions.account,
      });
      await budget.allocate({
        tokenId: 1n,
        amount: 100n,
        asset: erc1155.assertValidAddress(),
        target: defaultOptions.account.address,
      });
      expect(await budget.available(erc1155.assertValidAddress(), 1n)).toBe(
        100n,
      );
    });
  });

  describe('can disburse', () => {
    beforeEach(async () => {
      const budgetFixtures = await loadFixture(
        fundBudget(defaultOptions, fixtures),
      );
      budget = budgetFixtures.budget;
      erc20 = budgetFixtures.erc20;
      erc1155 = budgetFixtures.erc1155;
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

    test('erc1155 assets', async () => {
      await budget.disburse({
        tokenId: 1n,
        amount: 5n,
        asset: erc1155.assertValidAddress(),
        target: defaultOptions.account.address,
      });

      expect(await budget.available(erc1155.assertValidAddress(), 1n)).to.equal(
        95n,
      );
    });
  });
});
