import { simulateMockErc20Mint, writeMockErc20Mint } from '@boostxyz/evm';
import { isAddress } from 'viem';
import { describe, expect, test } from 'vitest';
import { MockERC20 } from '../test/MockERC20';
import { defaultOptions } from '../test/helpers';
import { awaitResult, bytes4, getDeployedContractAddress } from './utils';

describe('bytes4', () => {
  test('should return the bytes4 representation of a string', () => {
    expect(bytes4('0xdeadbeef')).toBe('0xd4fd4e18');
    expect(bytes4('deadbeef')).toBe('0x9f24c52e');
  });
});

describe('getDeployedContractAddress', () => {
  test('should return the address of a contract given a tx hash promise', async () => {
    const hash = new MockERC20(defaultOptions, {}).deployRaw();
    expect(
      isAddress(await getDeployedContractAddress(defaultOptions.config, hash)),
    ).toBe(true);
  });
});

describe('awaitResult', () => {
  test('should wait for a transaction receipt and return the simulated result', async () => {
    const erc20 = new MockERC20(defaultOptions, {});
    await erc20.deploy();
    const { request, result } = await simulateMockErc20Mint(
      defaultOptions.config,
      {
        address: erc20.assertValidAddress(),
        args: [defaultOptions.account.address, 100n],
        account: defaultOptions.account,
      },
    );
    const hash = await writeMockErc20Mint(defaultOptions.config, request);
    expect(
      await awaitResult(
        defaultOptions.config,
        Promise.resolve({ hash, result }),
      ),
    ).toBe(undefined);
  });
});
