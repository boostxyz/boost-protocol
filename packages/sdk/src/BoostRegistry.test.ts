import { loadFixture } from '@nomicfoundation/hardhat-toolbox-viem/network-helpers';
import { pad, parseEther, zeroAddress, isAddress } from 'viem';
import { beforeAll, beforeEach, describe, expect, test, vi } from 'vitest';
import {
  type BudgetFixtures,
  type Fixtures,
  defaultOptions,
  deployFixtures,
  freshBoost,
  fundBudget,
  makeMockEventActionPayload,
} from '@boostxyz/test/helpers';
import { ContractAction } from './Actions/ContractAction';
import type { ERC20Incentive } from './Incentives/ERC20Incentive';
import { StrategyType } from './claiming';
import { BoostNotFoundError, IncentiveNotCloneableError } from './errors';
import { bytes4, RegistryType } from './utils';
import { BOOST_CORE_CLAIM_FEE } from './BoostCore';
import { accounts } from '@boostxyz/test/accounts';
import { SimpleAllowList } from './AllowLists/SimpleAllowList';

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
