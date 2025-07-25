import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { isAddress } from 'viem';
import { beforeAll, describe, expect, test } from 'vitest';
import {
  type Fixtures,
  defaultOptions,
  deployFixtures,
} from '@boostxyz/test/helpers';
import { OffchainAccessList } from './OffchainAccessList';

let fixtures: Fixtures;

beforeAll(async () => {
  fixtures = await loadFixture(deployFixtures(defaultOptions));
});

function freshOffchainAccessList(fixtures: Fixtures) {
  return function freshOffchainAccessList() {
    return fixtures.registry.initialize(
      crypto.randomUUID(),
      fixtures.core.OffchainAccessList({
        owner: defaultOptions.account.address,
        allowlistIds: ['allow-1', 'allow-2'],
        denylistIds: ['deny-1', 'deny-2'],
      }),
    );
  };
}

describe('OffchainAccessList', () => {
  test('can successfully be deployed', async () => {
    const accessList = new OffchainAccessList(defaultOptions, {
      owner: defaultOptions.account.address,
      allowlistIds: [],
      denylistIds: [],
    });
    // @ts-expect-error - deploy is protected
    await accessList.deploy();
    expect(isAddress(accessList.assertValidAddress())).toBe(true);
  });

  test('can get owner', async () => {
    const accessList = await loadFixture(freshOffchainAccessList(fixtures));
    expect(await accessList.owner()).toBe(defaultOptions.account.address);
  });

  // TODO: Add isAllowed tests once off-chain API integration is implemented
  // test('can check if address is allowed via off-chain API', async () => {
  //   const accessList = await loadFixture(freshOffchainAccessList(fixtures));
  //   expect(await accessList.isAllowed(defaultOptions.account.address)).toBe(true);
  //   expect(await accessList.isAllowed(zeroAddress)).toBe(false);
  // });

  test('can get allowlist IDs', async () => {
    const accessList = await loadFixture(freshOffchainAccessList(fixtures));
    const allowlistIds = await accessList.getAllowlistIds();
    expect(allowlistIds).toEqual(['allow-1', 'allow-2']);
  });

  test('can get denylist IDs', async () => {
    const accessList = await loadFixture(freshOffchainAccessList(fixtures));
    const denylistIds = await accessList.getDenylistIds();
    expect(denylistIds).toEqual(['deny-1', 'deny-2']);
  });

  test('can set allowlist IDs', async () => {
    const accessList = await loadFixture(freshOffchainAccessList(fixtures));
    await accessList.setAllowlistIds(['new-allow-1', 'new-allow-2', 'new-allow-3']);
    const allowlistIds = await accessList.getAllowlistIds();
    expect(allowlistIds).toEqual(['new-allow-1', 'new-allow-2', 'new-allow-3']);
  });

  test('can set denylist IDs', async () => {
    const accessList = await loadFixture(freshOffchainAccessList(fixtures));
    await accessList.setDenylistIds(['new-deny-1', 'new-deny-2', 'new-deny-3']);
    const denylistIds = await accessList.getDenylistIds();
    expect(denylistIds).toEqual(['new-deny-1', 'new-deny-2', 'new-deny-3']);
  });

  test('can add allowlist ID', async () => {
    const accessList = await loadFixture(freshOffchainAccessList(fixtures));
    await accessList.addAllowlistId('new-allow-id');
    const allowlistIds = await accessList.getAllowlistIds();
    expect(allowlistIds).toContain('new-allow-id');
    expect(allowlistIds).toHaveLength(3);
  });

  test('can add denylist ID', async () => {
    const accessList = await loadFixture(freshOffchainAccessList(fixtures));
    await accessList.addDenylistId('new-deny-id');
    const denylistIds = await accessList.getDenylistIds();
    expect(denylistIds).toContain('new-deny-id');
    expect(denylistIds).toHaveLength(3);
  });

  test('can remove allowlist ID', async () => {
    const accessList = await loadFixture(freshOffchainAccessList(fixtures));
    await accessList.removeAllowlistId('allow-1');
    const allowlistIds = await accessList.getAllowlistIds();
    expect(allowlistIds).not.toContain('allow-1');
    expect(allowlistIds).toContain('allow-2');
    expect(allowlistIds).toHaveLength(1);
  });

  test('can remove denylist ID', async () => {
    const accessList = await loadFixture(freshOffchainAccessList(fixtures));
    await accessList.removeDenylistId('deny-1');
    const denylistIds = await accessList.getDenylistIds();
    expect(denylistIds).not.toContain('deny-1');
    expect(denylistIds).toContain('deny-2');
    expect(denylistIds).toHaveLength(1);
  });

  test('can check if allowlist ID exists', async () => {
    const accessList = await loadFixture(freshOffchainAccessList(fixtures));
    expect(await accessList.hasAllowlistId('allow-1')).toBe(true);
    expect(await accessList.hasAllowlistId('allow-2')).toBe(true);
    expect(await accessList.hasAllowlistId('nonexistent')).toBe(false);
  });

  test('can check if denylist ID exists', async () => {
    const accessList = await loadFixture(freshOffchainAccessList(fixtures));
    expect(await accessList.hasDenylistId('deny-1')).toBe(true);
    expect(await accessList.hasDenylistId('deny-2')).toBe(true);
    expect(await accessList.hasDenylistId('nonexistent')).toBe(false);
  });

  test('can handle empty allowlist and denylist', async () => {
    const accessList = new OffchainAccessList(defaultOptions, {
      owner: defaultOptions.account.address,
      allowlistIds: [],
      denylistIds: [],
    });
    // @ts-expect-error - deploy is protected
    await accessList.deploy();
    
    const allowlistIds = await accessList.getAllowlistIds();
    const denylistIds = await accessList.getDenylistIds();
    
    expect(allowlistIds).toEqual([]);
    expect(denylistIds).toEqual([]);
    expect(await accessList.hasAllowlistId('nonexistent')).toBe(false);
    expect(await accessList.hasDenylistId('nonexistent')).toBe(false);
  });

  // TODO: Add test for off-chain access behavior once API integration is implemented
  // test('can check off-chain access behavior', async () => {
  //   const accessList = await loadFixture(freshOffchainAccessList(fixtures));
  //   
  //   // Should check against off-chain allowlist/denylist APIs
  //   expect(await accessList.isAllowed(defaultOptions.account.address)).toBe(true);
  //   expect(await accessList.isAllowed(zeroAddress)).toBe(false);
  // });
});