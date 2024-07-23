import {
  ERC1155StrategyType,
  StrategyType,
  prepareERC1155IncentivePayload,
} from '@boostxyz/evm';
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { isAddress, zeroAddress } from 'viem';
import { beforeAll, beforeEach, describe, expect, test } from 'vitest';
import {
  type BudgetFixtures,
  type Fixtures,
  defaultOptions,
  deployFixtures,
  freshBoost,
  fundBudget,
} from '../../test/helpers';
import { ERC1155Incentive } from './ERC1155Incentive';

let fixtures: Fixtures, budgets: BudgetFixtures;

describe('ERC1155Incentive', () => {
  beforeAll(async () => {
    fixtures = await loadFixture(deployFixtures);
  });

  beforeEach(async () => {
    budgets = await loadFixture(fundBudget(defaultOptions, fixtures));
  });

  test('can successfully be deployed', async () => {
    const action = new ERC1155Incentive(defaultOptions, {
      asset: zeroAddress,
      strategy: ERC1155StrategyType.MINT,
      tokenId: 0n,
      limit: 10n,
      extraData: '0x',
    });
    await action.deploy();
    expect(isAddress(action.assertValidAddress())).toBe(true);
  });

  test.skip('can properly form initialization payload', async () => {
    const erc1155Incentive = new fixtures.bases.ERC1155Incentive(
      defaultOptions,
      {
        asset: budgets.erc1155.assertValidAddress(),
        tokenId: 1n,
        limit: 1n,
        extraData: '0x',
        strategy: ERC1155StrategyType.POOL,
      },
    );
    await freshBoost(fixtures, {
      budget: budgets.budget,
      incentives: [erc1155Incentive],
    });
  });
});
