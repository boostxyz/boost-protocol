import {
  deployContract,
  waitForTransactionReceipt,
  writeContract,
} from '@wagmi/core';
import type { Address, Hash, WaitForTransactionReceiptParameters } from 'viem';
import { DeployableAlreadyDeployedError } from '../errors';
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

  public async initialize(
    _payload?: Payload,
    _options?: DeployableOptions,
    waitParams: Omit<WaitForTransactionReceiptParameters, 'hash'> = {},
  ) {
    const payload = _payload || this._payload;
    const config = _options?.config || this._config;
    console.log(payload);
    const { abi, args } = this.buildParameters(payload);
    console.log(args);
    const hash = await writeContract(config, {
      ...this.optionallyAttachAccount(_options?.account),
      abi,
      args,
      functionName: 'initialize',
      address: this.assertValidAddress(),
    });
    await waitForTransactionReceipt(config, {
      ...waitParams,
      hash,
    });
  }

  public override async deploy(
    payload?: Payload,
    options?: DeployableOptions,
    waitParams?: Omit<WaitForTransactionReceiptParameters, 'hash'>,
  ): Promise<Address> {
    await super.deploy(payload, options, waitParams);
    return this.assertValidAddress();
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
