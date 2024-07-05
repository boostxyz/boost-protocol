import {
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
import type { CallParams } from '../utils';

export type { SimpleDenyListPayload };

export class SimpleDenyList extends DeployableTarget<SimpleDenyListPayload> {
  public static base = import.meta.env.VITE_SIMPLE_DENYLIST_BASE;

  public async isAllowed(
    address: Address,
    params: CallParams<typeof readSimpleDenyListIsAllowed> = {},
  ): Promise<boolean> {
    return await readSimpleDenyListIsAllowed(this._config, {
      address: this.assertValidAddress(),
      args: [address, zeroHash],
      ...params,
    });
  }

  public async setAllowed(
    addresses: Address[],
    allowed: boolean[],
    params: CallParams<typeof writeSimpleDenyListSetDenied> = {},
  ) {
    return this.awaitResult(
      this.setAllowedRaw(addresses, allowed, params),
      simpleDenyListAbi,
      simulateSimpleDenyListSetDenied,
    );
  }

  public async setAllowedRaw(
    addresses: Address[],
    allowed: boolean[],
    params: CallParams<typeof writeSimpleDenyListSetDenied> = {},
  ) {
    return await writeSimpleDenyListSetDenied(this._config, {
      address: this.assertValidAddress(),
      args: [addresses, allowed],
      ...params,
    });
  }

  public async supportsInterface(
    interfaceId: Hex,
    params: CallParams<typeof readSimpleDenyListSupportsInterface> = {},
  ) {
    return readSimpleDenyListSupportsInterface(this._config, {
      address: this.assertValidAddress(),
      ...this.optionallyAttachAccount(),
      ...params,
      args: [interfaceId],
    });
  }

  public async getComponentInterface(
    params: CallParams<typeof readSimpleDenyListGetComponentInterface> = {},
  ) {
    return readSimpleDenyListGetComponentInterface(this._config, {
      address: this.assertValidAddress(),
      ...this.optionallyAttachAccount(),
      ...params,
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
