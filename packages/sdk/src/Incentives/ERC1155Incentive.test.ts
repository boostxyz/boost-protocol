import { ERC1155StrategyType } from '@boostxyz/evm';
import type { Config } from '@wagmi/core';
import { isAddress, zeroAddress } from 'viem';
import { beforeEach, describe, expect, test } from 'vitest';
import { setupConfig, testAccount } from '../../test/viem';
import { ERC1155Incentive } from './ERC1155Incentive';

let config: Config;

beforeEach(() => {
  config = setupConfig();
});

describe('ERC1155Incentive', () => {
  test('can successfully be deployed', async () => {
    const action = new ERC1155Incentive(
      { config, account: testAccount },
      {
        asset: zeroAddress,
        strategy: ERC1155StrategyType.MINT,
        tokenId: 0n,
        limit: 10n,
        extraData: '0x',
      },
    );
    await action.deploy();
    expect(isAddress(action.assertValidAddress())).toBe(true);
  });
});
