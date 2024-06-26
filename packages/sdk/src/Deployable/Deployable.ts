import {
  type Config as WagmiConfig,
  deployContract,
  getClient,
} from '@wagmi/core';
import type { Account, Address, Hash, Hex } from 'viem';
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

export interface DeployableConfig extends WagmiConfig {
  account?: Account;
}
export class Deployable<Payload = unknown> extends Contract {
  protected _payload: Payload | undefined;
  protected _account?: Account;

  constructor(
    { account, ...config }: DeployableConfig,
    options: DeployableOptions<Payload>,
  ) {
    if (typeof options === 'string') {
      super(config, options as Address);
    } else {
      super(config, undefined);
      this._payload = options as Payload;
    }
    if (account) this._account = account;
  }

  get payload() {
    return this._payload;
  }

  public withPayload(payload: Payload) {
    this._payload = payload;
    return this;
  }

  public async deploy(
    _payload?: Payload,
    _config?: DeployableConfig,
  ): Promise<Hash> {
    if (this.address) throw new DeployableAlreadyDeployedError(this.address);
    const config = _config || this._config;
    const payload = _payload || this._payload;
    const account = _config?.account || this._account;
    return await deployContract(config, {
      ...this.buildParameters(payload),
      ...(account ? { account } : {}),
    });
  }

  public buildParameters(
    _payload?: Payload,
    _config?: DeployableConfig,
  ): GenericDeployableParams {
    throw new DeployableBuildParametersUnspecifiedError();
  }

  public validateDeploymentConfig(
    _payload?: Payload,
    _config?: DeployableConfig,
  ) {
    const config = _config || this._config;
    if (!config) throw new DeployableWagmiConfigurationRequiredError();
    const payload = _payload || this._payload;
    if (!payload) throw new DeployableMissingPayloadError();
    return [payload, config] as [Payload, WagmiConfig];
  }
}
