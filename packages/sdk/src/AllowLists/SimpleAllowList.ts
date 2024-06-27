import {
  type SimpleAllowListPayload,
  prepareSimpleAllowListPayload,
  readSimpleAllowListIsAllowed,
  writeSimpleAllowListSetAllowed,
} from '@boostxyz/evm';
import SimpleAllowListArtifact from '@boostxyz/evm/artifacts/contracts/allowlists/SimpleAllowList.sol/SimpleAllowList.json';
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
    params: CallParams<typeof readSimpleAllowListIsAllowed> = {},
  ) {
    return await writeSimpleAllowListSetAllowed(this._config, {
      address: this.assertValidAddress(),
      args: [addresses, allowed],
      ...params,
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
      abi: SimpleAllowListArtifact.abi,
      bytecode: SimpleAllowListArtifact.bytecode as Hex,
      args: [prepareSimpleAllowListPayload(payload)],
      ...this.optionallyAttachAccount(options.account),
    };
  }
}
