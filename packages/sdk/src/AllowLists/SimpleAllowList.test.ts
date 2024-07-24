import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { isAddress, zeroAddress } from 'viem';
import { beforeAll, describe, expect, test } from 'vitest';
import {
  type Fixtures,
  defaultOptions,
  deployFixtures,
} from '../../test/helpers';
import { SimpleAllowList } from './SimpleAllowList';

let fixtures: Fixtures;

beforeAll(async () => {
  fixtures = await loadFixture(deployFixtures);
});

function freshAllowList(fixtures: Fixtures) {
  return function freshAllowList() {
    return fixtures.registry.clone(
      crypto.randomUUID(),
      new fixtures.bases.SimpleAllowList(defaultOptions, {
        owner: defaultOptions.account.address,
        allowed: [defaultOptions.account.address],
      }),
    );
  };
}

describe('SimpleAllowList', () => {
  test('can successfully be deployed', async () => {
    const allowList = new SimpleAllowList(defaultOptions, {
      owner: defaultOptions.account.address,
      allowed: [],
    });
    await allowList.deploy();
    expect(isAddress(allowList.assertValidAddress())).toBe(true);
  });

  test('can check is allowed', async () => {
    const allowList = await loadFixture(freshAllowList(fixtures));
    expect(await allowList.isAllowed(defaultOptions.account.address)).toBe(
      true,
    );
    expect(await allowList.isAllowed(zeroAddress)).toBe(false);
  });

  test('can set allowed', async () => {
    const allowList = await loadFixture(freshAllowList(fixtures));
    await allowList.setAllowed([zeroAddress], [true]);
    expect(await allowList.isAllowed(zeroAddress)).toBe(true);
  });
});
