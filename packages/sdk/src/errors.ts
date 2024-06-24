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
