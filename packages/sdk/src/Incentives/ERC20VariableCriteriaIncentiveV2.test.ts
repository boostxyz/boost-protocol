import { selectors as eventSelectors } from "@boostxyz/signatures/events";
import { selectors as funcSelectors } from "@boostxyz/signatures/functions";
import type { MockERC20 } from "@boostxyz/test/MockERC20";
import type { MockERC721 } from "@boostxyz/test/MockERC721";
import { accounts } from "@boostxyz/test/accounts";
import {
  type BudgetFixtures,
  type Fixtures,
  defaultOptions,
  deployFixtures,
  freshBoost,
  fundBudget,
  fundErc20,
  fundErc721,
} from "@boostxyz/test/helpers";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import {
  type Hex,
  isAddress,
  isAddressEqual,
  parseEther,
  zeroAddress,
  zeroHash,
} from "viem";
import { beforeAll, beforeEach, describe, expect, test } from "vitest";
import { SignatureType, ValueType } from "../Actions/EventAction";
import type { Boost } from "../Boost";
import {
  type ERC20VariableCriteriaIncentiveV2,
  type ERC20VariableCriteriaIncentiveV2Payload,
  type IncentiveCriteria,
  gasRebateIncentiveCriteria,
} from "./ERC20VariableCriteriaIncentiveV2";
import { allKnownSignatures } from "@boostxyz/test/allKnownSignatures";

/**
 * A basic ERC721 mint scalar criteria for testing
 *
 * @param {MockERC721} erc721 - The ERC721 contract
 * @returns {IncentiveCriteria} - Returns a basic incentive criteria
 */
export function basicErc721TransferScalarCriteria(
  erc721: MockERC721,
): IncentiveCriteria {
  return {
    criteriaType: SignatureType.FUNC,
    signature: funcSelectors["transferFrom(address,address,uint256)"] as Hex, // Function selector for mint
    fieldIndex: 2, // Field where the scalar value resides
    targetContract: erc721.assertValidAddress(),
    valueType: ValueType.WAD,
  };
}

/**
 * A basic ERC721 mint scalar criteria for testing
 *
 * @param {MockERC721} erc721 - The ERC721 contract
 * @returns {IncentiveCriteria} - Returns a basic incentive criteria
 */
export function basicErc721MintScalarCriteria(
  erc721: MockERC721,
): IncentiveCriteria {
  return {
    criteriaType: SignatureType.EVENT,
    signature: eventSelectors[
      "Transfer(address indexed,address indexed,uint256 indexed)"
    ] as Hex, // Function selector for mint
    fieldIndex: 2, // Field where the scalar value resides
    targetContract: erc721.assertValidAddress(),
    valueType: ValueType.WAD,
  };
}

/**
 * A basic ERC721 mint scalar payload for testing
 *
 * @param {MockERC721} erc721 - The ERC721 contract
 * @returns {ERC20VariableCriteriaIncentivePayload} - Returns a full variable criteria incentive payload
 */
export function basicErc721TransferScalarPayload(
  erc721: MockERC721,
): ERC20VariableCriteriaIncentiveV2Payload {
  return {
    asset: erc721.assertValidAddress(),
    reward: 1n,
    limit: 1n,
    maxReward: 0n,
    criteria: basicErc721TransferScalarCriteria(erc721),
  };
}

let fixtures: Fixtures,
  erc20: MockERC20,
  erc721: MockERC721,
  erc20Incentive: ERC20VariableCriteriaIncentiveV2,
  budgets: BudgetFixtures,
  boost: Boost;

describe("ERC20VariableCriteriaIncentiveV2", () => {
  beforeAll(async () => {
    fixtures = await loadFixture(deployFixtures(defaultOptions));
  });

  beforeEach(async () => {
    budgets = await loadFixture(fundBudget(defaultOptions, fixtures));
    erc20 = await loadFixture(fundErc20(defaultOptions));
    erc721 = await loadFixture(fundErc721(defaultOptions));
    erc20Incentive = fixtures.core.ERC20VariableCriteriaIncentiveV2({
      asset: budgets.erc20.assertValidAddress(),
      reward: 1n,
      limit: 1n,
      criteria: basicErc721TransferScalarCriteria(erc721),
    });

    boost = await freshBoost(fixtures, {
      budget: budgets.budget,
      incentives: [erc20Incentive],
    });
    expect(isAddress(boost.incentives[0]!.assertValidAddress())).toBe(true);
  });

  describe("getIncentiveCriteria", () => {
    test("should fetch incentive criteria successfully", async () => {
      const incentive = boost.incentives[0] as ERC20VariableCriteriaIncentiveV2;
      const criteria = await incentive.getIncentiveCriteria();
      expect(criteria).toMatchObject({
        criteriaType: SignatureType.FUNC,
        signature: expect.any(String),
        fieldIndex: expect.any(Number),
        targetContract: expect.any(String),
        valueType: expect.any(Number),
      });
    });
  });

  describe("getIncentiveScalar", () => {
    test("should return a valid scalar for function-based criteria", async () => {
      const recipient = accounts[1].account;

      const { hash } = await erc721.transferFromRaw(
        accounts[0].account,
        recipient,
        1n,
      );
      const scalar = await erc20Incentive.getIncentiveScalar({
        hash,
        chainId: 31337,
        knownSignatures: allKnownSignatures,
      });

      expect(scalar).toBe(1n);
    });

    test("should return a valid scalar for event-based criteria", async () => {
      erc20Incentive = fixtures.core.ERC20VariableCriteriaIncentiveV2({
        asset: budgets.erc20.assertValidAddress(),
        reward: 1n,
        limit: 1n,
        maxReward: 0n,
        criteria: basicErc721MintScalarCriteria(erc721),
      });

      boost = await freshBoost(fixtures, {
        budget: budgets.budget,
        incentives: [erc20Incentive],
      });
      const recipient = accounts[1].account;
      const { hash } = await erc721.transferFromRaw(
        accounts[0].account,
        recipient,
        1n,
      );
      const scalar = await erc20Incentive.getIncentiveScalar({
        hash,
        chainId: 31337,
        knownSignatures: allKnownSignatures,
      });

      expect(scalar).toBe(1n);
    });

    test("gasRebateIncentiveCriteria generates correct incentive criteria", async () => {
      // Ensure that the gasRebateIncentiveCriteria returns the correct structure
      const gasRebateCriteria = gasRebateIncentiveCriteria();

      erc20Incentive = fixtures.core.ERC20VariableCriteriaIncentiveV2({
        asset: budgets.erc20.assertValidAddress(),
        reward: 1n,
        limit: 1n,
        maxReward: 0n,
        criteria: gasRebateCriteria,
      });

      // Validate the returned structure against the expected criteria values
      expect(gasRebateCriteria).toEqual({
        criteriaType: SignatureType.EVENT,
        signature: zeroHash,
        fieldIndex: 255,
        targetContract: zeroAddress,
        valueType: ValueType.WAD,
      });

      boost = await freshBoost(fixtures, {
        budget: budgets.budget,
        incentives: [erc20Incentive],
      });

      // Validate that the deployed incentive has the correct criteria set up
      const deployedIncentive = (await boost
        .incentives[0]) as ERC20VariableCriteriaIncentiveV2;
      const deployedCriteria = await deployedIncentive.getIncentiveCriteria();
      expect(deployedCriteria.criteriaType).toBe(SignatureType.EVENT);
      expect(deployedCriteria.signature).toBe(zeroHash);
      expect(deployedCriteria.fieldIndex).toBe(255);
      expect(deployedCriteria.targetContract).toBe(zeroAddress);
      expect(deployedCriteria.valueType).toBe(ValueType.WAD);
    });

    test("should throw NoMatchingLogsError for event criteria with no matching logs", async () => {
      const recipient = accounts[1].account;

      const { hash } = await erc20.mintRaw(recipient, parseEther("100"));

      try {
        await erc20Incentive.getIncentiveScalar({
          hash,
          chainId: 31337,
          knownSignatures: allKnownSignatures,
        });
      } catch (e) {
        expect((e as Error).name).toBe("DecodedArgsError");
      }
    });

    test("should throw DecodedArgsError for invalid function-based data", async () => {
      const recipient = accounts[1].account;
      const { hash } = await erc20.mintRaw(recipient, parseEther("100"));

      try {
        await erc20Incentive.getIncentiveScalar({
          hash,
          chainId: 31337,
          knownSignatures: allKnownSignatures,
        });
      } catch (e) {
        expect((e as Error).name).toBe("DecodedArgsError");
      }
    });
  });

  test("can properly encode a uint256", () => {
    //@ts-ignore
    const incentive = fixtures.core.ERC20VariableCriteriaIncentiveV2();
    expect(incentive.buildClawbackData(1n)).toBe(
      "0x0000000000000000000000000000000000000000000000000000000000000001",
    );
  });

  test("can clawback via a budget", async () => {
    const boost = await freshBoost(fixtures, {
      budget: budgets.budget,
      incentives: [erc20Incentive],
    });
    const [amount, address] = await budgets.budget.clawbackFromTarget(
      fixtures.core.assertValidAddress(),
      erc20Incentive.buildClawbackData(1n),
      boost.id,
      0,
    );
    expect(amount).toBe(1n);
    expect(isAddressEqual(address, budgets.erc20.assertValidAddress())).toBe(
      true,
    );
  });
});
