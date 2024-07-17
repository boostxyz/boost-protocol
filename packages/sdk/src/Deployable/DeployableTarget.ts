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

/**
 * Description placeholder
 *
 * @export
 * @class DeployableTarget
 * @typedef {DeployableTarget}
 * @template [Payload=unknown]
 * @extends {Deployable<Payload>}
 */
export class DeployableTarget<Payload = unknown> extends Deployable<Payload> {
  /**
   * Description placeholder
   *
   * @static
   * @readonly
   * @type {Address}
   */
  static readonly base: Address = zeroAddress;
  /**
   * Description placeholder
   *
   * @static
   * @readonly
   * @type {RegistryType}
   */
  static readonly registryType: RegistryType = RegistryType.ACTION;
  /**
   * Description placeholder
   *
   * @readonly
   * @type {boolean}
   */
  readonly isBase: boolean = true;

  /**
   * Creates an instance of DeployableTarget.
   *
   * @constructor
   * @param {DeployableOptions} options
   * @param {DeployablePayloadOrAddress<Payload>} payload
   * @param {?boolean} [isBase]
   */
  constructor(
    options: DeployableOptions,
    payload: DeployablePayloadOrAddress<Payload>,
    isBase?: boolean,
  ) {
    super(options, payload);
    if (isBase !== undefined) this.isBase = isBase;
  }

  /**
   * Description placeholder
   *
   * @public
   * @readonly
   * @type {Address}
   */
  public get base(): Address {
    return (this.constructor as typeof DeployableTarget).base;
  }

  /**
   * Description placeholder
   *
   * @public
   * @readonly
   * @type {RegistryType}
   */
  public get registryType(): RegistryType {
    return (this.constructor as typeof DeployableTarget).registryType;
  }

  /**
   * @inheritdoc
   *
   * @public
   * @async
   * @param {?Payload} [payload]
   * @param {?DeployableOptions} [options]
   * @param {?Omit<WaitForTransactionReceiptParameters, 'hash'>} [waitParams]
   * @returns {unknown}
   */
  public override async deploy(
    payload?: Payload,
    options?: DeployableOptions,
    waitParams?: Omit<WaitForTransactionReceiptParameters, 'hash'>,
  ) {
    await super.deploy(payload, options, waitParams);
    this.assertValidAddress();
    return this;
  }

  /**
   * @inheritdoc
   *
   * @public
   * @async
   * @param {?Payload} [_payload]
   * @param {?DeployableOptions} [_options]
   * @returns {Promise<Hash>}
   */
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
      // Deployable targets don't construct with arguments, they initialize with encoded payloads
      args: [],
    });
  }
}
