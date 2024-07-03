import { ERC1155StrategyType, StrategyType } from '@boostxyz/evm';
import type { Config } from '@wagmi/core';
import { isAddress, zeroAddress } from 'viem';
import { beforeEach, describe, expect, test } from 'vitest';
import { setupConfig, testAccount } from '../../test/viem';
import { ERC20Incentive } from './ERC20Incentive';

let config: Config;

beforeEach(() => {
  config = setupConfig();
});

describe('ERC1155Incentive', () => {
  test('can successfully be deployed', async () => {
    const action = new ERC20Incentive(
      { config, account: testAccount },
      {
        asset: zeroAddress,
        strategy: StrategyType.MINT,
        reward: 0n,
        limit: 10n,
      },
    );
    const address = await action.deploy();
    expect(isAddress(address)).toBe(true);
  });
});
