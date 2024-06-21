import {
  type SimpleAllowListPayload,
  prepareSimpleAllowListPayload,
  readAllowListIsAllowed,
  writeSimpleAllowListSetAllowed,
} from '@boostxyz/evm';
import SimpleAllowListArtifact from '@boostxyz/evm/artifacts/contracts/allowlists/SimpleAllowList.sol/SimpleAllowList.json';
import { type Config, getAccount } from '@wagmi/core';
import { type Address, type Hex, zeroAddress, zeroHash } from 'viem';
import {
  Deployable,
  type GenericDeployableParams,
} from '../Deployable/Deployable';
import {
  DeployableAddressRequiredError,
  DeployableUnknownOwnerProvided,
} from '../errors';

export type { SimpleAllowListPayload };

export class SimpleAllowList extends Deployable {
  protected payload: SimpleAllowListPayload = {
    owner: zeroAddress,
    allowed: [],
  };

  constructor(config: Partial<SimpleAllowListPayload> = {}) {
    super();
    this.payload = {
      ...this.payload,
      ...config,
    };
  }

  public async isAllowed(address: Address, config: Config): Promise<boolean> {
    if (!this.address) throw new DeployableAddressRequiredError();
    return await readAllowListIsAllowed(config, {
      address: this.address,
      args: [address, zeroHash],
    });
  }

  public async setAllowed(
    addresses: Address[],
    allowed: boolean[],
    config: Config,
  ) {
    if (!this.address) throw new DeployableAddressRequiredError();
    return await writeSimpleAllowListSetAllowed(config, {
      address: this.address,
      args: [addresses, allowed],
    });
  }

  public override buildParameters(config: Config): GenericDeployableParams {
    if (!this.payload.owner || this.payload.owner === zeroAddress) {
      const owner = getAccount(config).address;
      if (owner) {
        this.payload.owner = owner;
      } else {
        throw new DeployableUnknownOwnerProvided();
      }
    }
    return {
      abi: SimpleAllowListArtifact.abi,
      bytecode: SimpleAllowListArtifact.bytecode as Hex,
      args: [prepareSimpleAllowListPayload(this.payload)],
    };
  }
}
