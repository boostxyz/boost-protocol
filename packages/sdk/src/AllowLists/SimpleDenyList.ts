import {
  type SimpleDenyListPayload,
  prepareSimpleDenyListPayload,
  readSimpleDenyListIsAllowed,
  writeSimpleDenyListSetDenied,
} from '@boostxyz/evm';
import SimpleDenyListArtifact from '@boostxyz/evm/artifacts/contracts/allowlists/SimpleDenyList.sol/SimpleDenyList.json';
import { type Config, getAccount } from '@wagmi/core';
import { type Address, type Hex, zeroAddress, zeroHash } from 'viem';
import {
  Deployable,
  type GenericDeployableParams,
} from '../Deployable/Deployable';
import { DeployableUnknownOwnerProvidedError } from '../errors';
import type { CallParams } from '../utils';

export type { SimpleDenyListPayload };

export class SimpleDenyList extends Deployable<SimpleDenyListPayload> {
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
    return await writeSimpleDenyListSetDenied(this._config, {
      address: this.assertValidAddress(),
      args: [addresses, allowed],
      ...params,
    });
  }

  public override buildParameters(
    _payload?: SimpleDenyListPayload,
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
      abi: SimpleDenyListArtifact.abi,
      bytecode: SimpleDenyListArtifact.bytecode as Hex,
      args: [prepareSimpleDenyListPayload(payload)],
    };
  }
}
