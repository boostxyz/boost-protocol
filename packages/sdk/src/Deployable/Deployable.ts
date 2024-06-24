import { type Config, deployContract } from '@wagmi/core';
import type { Address, Hex } from 'viem';
import {
  DeployableAlreadyDeployedError,
  DeployableBuildParametersUnspecifiedError,
  DeployableMissingPayloadError,
  DeployableWagmiConfigurationRequiredError,
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

  get payload() {
    return this._payload;
  }

  public withPayload(payload: Payload) {
    this._payload = payload;
    return this;
  }

  public async deploy(_payload?: Payload, _config?: Config): Promise<Address> {
    if (this.address) throw new DeployableAlreadyDeployedError(this.address);
    const config = _config || this._config;
    const payload = _payload || this._payload;
    return (this._address = await deployContract(
      config,
      this.buildParameters(payload),
    ));
  }

  public buildParameters(
    _payload?: Payload,
    _config?: Config,
  ): GenericDeployableParams {
    throw new DeployableBuildParametersUnspecifiedError();
  }

  public validateDeploymentConfig(_payload?: Payload, _config?: Config) {
    const config = _config || this._config;
    if (!config) throw new DeployableWagmiConfigurationRequiredError();
    const payload = _payload || this._payload;
    if (!payload) throw new DeployableMissingPayloadError();
    return [payload, config] as [Payload, Config];
  }
}
