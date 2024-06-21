export class DeployableAddressRequiredError extends Error {
  constructor() {
    super('Attempted to call contract method without providing an address');
  }
}

export class DeployableParametersUnspecifiedError extends Error {
  constructor() {
    super(
      'Implementing class did not properly override the `buildParameters` method',
    );
  }
}

export class DeployableUnknownOwnerProvided extends Error {
  constructor() {
    super(
      'Expected an an owner to be provided in configuration or an account to exist on Wagmi config.',
    );
  }
}
