import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { isAddress, zeroAddress } from 'viem';
import { beforeAll, describe, expect, test } from 'vitest';
import {
  type Fixtures,
  defaultOptions,
  deployFixtures,
} from '../../test/helpers';
import { SimpleDenyList } from './SimpleDenyList';

let fixtures: Fixtures;

beforeAll(async () => {
  fixtures = await loadFixture(deployFixtures);
});

function freshDenyList(fixtures: Fixtures) {
  return function freshDenyList() {
    return fixtures.registry.clone(
      crypto.randomUUID(),
      new fixtures.bases.SimpleDenyList(defaultOptions, {
        owner: defaultOptions.account.address,
        denied: [defaultOptions.account.address],
      }),
    );
  };
}

describe('SimpleDenyList', () => {
  test('can successfully be deployed', async () => {
    const denyList = new SimpleDenyList(defaultOptions, {
      owner: defaultOptions.account.address,
      denied: [],
    });
    await denyList.deploy();
    expect(isAddress(denyList.assertValidAddress())).toBe(true);
  });

  test('can check is denied', async () => {
    const denyList = await loadFixture(freshDenyList(fixtures));
    expect(await denyList.isAllowed(defaultOptions.account.address)).toBe(
      false,
    );
    expect(await denyList.isAllowed(zeroAddress)).toBe(true);
  });

  test('can set denied', async () => {
    const denyList = await loadFixture(freshDenyList(fixtures));
    await denyList.setDenied([zeroAddress], [true]);
    expect(await denyList.isAllowed(zeroAddress)).toBe(false);
  });
});
