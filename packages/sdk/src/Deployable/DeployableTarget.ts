import {
  type aCloneableAbi,
  readACloneableGetComponentInterface,
  readACloneableSupportsInterface,
} from '@boostxyz/evm';
import { deployContract } from '@wagmi/core';
import {
  type Abi,
  type Address,
  type Hash,
  type Hex,
  type WaitForTransactionReceiptParameters,
  isAddress,
  isAddressEqual,
  zeroAddress,
} from 'viem';
import {
  DeployableAlreadyDeployedError,
  DeployableMissingPayloadError,
} from '../errors';
import { type ReadParams, RegistryType } from '../utils';
import {
  Deployable,
  type DeployableOptions,
  type DeployablePayloadOrAddress,
} from './Deployable';

/**
 * A base class representing a generic base Boost Protocol target contract, extended by Actions, AllowLists, Budgets, Incentives, and Validators.
 *
 * @export
 * @class DeployableTarget
 * @typedef {DeployableTarget}
 * @template [Payload=unknown]
 * @extends {Deployable<Payload>}
 */
export class DeployableTarget<
  Payload,
  ContractAbi extends Abi,
> extends Deployable<Payload, ContractAbi> {
  /**
   * A static property representing a map of stringified chain ID's to the address of the base implementation on chain, used when cloning base contracts.
   *
   * @static
   * @readonly
   * @type {Record<string, Address>}
   */
  static readonly bases: Record<number, Address> = {};
  /**
   * The target's registry type.
   *
   * @static
   * @readonly
   * @type {RegistryType}
   */
  static readonly registryType: RegistryType = RegistryType.ACTION;
  /**
   * A property asserting that the protocol should eiher clone and initialize a new target from the base implementation, or re-use an existing contract without initializing.
   *
   * @readonly
   * @type {boolean}
   */
  readonly _isBase: boolean = true;
  public get isBase() {
    if (
      !!this.address &&
      Object.values(this.bases).some((base) =>
        // biome-ignore lint/style/noNonNullAssertion: won't evaluate this if address checked and defined above
        isAddressEqual(this.address!, base),
      )
    )
      return true;
    return this._isBase;
  }

  /**
   * Creates an instance of DeployableTarget.
   *
   * @constructor
   * @param {DeployableOptions} options
   * @param {DeployablePayloadOrAddress<Payload>} payload - Either a given implementation's initialization payload, or an address to an existing on chain target.
   * @param {?boolean} [isBase] - A property asserting that the protocol should eiher clone and initialize a new target from the base implementation, or re-use an existing contract without initializing.
   */
  constructor(
    options: DeployableOptions,
    payload?: DeployablePayloadOrAddress<Payload>,
    isBase?: boolean,
  ) {
    super(options, payload);
    // if supplying a custom address, safe enough to assume it is not a base address which makes reusing contracts like budgets easier
    if (
      typeof payload === 'string' &&
      isAddress(payload) &&
      payload !== zeroAddress &&
      !Object.values(this.bases).some((base) => {
        if (!payload || !base) return false;
        return isAddressEqual(payload, base);
      })
    )
      isBase = false;
    if (isBase !== undefined) this._isBase = isBase;
  }

  /**
   * A getter that will return the base implementation's static addresses by numerical chain ID
   *
   * @public
   * @readonly
   * @type {Record<number, Address>}
   */
  public get bases(): Record<number, Address> {
    return (this.constructor as typeof DeployableTarget).bases;
  }

  /**
   * A getter that returns the registry type of the base implementation
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
   * @returns {Promise<this>}
   */
  protected override async deploy(
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
  protected override async deployRaw(
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

  /**
   * Check if the contract supports the given interface
   *
   * @public
   * @async
   * @param {Hex} interfaceId - The interface identifier
   * @param {?ReadParams} [params]
   * @returns {Promise<boolean>} - True if the contract supports the interface
   */
  public async supportsInterface(
    interfaceId: Hex,
    params?: ReadParams<typeof aCloneableAbi, 'supportsInterface'>,
  ) {
    return await readACloneableSupportsInterface(this._config, {
      address: this.assertValidAddress(),
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
      args: [interfaceId],
    });
  }

  /**
   *  Return a cloneable's unique identifier for downstream consumers to differentiate various targets
   *  All implementations must override this function
   *
   * @public
   * @async
   * @param {?ReadParams} [params]
   * @returns {Promise<Hex>}
   */
  public async getComponentInterface(
    params?: ReadParams<typeof aCloneableAbi, 'getComponentInterface'>,
  ) {
    return await readACloneableGetComponentInterface(this._config, {
      address: this.assertValidAddress(),
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
      args: [],
    });
  }

  /**
   * @inheritdoc
   *
   * @protected
   * @template [P=Payload]
   * @param {?P} [_payload]
   * @param {?DeployableOptions} [_options]
   * @returns {[P, DeployableOptions]}
   */
  protected override validateDeploymentConfig<P = Payload>(
    _payload?: P,
    _options?: DeployableOptions,
  ) {
    const payload = _payload || this._payload;
    if (!payload) throw new DeployableMissingPayloadError();
    return super.validateDeploymentConfig(payload, _options) as [
      P,
      DeployableOptions,
    ];
  }
}
