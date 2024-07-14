import { isAddress } from 'viem';
import { describe, expect, test } from 'vitest';
import { testAccount } from '../../test/viem';
import { SimpleDenyList } from './SimpleDenyList';

import { defaultOptions } from '../../test/helpers';

describe('SimpleDenyList', () => {
  test('can successfully be deployed', async () => {
    const action = new SimpleDenyList(defaultOptions, {
      owner: testAccount.address,
      allowed: [],
    });
    await action.deploy();
    expect(isAddress(action.assertValidAddress())).toBe(true);
  });
});
