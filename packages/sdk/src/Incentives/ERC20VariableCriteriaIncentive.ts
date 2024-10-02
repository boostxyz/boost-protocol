import {
  type erc20VariableCriteriaIncentiveAbi,
  readErc20VariableCriteriaIncentiveGetIncentiveCriteria,
} from '@boostxyz/evm';
import events from '@boostxyz/signatures/events';
import functions from '@boostxyz/signatures/functions';
import {
  type AbiEvent,
  type AbiFunction,
  type Address,
  type Hex,
  type Log,
  decodeFunctionData,
  parseEventLogs,
} from 'viem';
import { getTransaction, getTransactionReceipt } from 'viem/actions';
import { SignatureType } from '../Actions/EventAction';
import type { ReadParams } from '../utils';
import { ERC20VariableIncentive } from './ERC20VariableIncentive';

// Note: Move these to a separate file and refine
class IncentiveCriteriaNotFoundError extends Error {
  constructor(message: string, e?: Error) {
    super(message + (e ? `: ${e.message}` : ''));
    this.name = 'IncentiveCriteriaNotFoundError';
  }
}

class NoMatchingLogsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NoMatchingLogsError';
  }
}

class InvalidCriteriaTypeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidCriteriaTypeError';
  }
}

class DecodedArgsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DecodedArgsError';
  }
}

export interface IncentiveCriteria {
  criteriaType: SignatureType;
  signature: Hex; // event/function signature selector
  fieldIndex: number; // the index in the decoded args where the scalar resides
  targetContract: Address; // the contract address to match
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
export class ERC20VariableCriteriaIncentive extends ERC20VariableIncentive {
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
      throw new IncentiveCriteriaNotFoundError(
        'Unable to fetch Incentive Criteria from contract',
        e as Error,
      );
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
    const transactionReceipt = await getTransactionReceipt(
      this._config.getClient(),
      {
        hash,
      },
    );
    const transaction = await getTransaction(this._config.getClient(), {
      hash,
    });
    if (criteria.criteriaType === SignatureType.EVENT) {
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
        }) as Log[];
        if (decodedEvents == undefined || decodedEvents.length === 0) {
          throw new NoMatchingLogsError(
            `No logs found for event signature ${criteria.signature}`,
          );
        }
        // Note: Double check this LOC
        const scalarValue = decodedEvents[0]?.topics[criteria.fieldIndex];
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
}
