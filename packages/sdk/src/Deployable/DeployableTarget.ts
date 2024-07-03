import { deployContract } from '@wagmi/core';
import type { Address, Hash, WaitForTransactionReceiptParameters } from 'viem';
import { DeployableAlreadyDeployedError } from '../errors';
import { getDeployedContractAddress } from '../utils';
import {
  Deployable,
  type DeployableOptions,
  type DeployablePayloadOrAddress,
} from './Deployable';

export class DeployableTarget<Payload = unknown> extends Deployable<Payload> {
  readonly isBase: boolean;
  constructor(
    options: DeployableOptions,
    payload: DeployablePayloadOrAddress<Payload>,
    isBase = false,
  ) {
    super(options, payload);
    this.isBase = isBase;
  }

  public override async deploy(
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

  public override async deployRaw(
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
}
