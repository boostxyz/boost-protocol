import { type Config, getAccount } from '@wagmi/core';
import { type Address, type Hex, zeroAddress, zeroHash } from 'viem';
import {
  type SimpleAllowListPayload,
  prepareSimpleAllowListPayload,
  readSimpleAllowListIsAllowed,
  writeSimpleAllowListSetAllowed,
} from '../../../evm/artifacts';
import SimpleAllowListArtifact from '../../../evm/artifacts/contracts/allowlists/SimpleAllowList.sol/SimpleAllowList.json';
import {
  Deployable,
  type GenericDeployableParams,
} from '../Deployable/Deployable';
import { DeployableUnknownOwnerProvidedError } from '../errors';
import type { CallParams } from '../utils';

export type { SimpleAllowListPayload };

export class SimpleAllowList extends Deployable<SimpleAllowListPayload> {
  public async isAllowed(
    address: Address,
    params: CallParams<typeof readSimpleAllowListIsAllowed> = {},
  ): Promise<boolean> {
    return await readSimpleAllowListIsAllowed(this._config, {
      address: this.assertValidAddress(),
      args: [address, zeroHash],
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
    _config?: Config,
  ): GenericDeployableParams {
    const [payload, config] = this.validateDeploymentConfig(_payload, _config);
    if (!payload.owner || payload.owner === zeroAddress) {
      const owner = getAccount(config).address;
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
    };
  }
}
