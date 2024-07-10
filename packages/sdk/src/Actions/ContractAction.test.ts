import type { Config } from '@wagmi/core';
import { isAddress, zeroAddress } from 'viem';
import { beforeEach, describe, expect, test } from 'vitest';
import { setupConfig, testAccount } from '../../test/viem';
import { ContractAction } from './ContractAction';

let config: Config;

beforeEach(() => {
  config = setupConfig();
});

describe('ContractAction', () => {
  test('can successfully be deployed', async () => {
    const action = new ContractAction(
      { config, account: testAccount },
      {
        chainId: BigInt(31_337),
        target: zeroAddress,
        selector: '0xdeadbeef',
        value: 2n,
      },
    );
    await action.deploy();
    expect(isAddress(action.assertValidAddress())).toBe(true);
  });
});
