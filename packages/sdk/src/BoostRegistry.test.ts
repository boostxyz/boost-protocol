import {
  type BudgetFixtures,
  type Fixtures,
  defaultOptions,
  deployFixtures
} from '@boostxyz/test/helpers';
import { loadFixture } from '@nomicfoundation/hardhat-toolbox-viem/network-helpers';
import { isAddress, zeroAddress } from 'viem';
import { beforeAll, describe, expect, test } from 'vitest';
import { RegistryType } from './utils';

let fixtures: Fixtures, budgets: BudgetFixtures;

describe('BoostRegistry', () => {
  beforeAll(async () => {
    fixtures = await loadFixture(deployFixtures(defaultOptions));
  });

  test('can initialize a new component', async () => {
    const { registry, core } = fixtures;
    const allowlist = await registry.initialize('NewAllowList', core.SimpleAllowList({
      owner: zeroAddress,
      allowed: []
    }))
    expect(isAddress(allowlist.assertValidAddress())).toBe(true)
  });

  test('can use a clones identifier to get the clone', async () => {
    const { registry, bases } = fixtures;
    const id = await registry.getCloneIdentifier(
      RegistryType.ALLOW_LIST,
      bases.SimpleAllowList.bases[31337]!,
      defaultOptions.account.address,
      'NewAllowList'
    )
    expect(await registry.getClone(id)).toMatchObject({
      baseType: RegistryType.ALLOW_LIST,
      instance: expect.any(String),
      deployer: defaultOptions.account.address,
      name: 'NewAllowList'
    })
  });
});
