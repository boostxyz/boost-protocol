import type { Config } from '@wagmi/core';
import { isAddress, zeroAddress } from 'viem';
import { beforeEach, describe, expect, test } from 'vitest';
import { setupConfig, testAccount } from '../../test/viem';
import { AllowListIncentive } from './AllowListIncentive';

let config: Config;

beforeEach(() => {
  config = setupConfig();
});

describe('AllowListIncentive', () => {
  test('can successfully be deployed', async () => {
    const action = new AllowListIncentive(
      { config, account: testAccount },
      {
        allowList: zeroAddress,
        limit: 0n,
      },
    );
    await action.deploy();
    expect(isAddress(action.assertValidAddress())).toBe(true);
  });
});
