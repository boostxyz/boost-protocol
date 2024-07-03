import type { Config } from '@wagmi/core';
import { isAddress } from 'viem';
import { beforeEach, describe, expect, test } from 'vitest';
import { setupConfig, testAccount } from '../../test/viem';
import { SimpleBudget } from './SimpleBudget';

let config: Config;

beforeEach(() => {
  config = setupConfig();
});

describe('SimpleBudget', () => {
  test('can successfully be deployed', async () => {
    const action = new SimpleBudget(
      { config, account: testAccount },
      {
        owner: testAccount.address,
        authorized: [],
      },
    );
    const address = await action.deploy();
    expect(isAddress(address)).toBe(true);
  });
});
