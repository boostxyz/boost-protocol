import { isAddress, zeroAddress } from 'viem';
import { describe, expect, test } from 'vitest';
import { defaultOptions } from '../../test/helpers';
import { ContractAction } from './ContractAction';

describe('ContractAction', () => {
  test('can successfully be deployed', async () => {
    const action = new ContractAction(defaultOptions, {
      chainId: BigInt(31_337),
      target: zeroAddress,
      selector: '0xdeadbeef',
      value: 2n,
    });
    await action.deploy();
    expect(isAddress(action.assertValidAddress())).toBe(true);
  });
});
