import { type Config, deployContract } from '@wagmi/core';
import type {
  Account,
  Address,
  Hash,
  Hex,
  WaitForTransactionReceiptParameters,
} from 'viem';
import {
  DeployableAlreadyDeployedError,
  DeployableBuildParametersUnspecifiedError,
  DeployableMissingPayloadError,
  DeployableWagmiConfigurationRequiredError,
} from '../errors';
import { getDeployedContractAddress } from '../utils';
import { Contract } from './Contract';

export type GenericDeployableParams = Omit<
  Parameters<typeof deployContract>[1],
  'args'
> & {
  args: [Hex, ...Array<Hex>];
};

export type DeployablePayloadOrAddress<Payload = unknown> = Payload | Address;

export interface DeployableOptions {
  config: Config;
  account?: Account;
}
export class Deployable<Payload = unknown> extends Contract {
  protected _payload: Payload | undefined;
  protected _account?: Account;

  constructor(
    { account, config }: DeployableOptions,
    payload: DeployablePayloadOrAddress<Payload>,
  ) {
    if (typeof payload === 'string') {
      super(config, payload as Address);
    } else {
      super(config, undefined);
      this._payload = payload as Payload;
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
    _options?: DeployableOptions,
    waitParams: Omit<WaitForTransactionReceiptParameters, 'hash'> = {},
  ): Promise<Address> {
    const config = _options?.config || this._config;
    const address = await getDeployedContractAddress(
      config,
      this.deployRaw(_payload, _options),
      waitParams,
    );
    this._address = address;
    return address;
  }

  public async deployRaw(
    _payload?: Payload,
    _options?: DeployableOptions,
  ): Promise<Hash> {
    if (this.address) throw new DeployableAlreadyDeployedError(this.address);
    const payload = _payload || this._payload;
    const config = _options?.config || this._config;
    return await deployContract(config, {
      ...this.buildParameters(payload),
      ...this.optionallyAttachAccount(_options?.account),
    });
  }

  protected optionallyAttachAccount(account?: Account) {
    if (account) return { account };
    return this._account ? { account: this._account } : {};
  }

  protected buildParameters(
    _payload?: Payload,
    _options?: DeployableOptions,
  ): GenericDeployableParams {
    throw new DeployableBuildParametersUnspecifiedError();
  }

  protected validateDeploymentConfig<P = Payload>(
    _payload?: P,
    _options?: DeployableOptions,
  ) {
    const options = _options || {
      config: this._config,
      account: this._account,
    };
    if (!options) throw new DeployableWagmiConfigurationRequiredError();
    const payload = _payload || this._payload;
    if (!payload) throw new DeployableMissingPayloadError();
    return [payload, options] as [P, DeployableOptions];
  }
}
