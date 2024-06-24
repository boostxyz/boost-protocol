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
import { DeployableAddressRequiredError } from '../errors';

export type { SimpleDenyListPayload };

export class SimpleDenyList extends Deployable<SimpleDenyListPayload> {
  protected payload: SimpleDenyListPayload = {
    owner: zeroAddress,
    allowed: [],
  };

  constructor(config: Partial<SimpleDenyListPayload> = {}) {
    super();
    this.payload = {
      ...this.payload,
      ...config,
    };
  }

  public async isAllowed(address: Address, config: Config): Promise<boolean> {
    if (!this.address) throw new DeployableAddressRequiredError();
    return await readSimpleDenyListIsAllowed(config, {
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
    return await writeSimpleDenyListSetDenied(config, {
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
        // throw?
        console.warn('Unable to ascertain owner for budget');
      }
    }
    return {
      abi: SimpleDenyListArtifact.abi,
      bytecode: SimpleDenyListArtifact.bytecode as Hex,
      args: [prepareSimpleDenyListPayload(this.payload)],
    };
  }
}
