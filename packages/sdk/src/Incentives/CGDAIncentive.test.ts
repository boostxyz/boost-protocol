import type { Config } from '@wagmi/core';
import { isAddress, zeroAddress } from 'viem';
import { beforeEach, describe, expect, test } from 'vitest';
import { setupConfig, testAccount } from '../../test/viem';
import { CGDAIncentive } from './CGDAIncentive';

let config: Config;

beforeEach(() => {
  config = setupConfig();
});

describe('CGDAIncentive', () => {
  test('can successfully be deployed', async () => {
    const action = new CGDAIncentive(
      { config, account: testAccount },
      {
        asset: zeroAddress,
        initialReward: 0n,
        rewardDecay: 0n,
        rewardBoost: 0n,
        totalBudget: 0n,
      },
    );
    const address = await action.deploy();
    expect(isAddress(address)).toBe(true);
  });
});
