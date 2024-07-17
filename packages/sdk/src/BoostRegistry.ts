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

export const BOOST_REGISTRY_ADDRESS: Address = import.meta.env
  .VITE_BOOST_REGISTRY_ADDRESS;

export interface BoostRegistryDeployedOptions extends DeployableOptions {
  address?: Address;
}

function isBoostRegistryDeployed(
  // biome-ignore lint/suspicious/noExplicitAny: type guard
  opts: any,
): opts is BoostRegistryDeployedOptions {
  return opts.address && isAddress(opts.address);
}

export interface BoostRegistryOptionsWithPayload extends DeployableOptions {}

function isBoostRegistryDeployable(
  // biome-ignore lint/suspicious/noExplicitAny: type guard
  opts: any,
): opts is BoostRegistryOptionsWithPayload {
  return !opts.address;
}

export type BoostRegistryConfig =
  | BoostRegistryDeployedOptions
  | BoostRegistryOptionsWithPayload;

export class BoostRegistry extends Deployable<never[]> {
  constructor({ config, account, ...options }: BoostRegistryConfig) {
    if (isBoostRegistryDeployed(options) && options.address) {
      super({ account, config }, options.address);
    } else if (isBoostRegistryDeployable(options) && !BOOST_REGISTRY_ADDRESS) {
      super({ account, config }, []);
    } else {
      super({ account, config }, BOOST_REGISTRY_ADDRESS);
    }
  }

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

  public async clone<Target extends DeployableTarget>(
    displayName: string,
    target: Target,
    params?: WriteParams<typeof boostRegistryAbi, 'deployClone'>,
  ) {
    const instance = await this.deployClone(displayName, target, params);
    return target.at(instance);
  }

  public async deployClone<Target extends DeployableTarget>(
    displayName: string,
    target: Target,
    params?: WriteParams<typeof boostRegistryAbi, 'deployClone'>,
  ) {
    return this.awaitResult(this.deployCloneRaw(displayName, target, params));
  }

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
