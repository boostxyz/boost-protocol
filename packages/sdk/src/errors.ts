import {
  type Hex,
  type WaitForTransactionReceiptReturnType,
  zeroHash,
} from 'viem';

export class BoostCoreNoIdentifierEmitted extends Error {
  constructor() {
    super(`No "BoostCreated" log was emitted from which to extract boostId`);
  }
}

export class ContractAddressRequiredError extends Error {
  constructor() {
    super('Attempted to call contract method without providing an address');
  }
}

export class DeployableAlreadyDeployedError extends Error {
  address: string;
  constructor(address: string) {
    super(
      `Attempted to deploy a contract that already has an address configured`,
    );
    this.address = address;
  }
}

export class DeployableBuildParametersUnspecifiedError extends Error {
  constructor() {
    super(
      'Implementing class did not properly override the `buildParameters` method',
    );
  }
}

export class DeployableUnknownOwnerProvidedError extends Error {
  constructor() {
    super(
      'Expected an an owner to be provided in configuration or an account to exist on Wagmi config.',
    );
  }
}

export class DeployableWagmiConfigurationRequiredError extends Error {
  constructor() {
    super(
      'Expected a valid Wagmi configuration to be available either on Deployable, or as argument to deploy.',
    );
  }
}

export class DeployableMissingPayloadError extends Error {
  constructor() {
    super(
      'Expected a valid payload to be available either on Deployable or as argument to deploy.',
    );
  }
}

export class NoContractAddressUponReceiptError extends Error {
  public readonly receipt: WaitForTransactionReceiptReturnType;
  constructor(receipt: WaitForTransactionReceiptReturnType) {
    super(`Expected a contract address to exist on receipt.`);
    this.receipt = receipt;
  }
}

export class InvalidComponentInterfaceError extends Error {
  public readonly expected: Hex[] = [];
  public readonly received: Hex = zeroHash;

  constructor(expected: Hex[], received: Hex) {
    super(`Address provided is not `);
    this.expected = expected;
    this.received = received;
  }
}
