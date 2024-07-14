import { isAddress } from 'viem';
import { describe, expect, test } from 'vitest';
import { testAccount } from '../../test/viem';
import { SimpleAllowList } from './SimpleAllowList';

import { defaultOptions } from '../../test/helpers';

describe('SimpleAllowList', () => {
  test('can successfully be deployed', async () => {
    const action = new SimpleAllowList(defaultOptions, {
      owner: testAccount.address,
      allowed: [],
    });
    await action.deploy();
    expect(isAddress(action.assertValidAddress())).toBe(true);
  });
});
