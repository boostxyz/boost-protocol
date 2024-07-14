import { ERC1155StrategyType } from '@boostxyz/evm';
import { isAddress, zeroAddress } from 'viem';
import { describe, expect, test } from 'vitest';
import { defaultOptions } from '../../test/helpers';
import { ERC1155Incentive } from './ERC1155Incentive';

describe('ERC1155Incentive', () => {
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
});
