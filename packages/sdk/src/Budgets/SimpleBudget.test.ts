import { isAddress } from 'viem';
import { describe, expect, test } from 'vitest';
import { defaultOptions } from '../../test/helpers';
import { testAccount } from '../../test/viem';
import { SimpleBudget } from './SimpleBudget';

describe('SimpleBudget', () => {
  test('can successfully be deployed', async () => {
    const action = new SimpleBudget(defaultOptions, {
      owner: testAccount.address,
      authorized: [],
    });
    await action.deploy();
    expect(isAddress(action.assertValidAddress())).toBe(true);
  });
});
