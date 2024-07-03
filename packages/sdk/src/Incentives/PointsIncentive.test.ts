import type { Config } from '@wagmi/core';
import { isAddress, zeroAddress } from 'viem';
import { beforeEach, describe, expect, test } from 'vitest';
import { setupConfig, testAccount } from '../../test/viem';
import { PointsIncentive } from './PointsIncentive';

let config: Config;

beforeEach(() => {
  config = setupConfig();
});

describe('PointsIncentive', () => {
  test('can successfully be deployed', async () => {
    const action = new PointsIncentive(
      { config, account: testAccount },
      {
        venue: zeroAddress,
        selector: '0xdeadb33f',
        quantity: 1n,
        limit: 1n,
      },
    );
    const address = await action.deploy();
    expect(isAddress(address)).toBe(true);
  });
});
