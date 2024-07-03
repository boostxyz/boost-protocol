import type { Config } from '@wagmi/core';
import { isAddress } from 'viem';
import { beforeEach, describe, expect, test } from 'vitest';
import { setupConfig, testAccount } from '../../test/viem';
import { SimpleAllowList } from './SimpleAllowList';

let config: Config;

beforeEach(() => {
  config = setupConfig();
});

describe('SimpleAllowList', () => {
  test('can successfully be deployed', async () => {
    const action = new SimpleAllowList(
      { config, account: testAccount },
      {
        owner: testAccount.address,
        allowed: [],
      },
    );
    const address = await action.deploy();
    expect(isAddress(address)).toBe(true);
  });
});
