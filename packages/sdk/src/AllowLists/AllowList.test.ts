import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { beforeAll, describe, expect, test } from 'vitest';
import {
  type Fixtures,
  defaultOptions,
  deployFixtures,
} from '@boostxyz/test/helpers';
import {
  SimpleAllowList,
  SimpleDenyList,
  allowListFromAddress,
} from './AllowList';

let fixtures: Fixtures;

beforeAll(async () => {
  fixtures = await loadFixture(deployFixtures(defaultOptions));
});

function freshAllowList(fixtures: Fixtures) {
  return function freshAllowList() {
    return fixtures.registry.initialize(
      crypto.randomUUID(),
      fixtures.core.SimpleAllowList({
        owner: defaultOptions.account.address,
        allowed: [defaultOptions.account.address],
      }),
    );
  };
}

function freshDenyList(fixtures: Fixtures) {
  return function freshDenyList() {
    return fixtures.registry.initialize(
      crypto.randomUUID(),
      fixtures.core.SimpleDenyList({
        owner: defaultOptions.account.address,
        denied: [defaultOptions.account.address],
      }),
    );
  };
}

describe('AllowList', () => {
  test('can automatically instantiate SimpleAllowList given an address', async () => {
    const _allowList = await loadFixture(freshAllowList(fixtures));
    expect(
      await allowListFromAddress(
        defaultOptions,
        _allowList.assertValidAddress(),
      ),
    ).toBeInstanceOf(SimpleAllowList);
  });

  test('can automatically instantiate SimpleDenyList given an address', async () => {
    const _allowList = await loadFixture(freshDenyList(fixtures));
    expect(
      await allowListFromAddress(
        defaultOptions,
        _allowList.assertValidAddress(),
      ),
    ).toBeInstanceOf(SimpleDenyList);
  });
});
