import { zeroAddress } from 'viem';
import { describe, expect, test } from 'vitest';
import { defaultOptions } from '../../test/helpers';
import { PassthroughAuth } from './PassthroughAuth';

describe('PassthroughAuth', () => {
  test('can successfully be deployed', async () => {
    const auth = new PassthroughAuth(defaultOptions);
    await auth.deploy();
    expect(await auth.isAuthorized(zeroAddress)).toBe(true);
  });
});
