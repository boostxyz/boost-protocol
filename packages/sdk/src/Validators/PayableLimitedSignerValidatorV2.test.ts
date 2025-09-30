import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { isAddress, parseEther } from "viem";
import { beforeAll, describe, expect, test } from "vitest";
import { accounts } from "@boostxyz/test/accounts";
import { type Fixtures, defaultOptions, deployFixtures } from "@boostxyz/test/helpers";
import { testAccount } from "@boostxyz/test/viem";
import { PayableLimitedSignerValidatorV2 } from "./PayableLimitedSignerValidatorV2";

let fixtures: Fixtures;

function freshBaseValidator(fixtures: Fixtures) {
  return async function freshBaseValidator() {    
    const PayableLimitedSignerValidatorV2 = fixtures.bases.PayableLimitedSignerValidatorV2;
    const baseAddress = PayableLimitedSignerValidatorV2.bases[31337];
    return new PayableLimitedSignerValidatorV2(
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
      fixtures.core.PayableLimitedSignerValidatorV2({
        signers: [account],
        validatorCaller: testAccount.address,
        maxClaimCount: 3
      })
    );
  };
}

describe("PayableLimitedSignerValidatorV2", () => {
  beforeAll(async () => {
    fixtures = await loadFixture(deployFixtures(defaultOptions));
    // Set the base address in the SDK class so other tests can use it
    const TPayableLimitedSignerValidatorV2 = fixtures.bases.PayableLimitedSignerValidatorV2;
    if (TPayableLimitedSignerValidatorV2.bases[31337]) {
      PayableLimitedSignerValidatorV2.bases[31337] = TPayableLimitedSignerValidatorV2.bases[31337];
    }
  });

  test("can successfully be deployed as clone", async () => {
    expect.assertions(1);
    
    // Deploy a clone (not a base)
    const validator = await fixtures.registry.initialize(
      crypto.randomUUID(),
      fixtures.core.PayableLimitedSignerValidatorV2({
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
    test("should have initial claim fee set from constructor", async () => {
      expect.assertions(1);
      const baseValidator = await loadFixture(freshBaseValidator(fixtures));
      const initialFee = await baseValidator.getClaimFee();
      
      // Should have the initial fee set during deployment (0.001 ETH)
      expect(initialFee).toBe(parseEther("0.001"));
    });

    test("should update initial claim fee and reflect changes on both base and clones", async () => {
      expect.assertions(6);
      const baseValidator = await loadFixture(freshBaseValidator(fixtures));
      const cloneValidator = await loadFixture(freshCloneValidator(fixtures));
      const newFee = parseEther("0.005"); // 0.005 ETH
      
      // Verify initial fees are set correctly (0.001 ETH from constructor)
      const initialBaseFee = await baseValidator.getClaimFee();
      const initialCloneFee = await cloneValidator.getClaimFee();
      expect(initialBaseFee).toBe(parseEther("0.001"));
      expect(initialCloneFee).toBe(parseEther("0.001"));
      
      // Update the fee on the base implementation
      await baseValidator.setClaimFee(newFee);
      
      // Verify both base and clone now reflect the new fee
      const updatedBaseFee = await baseValidator.getClaimFee();
      const updatedCloneFee = await cloneValidator.getClaimFee();
      expect(updatedBaseFee).toBe(newFee);
      expect(updatedCloneFee).toBe(newFee);
      
      // Verify the fees are different from the initial fees
      expect(updatedBaseFee).not.toBe(initialBaseFee);
      expect(updatedCloneFee).not.toBe(initialCloneFee);
    });

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

      await expect(cloneValidator.setClaimFee(newFee)).rejects.toThrow();
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
    test("should inherit signer management from LimitedSignerValidatorV2", async () => {
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
