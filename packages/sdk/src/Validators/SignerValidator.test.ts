import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { type Address, encodeAbiParameters, isAddress, pad } from 'viem';
import { beforeAll, describe, expect, test } from 'vitest';
import { accounts } from '../../test/accounts';
import {
  type Fixtures,
  defaultOptions,
  deployFixtures,
} from '../../test/helpers';
import { testAccount } from '../../test/viem';
import { prepareSignerValidatorClaimDataPayload } from '../utils';
import { SignerValidator } from './SignerValidator';

let fixtures: Fixtures;

function freshValidator(fixtures: Fixtures) {
  return function freshValidator() {
    return fixtures.registry.clone(
      crypto.randomUUID(),
      new fixtures.bases.SignerValidator(defaultOptions, {
        signers: [defaultOptions.account.address, accounts.at(1)!.account],
      }),
    );
  };
}

describe('SignerValidator', () => {
  beforeAll(async () => {
    fixtures = await loadFixture(deployFixtures);
  });

  test('can successfully be deployed', async () => {
    const action = new SignerValidator(defaultOptions, {
      signers: [testAccount.address],
    });
    await action.deploy();
    expect(isAddress(action.assertValidAddress())).toBe(true);
  });

  test('initializes successfully', async () => {
    const validator = await loadFixture(freshValidator(fixtures));
    expect(await validator.signers(defaultOptions.account.address)).toBe(true);
    expect(await validator.signers(accounts.at(1)!.account)).toBe(true);
    expect(await validator.signers(accounts.at(2)!.account)).toBe(false);
  });

  test('can validate hashes', async () => {
    const validator = await loadFixture(freshValidator(fixtures));

    // Define the input data
    const boostId = 5n;
    const incentiveId = 1n;
    const claimant = '0x24582544C98a86eE59687c4D5B55D78f4FffA666';
    const incentiveData = pad('0xdef456232173821931823712381232131391321934');

    const trustedSigner = accounts.at(0)!;
    const untrustedSigner = accounts.at(2)!;

    const typeHashData = await validator.hashSignerData({
      boostId: boostId,
      incentiveId: incentiveId,
      claimant: claimant,
      incentiveData,
    });

    const claimDataPayload = await prepareSignerValidatorClaimDataPayload(
      trustedSigner,
      incentiveData,
      typeHashData,
    );

    const badClaimDataPayload = await prepareSignerValidatorClaimDataPayload(
      untrustedSigner,
      incentiveData,
      typeHashData,
    );

    // Validation using trusted signer
    expect(
      await validator.validate({
        boostId: boostId,
        incentiveId: incentiveId,
        claimData: claimDataPayload,
        claimant: claimant,
      }),
    ).toBe(true);

    // Validation using untrusted signer should throw an error
    try {
      await validator.validate({
        boostId: boostId,
        incentiveId: incentiveId,
        claimData: badClaimDataPayload,
        claimant: claimant,
      });
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
    }
  });
  test('will not revalidate the same hash', async () => {
    const validator = await loadFixture(freshValidator(fixtures));

    // Define the input data
    const boostId = 1n;
    const incentiveId = 1n;
    const claimant = accounts.at(0)!.account;

    const incentiveData = pad('0xdef456232173821931823712381232131391321934');

    const trustedSigner = accounts.at(0)!;

    const typeHashData = await validator.hashSignerData({
      boostId: boostId,
      incentiveId: incentiveId,
      claimant: claimant,
      incentiveData,
    });

    const claimDataPayload = await prepareSignerValidatorClaimDataPayload(
      trustedSigner,
      incentiveData,
      typeHashData,
    );

    expect(
      await validator.validate({
        boostId,
        incentiveId,
        claimant,
        claimData: claimDataPayload,
      }),
    ).toBe(true);

    // Attempt to validate the same hash again (should throw an error)
    try {
      await validator.validate({
        boostId,
        incentiveId,
        claimData: claimDataPayload,
        claimant,
      });
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
    }
  });

  test('can set authorized', async () => {
    const validator = await loadFixture(freshValidator(fixtures));
    const newSigner = accounts.at(2)!.account;
    expect(await validator.signers(newSigner)).toBe(false);
    await validator.setAuthorized([newSigner], [true]);
    expect(await validator.signers(newSigner)).toBe(true);
  });
});
