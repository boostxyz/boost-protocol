import {
  prepareAllowListIncentivePayload,
  writeAllowListIncentiveInitialize,
} from '@boostxyz/evm';
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { isAddress, zeroAddress } from 'viem';
import { beforeAll, describe, expect, test } from 'vitest';
import { accounts } from '../../test/accounts';
import {
  type Fixtures,
  defaultOptions,
  deployFixtures,
} from '../../test/helpers';
import type { AllowList } from '../AllowLists/AllowList';
import { AllowListIncentive } from './AllowListIncentive';

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

function freshAllowListIncentive(fixtures: Fixtures, allowlist: AllowList) {
  return async function freshAllowListIncentive() {
    return fixtures.registry.clone(
      crypto.randomUUID(),
      new fixtures.bases.AllowListIncentive(defaultOptions, {
        allowList: allowlist.assertValidAddress(),
        limit: 3n,
      }),
    );
  };
}

describe('AllowListIncentive', () => {
  test('can successfully be deployed', async () => {
    const action = new AllowListIncentive(defaultOptions, {
      allowList: zeroAddress,
      limit: 0n,
    });
    await action.deploy();
    expect(isAddress(action.assertValidAddress())).toBe(true);
  });

  test('can be claimed', async () => {
    const allowList = await loadFixture(freshAllowList(fixtures));
    const incentive = await loadFixture(
      freshAllowListIncentive(fixtures, allowList),
    );
    console.log(fixtures.core.assertValidAddress());
    console.log(fixtures.registry.assertValidAddress());
    console.log(await incentive.owner());
    expect(await allowList.isAllowed(zeroAddress)).toBe(false);
    await incentive.claim({ target: zeroAddress });
    expect(await allowList.isAllowed(zeroAddress)).toBe(true);
  });

  test('cannot be claimed twice', async () => {
    const allowList = await loadFixture(freshAllowList(fixtures));
    const incentive = await loadFixture(
      freshAllowListIncentive(fixtures, allowList),
    );
    expect(await allowList.isAllowed(zeroAddress)).toBe(false);
    await incentive.claim({ target: zeroAddress });
    expect(await allowList.isAllowed(zeroAddress)).toBe(true);
    try {
      await incentive.claim({ target: zeroAddress });
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
    }
  });

  test('can check claimable', async () => {
    const allowList = await loadFixture(freshAllowList(fixtures));
    const incentive = await loadFixture(
      freshAllowListIncentive(fixtures, allowList),
    );
    expect(await incentive.isClaimable({ target: zeroAddress })).toBe(true);
    await incentive.claim({ target: zeroAddress });
    expect(await allowList.isAllowed(zeroAddress)).toBe(false);
  });

  test('cannot exceed max claims', async () => {
    const allowList = await loadFixture(freshAllowList(fixtures));
    const incentive = await loadFixture(
      freshAllowListIncentive(fixtures, allowList),
    );
    for (let i = 0; i < 3; i++) {
      const { account } = accounts.at(i)!;
      await incentive.claim({ target: account });
    }
    try {
      await incentive.claim({ target: zeroAddress });
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
    }
  });
});
