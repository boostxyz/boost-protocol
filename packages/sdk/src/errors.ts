import type { Deployable } from './Deployable/Deployable';

export class DeployableAddressRequiredError extends Error {
  constructor() {
    super('Attempted to call contract method without providing an address');
  }
}

export function requireAddress(deployable: Deployable) {
  if (!deployable.address) throw new DeployableAddressRequiredError();
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

export class DeployableParametersUnspecifiedError extends Error {
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
