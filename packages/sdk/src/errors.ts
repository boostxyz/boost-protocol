import {
  type AbiEvent,
  type AbiFunction,
  type Hex,
  type Log,
  type WaitForTransactionReceiptReturnType,
  zeroHash,
} from 'viem';
import type { Criteria } from './Actions/EventAction';
import type { EventLogs } from './Actions/EventAction';
import type { BoostRegistry } from './BoostRegistry';
import type { Incentive } from './Incentives/Incentive';

/**
 * This error is thrown during Boost creation if no `BoostCreated` event was emitted.
 *
 * @export
 * @class BoostCoreNoIdentifierEmitted
 * @typedef {BoostCoreNoIdentifierEmitted}
 * @extends {Error}
 * @example
 * ```ts
 * try {
 *   await boostCore.createBoost(...)
 * } catch(e) {
 *   if(e instanceof BoostCoreNoIdentifierEmitted) {}
 * }
 * ```
 */
export class BoostCoreNoIdentifierEmitted extends Error {
  /**
   * Creates an instance of BoostCoreNoIdentifierEmitted.
   *
   * @constructor
   */
  constructor() {
    super(`No "BoostCreated" log was emitted from which to extract boostId`);
  }
}

/**
 * This error is thrown when `assertValidAddress` is called, usually because a contract call expects the class to have a valid address attached.
 *
 * @export
 * @class ContractAddressRequiredError
 * @typedef {ContractAddressRequiredError}
 * @extends {Error}
 * @example
 * ```ts
 * try {
 *   target.assertValidAddress()
 * } catch(e) {
 *   if(e instanceof ContractAddressRequiredError) {}
 * }
 */
export class ContractAddressRequiredError extends Error {
  /**
   * Creates an instance of ContractAddressRequiredError.
   *
   * @constructor
   */
  constructor() {
    super('Attempted to call contract method without providing an address');
  }
}

/**
 * This error is thrown when attempting to deploy a contract that has already been deployed, or has an address attached.
 *
 * @export
 * @class DeployableAlreadyDeployedError
 * @typedef {DeployableAlreadyDeployedError}
 * @extends {Error}
 */
export class DeployableAlreadyDeployedError extends Error {
  /**
   * The address already attached to the target.
   *
   * @type {string}
   */
  address: string;
  /**
   * Creates an instance of DeployableAlreadyDeployedError.
   *
   * @constructor
   * @param {string} address
   */
  constructor(address: string) {
    super(
      'Attempted to deploy a contract that already has an address configured',
    );
    this.address = address;
  }
}

/**
 * You should never see this error if we did our jobs and every target overrides the `buildParameters` method.
 *
 * @export
 * @class DeployableBuildParametersUnspecifiedError
 * @typedef {DeployableBuildParametersUnspecifiedError}
 * @extends {Error}
 */
export class DeployableBuildParametersUnspecifiedError extends Error {
  /**
   * Creates an instance of DeployableBuildParametersUnspecifiedError.
   *
   * @constructor
   */
  constructor() {
    super(
      'Implementing class did not properly override the `buildParameters` method',
    );
  }
}

/**
 * This error is thrown when attempting to deploy an `ownable` contract and the owner cannot be ascertained from the initialization payload or configured account.
 *
 * @export
 * @class DeployableUnknownOwnerProvidedError
 * @typedef {DeployableUnknownOwnerProvidedError}
 * @extends {Error}
 */
export class DeployableUnknownOwnerProvidedError extends Error {
  /**
   * Creates an instance of DeployableUnknownOwnerProvidedError.
   *
   * @constructor
   */
  constructor() {
    super(
      'Expected an an owner to be provided in configuration or an account to exist on Wagmi config.',
    );
  }
}

/**
 * This error is thrown when deploying a contract with no valid Wagmi configuration on the instance.
 *
 * @export
 * @class DeployableWagmiConfigurationRequiredError
 * @typedef {DeployableWagmiConfigurationRequiredError}
 * @extends {Error}
 */
export class DeployableWagmiConfigurationRequiredError extends Error {
  /**
   * Creates an instance of DeployableWagmiConfigurationRequiredError.
   *
   * @constructor
   */
  constructor() {
    super(
      'Expected a valid Wagmi configuration to be available either on Deployable, or as argument to deploy.',
    );
  }
}

/**
 * This error is thrown when deploying a contract with no valid initialization payload.
 *
 * @export
 * @class DeployableMissingPayloadError
 * @typedef {DeployableMissingPayloadError}
 * @extends {Error}
 */
export class DeployableMissingPayloadError extends Error {
  /**
   * Creates an instance of DeployableMissingPayloadError.
   *
   * @constructor
   */
  constructor() {
    super(
      'Expected a valid payload to be available either on Deployable or as argument to deploy.',
    );
  }
}

/**
 * This error is thrown when we receive a transaction receipt for a contract deployment without a contract address on it.
 *
 * @export
 * @class NoContractAddressUponReceiptError
 * @typedef {NoContractAddressUponReceiptError}
 * @extends {Error}
 */
export class NoContractAddressUponReceiptError extends Error {
  /**
   * The raw receipt we receive from [waitForTransactionReceipt](https://v1.viem.sh/docs/actions/public/waitForTransactionReceipt.html#waitfortransactionreceipt)
   *
   * @public
   * @readonly
   * @type {WaitForTransactionReceiptReturnType}
   */
  public readonly receipt: WaitForTransactionReceiptReturnType;
  /**
   * Creates an instance of NoContractAddressUponReceiptError.
   *
   * @constructor
   * @param {WaitForTransactionReceiptReturnType} receipt
   */
  constructor(receipt: WaitForTransactionReceiptReturnType) {
    super(`Expected a contract address to exist on receipt.`, {
      cause: receipt,
    });
    this.receipt = receipt;
  }
}

/**
 * This error is thrown when a target address was provided that doesn't match any supported interface for the given registry type.
 * For example, if you try to do `incentiveFromAddress()` with the address of a deployed `SimpleBudget`
 *
 * @export
 * @class InvalidComponentInterfaceError
 * @typedef {InvalidComponentInterfaceError}
 * @extends {Error}
 */
export class InvalidComponentInterfaceError extends Error {
  /**
   * Expected interface hashes.
   *
   * @public
   * @readonly
   * @type {Hex[]}
   */
  public readonly expected: Hex[] = [];
  /**
   * The actual interface hash.
   *
   * @public
   * @readonly
   * @type {Hex}
   */
  public readonly received: Hex = zeroHash;

  /**
   * Creates an instance of InvalidComponentInterfaceError.
   *
   * @constructor
   * @param {Hex[]} expected
   * @param {Hex} received
   */
  constructor(expected: Hex[], received: Hex) {
    super(`Address provided does not match any expected protocol interface`, {
      cause: { expected, received },
    });
    this.expected = expected;
    this.received = received;
  }
}

/**
 * This error is thrown when a param is not transparently stored onchain
 *
 * @export
 * @class UnparseableAbiParamError
 * @typedef {UnparseableAbiParamError}
 * @extends {Error}
 */
export class UnparseableAbiParamError extends Error {
  /**
   * the param index that is unparseable
   *
   * @type {number}
   */
  input_param_idx: number;
  /**
   * The given event that contains the unparseable param
   *
   * @type {AbiEvent}
   */
  event: AbiEvent;
  /**
   * Creates an instance of UnknownTransferPayloadSupplied.
   *
   * @constructor
   * @param {number} input_param_idx
   * @param {AbiEvent} event
   */
  constructor(input_param_idx: number, event: AbiEvent) {
    super(
      `Parameter is not transparently stored onchain. Parameter ${input_param_idx} in event ${event.name} cannot be used in an action`,
      { cause: event },
    );
    this.event = event;
    this.input_param_idx = input_param_idx;
  }
}

/**
 * This error is thrown when attempting a Budget transfer and arguments aren't of the type `FungibleTransferPayload` or `ERC1155TransferPayload`
 *
 * @see {@link FungibleTransferPayload}
 * @see {@link ERC1155TransferPayload}
 * @export
 * @class UnknownTransferPayloadSupplied
 * @typedef {UnknownTransferPayloadSupplied}
 * @extends {Error}
 */
export class UnknownTransferPayloadSupplied extends Error {
  /**
   * The given payload that does not conform to the correct payload shape.
   *
   * @type {unknown}
   */
  received: unknown;
  /**
   * Creates an instance of UnknownTransferPayloadSupplied.
   *
   * @constructor
   * @param {unknown} received
   */
  constructor(received: unknown) {
    super(
      `Did not provide a valid FungibleTransferPayload or ERC1155 transfer payload.`,
      { cause: received },
    );
    this.received = received;
  }
}

/**
 * This error is thrown during Boost creation when the budget doesn't authorize the Boost Core address.
 *
 * @export
 * @class BudgetMustAuthorizeBoostCore
 * @typedef {BudgetMustAuthorizeBoostCore}
 * @extends {Error}
 */
export class BudgetMustAuthorizeBoostCore extends Error {
  /**
   * Creates an instance of BudgetMustAuthorizeBoostCore.
   *
   * @constructor
   * @param {string} boostCoreAddress
   */
  constructor(boostCoreAddress: string) {
    super(
      `Budget needs to explicitly authorize ${boostCoreAddress}. You can retrieve this value from BoostCore.address`,
    );
  }
}

/**
 * Because this contract is a base implementation, it should not be initialized through the constructor. Instead, it should be cloned and initialized using the {@link BoostRegistry}
 *
 * @export
 * @class MustInitializeBudgetError
 * @typedef {MustInitializeBudgetError}
 * @extends {Error}
 */
export class MustInitializeBudgetError extends Error {
  /**
   * Creates an instance of MustInitializeBudgetError.
   */
  constructor() {
    super(`Budgets must be preinitialized before being used with a new Boost`);
  }
}

/**
 * The error is thrown when trying to reuse an existing deployed Incentive that isn't a base implementation.
 * The protocol doesn't allow this.
 *
 * @export
 * @class IncentiveNotCloneableError
 * @typedef {IncentiveNotCloneableError}
 * @extends {Error}
 */
export class IncentiveNotCloneableError extends Error {
  /**
   * Creates an instance of IncentiveNotCloneableError.
   *
   * @constructor
   * @param {Incentive} incentive
   */
  constructor(incentive: Incentive) {
    super(`Incentive not cloneable: ${incentive.constructor.name}`);
  }
}

/**
 * Thrown when encoding an EventAction payload and no action steps are provided
 *
 * @export
 * @class NoEventActionStepsProvidedError
 * @typedef {NoEventActionStepsProvidedError}
 * @extends {Error}
 */
export class NoEventActionStepsProvidedError extends Error {
  /**
   * Creates an instance of NoEventActionStepsProvidedError.
   *
   * @constructor
   */
  constructor() {
    super('Must supply at least one action step');
  }
}

/**
 * Thrown when encoding an EventAction payload and > 4 steps are provided
 *
 * @export
 * @class TooManyEventActionStepsProvidedError
 * @typedef {TooManyEventActionStepsProvidedError}
 * @extends {Error}
 */
export class TooManyEventActionStepsProvidedError extends Error {
  /**
   * Creates an instance of TooManyEventActionStepsProvidedError.
   *
   * @constructor
   */
  constructor() {
    super(
      'Cannot supply more than 4 action steps with current protocol version',
    );
  }
}

/**
 * The error is thrown when trying to reuse an existing deployed Incentive that isn't a base implementation.
 *
 * @export
 * @class ValidationAbiMissingError
 * @typedef {ValidationAbiMissingError}
 * @extends {Error}
 */
export class ValidationAbiMissingError extends Error {
  /**
   * Creates an instance of ValidationAbiMissingError.
   *
   * @constructor
   * @param {Hex} signature
   */
  constructor(signature: Hex) {
    super(`No known ABI for given signature: ${signature}`);
  }
}

/**
 * Function action validation context to help debug other validation errors
 *
 * @interface FunctionActionValidationMeta
 * @typedef {FunctionActionValidationMeta}
 */
interface FunctionActionValidationMeta {
  decodedArgs: readonly (string | bigint)[];
  /**
   * The value pulled off the log being validated against
   *
   * @type {*}
   * biome-ignore lint/suspicious/noExplicitAny: this can be a few different types based on what the log emits
   */
  fieldValue: any;
  /**
   * The criteria being used to compare during validation
   *
   * @type {Criteria}
   */
  criteria: Criteria;
}
/**
 * Event action validation context to help debug other validation errors
 *
 * @interface EventActionValidationMeta
 * @typedef {EventActionValidationMeta}
 */
interface EventActionValidationMeta {
  /**
   * The viem log being validated against
   *
   * @type {Log}
   */
  log?: EventLogs[0];
  /**
   * The value pulled off the log being validated against
   *
   * @type {*}
   * biome-ignore lint/suspicious/noExplicitAny: this can be a few different types based on what the log emits
   */
  fieldValue: any;
  /**
   * The criteria being used to compare during validation
   *
   * @type {Criteria}
   */
  criteria: Criteria;
}

/**
 * The base error thrown during event action validation extended by more specific validation errors.
 * Instantiated with relevent context data for more in depth debugging.
 *
 * @export
 * @class FieldActionValidationError
 * @typedef {FieldActionValidationError}
 * @extends {Error}
 */
export class FieldActionValidationError extends Error {
  /**
   * The function input arguments being validated against
   *
   * @type {decodedArgs}
   */
  decodedArgs?: readonly (string | bigint)[];
  /**
   * The viem log being validated against
   *
   * @type {Log}
   */
  log?: EventLogs[0];
  /**
   * The value pulled off the log being validated against
   *
   * @type {*}
   * biome-ignore lint/suspicious/noExplicitAny: this can be a few different types based on what the log emits
   */
  fieldValue: any;
  /**
   * The criteria being used to compare during validation
   *
   * @type {Criteria}
   */
  criteria: Criteria;
  /**
   * Creates an instance of FieldActionValidationError.
   *
   * @constructor
   * @param {string} message
   * @param {EventActionValidationMeta} param0
   * @param {*} param0.fieldValue
   * @param {Criteria} param0.criteria
   * @param {Log} param0.log
   */
  constructor(
    message: string,
    {
      fieldValue,
      criteria,
      ...args
    }: EventActionValidationMeta | FunctionActionValidationMeta,
  ) {
    super(message);
    this.fieldValue = fieldValue;
    this.criteria = criteria;

    switch (true) {
      case 'log' in args:
        this.log = args.log;
        break;
      case 'decodedArgs' in args:
        this.decodedArgs = args.decodedArgs;
    }
  }
}

/**
 * Thrown when abi-decoded args on log is undefined
 *
 * @export
 * @class FieldValueUndefinedError
 * @typedef {FieldValueUndefinedError}
 * @extends {FieldActionValidationError}
 */
export class DecodedArgsMalformedError extends FieldActionValidationError {
  /**
   * Creates an instance of DecodedArgsUndefinedError.
   *
   * @constructor
   * @param {DecodedArgsMalformedError} metadata
   */
  constructor(
    metadata: EventActionValidationMeta | FunctionActionValidationMeta,
  ) {
    super(
      'Decoded Args are malformed; Check which params are indexed',
      metadata,
    );
  }
}

/**
 * Thrown when field value on log is undefined
 *
 * @export
 * @class FieldValueUndefinedError
 * @typedef {FieldValueUndefinedError}
 * @extends {FieldActionValidationError}
 */
export class FieldValueUndefinedError extends FieldActionValidationError {
  /**
   * Creates an instance of FieldValueUndefinedError.
   *
   * @constructor
   * @param {EventActionValidationMeta} metadata
   */
  constructor(
    metadata: EventActionValidationMeta | FunctionActionValidationMeta,
  ) {
    super('Field value is undefined', metadata);
  }
}

/**
 * Thrown when a filter type is using a numerical operator but field type is not numerical
 *
 * @export
 * @class InvalidNumericalCriteriaError
 * @typedef {InvalidNumericalCriteriaError}
 * @extends {FieldActionValidationError}
 */
export class InvalidNumericalCriteriaError extends FieldActionValidationError {
  /**
   * Creates an instance of InvalidNumericalCriteria.
   *
   * @constructor
   * @param {EventActionValidationMeta} metadata
   */
  constructor(
    metadata: EventActionValidationMeta | FunctionActionValidationMeta,
  ) {
    super(
      'Numerical comparisons cannot be used with non-numerical criteria',
      metadata,
    );
  }
}

/**
 * Thrown when decoding function data fails.
 *
 * @export
 * @class FunctionDataDecodeError
 * @typedef {FunctionDataDecodeError}
 * @extends {Error}
 */
export class FunctionDataDecodeError extends Error {
  public abi: AbiFunction[];
  public originalError: Error;

  /**
   * Creates an instance of FunctionDataDecodeError.
   *
   * @constructor
   * @param {AbiFunction[]} abi - The ABI of the function.
   * @param {Error} originalError - The original error that was thrown.
   */
  constructor(abi: AbiFunction[], originalError: Error) {
    super(`Failed to decode function data: ${originalError.message}`);
    this.name = 'FunctionDataDecodeError';
    this.abi = abi;
    this.originalError = originalError;
  }
}

/**
 * Thrown when an the log's field value is being compared a field type that isn't bytes or string during event action validation
 *
 * @export
 * @class FieldValueNotComparableError
 * @typedef {FieldValueNotComparableError}
 * @extends {FieldActionValidationError}
 */
export class FieldValueNotComparableError extends FieldActionValidationError {
  /**
   * Creates an instance of FieldValueNotComparableError.
   *
   * @constructor
   * @param {EventActionValidationMeta} metadata
   */
  constructor(
    metadata: EventActionValidationMeta | FunctionActionValidationMeta,
  ) {
    super('Filter can only be used with bytes or string field type', metadata);
  }
}

/**
 * Thrown when an invalid filter type enum was provided event action validation.
 *
 * @export
 * @class UnrecognizedFilterTypeError
 * @typedef {UnrecognizedFilterTypeError}
 * @extends {FieldActionValidationError}
 */
export class UnrecognizedFilterTypeError extends FieldActionValidationError {
  /**
   * Creates an instance of UnrecognizedFilterTypeError.
   *
   * @constructor
   * @param {EventActionValidationMeta} metadata
   */
  constructor(
    metadata: EventActionValidationMeta | FunctionActionValidationMeta,
  ) {
    super('Invalid FilterType provided', metadata);
  }
}

/**
 * Thrown when no chain ID is provided in the Wagmi configuration.
 *
 * @export
 * @class NoConnectedChainIdError
 * @typedef {NoConnectedChainIdError}
 * @extends {Error}
 */
export class NoConnectedChainIdError extends Error {
  /**
   * Creates an instance of NoConnectedChainIdError.
   *
   * @constructor
   */
  constructor() {
    super(
      'Provided Wagmi configuration does not define `chainId` property with which to target protocol contracts',
    );
    this.name = 'NoConnectedChainIdError';
  }
}

/**
 * Thrown when an invalid chain ID is provided that doesn't match any deployed protocol.
 *
 * @export
 * @class InvalidProtocolChainIdError
 * @typedef {InvalidProtocolChainIdError}
 * @extends {Error}
 */
export class InvalidProtocolChainIdError extends Error {
  /**
   * Creates an instance of InvalidProtocolChainIdError.
   *
   * @constructor
   * @param {number} chainId - The chain ID provided in the configuration.
   * @param {number[]} validChainIds - A list of valid chain IDs where the protocol is deployed.
   */
  constructor(chainId: number, validChainIds: number[]) {
    super(
      `Provided Wagmi configuration supplied a "chainId" where protocol is not deployed, provided: ${chainId}, but valid chains are: ${validChainIds}`,
    );
    this.name = 'InvalidProtocolChainIdError';
  }
}

/**
 * Thrown when the incentive criteria cannot be fetched from the contract.
 *
 * @export
 * @class IncentiveCriteriaNotFoundError
 * @typedef {IncentiveCriteriaNotFoundError}
 * @extends {Error}
 */
export class IncentiveCriteriaNotFoundError extends Error {
  /**
   * Creates an instance of IncentiveCriteriaNotFoundError.
   *
   * @constructor
   * @param {Error} [e] - Optional error object for further context.
   * @param {string} [message='Unable to fetch Incentive Criteria from contract'] - Custom error message.
   */
  constructor(
    e?: Error,
    message = 'Unable to fetch Incentive Criteria from contract',
  ) {
    super(message + (e ? `: ${e.message}` : ''));
    this.name = 'IncentiveCriteriaNotFoundError';
  }
}

/**
 * Thrown when no matching logs are found for a given event signature.
 *
 * @export
 * @class NoMatchingLogsError
 * @typedef {NoMatchingLogsError}
 * @extends {Error}
 */
export class NoMatchingLogsError extends Error {
  /**
   * Creates an instance of NoMatchingLogsError.
   *
   * @constructor
   * @param {string} signature - The event signature for which logs are being searched.
   * @param {string} [message] - Optional custom error message.
   */
  constructor(
    signature: string,
    message = `No logs found for event signature ${signature}`,
  ) {
    super(message);
    this.name = 'NoMatchingLogsError';
  }
}

/**
 * Thrown when an invalid criteria type is provided.
 *
 * @export
 * @class InvalidCriteriaTypeError
 * @typedef {InvalidCriteriaTypeError}
 * @extends {Error}
 */
export class InvalidCriteriaTypeError extends Error {
  /**
   * Creates an instance of InvalidCriteriaTypeError.
   *
   * @constructor
   * @param {string} [criteriaType='unknown'] - The invalid criteria type that was provided.
   * @param {string} [message] - Optional custom error message.
   */
  constructor(
    criteriaType = 'unknown',
    message = `Invalid criteria type ${criteriaType}`,
  ) {
    super(message);
    this.name = 'InvalidCriteriaTypeError';
  }
}

/**
 * Thrown when decoding function arguments fails.
 *
 * @export
 * @class DecodedArgsError
 * @typedef {DecodedArgsError}
 * @extends {Error}
 */
export class DecodedArgsError extends Error {
  /**
   * Creates an instance of DecodedArgsError.
   *
   * @constructor
   * @param {string} [message='Issue decoding args'] - Custom error message.
   */
  constructor(message = 'Issue decoding args') {
    super(message);
    this.name = 'DecodedArgsError';
  }
}
