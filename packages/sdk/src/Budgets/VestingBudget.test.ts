import type { Config } from '@wagmi/core';
import { isAddress } from 'viem';
import { beforeEach, describe, expect, test } from 'vitest';
import { setupConfig, testAccount } from '../../test/viem';
import { VestingBudget } from './VestingBudget';

let config: Config;

beforeEach(() => {
  config = setupConfig();
});

describe('VestingBudget', () => {
  test('can successfully be deployed', async () => {
    const action = new VestingBudget(
      { config, account: testAccount },
      {
        owner: testAccount.address,
        authorized: [],
        start: 0n,
        duration: 100n,
        cliff: 5n,
      },
    );
    const address = await action.deploy();
    expect(isAddress(address)).toBe(true);
  });
});
