import {
  eventActionAbi,
  readEventActionGetActionClaimant,
  readEventActionGetActionSteps,
  simulateEventActionExecute,
  writeEventActionExecute,
} from '@boostxyz/evm';
import { bytecode } from '@boostxyz/evm/artifacts/contracts/actions/EventAction.sol/EventAction.json';
import { getTransaction, getTransactionReceipt } from '@wagmi/core';
import { match } from 'ts-pattern';
import {
  type AbiEvent,
  type AbiFunction,
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
  signatureType: SignatureType;
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
  signatureType: SignatureType;
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
      const decodedLogs = receipt.logs
        .filter((log) => log.topics[0] === toEventSelector(event))
        .map((log) => {
          const { eventName, args } = decodeEventLog({
            abi: [event],
            data: log.data,
            topics: log.topics,
          });
          return { ...log, eventName, args };
        });

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
        return this.isActionEventValid(actionStep, params.logs);
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
        return this.decodeTransferLogs(receipt, actionStep);
      }

      const decodedLogs = receipt.logs
        .filter((log) => log.topics[0] === toEventSelector(event))
        .map((log) => {
          const { eventName, args } = decodeEventLog({
            abi: [event],
            data: log.data,
            topics: log.topics,
          });

          return { ...log, eventName, args };
        });

      return this.isActionEventValid(actionStep, decodedLogs);
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
   * If logs are provided in the optional `params` argument, then those logs will be used instead of being fetched with the configured client.
   *
   * @public
   * @async
   * @param {ActionStep} actionStep - The action step containing the event to validate.
   * @param {EventLogs} logs - Event logs to validate the given step against
   * @returns {Promise<boolean>} Resolves to true if the action event is valid, throws if input is invalid, otherwise false.
   */
  public isActionEventValid(actionStep: ActionStep, logs: EventLogs) {
    const criteria = actionStep.actionParameter;
    if (!logs.length) return false;
    for (let log of logs) {
      if (this.validateLogAgainstCriteria(criteria, log)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Decodes transfer logs specifically for ERC721 and ERC20 Transfer events.
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
   * @param {ActionStep} actionStep - The action step being validated
   * @returns {Promise<boolean>} - Returns true if the transfer logs are valid for either ERC20 or ERC721
   * @throws {DecodedArgsError} - Throws if neither ERC20 nor ERC721 decoding succeeds
   */
  private async decodeTransferLogs(
    receipt: GetTransactionReceiptReturnType,
    actionStep: ActionStep,
  ) {
    const filteredLogs = receipt.logs.filter(
      (log) => log.topics[0] === TRANSFER_SIGNATURE,
    );

    // ERC721
    try {
      const decodedLogs = filteredLogs.map((log) => {
        const { eventName, args } = decodeEventLog({
          abi: [
            {
              name: 'Transfer',
              type: 'event',
              inputs: [
                { type: 'address', indexed: true },
                { type: 'address', indexed: true },
                { type: 'uint256', indexed: true },
              ],
            },
          ],
          data: log.data,
          topics: log.topics,
        });
        return { ...log, eventName, args };
      });

      return this.isActionEventValid(actionStep, decodedLogs);
    } catch {
      // ERC20
      try {
        const decodedLogs = filteredLogs.map((log) => {
          const { eventName, args } = decodeEventLog({
            abi: [
              {
                name: 'Transfer',
                type: 'event',
                inputs: [
                  { type: 'address', indexed: true },
                  { type: 'address', indexed: true },
                  { type: 'uint256' },
                ],
              },
            ],
            data: log.data,
            topics: log.topics,
          });
          return { ...log, eventName, args };
        });

        return this.isActionEventValid(actionStep, decodedLogs);
      } catch {
        throw new DecodedArgsError('Failed to decode transfer logs');
      }
    }
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
    let signature = actionStep.signature;

    let func: AbiFunction;
    if (params.abiItem) func = params?.abiItem as AbiFunction;
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

    // Validate the criteria against decoded arguments using fieldIndex
    const decodedArgs = decodedData.args;

    if (!decodedArgs || !decodedData) return false;

    if (
      !this.validateFunctionAgainstCriteria(
        criteria,
        decodedArgs as (string | bigint)[],
      )
    ) {
      return false;
    }

    return true;
  }
  /**
   * Validates a field against a given criteria.
   *
   * @param {Criteria} criteria - The criteria to validate against.
   * @param {string | bigint | Hex} fieldValue - The field value to validate.
   * @param {Object} input - Additional context for validation.
   * @param {EventLogs[0]} [input.log] - The event log, if validating an event.
   * @param {readonly (string | bigint)[]} [input.decodedArgs] - The decoded function arguments, if validating a function call.
   * @returns {Promise<boolean>} - Returns true if the field passes the criteria, false otherwise.
   */
  public validateFieldAgainstCriteria(
    criteria: Criteria,
    fieldValue: string | bigint | Hex,
    input:
      | { log: EventLogs[0] }
      | { decodedArgs: readonly (string | bigint)[] },
  ): boolean {
    if (
      criteria.filterType === FilterType.EQUAL &&
      criteria.fieldType === PrimitiveType.BYTES &&
      criteria.fieldIndex === CheatCodes.ANY_ACTION_PARAM
    ) {
      return true;
    }

    // Type narrow based on criteria.filterType
    switch (criteria.filterType) {
      case FilterType.EQUAL:
        return match(criteria.fieldType)
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
        return match(criteria.fieldType)
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
        if (criteria.fieldType === PrimitiveType.UINT) {
          return BigInt(fieldValue) > BigInt(criteria.filterData);
        }
        throw new InvalidNumericalCriteriaError({
          ...input,
          criteria,
          fieldValue,
        });
      case FilterType.GREATER_THAN_OR_EQUAL:
        if (criteria.fieldType === PrimitiveType.UINT) {
          return BigInt(fieldValue) >= BigInt(criteria.filterData);
        }
        throw new InvalidNumericalCriteriaError({
          ...input,
          criteria,
          fieldValue,
        });

      case FilterType.LESS_THAN:
        if (criteria.fieldType === PrimitiveType.UINT) {
          return BigInt(fieldValue) < BigInt(criteria.filterData);
        }
        throw new InvalidNumericalCriteriaError({
          ...input,
          criteria,
          fieldValue,
        });
      case FilterType.LESS_THAN_OR_EQUAL:
        if (criteria.fieldType === PrimitiveType.UINT) {
          return BigInt(fieldValue) <= BigInt(criteria.filterData);
        }
        throw new InvalidNumericalCriteriaError({
          ...input,
          criteria,
          fieldValue,
        });

      case FilterType.CONTAINS:
        if (
          criteria.fieldType === PrimitiveType.BYTES ||
          criteria.fieldType === PrimitiveType.STRING
        ) {
          let substring;
          if (criteria.fieldType === PrimitiveType.STRING) {
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

        if (criteria.fieldType === PrimitiveType.STRING) {
          // fieldValue is decoded by the ABI
          const regexString = fromHex(criteria.filterData, 'string');
          return new RegExp(regexString).test(fieldValue);
        }

      default:
        throw new UnrecognizedFilterTypeError({
          ...input,
          criteria,
          fieldValue,
        });
    }
  }

  /**
   * Validates a {@link Log} against a given criteria.
   * If the criteria's fieldIndex is 255 (using CheatCodes enum), it is reserved for anyValidation
   *
   * @param {Criteria} criteria - The criteria to validate against.
   * @param {Log} log - The Viem event log.
   * @returns {boolean} - Returns true if the log passes the criteria, false otherwise.
   */
  public validateLogAgainstCriteria(
    criteria: Criteria,
    log: EventLogs[0],
  ): boolean {
    if (
      !Array.isArray(log.args) ||
      (log.args.length <= criteria.fieldIndex &&
        criteria.fieldIndex !== CheatCodes.ANY_ACTION_PARAM)
    ) {
      throw new DecodedArgsMalformedError({
        log,
        criteria,
        fieldValue: undefined,
      });
    }

    const fieldValue =
      criteria.fieldIndex === CheatCodes.ANY_ACTION_PARAM
        ? zeroHash
        : log.args.at(criteria.fieldIndex);

    if (fieldValue === undefined) {
      throw new FieldValueUndefinedError({ log, criteria, fieldValue });
    }
    return this.validateFieldAgainstCriteria(criteria, fieldValue, { log });
  }

  /**
   * Validates a function's decoded arguments against a given criteria.
   * If the criteria's fieldIndex is 255 (using CheatCodes enum), it is reserved for anyValidation
   *
   * @param {Criteria} criteria - The criteria to validate against.
   * @param {unknown[]} decodedArgs - The decoded arguments of the function call.
   * @returns {Promise<boolean>} - Returns true if the decoded argument passes the criteria, false otherwise.
   */
  public validateFunctionAgainstCriteria(
    criteria: Criteria,
    decodedArgs: readonly (string | bigint)[],
  ): boolean {
    const fieldValue =
      criteria.fieldIndex === CheatCodes.ANY_ACTION_PARAM
        ? zeroHash
        : decodedArgs[criteria.fieldIndex];
    if (fieldValue === undefined) {
      throw new FieldValueUndefinedError({
        criteria,
        fieldValue,
      });
    }
    return this.validateFieldAgainstCriteria(criteria, fieldValue, {
      decodedArgs,
    });
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

function _dedupeActionSteps(_steps: ActionStep[]): ActionStep[] {
  const steps: ActionStep[] = [],
    signatures: Record<string, boolean> = {};
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
                  { type: 'uint8', name: 'fieldIndex' },
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
                  { type: 'uint8', name: 'fieldIndex' },
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
                  { type: 'uint8', name: 'fieldIndex' },
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
                  { type: 'uint8', name: 'fieldIndex' },
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
        actionClaimant: _toRawActionStep(actionClaimant),
        actionStepOne: {
          ..._toRawActionStep(actionStepOne),
          actionType: actionStepOne.actionType || 0,
        },
        actionStepTwo: {
          ..._toRawActionStep(actionStepTwo),
          actionType: actionStepTwo.actionType || 0,
        },
        actionStepThree: {
          ..._toRawActionStep(actionStepThree),
          actionType: actionStepThree.actionType || 0,
        },
        actionStepFour: {
          ..._toRawActionStep(actionStepFour),
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
