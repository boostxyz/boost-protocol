import { isAddress } from 'viem';
import { describe, expect, test } from 'vitest';
import { defaultOptions } from '@boostxyz/test/helpers';
import { testAccount } from '@boostxyz/test/viem';
import { SignerValidator } from './SignerValidator';
import { BoostValidatorEOA, validatorFromAddress } from './Validator';

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

  test('Boost EOAs are defined', () => {
    expect(isAddress(BoostValidatorEOA.TESTNET)).toBe(true)
    // expect(isAddress(BoostValidatorEOA.MAINNET)).toBe(true)
  })
});
