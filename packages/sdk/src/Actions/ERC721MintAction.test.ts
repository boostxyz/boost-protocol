import type { Config } from '@wagmi/core';
import { isAddress, zeroAddress } from 'viem';
import { beforeEach, describe, expect, test } from 'vitest';
import { setupConfig, testAccount } from '../../test/viem';
import { ERC721MintAction } from './ERC721MintAction';

let config: Config;

beforeEach(() => {
  config = setupConfig();
});

describe('ERC721MintAction', () => {
  test('can successfully be deployed', async () => {
    const action = new ERC721MintAction(
      { config, account: testAccount },
      {
        chainId: BigInt(31_337),
        target: zeroAddress,
        selector: '0xdeadbeef',
        value: 2n,
      },
    );
    const address = await action.deploy();
    expect(isAddress(address)).toBe(true);
  });
});
