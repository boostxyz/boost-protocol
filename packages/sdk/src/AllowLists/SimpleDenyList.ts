import {
  RegistryType,
  type SimpleDenyListPayload,
  prepareSimpleDenyListPayload,
  readSimpleDenyListGetComponentInterface,
  readSimpleDenyListIsAllowed,
  readSimpleDenyListSupportsInterface,
  simpleDenyListAbi,
  simulateSimpleDenyListSetDenied,
  writeSimpleDenyListSetDenied,
} from '@boostxyz/evm';
import { bytecode } from '@boostxyz/evm/artifacts/contracts/allowlists/SimpleDenyList.sol/SimpleDenyList.json';
import { getAccount } from '@wagmi/core';
import { type Address, type Hex, zeroAddress, zeroHash } from 'viem';
import type {
  DeployableOptions,
  GenericDeployableParams,
} from '../Deployable/Deployable';
import { DeployableTarget } from '../Deployable/DeployableTarget';
import { DeployableUnknownOwnerProvidedError } from '../errors';
import type { ReadParams, WriteParams } from '../utils';

export type { SimpleDenyListPayload };

export class SimpleDenyList extends DeployableTarget<SimpleDenyListPayload> {
  public static override base = import.meta.env.VITE_SIMPLE_DENYLIST_BASE;
  public static override registryType: RegistryType = RegistryType.ALLOW_LIST;

  public async isAllowed(
    address: Address,
    params?: ReadParams<typeof simpleDenyListAbi, 'isAllowed'>,
  ): Promise<boolean> {
    return await readSimpleDenyListIsAllowed(this._config, {
      address: this.assertValidAddress(),
      args: [address, zeroHash],
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  public async setDenied(
    addresses: Address[],
    allowed: boolean[],
    params?: WriteParams<typeof simpleDenyListAbi, 'setDenied'>,
  ) {
    return this.awaitResult(this.setDeniedRaw(addresses, allowed, params));
  }

  public async setDeniedRaw(
    addresses: Address[],
    allowed: boolean[],
    params?: WriteParams<typeof simpleDenyListAbi, 'setDenied'>,
  ) {
    const { request, result } = await simulateSimpleDenyListSetDenied(
      this._config,
      {
        address: this.assertValidAddress(),
        args: [addresses, allowed],
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      },
    );
    const hash = await writeSimpleDenyListSetDenied(this._config, request);
    return { hash, result };
  }

  public async supportsInterface(
    interfaceId: Hex,
    params?: ReadParams<typeof simpleDenyListAbi, 'supportsInterface'>,
  ) {
    return readSimpleDenyListSupportsInterface(this._config, {
      address: this.assertValidAddress(),
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
      args: [interfaceId],
    });
  }

  public async getComponentInterface(
    params?: ReadParams<typeof simpleDenyListAbi, 'getComponentInterface'>,
  ) {
    return readSimpleDenyListGetComponentInterface(this._config, {
      address: this.assertValidAddress(),
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
      args: [],
    });
  }

  public override buildParameters(
    _payload?: SimpleDenyListPayload,
    _options?: DeployableOptions,
  ): GenericDeployableParams {
    const [payload, options] = this.validateDeploymentConfig(
      _payload,
      _options,
    );
    if (!payload.owner || payload.owner === zeroAddress) {
      const owner = options.account
        ? options.account.address
        : options.config
          ? getAccount(options.config).address
          : this._account?.address;
      if (owner) {
        payload.owner = owner;
      } else {
        throw new DeployableUnknownOwnerProvidedError();
      }
    }
    return {
      abi: simpleDenyListAbi,
      bytecode: bytecode as Hex,
      args: [prepareSimpleDenyListPayload(payload)],
      ...this.optionallyAttachAccount(options.account),
    };
  }
}
