import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { beforeAll, describe, expect, test } from 'vitest';
import {
  type Fixtures,
  defaultOptions,
  deployFixtures,
  freshManagedBudget,
} from '@boostxyz/test/helpers';
import { budgetFromAddress } from './Budget';
import { ManagedBudget } from './ManagedBudget';

let fixtures: Fixtures;

beforeAll(async () => {
  fixtures = await loadFixture(deployFixtures(defaultOptions));
});

describe('Budget', () => {
  test('can automatically instantiate ManagedBudget given an address', async () => {
    const budget = await loadFixture(
      freshManagedBudget(defaultOptions, fixtures),
    );
    expect(
      await budgetFromAddress(defaultOptions, budget.assertValidAddress()),
    ).toBeInstanceOf(ManagedBudget);
  });
});
