import {
  erc20VariableCriteriaIncentiveV2Abi,
  readErc20VariableCriteriaIncentiveV2GetIncentiveCriteria,
  readErc20VariableCriteriaIncentiveV2GetMaxReward,
} from '@boostxyz/evm';
import { bytecode } from '@boostxyz/evm/artifacts/contracts/incentives/ERC20VariableCriteriaIncentiveV2.sol/ERC20VariableCriteriaIncentiveV2.json';
import { getTransaction, getTransactionReceipt } from '@wagmi/core';
import {
  type AbiEvent,
  type AbiFunction,
  type Address,
  type Hex,
  decodeAbiParameters,
  decodeFunctionData,
  encodeAbiParameters,
  parseEther,
  parseEventLogs,
  zeroAddress,
  zeroHash,
} from 'viem';
import { ERC20VariableCriteriaIncentiveV2 as ERC20VariableCriteriaIncentiveV2Bases } from '../../dist/deployments.json';
import {
  SignatureType,
  ValueType,
  getScalarValueFromTuple,
  isCriteriaFieldIndexTuple,
} from '../Actions/EventAction';
import type {
  DeployableOptions,
  GenericDeployableParams,
} from '../Deployable/Deployable';
import {
  DecodedArgsError,
  IncentiveCriteriaNotFoundError,
  InvalidCriteriaTypeError,
  NoMatchingLogsError,
} from '../errors';
import { CheatCodes, type ReadParams } from '../utils';
import { ERC20VariableIncentive } from './ERC20VariableIncentive';

export { erc20VariableCriteriaIncentiveV2Abi };

export interface ERC20VariableCriteriaIncentiveV2Payload {
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
   * The total amount claimable in a single claim or maximum per-action reward.
   *
   * @type {bigint}
   * @optional
   */
  maxReward?: bigint;
  /**
   * The criteria for the incentive that determines how the reward is distributed.
   *
   * @type {IncentiveCriteria}
   */
  criteria: IncentiveCriteriaV2;
}

export interface IncentiveCriteriaV2 {
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
  /**
   * The type of value used for the scalar value (RAW or WAD).
   * - RAW: Raw integer value (e.g., NFT quantity)
   * - WAD: Value with 18 decimals (e.g., token amount)
   *
   * @type {ValueType}
   */
  valueType: ValueType;
}

export interface ReadIncentiveCriteriaV2Params extends ReadParams {}

export interface GetIncentiveScalarV2Params {
  chainId: number;
  hash: Hex;
  knownSignatures: Record<Hex, AbiFunction | AbiEvent>;
}

/**
 * Extended ERC20 Variable Criteria Incentive class that fetches incentive criteria and scalar
 *
 * @export
 * @class ERC20VariableCriteriaIncentive
 * @typedef {ERC20VariableCriteriaIncentiveV2}
 * @extends {ERC20VariableIncentive<ERC20VariableCriteriaIncentiveV2Payload, typeof erc20VariableCriteriaIncentiveV2Abi>}
 */
export class ERC20VariableCriteriaIncentiveV2 extends ERC20VariableIncentive<
  ERC20VariableCriteriaIncentiveV2Payload,
  typeof erc20VariableCriteriaIncentiveV2Abi,
  Promise<bigint>
> {
  //@ts-expect-error instantiated correctly
  public override readonly abi = erc20VariableCriteriaIncentiveV2Abi;
  /**
   * @inheritdoc
   *
   * @public
   * @static
   * @type {Record<number, Address>}
   */
  public static override bases: Record<number, Address> = {
    31337: import.meta.env.VITE_ERC20_VARIABLE_CRITERIA_INCENTIVE_V2_BASE,
    ...(ERC20VariableCriteriaIncentiveV2Bases as Record<number, Address>),
  };

  /**
   *Functions from the ERC20VariableIncentive contract
   */

  /**
   * Fetches the IncentiveCriteria struct from the contract
   *
   * @param {?ReadParams} [params]
   * @returns {Promise<IncentiveCriteria>} Incentive criteria structure
   * @throws {IncentiveCriteriaNotFoundError}
   */
  public async getIncentiveCriteria(
    params?: ReadParams,
  ): Promise<IncentiveCriteriaV2> {
    try {
      const criteria =
        await readErc20VariableCriteriaIncentiveV2GetIncentiveCriteria(
          this._config,
          {
            ...params,
            address: this.assertValidAddress(),
          },
        );

      return criteria;
    } catch (e) {
      throw new IncentiveCriteriaNotFoundError(e as Error);
    }
  }

  /**
   * Decodes claim data for the ERC20VariableCriteriaIncentiveV2, returning the claim amount.
   * Useful when deriving amount claimed from logs.
   *
   * @public
   * @param {Hex} claimData
   * @returns {Promise<bigint>} Returns the reward amount from a claim data payload
   */
  public override async decodeClaimData(claimData: Hex) {
    const boostClaimData = decodeAbiParameters(
      [
        {
          type: 'tuple',
          name: 'BoostClaimData',
          components: [
            { type: 'bytes', name: 'validatorData' },
            { type: 'bytes', name: 'incentiveData' },
          ],
        },
      ],
      claimData,
    );
    const signedAmount = decodeAbiParameters(
      [{ type: 'uint256' }],
      boostClaimData[0].incentiveData,
    )[0];
    let claimAmount = signedAmount;
    const [reward, maxReward] = await Promise.all([
      this.reward(),
      this.getMaxReward(),
    ]);

    if (reward === 0n) {
      return claimAmount;
    } else {
      claimAmount = (reward * signedAmount) / parseEther('1');
    }

    if (maxReward !== 0n && claimAmount > maxReward) {
      claimAmount = maxReward;
    }

    return claimAmount;
  }

  /**
   * Fetches the IncentiveCriteria struct from the contract
   *
   * @param {?ReadParams} [params]
   * @returns {Promise<IncentiveCriteria>} Incentive criteria structure
   * @throws {IncentiveCriteriaNotFoundError}
   */
  public async getMaxReward(params?: ReadParams): Promise<bigint> {
    const maxReward = await readErc20VariableCriteriaIncentiveV2GetMaxReward(
      this._config,
      {
        ...params,
        address: this.assertValidAddress(),
      },
    );

    return maxReward;
  }

  /**
   * Fetches the incentive scalar from a transaction hash
   *
   * @param {GetIncentiveScalarParams} params
   * @param {?ReadParams} [params]
   * @returns {Promise<bigint>}
   * @throws {InvalidCriteriaTypeError | NoMatchingLogsError | DecodedArgsError}
   */
  public async getIncentiveScalar(
    { chainId, hash, knownSignatures }: GetIncentiveScalarV2Params,
    params?: ReadParams,
  ): Promise<bigint> {
    const criteria = await this.getIncentiveCriteria(params);
    if (criteria.criteriaType === SignatureType.EVENT) {
      const transactionReceipt = await getTransactionReceipt(this._config, {
        chainId,
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
        const eventAbi = knownSignatures[criteria.signature] as AbiEvent;
        const decodedEvents = parseEventLogs({
          abi: [eventAbi],
          logs,
        });
        if (decodedEvents == undefined || decodedEvents.length === 0) {
          throw new NoMatchingLogsError(
            `No logs found for event signature ${criteria.signature}`,
          );
        }

        if (isCriteriaFieldIndexTuple(criteria.fieldIndex)) {
          return getScalarValueFromTuple(
            decodedEvents[0]?.args as unknown[],
            criteria.fieldIndex,
          );
        }

        const scalarValue =
          decodedEvents[0] && decodedEvents[0].args
            ? (decodedEvents[0].args as string[])[criteria.fieldIndex]
            : undefined;
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
      const transaction = await getTransaction(this._config, {
        chainId,
        hash,
      });
      try {
        // Decode function data
        const func = knownSignatures[criteria.signature] as AbiFunction;
        const decodedFunction = decodeFunctionData({
          abi: [func],
          data: transaction.input,
        });

        if (isCriteriaFieldIndexTuple(criteria.fieldIndex)) {
          return getScalarValueFromTuple(
            decodedFunction.args as unknown[],
            criteria.fieldIndex,
          );
        }

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
   * @param {?ERC20VariableCriteriaIncentiveV2Payload} [_payload]
   * @param {?DeployableOptions} [_options]
   * @returns {GenericDeployableParams}
   */
  public override buildParameters(
    _payload?: ERC20VariableCriteriaIncentiveV2Payload,
    _options?: DeployableOptions,
  ): GenericDeployableParams {
    const [payload, options] = this.validateDeploymentConfig(
      _payload,
      _options,
    );
    return {
      abi: erc20VariableCriteriaIncentiveV2Abi,
      bytecode: bytecode as Hex,
      args: [prepareERC20VariableCriteriaIncentiveV2Payload(payload)],
      ...this.optionallyAttachAccount(options.account),
    };
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
export function gasRebateIncentiveCriteriaV2(): IncentiveCriteriaV2 {
  return {
    criteriaType: SignatureType.EVENT,
    signature: zeroHash,
    fieldIndex: CheatCodes.GAS_REBATE_INCENTIVE,
    targetContract: zeroAddress,
    valueType: ValueType.WAD,
  };
}

/**
 *
 *
 * @param {InitPayloadExtended} param0
 * @param {Address} param0.asset - The address of the ERC20 asset to incentivize.
 * @param {bigint} param0.reward - The reward amount to distribute per action.
 * @param {bigint} param0.limit - The total limit of the asset distribution.
 * @param {bigint} param0.maxReward - The maximum value claimable from a single completion.
 * @param {IncentiveCriteria} param0.criteria - The incentive criteria for reward distribution.
 * @returns {Hex}
 */
export function prepareERC20VariableCriteriaIncentiveV2Payload({
  asset,
  reward,
  limit,
  maxReward = 0n,
  criteria,
}: ERC20VariableCriteriaIncentiveV2Payload) {
  return encodeAbiParameters(
    [
      {
        type: 'tuple',
        name: 'initPayloadExtended',
        components: [
          { type: 'address', name: 'asset' },
          { type: 'uint256', name: 'reward' },
          { type: 'uint256', name: 'limit' },
          { type: 'uint256', name: 'maxReward' },
          {
            type: 'tuple',
            name: 'criteria',
            components: [
              { type: 'uint8', name: 'criteriaType' },
              { type: 'bytes32', name: 'signature' },
              { type: 'uint8', name: 'fieldIndex' },
              { type: 'address', name: 'targetContract' },
              { type: 'uint8', name: 'valueType' },
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
        maxReward: maxReward,
        criteria: {
          criteriaType: criteria.criteriaType,
          signature: criteria.signature,
          fieldIndex: criteria.fieldIndex,
          targetContract: criteria.targetContract,
          valueType: criteria.valueType,
        },
      },
    ],
  );
}
