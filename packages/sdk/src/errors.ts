import {
  type Hex,
  type WaitForTransactionReceiptReturnType,
  zeroHash,
} from 'viem';
import type { Incentive } from './Incentives/Incentive';

/**
 * Description placeholder
 *
 * @export
 * @class BoostCoreNoIdentifierEmitted
 * @typedef {BoostCoreNoIdentifierEmitted}
 * @extends {Error}
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
 * Description placeholder
 *
 * @export
 * @class ContractAddressRequiredError
 * @typedef {ContractAddressRequiredError}
 * @extends {Error}
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
 * Description placeholder
 *
 * @export
 * @class DeployableAlreadyDeployedError
 * @typedef {DeployableAlreadyDeployedError}
 * @extends {Error}
 */
export class DeployableAlreadyDeployedError extends Error {
  /**
   * Description placeholder
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
 * Description placeholder
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
 * Description placeholder
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
 * Description placeholder
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
 * Description placeholder
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
 * Description placeholder
 *
 * @export
 * @class NoContractAddressUponReceiptError
 * @typedef {NoContractAddressUponReceiptError}
 * @extends {Error}
 */
export class NoContractAddressUponReceiptError extends Error {
  /**
   * Description placeholder
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
 * Description placeholder
 *
 * @export
 * @class InvalidComponentInterfaceError
 * @typedef {InvalidComponentInterfaceError}
 * @extends {Error}
 */
export class InvalidComponentInterfaceError extends Error {
  /**
   * Description placeholder
   *
   * @public
   * @readonly
   * @type {Hex[]}
   */
  public readonly expected: Hex[] = [];
  /**
   * Description placeholder
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
 * Description placeholder
 *
 * @export
 * @class UnknownTransferPayloadSupplied
 * @typedef {UnknownTransferPayloadSupplied}
 * @extends {Error}
 */
export class UnknownTransferPayloadSupplied extends Error {
  /**
   * Description placeholder
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
 * Description placeholder
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
 * Description placeholder
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
