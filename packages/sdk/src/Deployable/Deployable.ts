import { type Config, deployContract } from '@wagmi/core';
import type {
  Abi,
  Account,
  Address,
  ContractEventName,
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
 * A base class representing a deployable contract, contains base implementations for deployment and initialization payload construction.
 *
 * @export
 * @typedef {GenericDeployableParams}
 */
export type GenericDeployableParams = Omit<
  Parameters<typeof deployContract>[1],
  'args' | 'account'
> & {
  args: [Hex, ...Array<Hex>];
  account?: Account;
};

/**
 * A generic type that encapsulates either an initialization payload for a contract, or a valid address for a previously deployed contract.
 *
 * @export
 * @typedef {DeployablePayloadOrAddress}
 * @template [Payload=unknown]
 */
export type DeployablePayloadOrAddress<Payload = unknown> = Payload | Address;

/**
 * Instantion options for the base deployable.
 *
 * @export
 * @interface DeployableOptions
 * @typedef {DeployableOptions}
 */
export interface DeployableOptions {
  /**
   * [Wagmi Configuration](https://wagmi.sh/core/api/createConfig)
   *
   * @see {@link Config}
   * @type {Config}
   */
  config: Config;
  /**
   * [Viem Local Account](https://viem.sh/docs/accounts/local), required if in a Node environment
   *
   * @see {@link Account}
   * @type {?Account}
   */
  account?: Account;
}

/**
 * A generic deployable contract that encapsulates common operations related to contract deployment
 *
 * @export
 * @class Deployable
 * @typedef {Deployable}
 * @template [Payload=unknown]
 * @template {Abi} [ContractAbi=[]]
 * @template {ContractEventName<ContractAbi>} [ContractEvent=ContractEventName<ContractAbi>]
 * @extends {Contract<ContractAbi, ContractEvent>}
 */
export class Deployable<
  Payload,
  ContractAbi extends Abi,
> extends Contract<ContractAbi> {
  /**
   * The deployable payload used either for contract construction or initialization
   *
   * @protected
   * @type {(Payload | undefined)}
   */
  protected _payload: Payload | undefined;
  /**
   * If it exists, [Viem Local Account](https://viem.sh/docs/accounts/local), if in a Node environment
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
   * @param {?Account} [param0.account]
   * @param {Config} param0.config
   * @param {DeployablePayloadOrAddress<Payload>} payload
   */
  constructor(
    { account, config }: DeployableOptions,
    payload?: DeployablePayloadOrAddress<Payload>,
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
   * Returns the attached deployable payload, if it exists
   *
   * @readonly
   * @type {Payload}
   */
  get payload() {
    return this._payload;
  }

  /**
   * Attaches a new payload for use with this deployable's initialization
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
   * High level deployment function to deploy and await the contract address.
   *
   * @public
   * @async
   * @param {?Payload} [_payload]
   * @param {?DeployableOptions} [_options]
   * @param {?Omit<WaitForTransactionReceiptParameters, 'hash'>} [waitParams] - See [viem.WaitForTransactionReceipt](https://v1.viem.sh/docs/actions/public/waitForTransactionReceipt.html#waitfortransactionreceipt)
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
   * The lower level contract deployment function that does not await for the transaction receipt.
   *
   * @public
   * @async
   * @param {?Payload} [_payload]
   * @param {?DeployableOptions} [_options]
   * @returns {Promise<Hash>}
   * @throws {@link DeployableAlreadyDeployedError}
   * @throws {@link DeployableWagmiConfigurationRequiredError}
   * @throws {@link DeployableMissingPayloadError}
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
   * Internal function to attach the connected account to write methods to avoid manually passing in an account each call.
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
   * Base parameter constructor, should return a partial `viem.deployContract` parameters shape including abi, bytecode, and arguments, if any.
   * Expected to be overridden by protocol contracts.
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
   * Internal method used to ensure that a Wagmi configuration and payload are always present when deploying.
   *
   * @protected
   * @template [P=Payload]
   * @param {?P} [_payload]
   * @param {?DeployableOptions} [_options]
   * @returns {[P, DeployableOptions]}
   * @throws {@link DeployableWagmiConfigurationRequiredError}
   * @throws {@link DeployableMissingPayloadError}
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
    return [payload, options] as [P, DeployableOptions];
  }
}
