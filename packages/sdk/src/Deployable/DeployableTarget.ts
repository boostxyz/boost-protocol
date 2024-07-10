import { RegistryType } from '@boostxyz/evm';
import {
  deployContract,
  waitForTransactionReceipt,
  writeContract,
} from '@wagmi/core';
import {
  type Address,
  type Hash,
  type WaitForTransactionReceiptParameters,
  zeroAddress,
  zeroHash,
} from 'viem';
import { DeployableAlreadyDeployedError } from '../errors';
import {
  Deployable,
  type DeployableOptions,
  type DeployablePayloadOrAddress,
} from './Deployable';

export class DeployableTarget<Payload = unknown> extends Deployable<Payload> {
  readonly base: string = zeroAddress;
  readonly isBase: boolean = true;
  readonly registryType: RegistryType = RegistryType.ACTION;
  constructor(
    options: DeployableOptions,
    payload: DeployablePayloadOrAddress<Payload>,
    isBase?: boolean,
  ) {
    super(options, payload);
    if (isBase !== undefined) this.isBase = isBase;
  }

  public override async deploy(
    payload?: Payload,
    options?: DeployableOptions,
    waitParams?: Omit<WaitForTransactionReceiptParameters, 'hash'>,
  ) {
    await super.deploy(payload, options, waitParams);
    this.assertValidAddress();
    return this;
  }

  public override async deployRaw(
    _payload?: Payload,
    _options?: DeployableOptions,
  ): Promise<Hash> {
    if (this.address) throw new DeployableAlreadyDeployedError(this.address);
    const payload = _payload || this._payload;
    const config = _options?.config || this._config;
    const { args, ...deployment } = this.buildParameters(payload);
    return await deployContract(config, {
      ...deployment,
      ...this.optionallyAttachAccount(_options?.account),
      args: [],
    });
  }
}
