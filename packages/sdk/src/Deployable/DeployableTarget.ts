import {
  type aCloneableAbi,
  readACloneableGetComponentInterface as readACloneableGetComponentInterface,
  readACloneableSupportsInterface,
} from '@boostxyz/evm';
import { deployContract } from '@wagmi/core';
import {
  type Abi,
  type Address,
  type Hash,
  type Hex,
  type WaitForTransactionReceiptParameters,
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
   * A static property representing the address of the base implementation on chain, used when cloning base contracts.
   *
   * @static
   * @readonly
   * @type {Address}
   */
  static readonly base: Address = zeroAddress;
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
  readonly isBase: boolean = true;

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
    payload: DeployablePayloadOrAddress<Payload>,
    isBase?: boolean,
  ) {
    super(options, payload);
    if (isBase !== undefined) this.isBase = isBase;
  }

  /**
   * A getter that will return the base implementation's static address
   *
   * @public
   * @readonly
   * @type {Address}
   */
  public get base(): Address {
    return (this.constructor as typeof DeployableTarget).base;
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

  /**
   * Check if the contract supports the given interface
   *
   * @public
   * @async
   * @param {Hex} interfaceId - The interface identifier
   * @param {?ReadParams<typeof contractActionAbi, 'supportsInterface'>} [params]
   * @returns {unknown} - True if the contract supports the interface
   */
  public async supportsInterface(
    interfaceId: Hex,
    params?: ReadParams<typeof aCloneableAbi, 'supportsInterface'>,
  ) {
    return readACloneableSupportsInterface(this._config, {
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
   * @param {?ReadParams<typeof contractActionAbi, 'getComponentInterface'>} [params]
   * @returns {unknown}
   */
  public async getComponentInterface(
    params?: ReadParams<typeof aCloneableAbi, 'getComponentInterface'>,
  ) {
    return readACloneableGetComponentInterface(this._config, {
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
