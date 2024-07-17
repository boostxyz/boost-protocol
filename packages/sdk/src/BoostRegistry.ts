import {
  type RegistryType,
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
import { type Address, type Hex, isAddress } from 'viem';
import {
  Deployable,
  type DeployableOptions,
  type GenericDeployableParams,
} from './Deployable/Deployable';
import type { DeployableTarget } from './Deployable/DeployableTarget';
import type { ReadParams, WriteParams } from './utils';

export { RegistryType };

/**
 * Description placeholder
 *
 * @type {Address}
 */
export const BOOST_REGISTRY_ADDRESS: Address = import.meta.env
  .VITE_BOOST_REGISTRY_ADDRESS;

/**
 * Description placeholder
 *
 * @export
 * @interface BoostRegistryDeployedOptions
 * @typedef {BoostRegistryDeployedOptions}
 * @extends {DeployableOptions}
 */
export interface BoostRegistryDeployedOptions extends DeployableOptions {
  /**
   * Description placeholder
   *
   * @type {?Address}
   */
  address?: Address;
}

/**
 * Description placeholder
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
 * Description placeholder
 *
 * @export
 * @interface BoostRegistryOptionsWithPayload
 * @typedef {BoostRegistryOptionsWithPayload}
 * @extends {DeployableOptions}
 */
export interface BoostRegistryOptionsWithPayload extends DeployableOptions {}

/**
 * Description placeholder
 *
 * @param {*} opts
 * @returns {opts is BoostRegistryOptionsWithPayload}
 */
function isBoostRegistryDeployable(
  // biome-ignore lint/suspicious/noExplicitAny: type guard
  opts: any,
): opts is BoostRegistryOptionsWithPayload {
  return !opts.address;
}

/**
 * Description placeholder
 *
 * @export
 * @typedef {BoostRegistryConfig}
 */
export type BoostRegistryConfig =
  | BoostRegistryDeployedOptions
  | BoostRegistryOptionsWithPayload;

/**
 * Description placeholder
 *
 * @export
 * @class BoostRegistry
 * @typedef {BoostRegistry}
 * @extends {Deployable<never[]>}
 */
export class BoostRegistry extends Deployable<never[]> {
  /**
   * Creates an instance of BoostRegistry.
   *
   * @constructor
   * @param {BoostRegistryConfig} param0
   * @param {Config} param0.config
   * @param {Account} param0.account
   * @param {({ address?: Address; } | {})} param0....options
   */
  constructor({ config, account, ...options }: BoostRegistryConfig) {
    if (isBoostRegistryDeployed(options) && options.address) {
      super({ account, config }, options.address);
    } else if (isBoostRegistryDeployable(options) && !BOOST_REGISTRY_ADDRESS) {
      super({ account, config }, []);
    } else {
      super({ account, config }, BOOST_REGISTRY_ADDRESS);
    }
  }

  /**
   * Description placeholder
   *
   * @public
   * @async
   * @param {RegistryType} registryType
   * @param {string} name
   * @param {Address} implementation
   * @param {?WriteParams<typeof boostRegistryAbi, 'register'>} [params]
   * @returns {unknown}
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
   * Description placeholder
   *
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
   * Description placeholder
   *
   * @public
   * @async
   * @template {DeployableTarget} Target
   * @param {string} displayName
   * @param {Target} target
   * @param {?WriteParams<typeof boostRegistryAbi, 'deployClone'>} [params]
   * @returns {unknown}
   */
  public async clone<Target extends DeployableTarget>(
    displayName: string,
    target: Target,
    params?: WriteParams<typeof boostRegistryAbi, 'deployClone'>,
  ) {
    const instance = await this.deployClone(displayName, target, params);
    return target.at(instance);
  }

  /**
   * Description placeholder
   *
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
  ) {
    return this.awaitResult(this.deployCloneRaw(displayName, target, params));
  }

  /**
   * Description placeholder
   *
   * @public
   * @async
   * @param {string} displayName
   * @param {DeployableTarget} target
   * @param {?WriteParams<typeof boostRegistryAbi, 'deployClone'>} [params]
   * @returns {unknown}
   */
  public async deployCloneRaw(
    displayName: string,
    target: DeployableTarget,
    params?: WriteParams<typeof boostRegistryAbi, 'deployClone'>,
  ) {
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
   * Description placeholder
   *
   * @public
   * @async
   * @param {Hex} identifier
   * @param {?ReadParams<typeof boostRegistryAbi, 'getBaseImplementation'>} [params]
   * @returns {unknown}
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
   * Description placeholder
   *
   * @public
   * @async
   * @param {Hex} identifier
   * @param {?ReadParams<typeof boostRegistryAbi, 'getClone'>} [params]
   * @returns {unknown}
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
   * Description placeholder
   *
   * @public
   * @async
   * @param {Address} deployer
   * @param {?ReadParams<typeof boostRegistryAbi, 'getClones'>} [params]
   * @returns {unknown}
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
   * Description placeholder
   *
   * @public
   * @async
   * @param {RegistryType} registryType
   * @param {Address} base
   * @param {Address} deployer
   * @param {string} displayName
   * @param {?ReadParams<typeof boostRegistryAbi, 'getCloneIdentifier'>} [params]
   * @returns {unknown}
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
   * Description placeholder
   *
   * @public
   * @async
   * @param {RegistryType} registryType
   * @param {string} displayName
   * @param {?ReadParams<typeof boostRegistryAbi, 'getIdentifier'>} [params]
   * @returns {unknown}
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
    const [, options] = this.validateDeploymentConfig(_payload, _options);
    return {
      abi: boostRegistryAbi,
      bytecode: bytecode as Hex,
      // biome-ignore lint/suspicious/noExplicitAny: Registry doesn't construct or initialize
      args: [] as any,
      ...this.optionallyAttachAccount(options.account),
    };
  }
}
