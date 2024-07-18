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

/**
 * Description placeholder
 *
 * @export
 * @typedef {GenericDeployableParams}
 */
export type GenericDeployableParams = Omit<
  Parameters<typeof deployContract>[1],
  'args'
> & {
  args: [Hex, ...Array<Hex>];
};

/**
 * Description placeholder
 *
 * @export
 * @typedef {DeployablePayloadOrAddress}
 * @template [Payload=unknown]
 */
export type DeployablePayloadOrAddress<Payload = unknown> = Payload | Address;

/**
 * Description placeholder
 *
 * @export
 * @interface DeployableOptions
 * @typedef {DeployableOptions}
 */
export interface DeployableOptions {
  /**
   * Description placeholder
   *
   * @type {Config}
   */
  config: Config;
  /**
   * Description placeholder
   *
   * @type {?Account}
   */
  account?: Account;
}
/**
 * Description placeholder
 *
 * @export
 * @class Deployable
 * @typedef {Deployable}
 * @template [Payload=unknown]
 * @extends {Contract}
 */
export class Deployable<Payload = unknown> extends Contract {
  /**
   * Description placeholder
   *
   * @protected
   * @type {(Payload | undefined)}
   */
  protected _payload: Payload | undefined;
  /**
   * Description placeholder
   *
   * @protected
   * @type {?Account}
   */
  protected _account?: Account;

  /**
   * Creates an instance of Deployable.
   *
   * @constructor
   * @param {DeployableOptions} param0
   * @param {Account} param0.account
   * @param {Config} param0.config
   * @param {DeployablePayloadOrAddress<Payload>} payload
   */
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

  /**
   * Description placeholder
   *
   * @readonly
   * @type {Payload}
   */
  get payload() {
    return this._payload;
  }

  /**
   * Description placeholder
   *
   * @public
   * @param {Payload} payload
   * @returns {this}
   */
  public withPayload(payload: Payload) {
    this._payload = payload;
    return this;
  }

  /**
   * Description placeholder
   *
   * @public
   * @async
   * @param {?Payload} [_payload]
   * @param {?DeployableOptions} [_options]
   * @param {?Omit<WaitForTransactionReceiptParameters, 'hash'>} [waitParams]
   * @returns {unknown}
   */
  public async deploy(
    _payload?: Payload,
    _options?: DeployableOptions,
    waitParams?: Omit<WaitForTransactionReceiptParameters, 'hash'>,
  ) {
    const config = _options?.config || this._config;
    const address = await getDeployedContractAddress(
      config,
      this.deployRaw(_payload, _options),
      waitParams,
    );
    this._address = address;
    return this;
  }

  /**
   * Description placeholder
   *
   * @public
   * @async
   * @param {?Payload} [_payload]
   * @param {?DeployableOptions} [_options]
   * @returns {Promise<Hash>}
   */
  public async deployRaw(
    _payload?: Payload,
    _options?: DeployableOptions,
  ): Promise<Hash> {
    if (this.address) throw new DeployableAlreadyDeployedError(this.address);
    const [payload, options] = this.validateDeploymentConfig(
      _payload,
      _options,
    );
    return await deployContract(options.config, {
      ...this.buildParameters(payload),
      ...this.optionallyAttachAccount(options.account),
    });
  }

  /**
   * Description placeholder
   *
   * @protected
   * @param {?Account} [account]
   * @returns {({ account: Account; } | { account?: undefined; })}
   */
  protected optionallyAttachAccount(account?: Account) {
    if (account) return { account };
    return this._account ? { account: this._account } : {};
  }

  /**
   * Description placeholder
   *
   * @public
   * @param {?Payload} [_payload]
   * @param {?DeployableOptions} [_options]
   * @returns {GenericDeployableParams}
   */
  public buildParameters(
    _payload?: Payload,
    _options?: DeployableOptions,
  ): GenericDeployableParams {
    throw new DeployableBuildParametersUnspecifiedError();
  }

  /**
   * Description placeholder
   *
   * @protected
   * @template [P=Payload]
   * @param {?P} [_payload]
   * @param {?DeployableOptions} [_options]
   * @returns {[P, DeployableOptions]}
   */
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
    console.log('!!!!!!!!!', payload);
    if (!payload) throw new DeployableMissingPayloadError();
    return [payload, options] as [P, DeployableOptions];
  }
}
