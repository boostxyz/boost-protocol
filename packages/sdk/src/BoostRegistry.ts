import {
  boostRegistryAbi,
  readBoostRegistryGetBaseImplementation,
  readBoostRegistryGetCloneIdentifier,
  readBoostRegistryGetClones,
  simulateBoostRegistryDeployClone,
  simulateBoostRegistryRegister,
  writeBoostRegistryDeployClone,
  writeBoostRegistryRegister,
} from '@boostxyz/evm';
import { bytecode } from '@boostxyz/evm/artifacts/contracts/BoostRegistry.sol/BoostRegistry.json';
import {
  type Address,
  type ContractEventName,
  type Hex,
  isAddress,
  zeroAddress,
} from 'viem';
import { BoostRegistry as BoostRegistryBases } from '../dist/deployments.json';
import {
  Deployable,
  type DeployableOptions,
  type GenericDeployableParams,
} from './Deployable/Deployable';
import type { DeployableTarget } from './Deployable/DeployableTarget';
import {
  type GenericLog,
  type HashAndSimulatedResult,
  type ReadParams,
  type RegistryType,
  type WriteParams,
  assertValidAddressByChainId,
} from './utils';

/**
 * The ABI of the BoostRegistry contract, if needed for low level operations
 *
 * @type {typeof boostRegistryAbi}
 */
export { boostRegistryAbi };

/**
 * The address of the deployed `BoostRegistry` instance. In prerelease mode, this will be its sepolia address
 *
 * @type {Address}
 */
export const BOOST_REGISTRY_ADDRESS =
  (BoostRegistryBases as Record<string, Address>)[__DEFAULT_CHAIN_ID__] ||
  zeroAddress;

/**
 * The fixed addresses for the deployed Boost Registry.
 * By default, `new BoostRegistry` will use the address deployed to the currently connected chain, or `BOOST_REGISTRY_ADDRESS` if not provided.
 *
 * @type {Record<number, Address>}
 */
export const BOOST_REGISTRY_ADDRESSES: Record<number, Address> = {
  ...(BoostRegistryBases as Record<number, Address>),
  31337: import.meta.env.VITE_BOOST_REGISTRY_ADDRESS,
};

/**
 * A record of `BoostRegistry` event names to `AbiEvent` objects for use with `getLogs`
 *
 * @export
 * @typedef {BoostRegistryLog}
 * @template {ContractEventName<typeof boostRegistryAbi>} [event=ContractEventName<
 *     typeof boostRegistryAbi
 *   >]
 */
export type BoostRegistryLog<
  event extends ContractEventName<typeof boostRegistryAbi> = ContractEventName<
    typeof boostRegistryAbi
  >,
> = GenericLog<typeof boostRegistryAbi, event>;

/**
 * Instantiation options for a previously deployed Boost Registry
 *
 * @export
 * @interface BoostRegistryDeployedOptions
 * @typedef {BoostRegistryDeployedOptions}
 * @extends {DeployableOptions}
 */
export interface BoostRegistryDeployedOptions extends DeployableOptions {
  /**
   * The address for a Boost Registry, if different than `BOOST_REGISTRY_ADDRESS`
   *
   * @type {?Address}
   */
  address?: Address;
}

/**
 * A typeguard to determine if instantiation is using a custom address.
 *
 * @param {*} opts
 * @returns {opts is BoostRegistryDeployedOptions}
 */
function isBoostRegistryDeployed(
  // biome-ignore lint/suspicious/noExplicitAny: type guard
  opts: any,
): opts is BoostRegistryDeployedOptions {
  return opts.address && isAddress(opts.address);
}

/**
 * The Boost Registry does not take any construction arguments, so if you'd like to deploy a new Boost Registry, pass an explicit null to the `address` field.
 *
 * @export
 * @interface BoostRegistryOptionsWithPayload
 * @typedef {BoostRegistryOptionsWithPayload}
 * @extends {DeployableOptions}
 */
export interface BoostRegistryOptionsWithPayload extends DeployableOptions {
  /**
   *
   * @type {null}
   */
  address: null;
}

/**
 * A typeguard to determine if the user is intending to deploy a new Boost Registry before usage
 *
 * @param {*} opts
 * @returns {opts is BoostRegistryOptionsWithPayload}
 */
function isBoostRegistryDeployable(
  // biome-ignore lint/suspicious/noExplicitAny: type guard
  opts: any,
): opts is BoostRegistryOptionsWithPayload {
  return opts.address === null;
}

/**
 * Instantiation options for a Boost Registry.
 *
 * @example
 * To target Boost's Registry, omit the address field.
 * Otherwise, supply a custom address to a previously deployed custom Boost Registry.
 * You can also pass `{ address: null }` if you are intending to deploy a new Boost Registry.
 * ```ts
 * let registry = new BoostRegistry({ config, account })
 * // or
 * registry = new BoostRegistry({ config, account, address: CUSTOM_ADDRESS })
 * // or
 * registry = new BoostRegistry({ config, account, address: null })
 * await registry.deploy()
 * ```
 *
 * @export
 * @typedef {BoostRegistryConfig}
 */
export type BoostRegistryConfig =
  | BoostRegistryDeployedOptions
  | BoostRegistryOptionsWithPayload;

/**
 * Constructs a new Boost Registry. A registry for base implementations and cloned instances.
 * This contract is used to register base implementations and deploy new instances of those implementations for use within the Boost protocol.
 *
 * @see {@link BoostRegistryConfig}
 * @export
 * @class BoostRegistry
 * @typedef {BoostRegistry}
 * @extends {Deployable<never[]>}
 */
export class BoostRegistry extends Deployable<
  never[],
  typeof boostRegistryAbi
> {
  /**
   * A static property representing a map of stringified chain ID's to the address of the deployed implementation on chain
   *
   * @static
   * @readonly
   * @type {Record<string, Address>}
   */
  static readonly addresses: Record<number, Address> = BOOST_REGISTRY_ADDRESSES;

  /**
   * A getter that will return Boost registry's static addresses by numerical chain ID
   *
   * @public
   * @readonly
   * @type {Record<number, Address>}
   */
  public get addresses(): Record<number, Address> {
    return (this.constructor as typeof BoostRegistry).addresses;
  }

  /**
   * Creates an instance of BoostRegistry.
   *
   * @see {@link BoostRegistryConfig}
   * @constructor
   * @param {BoostRegistryConfig} param0
   * @param {Config} param0.config - [Wagmi Configuration](https://wagmi.sh/core/api/createConfig)
   * @param {?Account} [param0.account] - [Viem Local Account](https://viem.sh/docs/accounts/local)
   * @param {({ address?: Address; } | {})} param0....options
   */
  constructor({ config, account, ...options }: BoostRegistryConfig) {
    if (isBoostRegistryDeployed(options) && options.address) {
      super({ account, config }, options.address);
    } else if (isBoostRegistryDeployable(options)) {
      super({ account, config }, []);
    } else {
      const { address } = assertValidAddressByChainId(
        config,
        BOOST_REGISTRY_ADDRESSES,
      );
      super({ account, config }, address);
    }
  }

  /**
   *  Register a new base implementation of a given type
   *
   * @public
   * @async
   * @param {RegistryType} registryType - The base type for the implementation
   * @param {string} name - A name for the implementation (must be unique within the given type)
   * @param {Address} implementation - The address of the implementation contract
   * @param {?WriteParams} [params] - Optional params to provide the underlying Viem contract call
   * @returns {Promise<void>}
   * @example
   * ```ts
   * await registry.register(ContractAction.registryType, 'ContractAction', ContractAction.base)
   * ```
   */
  public async register(
    registryType: RegistryType,
    name: string,
    implementation: Address,
    params?: WriteParams<typeof boostRegistryAbi, 'register'>,
  ) {
    return await this.awaitResult(
      this.registerRaw(registryType, name, implementation, params),
    );
  }

  /**
   * @see {@link register}
   * @public
   * @async
   * @param {RegistryType} registryType
   * @param {string} name
   * @param {Address} implementation
   * @param {?WriteParams} [params]
   * @returns {Promise<{ hash: `0x${string}`; result: void; }>}
   */
  public async registerRaw(
    registryType: RegistryType,
    name: string,
    implementation: Address,
    params?: WriteParams<typeof boostRegistryAbi, 'register'>,
  ) {
    const { request, result } = await simulateBoostRegistryRegister(
      this._config,
      {
        ...assertValidAddressByChainId(
          this._config,
          this.addresses,
          params?.chain?.id || params?.chainId,
        ),
        args: [registryType, name, implementation],
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      },
    );
    const hash = await writeBoostRegistryRegister(this._config, request);
    return { hash, result };
  }

  /**
   * Initialize a new instance of a registered base implementation, returning the provided target with a new address set on it.
   * This method is the same as `clone`, but serves to make its function more obvious as to why you'd need to use it.
   *
   * @public
   * @async
   * @template {DeployableTarget} Target
   * @param {string} displayName - The display name for the clone
   * @param {Target} target - An instance of a target contract to clone and initialize
   * @param {?WriteParams} [params]
   * @returns {Promise<Target>} - The provided instance, but with a new address attached.
   * biome-ignore lint/suspicious/noExplicitAny: any deployable target will suffice
   */
  public initialize<Target extends DeployableTarget<any, any>>(
    displayName: string,
    target: Target,
    params?: WriteParams<typeof boostRegistryAbi, 'deployClone'>,
  ): Promise<Target> {
    return this.clone(displayName, target, params);
  }

  /**
   * Deploy a new instance of a registered base implementation, returning the provided target with a new address set on it.
   *
   * @public
   * @async
   * @template {DeployableTarget} Target
   * @param {string} displayName - The display name for the clone
   * @param {Target} target - An instance of a target contract to clone and initialize
   * @param {?WriteParams} [params]
   * @returns {Promise<Target>} - The provided instance, but with a new address attached.
   * biome-ignore lint/suspicious/noExplicitAny: any deployable target will suffice
   */
  public async clone<Target extends DeployableTarget<any, any>>(
    displayName: string,
    target: Target,
    params?: WriteParams<typeof boostRegistryAbi, 'deployClone'>,
  ): Promise<Target> {
    const instance = await this.deployClone(displayName, target, params);
    return target.at(instance);
  }

  /**
   *
   * @see {@link clone}
   * @public
   * @async
   * @template {DeployableTarget} Target
   * @param {string} displayName
   * @param {Target} target
   * @param {?WriteParams} [params]
   * @returns {Promise<Address>}
   * biome-ignore lint/suspicious/noExplicitAny: any deployable target will suffice
   */
  public async deployClone<Target extends DeployableTarget<any, any>>(
    displayName: string,
    target: Target,
    params?: WriteParams<typeof boostRegistryAbi, 'deployClone'>,
  ): Promise<Address> {
    return await this.awaitResult(
      this.deployCloneRaw(displayName, target, params),
    );
  }

  /**
   * @see {@link clone}
   * @public
   * @async
   * @param {string} displayName
   * @param {DeployableTarget} target
   * @param {?WriteParams} [params]
   * @returns {Promise<{ hash: Hex, result: Address }>} - The transaction hash
   * biome-ignore lint/suspicious/noExplicitAny: any deployable target will suffice
   */
  public async deployCloneRaw<Target extends DeployableTarget<any, any>>(
    displayName: string,
    target: Target,
    params?: WriteParams<typeof boostRegistryAbi, 'deployClone'>,
  ): Promise<HashAndSimulatedResult<Address>> {
    const payload = target.buildParameters(undefined, {
      config: this._config,
      account: this._account,
    });
    const { address: baseAddress } = assertValidAddressByChainId(
      this._config,
      target.bases,
      params?.chain?.id || params?.chainId,
    );
    const { request, result } = await simulateBoostRegistryDeployClone(
      this._config,
      {
        ...assertValidAddressByChainId(
          this._config,
          this.addresses,
          params?.chain?.id || params?.chainId,
        ),
        args: [target.registryType, baseAddress, displayName, payload.args[0]],
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      },
    );
    const hash = await writeBoostRegistryDeployClone(this._config, request);
    return { hash, result };
  }

  /**
   * Get the address of a registered base implementation.
   * This function will revert if the implementation is not registered
   *
   * @public
   * @async
   * @param {Hex} identifier - The unique identifier for the implementation (see {getIdentifier})
   * @param {?ReadParams} [params]
   * @returns {Promise<Address>} - The address of the implementation
   */
  public async getBaseImplementation(
    identifier: Hex,
    params?: ReadParams<typeof boostRegistryAbi, 'getBaseImplementation'>,
  ) {
    return await readBoostRegistryGetBaseImplementation(this._config, {
      ...assertValidAddressByChainId(
        this._config,
        this.addresses,
        params?.chainId,
      ),
      args: [identifier],
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  /**
   * Get the address of a deployed clone by its identifier
   *
   * @public
   * @async
   * @param {Hex} identifier - The unique identifier for the deployed clone (see {getCloneIdentifier})
   * @param {?ReadParams} [params]
   * @returns {Promise<Address>} - The address of the deployed clone
   */
  public async getClone(
    identifier: Hex,
    params?: ReadParams<typeof boostRegistryAbi, 'getClone'>,
  ) {
    return await readBoostRegistryGetBaseImplementation(this._config, {
      ...assertValidAddressByChainId(
        this._config,
        this.addresses,
        params?.chainId,
      ),
      args: [identifier],
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  /**
   * Get the list of identifiers of deployed clones for a given deployer
   *
   * @public
   * @async
   * @param {Address} deployer - The address of the deployer
   * @param {?ReadParams} [params]
   * @returns {Promise<Hex[]>} - The list of deployed clones for the given deployer
   */
  public async getClones(
    deployer: Address,
    params?: ReadParams<typeof boostRegistryAbi, 'getClones'>,
  ) {
    return await readBoostRegistryGetClones(this._config, {
      ...assertValidAddressByChainId(
        this._config,
        this.addresses,
        params?.chainId,
      ),
      args: [deployer],
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  /**
   * Build the identifier for a clone of a base implementation
   *
   * @public
   * @async
   * @param {RegistryType} registryType - The base type for the implementation
   * @param {Address} base - The address of the base implementation
   * @param {Address} deployer - The address of the deployer
   * @param {string} displayName - The display name of the clone
   * @param {?ReadParams} [params]
   * @returns {Promise<Hex>} - The unique identifier for the clone
   */
  public async getCloneIdentifier(
    registryType: RegistryType,
    base: Address,
    deployer: Address,
    displayName: string,
    params?: ReadParams<typeof boostRegistryAbi, 'getCloneIdentifier'>,
  ) {
    return await readBoostRegistryGetCloneIdentifier(this._config, {
      ...assertValidAddressByChainId(
        this._config,
        this.addresses,
        params?.chainId,
      ),
      args: [registryType, base, deployer, displayName],
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  /**
   * Build the identifier for a base implementation
   *
   * @public
   * @async
   * @param {RegistryType} registryType - The base type for the implementation
   * @param {string} displayName - The name of the implementation
   * @param {?ReadParams} [params]
   * @returns {Promise<Hex>} - The unique identifier for the implementation
   */
  public async getIdentifier(
    registryType: RegistryType,
    displayName: string,
    params?: ReadParams<typeof boostRegistryAbi, 'getIdentifier'>,
  ) {
    return await readBoostRegistryGetCloneIdentifier(this._config, {
      ...assertValidAddressByChainId(
        this._config,
        this.addresses,
        params?.chainId,
      ),
      args: [registryType, displayName],
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  /**
   * @inheritdoc
   *
   * @public
   * @param {?never[]} [_payload]
   * @param {?DeployableOptions} [_options]
   * @returns {GenericDeployableParams}
   */
  public override buildParameters(
    _payload?: never[],
    _options?: DeployableOptions,
  ): GenericDeployableParams {
    const [, options] = this.validateDeploymentConfig([], _options);
    return {
      abi: boostRegistryAbi,
      bytecode: bytecode as Hex,
      // biome-ignore lint/suspicious/noExplicitAny: Registry doesn't construct or initialize
      args: [] as any,
      ...this.optionallyAttachAccount(options.account),
    };
  }
}
