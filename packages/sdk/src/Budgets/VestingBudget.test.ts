import { isAddress } from 'viem';
import { describe, expect, test } from 'vitest';
import { defaultOptions } from '../../test/helpers';
import { testAccount } from '../../test/viem';
import { VestingBudget } from './VestingBudget';

describe('VestingBudget', () => {
  test('can successfully be deployed', async () => {
    const action = new VestingBudget(defaultOptions, {
      owner: testAccount.address,
      authorized: [],
      start: 0n,
      duration: 100n,
      cliff: 5n,
    });
    await action.deploy();
    expect(isAddress(action.assertValidAddress())).toBe(true);
  });
});
