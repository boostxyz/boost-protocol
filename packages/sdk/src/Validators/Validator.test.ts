import { describe, expect, test } from 'vitest';
import { defaultOptions } from '../../test/helpers';
import { testAccount } from '../../test/viem';
import { SignerValidator } from './SignerValidator';
import { validatorFromAddress } from './Validator';

describe('Validator', () => {
  test('can automatically instantiate SignerValidator given an address', async () => {
    const validator = new SignerValidator(defaultOptions, {
      signers: [testAccount.address],
      validatorCaller: testAccount.address,
    });
    await validator.deploy();
    expect(
      await validatorFromAddress(
        defaultOptions,
        validator.assertValidAddress(),
      ),
    ).toBeInstanceOf(SignerValidator);
  });
});
