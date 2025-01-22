import {
  eventActionAbi,
  readEventActionGetActionClaimant,
  readEventActionGetActionSteps,
  simulateEventActionExecute,
  writeEventActionExecute,
} from '@boostxyz/evm';
import { bytecode } from '@boostxyz/evm/artifacts/contracts/actions/EventAction.sol/EventAction.json';
import { abi } from '@boostxyz/signatures/events';
import { getTransaction, getTransactionReceipt } from '@wagmi/core';
import { match } from 'ts-pattern';
import {
  type AbiEvent,
  type AbiFunction,
  type AbiParameter,
  type Address,
  type GetLogsReturnType,
  type GetTransactionParameters,
  type GetTransactionReceiptReturnType,
  type Hex,
  type Log,
  type Transaction,
  decodeEventLog,
  decodeFunctionData,
  encodeAbiParameters,
  fromHex,
  isAddress,
  isAddressEqual,
  pad,
  toEventSelector,
  zeroAddress,
  zeroHash,
} from 'viem';
import { EventAction as EventActionBases } from '../../dist/deployments.json';
import type {
  DeployableOptions,
  GenericDeployableParams,
} from '../Deployable/Deployable';
import { DeployableTarget } from '../Deployable/DeployableTarget';
import {
  DecodedArgsError,
  DecodedArgsMalformedError,
  FieldValueNotComparableError,
  FieldValueUndefinedError,
  FunctionDataDecodeError,
  InvalidNumericalCriteriaError,
  InvalidTupleDecodingError,
  InvalidTupleEncodingError,
  NoEventActionStepsProvidedError,
  TooManyEventActionStepsProvidedError,
  UnparseableAbiParamError,
  UnrecognizedFilterTypeError,
  ValidationAbiMissingError,
} from '../errors';
import {
  CheatCodes,
  type Overwrite,
  type ReadParams,
  RegistryType,
  TRANSFER_SIGNATURE,
  type WriteParams,
} from '../utils';

/*
 * Action Event Payloads
 */

/**
 * Filter types used to determine how criteria are evaluated.
 *
 * @export
 * @enum {number}
 */
export enum FilterType {
  EQUAL = 0,
  NOT_EQUAL = 1,
  GREATER_THAN = 2,
  LESS_THAN = 3,
  CONTAINS = 4,
  REGEX = 5,
  GREATER_THAN_OR_EQUAL = 6,
  LESS_THAN_OR_EQUAL = 7,
}

/**
 * The primitive types supported for filtering.
 *
 * @export
 * @enum {number}
 */
export enum PrimitiveType {
  UINT = 0,
  ADDRESS = 1,
  BYTES = 2,
  STRING = 3,
  // Note: TUPLE remains in the enum but is no longer handled directly by `validateFieldAgainstCriteria`.
  TUPLE = 4,
}

/**
 * Object representation of a `Criteria` struct used in event actions.
 *
 * @export
 * @interface Criteria
 * @typedef {Criteria}
 */
export interface Criteria {
  /**
   * The filter type used in this criteria.
   *
   * @type {FilterType}
   */
  filterType: FilterType;
  /**
   * The primitive type of the field being filtered.
   *
   * @type {PrimitiveType}
   */
  fieldType: PrimitiveType;
  /**
   * The index in the logs argument array where the field is located.
   *
   * If `fieldType` is TUPLE, this value is **bitpacked** with up to 5 sub-indexes,
   * with the maximum 6-bit value used as a "terminator" to indicate no further indexes.
   *
   * @type {number}
   */
  fieldIndex: number;
  /**
   * The filter data used for complex filtering.
   *
   * @type {Hex}
   */
  filterData: Hex;
}

/**
 * Whether a given signature is an event or function
 *
 * @export
 * @enum {number}
 */
export enum SignatureType {
  EVENT = 0,
  FUNC = 1,
}

/**
 *  The payload describing how claimants are identified
 *
 * @export
 * @interface ActionClaimant
 * @typedef {ActionClaimant}
 */
export interface ActionClaimant {
  /**
   * Whether claimaint is inferred from event or function
   *
   * @type {SignatureType}
   */
  signatureType?: SignatureType;
  /**
   * The 4 byte signature of the event or function
   *
   * @type {Hex}
   */
  signature: Hex;
  /**
   * The index corresponding to claimant.
   *
   * @type {number}
   */
  fieldIndex: number;
  /**
   * The address of the target contract
   *
   * @type {Address}
   */
  targetContract: Address;
  /**
   * The chain id of the target contract.
   * @type {number}
   */
  chainid: number;
}

/**
 * Object representation of an `ActionStep` struct used in event actions.
 *
 * @export
 * @interface ActionStep
 * @typedef {ActionStep}
 */
export interface ActionStep {
  /**
   * The signature of the event.
   *
   * @type {Hex}
   */
  signature: Hex;
  /**
   * Whether claimaint is inferred from event or function
   *
   * @type {SignatureType}
   */
  signatureType?: SignatureType;
  /**
   * The type of action being performed.
   *
   * @type {number}
   */
  actionType?: number;
  /**
   * The address of the target contract.
   *
   * @type {Address}
   */
  targetContract: Address;
  /**
   * The chain id of the target contract.
   * @type {number}
   */
  chainid: number;
  /**
   * The criteria used for this action step.
   *
   * @type {Criteria}
   */
  actionParameter: Criteria;
}

/**
 * Parameters for validating an action step.
 *
 * @typedef {Object} ValidateActionStepParams
 * @property {Record<Hex, AbiEvent | AbiFunction>} [knownSignatures] - Record of known events, keyed by 32 byte selectors. You can use [@boostxyz/signatures](https://www.npmjs.com/package/@boostxyz/signatures) to assemble this parameter.
 * @property {AbiEvent | AbiFunction} [abiItem] - Optional ABI item definition.
 * @property {EventLogs} [logs] - Event logs to validate against. Required if 'hash' is not provided.
 * @property {Hex} [hash] - Transaction hash to validate against. Required if 'logs' is not provided.
 */
export type ValidateActionStepParams = {
  knownSignatures: Record<Hex, AbiEvent | AbiFunction>;
  abiItem?: AbiEvent | AbiFunction;
  notBeforeBlockNumber?: bigint;
} & ({ logs: EventLogs } | (GetTransactionParameters & { hash: Hex }));

/**
 * You can either supply a simplified version of the payload, or one that explicitly declares action steps.
 *
 * @export
 * @typedef {EventActionPayload}
 */
export type EventActionPayload =
  | EventActionPayloadSimple
  | EventActionPayloadRaw;

export interface EventActionPayloadSimple {
  /**
   *  The payload describing how claimants are identified
   *
   * @type {ActionClaimant}
   */
  actionClaimant: ActionClaimant;

  /**
   * Up to 4 action steps.
   * If you supply less than 4, then the last step will be reused to satisfy the EventAction.InitPayload
   * Any more than 4 will throw an error.
   *
   * @type {ActionStep[]}
   */
  actionSteps: ActionStep[];
}

export type ActionStepTuple = [ActionStep, ActionStep, ActionStep, ActionStep];

/**
 * Typeguard to determine if a user is supplying a simple or raw EventActionPayload
 *
 * @param {*} opts
 * @returns {opts is EventActionPayloadSimple}
 */
export function isEventActionPayloadSimple(
  opts: EventActionPayload,
): opts is EventActionPayloadSimple {
  return Array.isArray((opts as EventActionPayloadSimple).actionSteps);
}

/**
 * Object representation of an `InitPayload` struct used to initialize event actions.
 *
 * @export
 * @interface EventActionPayloadRaw
 * @typedef {EventActionPayloadRaw}
 */
export interface EventActionPayloadRaw {
  /**
   *  The payload describing how claimants are identified
   *
   * @type {ActionClaimant}
   */
  actionClaimant: ActionClaimant;
  /**
   * The first action step.
   *
   * @type {ActionStep}
   */
  actionStepOne: ActionStep;
  /**
   * The second action step.
   *
   * @type {ActionStep}
   */
  actionStepTwo: ActionStep;
  /**
   * The third action step.
   *
   * @type {ActionStep}
   */
  actionStepThree: ActionStep;
  /**
   * The fourth action step.
   *
   * @type {ActionStep}
   */
  actionStepFour: ActionStep;
}

/**
 * Array of event logs to pass into TxParams
 * @export
 * @typedef {EventLogs}
 */
export type EventLogs = GetLogsReturnType<AbiEvent, AbiEvent[], true>;

/**
 * Single event log
 * @export
 * @typedef {EventLog}
 */
export type EventLog = EventLogs[0] & { args: unknown[] };

/**
 * A generic event action
 *
 * @export
 * @class EventAction
 * @typedef {EventAction}
 * @extends {DeployableTarget<EventActionPayload>}
 */
export class EventAction extends DeployableTarget<
  EventActionPayload,
  typeof eventActionAbi
> {
  /**
   * @inheritdoc
   *
   * @public
   * @readonly
   * @type {*}
   */
  public override readonly abi = eventActionAbi;
  /**
   * @inheritdoc
   *
   * @public
   * @static
   * @type {Record<number, Address>}
   */
  public static override bases: Record<number, Address> = {
    31337: import.meta.env.VITE_EVENT_ACTION_BASE,
    ...(EventActionBases as Record<number, Address>),
  };
  /**
   * @inheritdoc
   *
   * @public
   * @static
   * @type {RegistryType}
   */
  public static override registryType: RegistryType = RegistryType.ACTION;

  /**
   * Gets a specific action event by index
   *
   * @public
   * @async
   * @param {number} index The index of the action event to retrieve
   * @param {?ReadEventActionParams<'getActionStep'>} [params]
   * @returns {Promise<ActionStep>}
   */
  public async getActionStep(index: number, params?: ReadParams) {
    const steps = await this.getActionSteps(params);
    return steps.at(index);
  }

  /**
   * Gets all action events
   *
   * @public
   * @async
   * @param {?ReadEventActionParams<'getActionSteps'>} [params]
   * @returns {Promise<ActionStep[]>}
   */
  public async getActionSteps(params?: ReadParams) {
    const steps = (await readEventActionGetActionSteps(this._config, {
      address: this.assertValidAddress(),
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    })) as RawActionStep[];
    return _dedupeActionSteps(steps.map(_fromRawActionStep));
  }

  /**
   * Gets the count of action events
   *
   * @public
   * @async
   * @param {?ReadEventActionParams<'getActionStepsCount'>} [params]
   * @returns {Promise<bigint>}
   */
  public async getActionStepsCount(params?: ReadParams) {
    const steps = await this.getActionSteps(params);
    return steps.length;
  }

  /**
   * Retrieves the payload describing how claimants can be identified from logs or function calls.
   *
   * @public
   * @async
   * @param {?ReadEventActionParams<'getActionClaimant'>} [params]
   * @returns {Promise<ActionClaimant>}
   */
  public async getActionClaimant(params?: ReadParams): Promise<ActionClaimant> {
    const result = (await readEventActionGetActionClaimant(this._config, {
      address: this.assertValidAddress(),
      ...this.optionallyAttachAccount(),
      ...params,
    })) as RawActionClaimant;
    return _fromRawActionStep(result);
  }

  /**
   * Executes a prepared event action
   *
   * @public
   * @async
   * @param {Hex} data
   * @param {?WriteParams} [params]
   * @returns {Promise<readonly [boolean, `0x${string}`]>}
   */
  public async execute(data: Hex, params?: WriteParams) {
    return await this.awaitResult(this.executeRaw(data, params));
  }

  /**
   * Executes a prepared event action
   *
   * @public
   * @async
   * @param {Hex} data
   * @param {?WriteParams} [params]
   * @returns {Promise<{ hash: `0x${string}`; result: readonly [boolean, `0x${string}`]; }>}
   */
  public async executeRaw(data: Hex, params?: WriteParams) {
    const { request, result } = await simulateEventActionExecute(this._config, {
      address: this.assertValidAddress(),
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
      args: [data],
    });
    const hash = await writeEventActionExecute(this._config, request);
    return { hash, result };
  }

  /**
   * Derives the action claimant address from a transaction based on the provided ActionClaimant configuration.
   * This method supports both event-based and function-based claimant derivation.
   * **Important**: The claimant is considered to be `transaction.from` when `claimant.fieldIndex` is 255 using CheatCodes enum.
   * This may have unintended side effects for bridged transactions and SCW transactions, so these are considered unsupported use cases for the time being.
   *
   ** @example
   * // Example usage
   * const eventAction = boost.action as EventAction
   * const claimant = await eventAction.getActionClaimant() // {
   *   signatureType: SignatureType.EVENT,
   *   signature: '0x1234...',
   *   fieldIndex: 2,
   *   targetContract: '0xabcd...',
   *   chainid: 1
   * };
   * const params: ValidateActionStepParams = {
   *   hash: '0x5678...',
   *   chainId: 1,
   *   knownSignatures: {
   *     '0x1234...': {
   *       type: 'event',
   *       name: 'Transfer(...)'
   *     }
   *   }
   * };
   * const claimantAddress = await eventAction.deriveActionClaimantFromTransaction(claimant, params);
   *
   * @param {ActionClaimant} claimant - The configuration specifying how to derive the claimant.
   * @param {ValidateActionStepParams} params - Parameters for validation, including transaction hash, known signatures, logs, and chain ID.
   * @returns {Promise<Address | undefined>} The derived claimant address if found, undefined otherwise.
   * @throws {ValidationAbiMissingError} If the ABI for the specified signature is not found.
   * @throws {FunctionDataDecodeError} If there's an error decoding function data (for function-based derivation).
   */
  public async deriveActionClaimantFromTransaction(
    claimant: ActionClaimant,
    params: ValidateActionStepParams,
  ): Promise<Address | undefined> {
    // find message sender and return it
    // WARNING: this is error prone in bridged transactions and SCW transactions, as this will return exit node
    if (claimant.fieldIndex === CheatCodes.TX_SENDER_CLAIMANT) {
      if ('hash' in params) {
        const transaction = await getTransaction(this._config, {
          ...params,
          chainId: claimant.chainid,
        });
        if (
          params.notBeforeBlockNumber &&
          transaction.blockNumber < params.notBeforeBlockNumber
        ) {
          return undefined;
        }
        return transaction.from;
      }
      if ('logs' in params) {
        for (let log of params.logs) {
          if (log.transactionHash) {
            const transaction = await getTransaction(this._config, {
              ...params,
              hash: log.transactionHash,
              chainId: claimant.chainid,
            });
            if (
              params.notBeforeBlockNumber &&
              transaction.blockNumber < params.notBeforeBlockNumber
            ) {
              return undefined;
            }
            return transaction.from;
          }
        }
      }
      return undefined;
    }

    const signature = claimant.signature;

    if (claimant.signatureType === SignatureType.EVENT) {
      let event: AbiEvent;
      if (params.abiItem) event = params.abiItem as AbiEvent;
      else {
        const sigPool = params.knownSignatures as Record<Hex, AbiEvent>;
        event = sigPool[signature] as AbiEvent;
      }
      if (!event) {
        throw new ValidationAbiMissingError(signature);
      }

      let address: Address | undefined;
      if ('logs' in params) {
        for (let log of params.logs) {
          if (!isAddressEqual(log.address, claimant.targetContract)) continue;
          let addressCandidate = this.validateClaimantAgainstArgs(
            claimant,
            log,
          );
          if (addressCandidate) address = addressCandidate;
        }
        return address;
      }
      const receipt = await getTransactionReceipt(this._config, {
        ...params,
        chainId: claimant.chainid,
      });
      if (
        params.notBeforeBlockNumber &&
        receipt.blockNumber < params.notBeforeBlockNumber
      ) {
        return undefined;
      }

      let decodedLogs: EventLogs;
      if (signature === TRANSFER_SIGNATURE) {
        ({ decodedLogs } = await this.decodeTransferLogs(receipt));
      } else {
        decodedLogs = receipt.logs
          .filter((log) => log.topics[0] === toEventSelector(event))
          .map((log) => decodeAndReorderLogArgs(event, log));
      }

      for (let log of decodedLogs) {
        if (!isAddressEqual(log.address, claimant.targetContract)) continue;
        let addressCandidate = this.validateClaimantAgainstArgs(claimant, log);
        if (addressCandidate) address = addressCandidate;
      }
      return address;
    }
    if (claimant.signatureType === SignatureType.FUNC && 'hash' in params) {
      const transaction = await getTransaction(this._config, {
        ...params,
        chainId: claimant.chainid,
      });
      if (
        params.notBeforeBlockNumber &&
        transaction.blockNumber < params.notBeforeBlockNumber
      ) {
        return undefined;
      }
      if (!isAddressEqual(transaction.to!, claimant.targetContract)) return;
      let func: AbiFunction;
      if (params.abiItem) func = params.abiItem as AbiFunction;
      else {
        const sigPool = params.knownSignatures as Record<Hex, AbiFunction>;
        func = sigPool[signature] as AbiFunction;
      }
      if (!func) {
        throw new ValidationAbiMissingError(claimant.signature);
      }
      let decodedData;
      try {
        decodedData = decodeFunctionData({
          abi: [func],
          data: transaction.input,
        });
      } catch (e) {
        throw new FunctionDataDecodeError([func], e as Error);
      }
      return this.validateClaimantAgainstArgs(claimant, decodedData);
    }
  }

  /**
   * Validates the action claimant against the arguments of a log or function data.
   *
   * @param {ActionClaimant} claimant - The action claimant to validate.
   * @param {Object} [logOrFnData] - Optional object containing the arguments to validate against.
   * @param {Array<any> | readonly unknown[] | Record<string, unknown>} [logOrFnData.args] - The arguments from the log or function data.
   * @returns {Address | undefined} The validated address if found and valid, otherwise undefined.
   */
  public validateClaimantAgainstArgs(
    claimant: ActionClaimant,
    logOrFnData?: {
      args: Array<unknown> | readonly unknown[] | Record<string, unknown>;
    },
  ): Address | undefined {
    if (
      !logOrFnData ||
      !Array.isArray(logOrFnData?.args) ||
      logOrFnData?.args.length <= claimant.fieldIndex
    ) {
      return;
    }
    const maybeAddress = logOrFnData.args.at(claimant.fieldIndex);
    if (isAddress(maybeAddress)) return maybeAddress;
  }

  /**
   * Retrieves action steps, and uses them to validate against, and optionally fetch logs that match the step's signature.
   * If logs are provided in the optional `params` argument, then those logs will be used instead of fetched with the configured client.
   *
   * @public
   * @async
   * @param ValidateActionStepParams params
   * @returns {Promise<boolean>}
   */
  public async validateActionSteps(params: ValidateActionStepParams) {
    const actionSteps = await this.getActionSteps();
    for (const actionStep of actionSteps) {
      if (!(await this.isActionStepValid(actionStep, params))) {
        return false;
      }
    }
    return true;
  }

  /**
   * Validates a single action step with a given criteria against logs or function calls.
   * If logs are provided in the optional `params` argument, then those logs will be used instead of being fetched with the configured client.
   * For functions a hash is required.
   *
   * @public
   * @async
   * @param {ActionStep} actionStep - The action step to validate. Can be a function of event step.
   * @param {ValidateActionStepParams} params - Additional parameters for validation, including hash, known events, logs, and chain ID.
   * @returns {Promise<boolean>}
   */
  public async isActionStepValid(
    actionStep: ActionStep,
    params: ValidateActionStepParams,
  ) {
    if (actionStep.signatureType === SignatureType.EVENT) {
      const signature = actionStep.signature;
      let event: AbiEvent;
      if (params.abiItem) event = params.abiItem as AbiEvent;
      else {
        const sigPool = params.knownSignatures as Record<Hex, AbiEvent>;
        event = sigPool[signature] as AbiEvent;
      }

      if (!event) {
        throw new ValidationAbiMissingError(signature);
      }

      if (this.isArraylikeIndexed(actionStep, event)) {
        // If the field is indexed, we can't filter on it
        throw new UnparseableAbiParamError(
          actionStep.actionParameter.fieldIndex,
          event,
        );
      }

      // Use the provided logs, no need to fetch receipt
      if ('logs' in params) {
        return this.isActionEventValid(actionStep, params.logs, event);
      }

      const receipt = await getTransactionReceipt(this._config, {
        ...params,
        chainId: actionStep.chainid,
      });
      if (
        params.notBeforeBlockNumber &&
        receipt.blockNumber < params.notBeforeBlockNumber
      ) {
        return false;
      }

      // Special handling for Transfer events
      if (actionStep.signature === TRANSFER_SIGNATURE) {
        const { decodedLogs, event } = await this.decodeTransferLogs(receipt);
        return this.isActionEventValid(actionStep, decodedLogs, event);
      }

      const decodedLogs = receipt.logs
        .filter((log) => log.topics[0] === toEventSelector(event))
        .map((log) => decodeAndReorderLogArgs(event, log));

      return this.isActionEventValid(actionStep, decodedLogs, event);
    }
    if (actionStep.signatureType === SignatureType.FUNC) {
      if ('hash' in params) {
        const transaction = await getTransaction(this._config, {
          ...params,
          chainId: actionStep.chainid,
        });
        if (
          params.notBeforeBlockNumber &&
          transaction.blockNumber < params.notBeforeBlockNumber
        ) {
          return false;
        }
        return this.isActionFunctionValid(actionStep, transaction, params);
      }
    }
    return false;
  }

  /**
   * Validates a single action event with a given criteria against logs.
   *
   * @public
   * @param {ActionStep} actionStep - The action step containing the event to validate.
   * @param {EventLogs} logs - Event logs to validate the given step against
   * @param {AbiEvent} eventAbi - The ABI definition of the event
   * @returns {boolean} Resolves to true if the action event is valid, throws if input is invalid, otherwise false.
   */
  public isActionEventValid(
    actionStep: ActionStep,
    logs: EventLogs,
    eventAbi: AbiEvent,
  ): boolean {
    const criteria = actionStep.actionParameter;
    if (!logs.length) return false;

    // Check each log
    for (let log of logs) {
      // parse out final (scalar) field from the log args
      try {
        if (!Array.isArray(log.args)) {
          throw new DecodedArgsMalformedError({
            log,
            criteria,
            fieldValue: undefined,
          });
        }
        const { value, type } = this.parseFieldFromAbi(
          log.args,
          criteria.fieldIndex,
          eventAbi.inputs || [],
          criteria.fieldType,
        );
        criteria.fieldType = type;
        if (this.validateFieldAgainstCriteria(criteria, value, { log })) {
          return true;
        }
      } catch {
        // If there's an error on this log, keep trying with the next one
      }
    }
    return false;
  }

  /**
   * Decodes logs specifically for ERC721 and ERC20 Transfer events.
   *
   * This special handling is required because both ERC20 and ERC721 Transfer events:
   * 1. Share the same event signature (0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef)
   * 2. Have similar but distinct structures:
   *    - ERC721: Transfer(address indexed from, address indexed to, uint256 indexed tokenId)
   *    - ERC20:  Transfer(address indexed from, address indexed to, uint256 value)
   *
   * This causes signature collisions in the known signatures package, requiring us to
   * try decoding both ways to determine which type of Transfer event we're dealing with.
   *
   * @param {GetTransactionReceiptReturnType} receipt - The transaction receipt containing the logs
   * @returns {Promise<{ decodedLogs: EventLogs; event: AbiEvent }>} - Returns the decoded logs and the transfer event ABI used for decoding
   * @throws {DecodedArgsError} - Throws if neither ERC20 nor ERC721 decoding succeeds
   */
  private async decodeTransferLogs(
    receipt: GetTransactionReceiptReturnType,
  ): Promise<{ decodedLogs: EventLogs; event: AbiEvent }> {
    const filteredLogs = receipt.logs.filter(
      (log) => log.topics[0] === TRANSFER_SIGNATURE,
    );
    const event = structuredClone(
      abi['Transfer(address indexed,address indexed,uint256 indexed)'],
    ) as AbiEvent;

    // ERC721
    try {
      const decodedLogs = filteredLogs.map((log) => {
        const { eventName, args } = decodeEventLog({
          abi: [event],
          data: log.data,
          topics: log.topics,
        });
        return { ...log, eventName, args };
      });

      return {
        decodedLogs,
        event,
      };
    } catch {
      // ERC20
      try {
        event.inputs[2]!.indexed = false;
        const decodedLogs = filteredLogs.map((log) => {
          const { eventName, args } = decodeEventLog({
            abi: [event],
            data: log.data,
            topics: log.topics,
          });
          return { ...log, eventName, args };
        });

        return {
          decodedLogs,
          event,
        };
      } catch {
        throw new DecodedArgsError('Failed to decode transfer logs');
      }
    }
  }

  /**
   * Parses the final (scalar) field from a set of decoded arguments, given an ABI definition.
   * If the fieldType is TUPLE, we decode `fieldIndex` as a bitpacked array of indexes to drill down
   * into nested tuples. Otherwise, we parse the single `fieldIndex` as normal.
   *
   * @public
   * @param {readonly unknown[]} allArgs - The decoded arguments array from an event log or function call.
   * @param {number} criteriaIndex - The field index (bitpacked if TUPLE).
   * @param {AbiParameter[]} abiInputs - The ABI inputs describing each decoded argument.
   * @param {PrimitiveType} declaredType - Either TUPLE or a standard scalar type
   * @returns {{ value: string | bigint | Hex; type: Exclude<PrimitiveType, PrimitiveType.TUPLE> }}
   */
  public parseFieldFromAbi(
    allArgs: readonly unknown[],
    criteriaIndex: number,
    abiInputs: readonly AbiParameter[],
    declaredType: PrimitiveType,
  ): {
    value: string | bigint | Hex;
    type: Exclude<PrimitiveType, PrimitiveType.TUPLE>;
  } {
    // If ANY_ACTION_PARAM, return a dummy "any" value so we can do special-case checks
    if (criteriaIndex === CheatCodes.ANY_ACTION_PARAM) {
      return { value: zeroHash, type: PrimitiveType.BYTES };
    }

    // If it's not TUPLE, parse as a single index (existing logic)
    if (declaredType !== PrimitiveType.TUPLE) {
      if (!Array.isArray(allArgs) || criteriaIndex >= allArgs.length) {
        throw new FieldValueUndefinedError({
          fieldValue: allArgs,
          criteria: {
            filterType: FilterType.EQUAL,
            fieldType: declaredType,
            fieldIndex: criteriaIndex,
            filterData: zeroHash,
          },
        });
      }
      const abiParam = abiInputs[criteriaIndex];
      if (!abiParam || !abiParam.type) {
        throw new UnparseableAbiParamError(criteriaIndex, abiParam as AbiEvent);
      }
      const rawValue = allArgs[criteriaIndex];

      const finalType = abiTypeToPrimitiveType(abiParam.type);

      if (
        finalType === PrimitiveType.ADDRESS &&
        (typeof rawValue !== 'string' || !isAddress(rawValue))
      ) {
        throw new FieldValueUndefinedError({
          fieldValue: rawValue,
          criteria: {
            fieldIndex: criteriaIndex,
            filterType: FilterType.EQUAL,
            fieldType: finalType,
            filterData: zeroHash,
          },
        });
      }

      return { value: rawValue as string | bigint | Hex, type: finalType };
    }

    // Otherwise, declaredType === TUPLE => decode bitpacked indexes
    const indexes = unpackFieldIndexes(criteriaIndex);
    return parseNestedTupleValue(allArgs as unknown[], indexes, abiInputs);
  }

  /**
   * Validates a single action function with a given criteria against the transaction input.
   *
   * @public
   * @param {ActionStep} actionStep - The action step containing the function to validate.
   * @param {Transaction} transaction - The transaction that will be validated against.
   * @param {Object} [params] - Parameters for validation.
   * @param {AbiItem} [params.abiItem] - The ABI item for the function, if known.
   * @param {Record<Hex, AbiEvent | AbiFunction>} [params.knownSignatures] - A record of known signatures.
   * @returns {boolean} Returns true if the action function is valid, false otherwise.
   * @throws {ValidationAbiMissingError} Throws if the ABI for the function signature is not found.
   * @throws {FunctionDataDecodeError} Throws if there's an error decoding the function data.
   */
  public isActionFunctionValid(
    actionStep: ActionStep,
    transaction: Transaction,
    params: Pick<ValidateActionStepParams, 'abiItem' | 'knownSignatures'>,
  ) {
    const criteria = actionStep.actionParameter;
    const signature = actionStep.signature;

    let func: AbiFunction;
    if (params.abiItem) func = params.abiItem as AbiFunction;
    else {
      const sigPool = params.knownSignatures as Record<Hex, AbiFunction>;
      func = sigPool[signature] as AbiFunction;
    }
    if (!func) {
      throw new ValidationAbiMissingError(signature);
    }

    let decodedData;
    try {
      decodedData = decodeFunctionData({
        abi: [func],
        data: transaction.input,
      });
    } catch (e) {
      throw new FunctionDataDecodeError([func], e as Error);
    }

    if (!decodedData?.args) {
      return false;
    }

    try {
      const { value, type } = this.parseFieldFromAbi(
        decodedData.args as unknown[],
        criteria.fieldIndex,
        func.inputs || [],
        criteria.fieldType,
      );
      criteria.fieldType = type;
      return this.validateFieldAgainstCriteria(criteria, value, {
        decodedArgs: decodedData.args as readonly (string | bigint)[],
      });
    } catch {
      return false;
    }
  }

  /**
   * Validates a field against a given criteria. The field is assumed to be a non-tuple scalar,
   * along with its final resolved `PrimitiveType`. (Any TUPLE logic has been extracted elsewhere.)
   *
   * @param {Criteria} criteria - The criteria to validate against.
   * @param {string | bigint | Hex} fieldValue - The field value to validate.
   * @param {Exclude<PrimitiveType, PrimitiveType.TUPLE>} fieldType - The final resolved primitive type.
   * @param {Object} input - Additional context for validation.
   * @param {EventLogs[0]} [input.log] - The event log, if validating an event.
   * @param {readonly (string | bigint)[]} [input.decodedArgs] - The decoded function arguments, if validating a function call.
   * @returns {boolean} - Returns true if the field passes the criteria, false otherwise.
   */
  public validateFieldAgainstCriteria(
    criteria: Criteria,
    fieldValue: string | bigint | Hex,
    input:
      | { log: EventLogs[0] }
      | { decodedArgs: readonly (string | bigint)[] },
  ): boolean {
    /*
     * Special-case: ANY_ACTION_PARAM. If we have filterType=EQUAL, fieldType=BYTES, fieldIndex=255,
     * we consider that a wildcard match. Return true immediately.
     */
    if (
      criteria.filterType === FilterType.EQUAL &&
      criteria.fieldType === PrimitiveType.BYTES &&
      criteria.fieldIndex === CheatCodes.ANY_ACTION_PARAM
    ) {
      return true;
    }
    if (criteria.fieldType === PrimitiveType.TUPLE) {
      throw new InvalidTupleDecodingError(
        'Tuples should not be passed into validateFieldAgainstCriteria',
      );
    }
    const fieldType = criteria.fieldType;

    // Evaluate filter based on the final fieldType
    switch (criteria.filterType) {
      case FilterType.EQUAL:
        return match(fieldType)
          .with(PrimitiveType.ADDRESS, () =>
            isAddressEqual(criteria.filterData, fieldValue as Address),
          )
          .with(
            PrimitiveType.UINT,
            () => BigInt(fieldValue) === BigInt(criteria.filterData),
          )
          .with(
            PrimitiveType.STRING,
            () => fieldValue === fromHex(criteria.filterData, 'string'),
          )
          .otherwise(() => fieldValue === criteria.filterData);

      case FilterType.NOT_EQUAL:
        return match(fieldType)
          .with(
            PrimitiveType.ADDRESS,
            () => !isAddressEqual(criteria.filterData, fieldValue as Address),
          )
          .with(
            PrimitiveType.UINT,
            () => BigInt(fieldValue) !== BigInt(criteria.filterData),
          )
          .with(
            PrimitiveType.STRING,
            () => fieldValue !== fromHex(criteria.filterData, 'string'),
          )
          .otherwise(() => fieldValue !== criteria.filterData);

      case FilterType.GREATER_THAN:
        if (fieldType === PrimitiveType.UINT) {
          return BigInt(fieldValue) > BigInt(criteria.filterData);
        }
        throw new InvalidNumericalCriteriaError({
          ...input,
          criteria,
          fieldValue,
        });

      case FilterType.GREATER_THAN_OR_EQUAL:
        if (fieldType === PrimitiveType.UINT) {
          return BigInt(fieldValue) >= BigInt(criteria.filterData);
        }
        throw new InvalidNumericalCriteriaError({
          ...input,
          criteria,
          fieldValue,
        });

      case FilterType.LESS_THAN:
        if (fieldType === PrimitiveType.UINT) {
          return BigInt(fieldValue) < BigInt(criteria.filterData);
        }
        throw new InvalidNumericalCriteriaError({
          ...input,
          criteria,
          fieldValue,
        });

      case FilterType.LESS_THAN_OR_EQUAL:
        if (fieldType === PrimitiveType.UINT) {
          return BigInt(fieldValue) <= BigInt(criteria.filterData);
        }
        throw new InvalidNumericalCriteriaError({
          ...input,
          criteria,
          fieldValue,
        });

      case FilterType.CONTAINS:
        if (
          fieldType === PrimitiveType.BYTES ||
          fieldType === PrimitiveType.STRING
        ) {
          let substring;
          if (fieldType === PrimitiveType.STRING) {
            substring = fromHex(criteria.filterData, 'string');
          } else {
            // truncate the `0x` prefix
            substring = criteria.filterData.slice(2);
          }
          return (fieldValue as string).includes(substring);
        }
        throw new FieldValueNotComparableError({
          ...input,
          criteria,
          fieldValue,
        });

      case FilterType.REGEX:
        if (typeof fieldValue !== 'string') {
          throw new FieldValueNotComparableError({
            ...input,
            criteria,
            fieldValue,
          });
        }
        if (fieldType === PrimitiveType.STRING) {
          const regexString = fromHex(criteria.filterData, 'string');
          return new RegExp(regexString).test(fieldValue);
        }
      // Otherwise unrecognized or not applicable

      default:
        throw new UnrecognizedFilterTypeError({
          ...input,
          criteria,
          fieldValue,
        });
    }
  }

  /**
   * @inheritdoc
   *
   * @public
   * @param {?EventActionPayload} [_payload]
   * @param {?DeployableOptions} [_options]
   * @returns {GenericDeployableParams}
   */
  public override buildParameters(
    _payload?: EventActionPayload,
    _options?: DeployableOptions,
  ): GenericDeployableParams {
    const [payload, options] = this.validateDeploymentConfig(
      _payload,
      _options,
    );
    let rawPayload: EventActionPayloadRaw;
    if (isEventActionPayloadSimple(payload)) {
      // filter out any falsy potential values
      let tmpSteps: ActionStep[] = payload.actionSteps.filter((step) => !!step);
      if (tmpSteps.length === 0) {
        throw new NoEventActionStepsProvidedError();
      }
      if (tmpSteps.length > 4) {
        throw new TooManyEventActionStepsProvidedError();
      }
      let steps: ActionStepTuple = Array.from({ length: 4 }, (_, i) => {
        // use either the provided step at the given index, or reuse the previous step
        // should aways exist
        return tmpSteps.at(i) || tmpSteps.at(-1);
      }) as ActionStepTuple;
      rawPayload = {
        actionClaimant: payload.actionClaimant,
        actionStepOne: steps[0],
        actionStepTwo: steps[1],
        actionStepThree: steps[2],
        actionStepFour: steps[3],
      };
    } else {
      rawPayload = payload;
    }
    return {
      abi: eventActionAbi,
      bytecode: bytecode as Hex,
      args: [prepareEventActionPayload(rawPayload)],
      ...this.optionallyAttachAccount(options.account),
    };
  }

  /**
   * Determines whether a string or bytes field is indexed in the event definition.
   * If the user tries to filter on an indexed string/bytes, we throw an error.
   *
   * @public
   * @param {ActionStep} step
   * @param {AbiEvent} event
   * @returns {boolean}
   */
  public isArraylikeIndexed(step: ActionStep, event: AbiEvent) {
    if (
      (step.actionParameter.fieldType === PrimitiveType.STRING ||
        step.actionParameter.fieldType === PrimitiveType.BYTES) &&
      event.inputs[step.actionParameter.fieldIndex]?.indexed
    ) {
      return true;
    }
    return false;
  }
}

/**
 * Checks if a particular ABI parameter is the "tuple" variant that can have `components`.
 *
 * @param {AbiParameter} param
 * @returns {boolean}
 */
function isTupleAbiParameter(
  param: AbiParameter,
): param is Extract<AbiParameter, { components: readonly AbiParameter[] }> {
  return param.type === 'tuple' || param.type.startsWith('tuple[');
}

/**
 * Recursively parses nested tuples by following an array of sub-indexes (unpacked from bitpacked `fieldIndex`).
 * Each entry in `indexes` is used to pick which sub-component in the current tuple's `components`.
 * If we encounter the "terminator" or run out of indexes, we stop.
 *
 * @param {unknown[]} rawArgs - The top-level arguments array.
 * @param {number[]} indexes - The array of indexes from `unpackFieldIndexes(...)`.
 * @param {readonly AbiParameter[]} abiInputs - The top-level ABI inputs for the entire arguments array.
 * @returns {{ value: string | bigint | Hex, type: Exclude<PrimitiveType, PrimitiveType.TUPLE> }}
 */
function parseNestedTupleValue(
  rawArgs: unknown[],
  indexes: number[],
  abiInputs: readonly AbiParameter[],
): {
  value: string | bigint | Hex;
  type: Exclude<PrimitiveType, PrimitiveType.TUPLE>;
} {
  if (!indexes.length) {
    throw new InvalidTupleDecodingError(
      `No indexes found; cannot parse TUPLE field`,
    );
  }

  // The first index picks which top-level ABI param to look at
  const idx = indexes[0] ?? abiInputs.length + 1;
  // If idx is out of range or is a "terminator," fail fast
  if (idx >= abiInputs.length) {
    throw new InvalidTupleDecodingError(undefined, idx);
  }

  const param = abiInputs[idx];
  const rawValue = rawArgs[idx];

  // If param isn't a tuple, we are at a leaf
  if (!isTupleAbiParameter(param!)) {
    const finalType = abiTypeToPrimitiveType(param!.type);
    return { value: rawValue as string | bigint | Hex, type: finalType };
  }

  // Otherwise param is a tuple => rawValue must be an array of subfields
  if (!Array.isArray(rawValue)) {
    throw new InvalidTupleDecodingError(
      `rawValue is not an array, but param.type is tuple`,
    );
  }

  // Move to the next sub-index
  const remaining = indexes.slice(1);
  if (!remaining.length) {
    // If there are no more indexes, we can't pick a sub-component
    // Typically you'd want at least one more index to say "which subfield in the tuple we want"
    throw new InvalidTupleDecodingError(undefined, -1);
  }

  // Check the next index for param.components
  const subIdx = remaining[0] ?? param.components.length + 1;
  if (subIdx >= param.components.length) {
    throw new InvalidTupleDecodingError(undefined, subIdx);
  }

  // Recurse deeper using param.components as the "new top-level" ABI param list
  return parseNestedTupleValue(rawValue, remaining, param.components);
}

/**
 * Maps an ABI type string (e.g. 'uint256', 'address', 'bytes', 'string', etc.) to a `PrimitiveType`.
 *
 * @param {string} abiType
 * @returns {Exclude<PrimitiveType, PrimitiveType.TUPLE>}
 */
function abiTypeToPrimitiveType(
  abiType: string,
): Exclude<PrimitiveType, PrimitiveType.TUPLE> {
  const lower = abiType.toLowerCase();

  if (lower.startsWith('uint') || lower.startsWith('int')) {
    return PrimitiveType.UINT;
  }
  if (lower === 'address') {
    return PrimitiveType.ADDRESS;
  }
  if (lower === 'bytes' || lower.startsWith('bytes')) {
    return PrimitiveType.BYTES;
  }
  if (lower === 'string') {
    return PrimitiveType.STRING;
  }

  // If it doesn't match any known scalar, throw. We expect parseNestedTupleValue() to handle nested tuple logic separately.
  throw new DecodedArgsError(`Unrecognized ABI type: ${abiType}`);
}

function _dedupeActionSteps(_steps: ActionStep[]): ActionStep[] {
  const steps: ActionStep[] = [];
  const signatures: Record<string, boolean> = {};
  for (let step of _steps) {
    const signature = JSON.stringify(step);
    if (signatures[signature]) continue;
    steps.push(step);
    signatures[signature] = true;
  }
  return steps;
}

type RawActionStep = Overwrite<ActionStep, { chainid: bigint }>;
type RawActionClaimant = Overwrite<ActionClaimant, { chainid: bigint }>;

function _toRawActionStep<T extends ActionStep | ActionClaimant>(obj: T) {
  return {
    ...obj,
    chainid: BigInt(obj.chainid),
  };
}

function _fromRawActionStep<T extends RawActionStep | RawActionClaimant>(
  obj: T,
) {
  if (obj.chainid > BigInt(Number.MAX_SAFE_INTEGER)) {
    throw new Error('Chain ID exceeds max safe integer');
  }

  return {
    ...obj,
    chainid: Number(obj.chainid),
  };
}

/**
 * Typeguard to determine if a user is supplying a simple or raw EventActionPayload
 *
 * @param {*} opts
 * @returns {opts is EventActionPayloadSimple}
 */
function _isEventActionPayloadSimple(
  opts: EventActionPayload,
): opts is EventActionPayloadSimple {
  return Array.isArray((opts as EventActionPayloadSimple).actionSteps);
}

/**
 * Determines whether a signature is an event or function signature based on its format.
 * - 32-byte signatures (0x + 64 chars) that don't start with 28 zeros are event signatures
 * - 4-byte signatures (0x + 8 chars) or 32-byte signatures with 28 leading zeros are function signatures
 *
 * @param {Hex} signature - The signature to check
 * @returns {SignatureType} The detected signature type
 */
export function detectSignatureType(signature: Hex): SignatureType {
  const hexWithoutPrefix = signature.slice(2);

  // 4-byte function selectors (8 hex chars)
  if (hexWithoutPrefix.length === 8) {
    return SignatureType.FUNC;
  }

  // 32-byte selectors (64 hex chars)
  if (hexWithoutPrefix.length === 64) {
    // Check if it starts with 28 bytes (56 chars) of zeros
    const leadingPart = hexWithoutPrefix.slice(0, 56);
    if (leadingPart === '0'.repeat(56)) {
      return SignatureType.FUNC;
    }
    return SignatureType.EVENT;
  }

  throw new Error('Invalid signature format');
}

/**
 * Function to properly encode an event action payload.
 *
 * @param {InitPayload} param0
 * @param {ActionStep} param0.actionStepOne - The first action step to initialize.
 * @param {ActionStep} param0.actionStepTwo - The second action step to initialize.
 * @param {ActionStep} param0.actionStepThree - The third action step to initialize.
 * @param {ActionStep} param0.actionStepFour - The fourth action step to initialize.
 * @returns {Hex}
 */
export function prepareEventActionPayload({
  actionClaimant,
  actionStepOne,
  actionStepTwo,
  actionStepThree,
  actionStepFour,
}: EventActionPayloadRaw) {
  // note chainIds are technically uint256 but viem treats them (safely) as numbers,
  // so we encode them as uint32 here to avoid downcast issues
  return encodeAbiParameters(
    [
      {
        type: 'tuple',
        name: 'initPayload',
        components: [
          {
            type: 'tuple',
            name: 'actionClaimant',
            components: [
              { type: 'uint8', name: 'signatureType' },
              { type: 'bytes32', name: 'signature' },
              { type: 'uint8', name: 'fieldIndex' },
              { type: 'address', name: 'targetContract' },
              { type: 'uint256', name: 'chainid' },
            ],
          },
          {
            type: 'tuple',
            name: 'actionStepOne',
            components: [
              { type: 'bytes32', name: 'signature' },
              { type: 'uint8', name: 'signatureType' },
              { type: 'uint8', name: 'actionType' },
              { type: 'address', name: 'targetContract' },
              { type: 'uint256', name: 'chainid' },
              {
                type: 'tuple',
                name: 'actionParameter',
                components: [
                  { type: 'uint8', name: 'filterType' },
                  { type: 'uint8', name: 'fieldType' },
                  { type: 'uint32', name: 'fieldIndex' },
                  { type: 'bytes', name: 'filterData' },
                ],
              },
            ],
          },
          {
            type: 'tuple',
            name: 'actionStepTwo',
            components: [
              { type: 'bytes32', name: 'signature' },
              { type: 'uint8', name: 'signatureType' },
              { type: 'uint8', name: 'actionType' },
              { type: 'address', name: 'targetContract' },
              { type: 'uint256', name: 'chainid' },
              {
                type: 'tuple',
                name: 'actionParameter',
                components: [
                  { type: 'uint8', name: 'filterType' },
                  { type: 'uint8', name: 'fieldType' },
                  { type: 'uint32', name: 'fieldIndex' },
                  { type: 'bytes', name: 'filterData' },
                ],
              },
            ],
          },
          {
            type: 'tuple',
            name: 'actionStepThree',
            components: [
              { type: 'bytes32', name: 'signature' },
              { type: 'uint8', name: 'signatureType' },
              { type: 'uint8', name: 'actionType' },
              { type: 'address', name: 'targetContract' },
              { type: 'uint256', name: 'chainid' },
              {
                type: 'tuple',
                name: 'actionParameter',
                components: [
                  { type: 'uint8', name: 'filterType' },
                  { type: 'uint8', name: 'fieldType' },
                  { type: 'uint32', name: 'fieldIndex' },
                  { type: 'bytes', name: 'filterData' },
                ],
              },
            ],
          },
          {
            type: 'tuple',
            name: 'actionStepFour',
            components: [
              { type: 'bytes32', name: 'signature' },
              { type: 'uint8', name: 'signatureType' },
              { type: 'uint8', name: 'actionType' },
              { type: 'address', name: 'targetContract' },
              { type: 'uint256', name: 'chainid' },
              {
                type: 'tuple',
                name: 'actionParameter',
                components: [
                  { type: 'uint8', name: 'filterType' },
                  { type: 'uint8', name: 'fieldType' },
                  { type: 'uint32', name: 'fieldIndex' },
                  { type: 'bytes', name: 'filterData' },
                ],
              },
            ],
          },
        ],
      },
    ],
    [
      {
        actionClaimant: {
          ..._toRawActionStep(actionClaimant),
          signatureType:
            actionClaimant.signatureType ??
            detectSignatureType(actionClaimant.signature),
          signature: pad(actionClaimant.signature),
        },
        actionStepOne: {
          ..._toRawActionStep(actionStepOne),
          signatureType:
            actionStepOne.signatureType ??
            detectSignatureType(actionStepOne.signature),
          signature: pad(actionStepOne.signature),
          actionType: actionStepOne.actionType || 0,
        },
        actionStepTwo: {
          ..._toRawActionStep(actionStepTwo),
          signatureType:
            actionStepTwo.signatureType ??
            detectSignatureType(actionStepTwo.signature),
          signature: pad(actionStepTwo.signature),
          actionType: actionStepTwo.actionType || 0,
        },
        actionStepThree: {
          ..._toRawActionStep(actionStepThree),
          signatureType:
            actionStepThree.signatureType ??
            detectSignatureType(actionStepThree.signature),
          signature: pad(actionStepThree.signature),
          actionType: actionStepThree.actionType || 0,
        },
        actionStepFour: {
          ..._toRawActionStep(actionStepFour),
          signatureType:
            actionStepFour.signatureType ??
            detectSignatureType(actionStepFour.signature),
          signature: pad(actionStepFour.signature),
          actionType: actionStepFour.actionType || 0,
        },
      },
    ],
  );
}

/**
 * Creates a default Criteria object that allows validation to pass. This is used if you don't care about targeting specific parameters in the action step.
 *
 * This function returns a Criteria object with the following properties:
 * - filterType: Set to EQUAL for exact matching
 * - fieldType: Set to BYTES to handle any data type
 * - fieldIndex: Set to 255, which is typically used to indicate "any" or "all" in this context using CheatCodes enum
 * - filterData: Set to zeroHash (0x0000...0000)
 *
 * @returns {Criteria} A Criteria object that can be used to match any action parameter
 *
 * @example
 * const anyCriteria = anyActionParameter();
 * // Use this criteria in an ActionStep to match any parameter
 * const actionStep = {
 *   // ... other properties ...
 *   actionParameter: anyCriteria
 * };
 */
export function anyActionParameter(): Criteria {
  return {
    filterType: FilterType.EQUAL,
    fieldType: PrimitiveType.BYTES,
    fieldIndex: CheatCodes.ANY_ACTION_PARAM,
    filterData: zeroHash,
  };
}

/**
 * Creates an ActionClaimant object that represents the transaction sender as the claimant.
 * This function is useful when you want to set up an action where the transaction sender is always considered the valid claimant,
 * regardless of the event or function parameters.
 *
 * The returned ActionClaimant has the following properties:
 * - signatureType: Set to SignatureType.EVENT (though it doesn't matter for this case)
 * - signature: Set to zeroHash (0x0000...0000)
 * - fieldIndex: Set to 255, indicating "any" field using CheatCodes enum
 * - targetContract: Set to zeroAddress (0x0000...0000)
 * - chainid:  The chain ID on which the transaction is sent, should match the chain ID for the action's {@link ActionStep}
 *
 * @param {number} chainId - The chain ID on which the transaction is sent, should match the chain ID for the action's {@link ActionStep}
 * @returns {ActionClaimant} An ActionClaimant object representing the msg.sender
 *
 * @example
 * const eventAction = new EventAction();
 * const payload: EventActionPayload = {
 *   actionClaimant: transactionSenderClaimant(),
 *   actionSteps: [
 *     // ... define your action steps here
 *   ]
 * };
 * await eventAction.deploy(payload);
 */
export function transactionSenderClaimant(chainId: number): ActionClaimant {
  return {
    signatureType: SignatureType.EVENT,
    signature: zeroHash,
    fieldIndex: CheatCodes.TX_SENDER_CLAIMANT,
    targetContract: zeroAddress,
    chainid: chainId,
  };
}

// Helper functions to bit-pack and decode fieldIndex values
const MAX_FIELD_INDEX = 0b111111; // Maximum value for 6 bits (63)

/**
 * Packs up to five indexes into a single uint32 value.
 *
 * @param {number[]} indexes - Array of up to five indexes to pack.
 * @returns {number} - Packed uint32 value.
 * @throws {Error} - If more than five indexes are provided or an index exceeds the maximum value.
 */
export function packFieldIndexes(indexes: number[]): number {
  if (indexes.length > 5) {
    throw new InvalidTupleEncodingError('Can only pack up to 5 indexes.');
  }

  let packed = 0;
  indexes.forEach((index, i) => {
    if (index > MAX_FIELD_INDEX) {
      throw new InvalidTupleEncodingError(
        `Index ${index} exceeds the maximum allowed value (${MAX_FIELD_INDEX}).`,
      );
    }
    packed |= (index & MAX_FIELD_INDEX) << (i * 6); // Each index occupies 6 bits
  });
  if (indexes.length < 5) {
    packed |= MAX_FIELD_INDEX << (indexes.length * 6); // Terminator
  }

  return packed;
}

/**
 * Unpacks a uint32 fieldIndex value into an array of up to five indexes.
 *
 * @param {number} packed - Packed uint32 value.
 * @returns {number[]} - Array of unpacked indexes.
 */
export function unpackFieldIndexes(packed: number): number[] {
  const indexes: number[] = [];
  for (let i = 0; i < 5; i++) {
    const index = (packed >> (i * 6)) & MAX_FIELD_INDEX;
    if (index === MAX_FIELD_INDEX) break; // Terminator value
    indexes.push(index);
  }
  return indexes;
}

/**
 * Decodes an event log and reorders the arguments to match the original ABI order.
 * This is necessary because viem's decodeEventLog reorders indexed parameters to the front.
 *
 * @param event - The event ABI definition
 * @param log - The log to decode
 * @returns {EventLog} The decoded log with arguments in the original ABI order
 */
export function decodeAndReorderLogArgs(event: AbiEvent, log: Log) {
  const decodedLog = decodeEventLog({
    abi: [event],
    data: log.data,
    topics: log.topics,
  });

  const argsArray = Array.isArray(decodedLog.args)
    ? decodedLog.args
    : Object.values(decodedLog.args);

  if (!event.inputs.some((input) => input.indexed)) {
    return {
      ...log,
      ...decodedLog,
    } as EventLog;
  }

  const indexedIndices: number[] = [];
  const nonIndexedIndices: number[] = [];
  for (let i = 0; i < event.inputs.length; i++) {
    if (event.inputs[i]!.indexed) {
      indexedIndices.push(i);
    } else {
      nonIndexedIndices.push(i);
    }
  }

  const reorderedArgs = Array.from({ length: event.inputs.length });
  let currentIndex = 0;

  // Place the indexed arguments in their original positions
  for (let i = 0; i < indexedIndices.length; i++) {
    reorderedArgs[indexedIndices[i]!] = argsArray[currentIndex++];
  }

  // Place the non-indexed arguments in their original positions
  for (let i = 0; i < nonIndexedIndices.length; i++) {
    reorderedArgs[nonIndexedIndices[i]!] = argsArray[currentIndex++];
  }

  return {
    ...log,
    eventName: decodedLog.eventName,
    args: reorderedArgs,
  } as EventLog;
}
