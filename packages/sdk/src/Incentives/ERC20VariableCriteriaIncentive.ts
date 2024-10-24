import {
  erc20VariableCriteriaIncentiveAbi,
  readErc20VariableCriteriaIncentiveGetIncentiveCriteria,
} from '@boostxyz/evm';
import { bytecode } from '@boostxyz/evm/artifacts/contracts/incentives/ERC20VariableCriteriaIncentive.sol/ERC20VariableCriteriaIncentive.json';
import events from '@boostxyz/signatures/events';
import functions from '@boostxyz/signatures/functions';
import { getTransaction, getTransactionReceipt } from '@wagmi/core';
import {
  type AbiEvent,
  type AbiFunction,
  type Address,
  type Hex,
  type Log,
  decodeFunctionData,
  encodeAbiParameters,
  parseEventLogs,
  zeroAddress,
  zeroHash,
} from 'viem';
import { ERC20VariableCriteriaIncentive as ERC20VariableCriteriaIncentiveBases } from '../../dist/deployments.json';
import { SignatureType } from '../Actions/EventAction';
import type {
  DeployableOptions,
  GenericDeployableParams,
} from '../Deployable/Deployable';
import { DeployableTarget } from '../Deployable/DeployableTarget';
import {
  DecodedArgsError,
  FieldActionValidationError,
  IncentiveCriteriaNotFoundError,
  InvalidCriteriaTypeError,
  NoMatchingLogsError,
} from '../errors';
import { CheatCodes, type ReadParams } from '../utils';
import { ERC20VariableIncentive } from './ERC20VariableIncentive';

export interface ERC20VariableCriteriaIncentivePayload {
  /**
   * The address of the incentivized asset.
   *
   * @type {Address}
   */
  asset: Address;
  /**
   * The amount of the asset to distribute as reward.
   *
   * @type {bigint}
   */
  reward: bigint;
  /**
   * The total spending limit of the asset that will be distributed.
   *
   * @type {bigint}
   */
  limit: bigint;
  /**
   * The criteria for the incentive that determines how the reward is distributed.
   *
   * @type {IncentiveCriteria}
   */
  criteria: IncentiveCriteria;
}

export interface IncentiveCriteria {
  /**
   * The type of criteria used, either function signature or event signature.
   *
   * @type {SignatureType}
   */
  criteriaType: SignatureType;
  /**
   * The function or event signature used for criteria matching.
   *
   * @type {Hex}
   */
  signature: Hex;
  /**
   * The index of the field from where the scalar value is extracted.
   *
   * @type {number}
   */
  fieldIndex: number;
  /**
   * The address of the contract where the event/function is called/emitted.
   *
   * @type {Address}
   */
  targetContract: Address;
}

export interface ReadIncentiveCriteriaParams
  extends ReadParams<
    typeof erc20VariableCriteriaIncentiveAbi,
    'getIncentiveCriteria'
  > {}

export interface GetIncentiveScalarParams {
  hash: Hex;
}

/**
 * Extended ERC20 Variable Criteria Incentive class that fetches incentive criteria and scalar
 */
export class ERC20VariableCriteriaIncentive extends DeployableTarget<
  ERC20VariableCriteriaIncentivePayload,
  typeof erc20VariableCriteriaIncentiveAbi
> {
  public override readonly abi = erc20VariableCriteriaIncentiveAbi;
  /**
   * @inheritdoc
   *
   * @public
   * @static
   * @type {Record<number, Address>}
   */
  public static override bases: Record<number, Address> = {
    31337: import.meta.env.VITE_ERC20_VARIABLE_CRITERIA_INCENTIVE_BASE,
    ...(ERC20VariableCriteriaIncentiveBases as Record<number, Address>),
  };

  /**
   *Functions from the ERC20VariableIncentive contract
   */

  /**
   * Fetches the IncentiveCriteria struct from the contract
   *
   * @returns {Promise<IncentiveCriteria>} Incentive criteria structure
   * @throws {IncentiveCriteriaNotFoundError}
   */
  public async getIncentiveCriteria(): Promise<IncentiveCriteria> {
    try {
      const criteria =
        await readErc20VariableCriteriaIncentiveGetIncentiveCriteria(
          this._config,
          {
            address: this.assertValidAddress(),
          },
        );

      return criteria;
    } catch (e) {
      throw new IncentiveCriteriaNotFoundError(e as Error);
    }
  }

  /**
   * Fetches the incentive scalar from a transaction hash
   *
   * @param {GetIncentiveScalarParams} params
   * @returns {Promise<bigint>}
   * @throws {InvalidCriteriaTypeError | NoMatchingLogsError | DecodedArgsError}
   */
  public async getIncentiveScalar({
    hash,
  }: GetIncentiveScalarParams): Promise<bigint> {
    const criteria = await this.getIncentiveCriteria();
    const transaction = await getTransaction(this._config, {
      hash,
    });
    if (criteria.criteriaType === SignatureType.EVENT) {
      const transactionReceipt = await getTransactionReceipt(this._config, {
        hash,
      });
      if (criteria.fieldIndex === CheatCodes.GAS_REBATE_INCENTIVE) {
        const totalCost =
          transactionReceipt.gasUsed * transactionReceipt.effectiveGasPrice + // Normal gas cost
          (transactionReceipt.blobGasUsed ?? 0n) *
            (transactionReceipt.blobGasPrice ?? 0n); // Blob gas cost - account for potential undefined values
        return totalCost;
      }
      const logs = transactionReceipt.logs;

      if (logs.length === 0) {
        throw new NoMatchingLogsError(
          `No logs found for event signature ${criteria.signature}`,
        );
      }

      // Decode the event log
      try {
        // Decode function data
        const eventAbi = (events.abi as Record<Hex, AbiEvent>)[
          criteria.signature
        ] as AbiEvent;
        const decodedEvents = parseEventLogs({
          abi: [eventAbi],
          logs,
        });
        if (decodedEvents == undefined || decodedEvents.length === 0) {
          throw new NoMatchingLogsError(
            `No logs found for event signature ${criteria.signature}`,
          );
        }
        const scalarValue = (decodedEvents[0]?.args as string[])[
          criteria.fieldIndex
        ];

        if (scalarValue === undefined) {
          throw new DecodedArgsError(
            `Decoded argument at index ${criteria.fieldIndex} is undefined`,
          );
        }
        return BigInt(scalarValue);
      } catch (e) {
        throw new DecodedArgsError(
          `Failed to decode event log for signature ${criteria.signature}: ${(e as Error).message}`,
        );
      }
    } else if (criteria.criteriaType === SignatureType.FUNC) {
      // Fetch the transaction data
      try {
        // Decode function data
        const func = (functions.abi as Record<Hex, AbiFunction>)[
          criteria.signature
        ] as AbiFunction;

        const decodedFunction = decodeFunctionData({
          abi: [func],
          data: transaction.input,
        });
        const scalarValue = decodedFunction.args[criteria.fieldIndex] as string;
        if (scalarValue === undefined || scalarValue === null) {
          throw new DecodedArgsError(
            `Decoded argument at index ${criteria.fieldIndex} is undefined`,
          );
        }
        return BigInt(scalarValue);
      } catch (e) {
        throw new DecodedArgsError(
          `Failed to decode function data for signature ${criteria.signature}: ${(e as Error).message}`,
        );
      }
    } else {
      throw new InvalidCriteriaTypeError(
        `Invalid criteria type ${criteria.criteriaType}`,
      );
    }
  }

  /**
   * @inheritdoc
   *
   * @public
   * @param {?ERC20VariableCriteriaIncentivePayload} [_payload]
   * @param {?DeployableOptions} [_options]
   * @returns {GenericDeployableParams}
   */
  public override buildParameters(
    _payload?: ERC20VariableCriteriaIncentivePayload,
    _options?: DeployableOptions,
  ): GenericDeployableParams {
    const [payload, options] = this.validateDeploymentConfig(
      _payload,
      _options,
    );
    return {
      abi: erc20VariableCriteriaIncentiveAbi,
      bytecode: bytecode as Hex,
      args: [prepareERC20VariableCriteriaIncentivePayload(payload)],
      ...this.optionallyAttachAccount(options.account),
    };
  }

  /**
   * Builds the claim data for the ERC20VariableCriteriaIncentive.
   *
   * @public
   * @param {bigint} rewardAmount
   * @returns {Hex} Returns the encoded claim data
   * @description This function returns the encoded claim data for the ERC20VariableCriteriaIncentive.
   */
  public buildClaimData(rewardAmount: bigint) {
    return encodeAbiParameters(
      [{ type: 'uint256', name: 'rewardAmount' }],
      [rewardAmount],
    );
  }
}

/**
 * Creates an IncentiveCriteria object representing a gas rebate incentive.
 * This object defines a variable incentive criteria where the criteria will be the gas spent.
 *
 * The criteria uses a signatureType of EVENT, with a special `fieldIndex` of 255 (using CheatCodes enum), which indicates
 * that the entire gas cost of the transaction will be used as the scalar value. If you don't want to
 * rebate the entire gas cost, you can use a reward value on the incentive..
 *
 * - `criteriaType`: EVENT, indicating it's based on event logs.
 * - `signature`: A zeroed signature (0x0000...0000), matching any event.
 * - `fieldIndex`: 255, indicating the use of transaction gas cost using CheatCodes enum.
 * - `targetContract`: A zeroed address (0x0000...0000), applicable to any contract.
 *
 * @returns {IncentiveCriteria} Returns an IncentiveCriteria object for a gas rebate.
 *
 * @example
 * const incentive = gasRebateIncentiveCriteria();
 * const actionPayload = {
 *   criteria: incentive,
 *   asset: "0xAssetAddress",
 *   reward: 0, // Set to zero to rebate the entire gas cost
 *   limit: BigInt(1000) // This is the total spend limit for the incentive
 * };
 * deployIncentive(actionPayload);
 */
export function gasRebateIncentiveCriteria(): IncentiveCriteria {
  return {
    criteriaType: SignatureType.EVENT,
    signature: zeroHash,
    fieldIndex: CheatCodes.GAS_REBATE_INCENTIVE,
    targetContract: zeroAddress,
  };
}

/**
 *
 *
 * @param {InitPayloadExtended} param0
 * @param {Address} param0.asset - The address of the ERC20 asset to incentivize.
 * @param {bigint} param0.reward - The reward amount to distribute per action.
 * @param {bigint} param0.limit - The total limit of the asset distribution.
 * @param {IncentiveCriteria} param0.criteria - The incentive criteria for reward distribution.
 * @returns {Hex}
 */
export function prepareERC20VariableCriteriaIncentivePayload({
  asset,
  reward,
  limit,
  criteria,
}: ERC20VariableCriteriaIncentivePayload) {
  return encodeAbiParameters(
    [
      {
        type: 'tuple',
        name: 'initPayloadExtended',
        components: [
          { type: 'address', name: 'asset' },
          { type: 'uint256', name: 'reward' },
          { type: 'uint256', name: 'limit' },
          {
            type: 'tuple',
            name: 'criteria',
            components: [
              { type: 'uint8', name: 'criteriaType' },
              { type: 'bytes32', name: 'signature' },
              { type: 'uint8', name: 'fieldIndex' },
              { type: 'address', name: 'targetContract' },
            ],
          },
        ],
      },
    ],
    [
      {
        asset: asset,
        reward: reward,
        limit: limit,
        criteria: {
          criteriaType: criteria.criteriaType,
          signature: criteria.signature,
          fieldIndex: criteria.fieldIndex,
          targetContract: criteria.targetContract,
        },
      },
    ],
  );
}
