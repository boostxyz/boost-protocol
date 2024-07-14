import { isAddress, zeroAddress } from 'viem';
import { describe, expect, test } from 'vitest';
import { defaultOptions } from '../../test/helpers';
import { AllowListIncentive } from './AllowListIncentive';

describe('AllowListIncentive', () => {
  test('can successfully be deployed', async () => {
    const action = new AllowListIncentive(defaultOptions, {
      allowList: zeroAddress,
      limit: 0n,
    });
    await action.deploy();
    expect(isAddress(action.assertValidAddress())).toBe(true);
  });
});
