import { selectors as eventSelectors } from '@boostxyz/signatures/events';
import { selectors as funcSelectors } from '@boostxyz/signatures/functions';
import type { MockERC20 } from '@boostxyz/test/MockERC20';
import type { MockERC721 } from '@boostxyz/test/MockERC721';
import { accounts } from '@boostxyz/test/accounts';
import {
  type BudgetFixtures,
  type Fixtures,
  defaultOptions,
  deployFixtures,
  freshBoost,
  fundBudget,
  fundErc20,
  fundErc721,
} from '@boostxyz/test/helpers';
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { type Hex, isAddress, parseEther, zeroAddress, zeroHash } from 'viem';
import { beforeAll, beforeEach, describe, expect, test } from 'vitest';
import { SignatureType } from '../Actions/EventAction';
import type { Boost } from '../Boost';
import {
  type ERC20VariableCriteriaIncentive,
  type ERC20VariableCriteriaIncentivePayload,
  type IncentiveCriteria,
  gasRebateIncentiveCriteria,
} from './ERC20VariableCriteriaIncentive';
import { allKnownSignatures } from '@boostxyz/test/allKnownSignatures';

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
    signature: funcSelectors['transferFrom(address,address,uint256)'] as Hex, // Function selector for mint
    fieldIndex: 2, // Field where the scalar value resides
    targetContract: erc721.assertValidAddress(),
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
      'Transfer(address indexed,address indexed,uint256 indexed)'
    ] as Hex, // Function selector for mint
    fieldIndex: 2, // Field where the scalar value resides
    targetContract: erc721.assertValidAddress(),
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
): ERC20VariableCriteriaIncentivePayload {
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
  erc20Incentive: ERC20VariableCriteriaIncentive,
  budgets: BudgetFixtures,
  boost: Boost;

describe('ERC20VariableCriteriaIncentive', () => {
  beforeAll(async () => {
    fixtures = await loadFixture(deployFixtures(defaultOptions));
  });

  beforeEach(async () => {
    budgets = await loadFixture(fundBudget(defaultOptions, fixtures));
    erc20 = await loadFixture(fundErc20(defaultOptions));
    erc721 = await loadFixture(fundErc721(defaultOptions));
    erc20Incentive = fixtures.core.ERC20VariableCriteriaIncentive({
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

  describe('getIncentiveCriteria', () => {
    test('should fetch incentive criteria successfully', async () => {
      const incentive = boost.incentives[0] as ERC20VariableCriteriaIncentive;
      const criteria = await incentive.getIncentiveCriteria();
      expect(criteria).toMatchObject({
        criteriaType: SignatureType.FUNC,
        signature: expect.any(String),
        fieldIndex: expect.any(Number),
        targetContract: expect.any(String),
      });
    });
  });

  describe('getIncentiveScalar', () => {
    test('should return a valid scalar for function-based criteria', async () => {
      const recipient = accounts[1].account;

      const { hash } = await erc721.transferFromRaw(
        accounts[0].account,
        recipient,
        1n,
      );
      const scalar = await erc20Incentive.getIncentiveScalar({
        hash,
        chainId: 31337,
        knownSignatures: allKnownSignatures
      });

      expect(scalar).toBe(1n);
    });

    test('should return a valid scalar for event-based criteria', async () => {
      erc20Incentive = fixtures.core.ERC20VariableCriteriaIncentive({
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
        knownSignatures: allKnownSignatures
      });

      expect(scalar).toBe(1n);
    });

    test('gasRebateIncentiveCriteria generates correct incentive criteria', async () => {
      // Ensure that the gasRebateIncentiveCriteria returns the correct structure
      const gasRebateCriteria = gasRebateIncentiveCriteria();

      erc20Incentive = fixtures.core.ERC20VariableCriteriaIncentive({
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
      });

      boost = await freshBoost(fixtures, {
        budget: budgets.budget,
        incentives: [erc20Incentive],
      });

      // Validate that the deployed incentive has the correct criteria set up
      const deployedIncentive = await boost.incentives[0] as ERC20VariableCriteriaIncentive;
      const deployedCriteria = await deployedIncentive.getIncentiveCriteria();
      expect(deployedCriteria.criteriaType).toBe(SignatureType.EVENT);
      expect(deployedCriteria.signature).toBe(zeroHash);
      expect(deployedCriteria.fieldIndex).toBe(255);
      expect(deployedCriteria.targetContract).toBe(zeroAddress);
    });

    test('should throw NoMatchingLogsError for event criteria with no matching logs', async () => {
      const recipient = accounts[1].account;

      const { hash } = await erc20.mintRaw(recipient, parseEther('100'));

      try {
        await erc20Incentive.getIncentiveScalar({
          hash,
          chainId: 31337,
          knownSignatures: allKnownSignatures
        });
      } catch (e) {
        expect((e as Error).name).toBe('DecodedArgsError');
      }
    });

    test('should throw DecodedArgsError for invalid function-based data', async () => {
      const recipient = accounts[1].account;
      const { hash } = await erc20.mintRaw(recipient, parseEther('100'));

      try {
        await erc20Incentive.getIncentiveScalar({
          hash,
          chainId: 31337,
          knownSignatures: allKnownSignatures
        });
      } catch (e) {
        expect((e as Error).name).toBe('DecodedArgsError');
      }
    });
  });
});
