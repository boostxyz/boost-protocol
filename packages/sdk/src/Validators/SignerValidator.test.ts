import type { Config } from '@wagmi/core';
import { isAddress } from 'viem';
import { beforeEach, describe, expect, test } from 'vitest';
import { setupConfig, testAccount } from '../../test/viem';
import { SignerValidator } from './SignerValidator';

let config: Config;

beforeEach(() => {
  config = setupConfig();
});

describe('SignerValidator', () => {
  test('can successfully be deployed', async () => {
    const action = new SignerValidator(
      { config, account: testAccount },
      {
        signers: [testAccount.address],
      },
    );
    const address = await action.deploy();
    expect(isAddress(address)).toBe(true);
  });
});
