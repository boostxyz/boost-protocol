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
import type { CallParams } from '../utils';

export type { SimpleAllowListPayload };

export class SimpleAllowList extends DeployableTarget<SimpleAllowListPayload> {
  public static base = import.meta.env.VITE_SIMPLE_ALLOWLIST_BASE;
  public override readonly base = SimpleAllowList.base;

  public async isAllowed(
    address: Address,
    params: CallParams<typeof readSimpleAllowListIsAllowed> = {},
  ): Promise<boolean> {
    return await readSimpleAllowListIsAllowed(this._config, {
      address: this.assertValidAddress(),
      args: [address, zeroHash],
      ...this.optionallyAttachAccount(),
      ...params,
    });
  }

  public async setAllowed(
    addresses: Address[],
    allowed: boolean[],
    params: CallParams<typeof writeSimpleAllowListSetAllowed> = {},
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
    params: CallParams<typeof writeSimpleAllowListSetAllowed> = {},
  ) {
    return await writeSimpleAllowListSetAllowed(this._config, {
      address: this.assertValidAddress(),
      args: [addresses, allowed],
      ...params,
    });
  }

  public async supportsInterface(
    interfaceId: Hex,
    params: CallParams<typeof readSimpleAllowListSupportsInterface> = {},
  ) {
    return readSimpleAllowListSupportsInterface(this._config, {
      address: this.assertValidAddress(),
      ...this.optionallyAttachAccount(),
      ...params,
      args: [interfaceId],
    });
  }

  public async getComponentInterface(
    params: CallParams<typeof readSimpleAllowListGetComponentInterface> = {},
  ) {
    return readSimpleAllowListGetComponentInterface(this._config, {
      address: this.assertValidAddress(),
      ...this.optionallyAttachAccount(),
      ...params,
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
