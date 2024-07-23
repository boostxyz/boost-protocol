import {
  type Hex,
  type WaitForTransactionReceiptReturnType,
  zeroHash,
} from 'viem';
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
      `Attempted to deploy a contract that already has an address configured`,
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
