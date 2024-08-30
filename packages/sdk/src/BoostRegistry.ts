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
import { watchContractEvent } from '@wagmi/core';
import type { ExtractAbiEvent } from 'abitype';
import {
  type Abi,
  type Address,
  type ContractEventName,
  type GetLogsReturnType,
  type Hex,
  getAbiItem,
  isAddress,
} from 'viem';
import { getLogs } from 'viem/actions';
import {
  Deployable,
  type DeployableOptions,
  type GenericDeployableParams,
} from './Deployable/Deployable';
import type { DeployableTarget } from './Deployable/DeployableTarget';
import {
  type GenericLog,
  type GetLogsParams,
  type HashAndSimulatedResult,
  type ReadParams,
  RegistryType,
  type WatchParams,
  type WriteParams,
} from './utils';

export { RegistryType, boostRegistryAbi };

/**
 * The fixed address for the Boost Registry.
 * By default, `new BoostRegistry` will use this address if not otherwise provided.
 *
 * @type {Address}
 */
export const BOOST_REGISTRY_ADDRESS: Address = import.meta.env
  .VITE_BOOST_REGISTRY_ADDRESS;

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
      super({ account, config }, BOOST_REGISTRY_ADDRESS);
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
   * @param {?WriteParams<typeof boostRegistryAbi, 'register'>} [params] - Optional params to provide the underlying Viem contract call
   * @returns {unknown}
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
    return this.awaitResult(
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
   * @param {?WriteParams<typeof boostRegistryAbi, 'register'>} [params]
   * @returns {unknown}
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
        address: this.assertValidAddress(),
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
   * Deploy a new instance of a registered base implementation, returning the provided target with a new address set on it.
   *
   * @public
   * @async
   * @template {DeployableTarget} Target
   * @param {string} displayName - The display name for the clone
   * @param {Target} target - An instance of a target contract to clone and initialize
   * @param {?WriteParams<typeof boostRegistryAbi, 'deployClone'>} [params]
   * @returns {Target} - The provided instance, but with a new address attached.
   */
  public async clone<
    Target extends DeployableTarget<any, Abi> ? infer Target : unknown,
  >(
    displayName: string,
    target: Target,
    params?: WriteParams<typeof boostRegistryAbi, 'deployClone'>,
  ): Target {
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
   * @param {?WriteParams<typeof boostRegistryAbi, 'deployClone'>} [params]
   * @returns {unknown}
   */
  public async deployClone<Target extends DeployableTarget>(
    displayName: string,
    target: Target,
    params?: WriteParams<typeof boostRegistryAbi, 'deployClone'>,
  ): Promise<Address> {
    return this.awaitResult(this.deployCloneRaw(displayName, target, params));
  }

  /**
   * @see {@link clone}
   * @public
   * @async
   * @param {string} displayName
   * @param {DeployableTarget} target
   * @param {?WriteParams<typeof boostRegistryAbi, 'deployClone'>} [params]
   * @returns {unknown} - The transaction hash
   */
  public async deployCloneRaw(
    displayName: string,
    target: DeployableTarget,
    params?: WriteParams<typeof boostRegistryAbi, 'deployClone'>,
  ): Promise<HashAndSimulatedResult<Address>> {
    const payload = target.buildParameters(undefined, {
      config: this._config,
      account: this._account,
    });
    const { request, result } = await simulateBoostRegistryDeployClone(
      this._config,
      {
        address: this.assertValidAddress(),
        args: [
          target.registryType,
          target.base,
          displayName,
          payload.args.at(0)!,
        ],
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
   * @param {?ReadParams<typeof boostRegistryAbi, 'getBaseImplementation'>} [params]
   * @returns {unknown} - The address of the implementation
   */
  public async getBaseImplementation(
    identifier: Hex,
    params?: ReadParams<typeof boostRegistryAbi, 'getBaseImplementation'>,
  ) {
    return readBoostRegistryGetBaseImplementation(this._config, {
      address: this.assertValidAddress(),
      args: [identifier],
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  /**
   * Get the address of a deployed clone by its identifier (index in incentives array)
   *
   * @public
   * @async
   * @param {Hex} identifier - The unique identifier for the deployed clone (see {getCloneIdentifier})
   * @param {?ReadParams<typeof boostRegistryAbi, 'getClone'>} [params]
   * @returns {Promise<Address>} - The address of the deployed clone
   */
  public async getClone(
    identifier: Hex,
    params?: ReadParams<typeof boostRegistryAbi, 'getClone'>,
  ) {
    return readBoostRegistryGetBaseImplementation(this._config, {
      address: this.assertValidAddress(),
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
   * @param {?ReadParams<typeof boostRegistryAbi, 'getClones'>} [params]
   * @returns {Promise<Address[]>} - The list of deployed clones for the given deployer
   */
  public async getClones(
    deployer: Address,
    params?: ReadParams<typeof boostRegistryAbi, 'getClones'>,
  ) {
    return readBoostRegistryGetClones(this._config, {
      address: this.assertValidAddress(),
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
   * @param {?ReadParams<typeof boostRegistryAbi, 'getCloneIdentifier'>} [params]
   * @returns {Promise<Hex>} - The unique identifier for the clone
   */
  public async getCloneIdentifier(
    registryType: RegistryType,
    base: Address,
    deployer: Address,
    displayName: string,
    params?: ReadParams<typeof boostRegistryAbi, 'getCloneIdentifier'>,
  ) {
    return readBoostRegistryGetCloneIdentifier(this._config, {
      address: this.assertValidAddress(),
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
   * @param {?ReadParams<typeof boostRegistryAbi, 'getIdentifier'>} [params]
   * @returns {Promise<Hex>} - The unique identifier for the implementation
   */
  public async getIdentifier(
    registryType: RegistryType,
    displayName: string,
    params?: ReadParams<typeof boostRegistryAbi, 'getIdentifier'>,
  ) {
    return readBoostRegistryGetCloneIdentifier(this._config, {
      address: this.assertValidAddress(),
      args: [registryType, displayName],
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  // /**
  //  * A typed wrapper for (viem.getLogs)[https://viem.sh/docs/actions/public/getLogs#getlogs].
  //  * Accepts `eventName` and `eventNames` as optional parameters to narrow the returned log types.
  //  * @example
  //  * ```ts
  //  * const logs = contract.getLogs({ eventName: 'EventName' })
  //  * const logs = contract.getLogs({ eventNames: ['EventName'] })
  //  * ```
  //  * @public
  //  * @async
  //  * @template {ContractEventName<typeof boostRegistryAbi>} event
  //  * @template {ExtractAbiEvent<
  //  *       typeof boostRegistryAbi,
  //  *       event
  //  *     >} [abiEvent=ExtractAbiEvent<typeof boostRegistryAbi, event>]
  //  * @param {?Omit<
  //  *       GetLogsParams<typeof boostRegistryAbi, event, abiEvent, abiEvent[]>,
  //  *       'event' | 'events'
  //  *     > & {
  //  *       eventName?: event;
  //  *       eventNames?: event[];
  //  *     }} [params]
  //  * @returns {Promise<GetLogsReturnType<abiEvent, abiEvent[]>>}
  //  */
  // public async getLogs<
  //   event extends ContractEventName<typeof boostRegistryAbi>,
  //   const abiEvent extends ExtractAbiEvent<
  //     typeof boostRegistryAbi,
  //     event
  //   > = ExtractAbiEvent<typeof boostRegistryAbi, event>,
  // >(
  //   params?: Omit<
  //     GetLogsParams<typeof boostRegistryAbi, event, abiEvent, abiEvent[]>,
  //     'event' | 'events'
  //   > & {
  //     eventName?: event;
  //     eventNames?: event[];
  //   },
  // ): Promise<GetLogsReturnType<abiEvent, abiEvent[]>> {
  //   return getLogs(this._config.getClient({ chainId: params?.chainId }), {
  //     // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wag
  //     ...(params as any),
  //     ...(params?.eventName
  //       ? {
  //           event: getAbiItem({
  //             abi: boostRegistryAbi,
  //             name: params.eventName,
  //             // biome-ignore lint/suspicious/noExplicitAny: awkward abi intersection issue
  //           } as any),
  //         }
  //       : {}),
  //     ...(params?.eventNames
  //       ? {
  //           events: params.eventNames.map((name) =>
  //             getAbiItem({
  //               abi: boostRegistryAbi,
  //               name,
  //               // biome-ignore lint/suspicious/noExplicitAny: awkward abi intersection issue
  //             } as any),
  //           ),
  //         }
  //       : {}),
  //     address: this.assertValidAddress(),
  //   });
  // }

  // /**
  //  * A typed wrapper for `wagmi.watchContractEvent`
  //  *
  //  * @public
  //  * @async
  //  * @template {ContractEventName<typeof boostRegistryAbi>} event
  //  * @param {(log: BoostRegistryLog<event>) => unknown} cb
  //  * @param {?WatchParams<typeof boostRegistryAbi, event> & {
  //  *       eventName?: event;
  //  *     }} [params]
  //  * @returns {unknown, params?: any) => unknown} Unsubscribe function
  //  */
  // public async subscribe<
  //   event extends ContractEventName<typeof boostRegistryAbi>,
  // >(
  //   cb: (log: BoostRegistryLog<event>) => unknown,
  //   params?: WatchParams<typeof boostRegistryAbi, event> & {
  //     eventName?: event;
  //   },
  // ) {
  //   return watchContractEvent<
  //     typeof this._config,
  //     (typeof this._config)['chains'][number]['id'],
  //     typeof boostRegistryAbi,
  //     event
  //   >(this._config, {
  //     // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
  //     ...(params as any),
  //     eventName: params?.eventName,
  //     abi: boostRegistryAbi,
  //     address: this.assertValidAddress(),
  //     onLogs: (logs) => {
  //       for (let l of logs) {
  //         cb(l as unknown as BoostRegistryLog<event>);
  //       }
  //     },
  //   });
  // }

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
