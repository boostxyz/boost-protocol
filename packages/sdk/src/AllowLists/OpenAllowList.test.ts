import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { isAddress, zeroAddress } from 'viem';
import { beforeAll, describe, expect, test } from 'vitest';
import { accounts } from '@boostxyz/test/accounts';
import {
  type Fixtures,
  defaultOptions,
  deployFixtures,
} from '@boostxyz/test/helpers';
import { OpenAllowList } from './OpenAllowList';

let fixtures: Fixtures;

beforeAll(async () => {
  fixtures = await loadFixture(deployFixtures(defaultOptions));
});

function freshOpenAllowList(fixtures: Fixtures) {
  return function freshOpenAllowList() {
    return fixtures.registry.initialize(
      crypto.randomUUID(),
      new fixtures.bases.OpenAllowList(defaultOptions),
    );
  };
}

describe('OpenAllowList', () => {
  test('can successfully be deployed', async () => {
    const denyList = new OpenAllowList(defaultOptions);
    await denyList.deploy();
    expect(isAddress(denyList.assertValidAddress())).toBe(true);
  });

  test('allows anyone', async () => {
    const denyList = await loadFixture(freshOpenAllowList(fixtures));
    expect(await denyList.isAllowed(defaultOptions.account.address)).toBe(true);
    expect(await denyList.isAllowed(zeroAddress)).toBe(true);
    expect(await denyList.isAllowed(accounts.at(1)!.account)).toBe(true);
  });
});
