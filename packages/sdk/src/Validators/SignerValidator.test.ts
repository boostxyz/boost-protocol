import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { signMessage } from '@wagmi/core';
import { encodePacked, isAddress, keccak256 } from 'viem';
import { beforeAll, describe, expect, test } from 'vitest';
import { accounts } from '../../test/accounts';
import {
  type Fixtures,
  defaultOptions,
  deployFixtures,
} from '../../test/helpers';
import { testAccount } from '../../test/viem';
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
    const message = keccak256(encodePacked(['string'], ['test']));
    const trustedSigner = accounts.at(0)!;
    const untrustedSigner = accounts.at(3)!;
    const trustedSignature = await signMessage(defaultOptions.config, {
      account: trustedSigner.privateKey,
      message: { raw: message },
    });
    const untrustedSignature = await signMessage(defaultOptions.config, {
      account: untrustedSigner.privateKey,
      message: { raw: message },
    });
    expect(
      await validator.validate({
        signer: trustedSigner.account,
        hash: message,
        signature: trustedSignature,
      }),
    ).toBe(true);
    try {
      await validator.validate({
        signer: untrustedSigner.account,
        hash: message,
        signature: untrustedSignature,
      });
    } catch (e) {
      expect(e).instanceOf(Error);
    }
  });

  test('will not revalidate the same hash', async () => {
    const validator = await loadFixture(freshValidator(fixtures));
    const message = keccak256(encodePacked(['string'], ['test']));
    const trustedSigner = accounts.at(0)!;
    const trustedSignature = await signMessage(defaultOptions.config, {
      account: trustedSigner.privateKey,
      message,
    });
    await validator.validate({
      signer: trustedSigner.account,
      hash: message,
      signature: trustedSignature,
    });
    try {
      await validator.validate({
        signer: trustedSigner.account,
        hash: message,
        signature: trustedSignature,
      });
    } catch (e) {
      expect(e).instanceOf(Error);
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
