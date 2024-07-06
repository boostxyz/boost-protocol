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
  constructor(
    options: DeployableOptions,
    payload: DeployablePayloadOrAddress<Payload>,
    isBase?: boolean,
  ) {
    super(options, payload);
    // mainly for boost creation, if we're not explicitly stating that we're targeting a base contract, attempt to infer
    // if we're targeting a predeployed contract, and base isn't explicitly true, mark it as false so it doesn't clone+initialize
    // if we're supplying a payload with which to clone+initialize, base should be true
    if (isBase === undefined) {
      if (typeof payload === 'string') {
        this.isBase = false;
      } else {
        this.isBase = true;
      }
    } else this.isBase = isBase;
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
