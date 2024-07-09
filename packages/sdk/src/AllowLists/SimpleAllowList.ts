import {
  type SimpleAllowListPayload,
  prepareSimpleAllowListPayload,
  readSimpleAllowListGetComponentInterface,
  readSimpleAllowListIsAllowed,
  readSimpleAllowListSupportsInterface,
  simpleAllowListAbi,
  simulateSimpleAllowListSetAllowed,
  writeSimpleAllowListSetAllowed,
} from '@boostxyz/evm';
import { bytecode } from '@boostxyz/evm/artifacts/contracts/allowlists/SimpleAllowList.sol/SimpleAllowList.json';
import { getAccount } from '@wagmi/core';
import { type Address, type Hex, zeroAddress, zeroHash } from 'viem';
import type {
  DeployableOptions,
  GenericDeployableParams,
} from '../Deployable/Deployable';
import { DeployableTarget } from '../Deployable/DeployableTarget';
import { DeployableUnknownOwnerProvidedError } from '../errors';
import type { ReadParams } from '../utils';

export type { SimpleAllowListPayload };

export class SimpleAllowList extends DeployableTarget<SimpleAllowListPayload> {
  public static base = import.meta.env.VITE_SIMPLE_ALLOWLIST_BASE;
  public override readonly base = SimpleAllowList.base;

  public async isAllowed(
    address: Address,
    params?: ReadParams<typeof simpleAllowListAbi, 'setAllowed'>,
  ): Promise<boolean> {
    return await readSimpleAllowListIsAllowed(this._config, {
      address: this.assertValidAddress(),
      args: [address, zeroHash],
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  public async setAllowed(
    addresses: Address[],
    allowed: boolean[],
    params?: ReadParams<typeof simpleAllowListAbi, 'setAllowed'>,
  ) {
    return this.awaitResult(
      this.setAllowedRaw(addresses, allowed, params),
      simpleAllowListAbi,
      simulateSimpleAllowListSetAllowed,
    );
  }

  public async setAllowedRaw(
    addresses: Address[],
    allowed: boolean[],
    params?: ReadParams<typeof simpleAllowListAbi, 'setAllowed'>,
  ) {
    return await writeSimpleAllowListSetAllowed(this._config, {
      address: this.assertValidAddress(),
      args: [addresses, allowed],
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  public async supportsInterface(
    interfaceId: Hex,
    params?: ReadParams<typeof simpleAllowListAbi, 'setAllowed'>,
  ) {
    return readSimpleAllowListSupportsInterface(this._config, {
      address: this.assertValidAddress(),
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
      args: [interfaceId],
    });
  }

  public async getComponentInterface(
    params?: ReadParams<typeof simpleAllowListAbi, 'setAllowed'>,
  ) {
    return readSimpleAllowListGetComponentInterface(this._config, {
      address: this.assertValidAddress(),
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
      args: [],
    });
  }

  public override buildParameters(
    _payload?: SimpleAllowListPayload,
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
      abi: simpleAllowListAbi,
      bytecode: bytecode as Hex,
      args: [prepareSimpleAllowListPayload(payload)],
      ...this.optionallyAttachAccount(options.account),
    };
  }
}
