import { isAddress } from 'viem';
import { describe, expect, test } from 'vitest';
import { defaultOptions } from '../../test/helpers';
import { testAccount } from '../../test/viem';
import { SignerValidator } from './SignerValidator';

describe('SignerValidator', () => {
  test('can successfully be deployed', async () => {
    const action = new SignerValidator(defaultOptions, {
      signers: [testAccount.address],
    });
    await action.deploy();
    expect(isAddress(action.assertValidAddress())).toBe(true);
  });
});
