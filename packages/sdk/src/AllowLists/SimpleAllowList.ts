import {
  type SimpleAllowListPayload,
  prepareSimpleAllowListPayload,
  readSimpleAllowListIsAllowed,
  writeSimpleAllowListSetAllowed,
} from '@boostxyz/evm';
import SimpleAllowListArtifact from '@boostxyz/evm/artifacts/contracts/allowlists/SimpleAllowList.sol/SimpleAllowList.json';
import { type Config, getAccount } from '@wagmi/core';
import {
  type Address,
  type CallParameters,
  type Hex,
  zeroAddress,
  zeroHash,
} from 'viem';
import {
  Deployable,
  type GenericDeployableParams,
} from '../Deployable/Deployable';
import {
  DeployableAddressRequiredError,
  DeployableUnknownOwnerProvidedError,
  requireAddress,
} from '../errors';
import type { CallParams } from '../utils';

export type { SimpleAllowListPayload };

export class SimpleAllowList extends Deployable<SimpleAllowListPayload> {
  public async isAllowed(
    address: Address,
    params: CallParams<typeof readSimpleAllowListIsAllowed> = {},
  ): Promise<boolean> {
    if (!this.address) throw new DeployableAddressRequiredError();
    return await readSimpleAllowListIsAllowed(this._config, {
      address: this.address,
      args: [address, zeroHash],
      ...params,
    });
  }

  public async setAllowed(
    addresses: Address[],
    allowed: boolean[],
    params: CallParams<typeof readSimpleAllowListIsAllowed> = {},
  ) {
    // if (!this.address) throw new DeployableAddressRequiredError();
    requireAddress(this);
    return await writeSimpleAllowListSetAllowed(this._config, {
      address: this.address!,
      args: [addresses, allowed],
      ...params,
    });
  }

  public override buildParameters(config: Config): GenericDeployableParams {
    if (!this.payload.owner || this.payload.owner === zeroAddress) {
      const owner = getAccount(config).address;
      if (owner) {
        this.payload.owner = owner;
      } else {
        throw new DeployableUnknownOwnerProvidedError();
      }
    }
    return {
      abi: SimpleAllowListArtifact.abi,
      bytecode: SimpleAllowListArtifact.bytecode as Hex,
      args: [prepareSimpleAllowListPayload(this.payload)],
    };
  }
}
