import { selectors } from '@boostxyz/signatures/events';
import { loadFixture } from '@nomicfoundation/hardhat-toolbox-viem/network-helpers';
import { type Hex, isAddress } from 'viem';
import { beforeAll, beforeEach, describe, expect, test } from 'vitest';
import { accounts } from '../test/accounts';
import {
  type BudgetFixtures,
  type Fixtures,
  defaultOptions,
  deployFixtures,
  fundBudget,
} from '../test/helpers';
import { FilterType, PrimitiveType, SignatureType } from './utils';

let fixtures: Fixtures, budgets: BudgetFixtures;

describe.only('BoostRegistry', () => {
  beforeAll(async () => {
    fixtures = await loadFixture(deployFixtures);
  });
  beforeEach(async () => {
    budgets = await loadFixture(fundBudget(defaultOptions, fixtures));
  });

  test('it should be able to clone EventAction', async () => {
    const action = await fixtures.registry.clone(
      'MyEventAction',
      fixtures.core.EventAction({
        actionClaimant: {
          signatureType: SignatureType.EVENT,
          signature: selectors['Transfer(address,address,uint256)'] as Hex,
          fieldIndex: 2,
          targetContract: budgets.erc20.assertValidAddress(),
        },
        actionSteps: [
          {
            signature: selectors['Transfer(address,address,uint256)'] as Hex,
            signatureType: SignatureType.EVENT,
            actionType: 0,
            targetContract: budgets.erc20.assertValidAddress(),
            actionParameter: {
              filterType: FilterType.EQUAL,
              fieldType: PrimitiveType.ADDRESS,
              fieldIndex: 2,
              filterData: accounts.at(1)!.account,
            },
          },
        ],
      }),
    );
    expect(isAddress(action.address!)).toBe(true);
  });
});
