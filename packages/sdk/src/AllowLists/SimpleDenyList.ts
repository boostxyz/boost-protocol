import {
  type SimpleDenyListPayload,
  prepareSimpleDenyListPayload,
  readSimpleDenyListIsAllowed,
  writeSimpleDenyListSetDenied,
} from '@boostxyz/evm';
import SimpleDenyListArtifact from '@boostxyz/evm/artifacts/contracts/allowlists/SimpleDenyList.sol/SimpleDenyList.json';
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
      abi: SimpleDenyListArtifact.abi,
      bytecode: SimpleDenyListArtifact.bytecode as Hex,
      args: [prepareSimpleDenyListPayload(payload)],
      ...this.optionallyAttachAccount(options.account),
    };
  }
}
