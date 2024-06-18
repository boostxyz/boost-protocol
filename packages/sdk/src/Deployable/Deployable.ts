import { type Config, deployContract } from '@wagmi/core';
import type { Address } from 'viem';
import { DeployableParametersUnspecifiedError } from '../errors';

export type GenericDeployableParams = Parameters<typeof deployContract>[1];
export class Deployable {
  protected _address: Address | undefined;

  constructor(address?: Address) {
    this._address = address;
  }

  public async deploy(config: Config): Promise<Address> {
    return (this._address = await deployContract(
      config,
      this.buildParameters(config),
    ));
  }

  public get address() {
    return this._address;
  }

  protected buildParameters(_config: Config): GenericDeployableParams {
    throw new DeployableParametersUnspecifiedError();
  }

  static at(address: Address) {
    return new Deployable(address);
  }
}
