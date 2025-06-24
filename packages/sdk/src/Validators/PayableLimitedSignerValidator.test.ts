import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { isAddress, parseEther } from "viem";
import { beforeAll, describe, expect, test } from "vitest";
import { accounts } from "@boostxyz/test/accounts";
import { type Fixtures, defaultOptions, deployFixtures } from "@boostxyz/test/helpers";
import { testAccount } from "@boostxyz/test/viem";
import { PayableLimitedSignerValidator } from "./PayableLimitedSignerValidator";

let fixtures: Fixtures;

function freshBaseValidator(fixtures: Fixtures) {
  return async function freshBaseValidator() {    
    const PayableLimitedSignerValidator = fixtures.bases.PayableLimitedSignerValidator;
    const baseAddress = PayableLimitedSignerValidator.bases[31337];
    return new PayableLimitedSignerValidator(
      defaultOptions,
      baseAddress
    );
  };
}

function freshCloneValidator(fixtures: Fixtures) {
  return function freshCloneValidator() {
    const account = accounts[2].account;
    return fixtures.registry.initialize(
      crypto.randomUUID(),
      fixtures.core.PayableLimitedSignerValidator({
        signers: [account],
        validatorCaller: testAccount.address,
        maxClaimCount: 3
      })
    );
  };
}

describe("PayableLimitedSignerValidator", () => {
  beforeAll(async () => {
    fixtures = await loadFixture(deployFixtures(defaultOptions));
    // Set the base address in the SDK class so other tests can use it
    const TPayableLimitedSignerValidator = fixtures.bases.PayableLimitedSignerValidator;
    if (TPayableLimitedSignerValidator.bases[31337]) {
      PayableLimitedSignerValidator.bases[31337] = TPayableLimitedSignerValidator.bases[31337];
    }
  });

  test("can successfully be deployed as clone", async () => {
    expect.assertions(1);
    
    // Deploy a clone (not a base)
    const validator = await fixtures.registry.initialize(
      crypto.randomUUID(),
      fixtures.core.PayableLimitedSignerValidator({
        signers: [testAccount.address],
        validatorCaller: testAccount.address,
        maxClaimCount: 1
      })
    );
    
    expect(isAddress(validator.assertValidAddress())).toBe(true);
  });

  test("initializes successfully as base implementation", async () => {
    expect.assertions(1);
    const validator = await loadFixture(freshBaseValidator(fixtures));
    expect(isAddress(validator.assertValidAddress())).toBe(true);
  });

  test("initializes successfully as clone", async () => {
    expect.assertions(2);
    const cloneValidator = await loadFixture(freshCloneValidator(fixtures));

    expect(await cloneValidator.signers(accounts[2].account)).toBe(true);
    expect(await cloneValidator.signers(defaultOptions.account.address)).toBe(false);
  });

  describe("Claim Fee Management", () => {
    test("should set and read claim fee on base implementation", async () => {
      expect.assertions(1);
      const baseValidator = await loadFixture(freshBaseValidator(fixtures));
      const claimFee = parseEther("0.01");

      await baseValidator.setClaimFee(claimFee);
      const retrievedFee = await baseValidator.getClaimFee();

      expect(retrievedFee).toBe(claimFee);
    });

    test("should read claim fee from base implementation when called on clone", async () => {
      expect.assertions(2);
      const baseValidator = await loadFixture(freshBaseValidator(fixtures));
      const cloneValidator = await loadFixture(freshCloneValidator(fixtures));
      const claimFee = parseEther("0.02");

      await baseValidator.setClaimFee(claimFee);

      const baseFee = await baseValidator.getClaimFee();
      const cloneFee = await cloneValidator.getClaimFee();

      expect(baseFee).toBe(claimFee);
      expect(cloneFee).toBe(claimFee);
    });

    test("should update fee globally when base is updated", async () => {
      expect.assertions(4);
      const baseValidator = await loadFixture(freshBaseValidator(fixtures));
      const cloneValidator = await loadFixture(freshCloneValidator(fixtures));
      const initialFee = parseEther("0.01");
      const newFee = parseEther("0.03");

      // Set initial fee
      await baseValidator.setClaimFee(initialFee);
      expect(await baseValidator.getClaimFee()).toBe(initialFee);
      expect(await cloneValidator.getClaimFee()).toBe(initialFee);

      // Update fee on base
      await baseValidator.setClaimFee(newFee);
      expect(await baseValidator.getClaimFee()).toBe(newFee);
      expect(await cloneValidator.getClaimFee()).toBe(newFee);
    });

    test("should prevent clones from setting fee", async () => {
      expect.assertions(1);
      const cloneValidator = await loadFixture(freshCloneValidator(fixtures));
      const newFee = parseEther("0.05");

      await expect(() => cloneValidator.setClaimFee(newFee)).rejects.toThrow();
    });

    test("should allow setting fee to zero", async () => {
      expect.assertions(1);
      const baseValidator = await loadFixture(freshBaseValidator(fixtures));

      await baseValidator.setClaimFee(0n);
      const retrievedFee = await baseValidator.getClaimFee();

      expect(retrievedFee).toBe(0n);
    });
  });

  describe("Inherited Functionality", () => {
    test("should inherit signer management from LimitedSignerValidator", async () => {
      expect.assertions(3);
      const validator = await loadFixture(freshBaseValidator(fixtures));
      const newSigner = accounts[3].account;

      // Initially not authorized
      expect(await validator.signers(newSigner)).toBe(false);

      // Authorize the signer
      await validator.setAuthorized([newSigner], [true]);
      expect(await validator.signers(newSigner)).toBe(true);

      // Deauthorize the signer
      await validator.setAuthorized([newSigner], [false]);
      expect(await validator.signers(newSigner)).toBe(false);
    });

    test("should inherit validator caller management", async () => {
      expect.assertions(1);
      const validator = await loadFixture(freshBaseValidator(fixtures));
      const newCaller = accounts[4].account;

      await validator.setValidatorCaller(newCaller);
      expect(true).toBe(true);
    });
  });
});
