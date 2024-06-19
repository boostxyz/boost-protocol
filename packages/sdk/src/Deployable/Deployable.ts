import { type Config, deployContract } from '@wagmi/core';
import type { Address, Hex } from 'viem';
import { DeployableParametersUnspecifiedError } from '../errors';

export type GenericDeployableParams = Omit<
  Parameters<typeof deployContract>[1],
  'args'
> & {
  args: [Hex, ...Array<Hex>];
};

export class Deployable {
  protected _address: Address | undefined;

  constructor(address?: Address) {
    this._address = address;
  }

  public async deploy(config: Config): Promise<Address> {
    if (this.address) {
      // throw? TODO
      console.warn(`Deployable already has address ${this.address}`);
    }
    return (this._address = await deployContract(
      config,
      this.buildParameters(config),
    ));
  }

  public get address() {
    return this._address;
  }

  public at(address: Address) {
    this._address = address;
    return this;
  }

  public buildParameters(_config: Config): GenericDeployableParams {
    throw new DeployableParametersUnspecifiedError();
  }
}
