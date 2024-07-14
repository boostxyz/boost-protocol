import { StrategyType } from '@boostxyz/evm';
import { isAddress, zeroAddress } from 'viem';
import { describe, expect, test } from 'vitest';
import { defaultOptions } from '../../test/helpers';
import { ERC20Incentive } from './ERC20Incentive';

describe('ERC1155Incentive', () => {
  test('can successfully be deployed', async () => {
    const action = new ERC20Incentive(defaultOptions, {
      asset: zeroAddress,
      strategy: StrategyType.MINT,
      reward: 0n,
      limit: 10n,
    });
    await action.deploy();
    expect(isAddress(action.assertValidAddress())).toBe(true);
  });
});
