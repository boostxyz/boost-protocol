import { type Config, deployContract } from '@wagmi/core';
import type { Address, Hex } from 'viem';
import {
  DeployableAlreadyDeployedError,
  DeployableParametersUnspecifiedError,
} from '../errors';
import { Contract } from './Contract';

export type GenericDeployableParams = Omit<
  Parameters<typeof deployContract>[1],
  'args'
> & {
  args: [Hex, ...Array<Hex>];
};

export type DeployableOptions<Payload = unknown> = Payload | Address;

export class Deployable<Payload = unknown> extends Contract {
  protected _payload: Payload | undefined;

  constructor(config: Config, options: DeployableOptions<Payload>) {
    if (typeof options === 'string') {
      super(config, options as Address);
    } else {
      super(config, undefined);
      this._payload = options as Payload;
    }
  }

  public async deploy(): Promise<Address> {
    if (this.address) throw new DeployableAlreadyDeployedError(this.address);
    return (this._address = await deployContract(
      this._config,
      this.buildParameters(this._config),
    ));
  }

  public buildParameters(payload: Payload): GenericDeployableParams {
    throw new DeployableParametersUnspecifiedError();
  }
}
