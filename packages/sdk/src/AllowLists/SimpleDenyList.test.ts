import type { Config } from '@wagmi/core';
import { isAddress } from 'viem';
import { beforeEach, describe, expect, test } from 'vitest';
import { setupConfig, testAccount } from '../../test/viem';
import { SimpleDenyList } from './SimpleDenyList';

let config: Config;

beforeEach(() => {
  config = setupConfig();
});

describe('SimpleDenyList', () => {
  test('can successfully be deployed', async () => {
    const action = new SimpleDenyList(
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
