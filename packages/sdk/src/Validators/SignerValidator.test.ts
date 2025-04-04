import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { isAddress, pad } from "viem";
import { beforeAll, describe, expect, test } from "vitest";
import { accounts } from "@boostxyz/test/accounts";
import {
  type Fixtures,
  defaultOptions,
  deployFixtures,
} from "@boostxyz/test/helpers";
import { testAccount } from "@boostxyz/test/viem";
import { SignerValidator } from "./SignerValidator";

let fixtures: Fixtures;

function freshValidator(fixtures: Fixtures) {
  return function freshValidator() {
    // biome-ignore lint/style/noNonNullAssertion: this will never be undefined
    const account = accounts.at(1)!.account;
    return fixtures.registry.initialize(
      crypto.randomUUID(),
      fixtures.core.SignerValidator({
        signers: [defaultOptions.account.address, account],
        validatorCaller: testAccount.address,
      }),
    );
  };
}

describe("SignerValidator", () => {
  beforeAll(async () => {
    fixtures = await loadFixture(deployFixtures(defaultOptions));
  });

  test("can successfully be deployed", async () => {
    const action = new SignerValidator(defaultOptions, {
      signers: [testAccount.address],
      validatorCaller: testAccount.address,
    });
    await action.deploy();
    expect(isAddress(action.assertValidAddress())).toBe(true);
  });

  test("initializes successfully", async () => {
    const validator = await loadFixture(freshValidator(fixtures));
    expect(await validator.signers(defaultOptions.account.address)).toBe(true);
    // biome-ignore lint/style/noNonNullAssertion: this will never be undefined
    expect(await validator.signers(accounts.at(1)!.account)).toBe(true);
    // biome-ignore lint/style/noNonNullAssertion: this will never be undefined
    expect(await validator.signers(accounts.at(2)!.account)).toBe(false);
  });

  test("can validate hashes", async () => {
    const validator = await loadFixture(freshValidator(fixtures));

    // Define the input data
    const boostId = 5n;
    const incentiveId = 0n;
    const claimant = "0x24582544C98a86eE59687c4D5B55D78f4FffA666";
    const incentiveData = pad("0xdef456232173821931823712381232131391321934");

    // biome-ignore lint/style/noNonNullAssertion: this will never be undefined
    const trustedSigner = accounts.at(0)!;
    // biome-ignore lint/style/noNonNullAssertion: this will never be undefined
    const untrustedSigner = accounts.at(2)!;

    const claimDataPayload = await validator.encodeClaimData({
      signer: trustedSigner,
      incentiveData,
      chainId: defaultOptions.config.chains[0].id,
      incentiveQuantity: 1,
      claimant,
      boostId: boostId,
    });

    const badClaimDataPayload = await validator.encodeClaimData({
      signer: untrustedSigner,
      incentiveData,
      chainId: defaultOptions.config.chains[0].id,
      incentiveQuantity: 1,
      claimant,
      boostId: boostId,
    });

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

  test("will not revalidate the same hash", async () => {
    const validator = await loadFixture(freshValidator(fixtures));

    // Define the input data
    const boostId = 5n;
    const incentiveId = 0n;
    const claimant = "0x24582544C98a86eE59687c4D5B55D78f4FffA666";
    const incentiveData = pad("0xdef456232173821931823712381232131391321934");

    // biome-ignore lint/style/noNonNullAssertion: this will never be undefined
    const trustedSigner = accounts.at(0)!;

    const claimDataPayload = await validator.encodeClaimData({
      signer: trustedSigner,
      incentiveData,
      chainId: defaultOptions.config.chains[0].id,
      incentiveQuantity: 1,
      claimant,
      boostId: boostId,
    });

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

  test("can set authorized", async () => {
    const validator = await loadFixture(freshValidator(fixtures));
    // biome-ignore lint/style/noNonNullAssertion: this will never be undefined
    const newSigner = accounts.at(2)!.account;
    expect(await validator.signers(newSigner)).toBe(false);
    await validator.setAuthorized([newSigner], [true]);
    expect(await validator.signers(newSigner)).toBe(true);
  });
});
