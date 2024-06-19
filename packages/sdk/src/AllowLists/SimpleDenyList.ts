import {
  type SimpleDenyListPayload,
  prepareSimpleDenyListPayload,
} from '@boostxyz/evm';
import SimpleDenyListArtifact from '@boostxyz/evm/artifacts/contracts/allowlists/SimpleDenyList.sol/SimpleDenyList.json';
import { type Config, getAccount } from '@wagmi/core';
import { type Hex, zeroAddress } from 'viem';
import {
  Deployable,
  type GenericDeployableParams,
} from '../Deployable/Deployable';

export type { SimpleDenyListPayload };

export class SimpleDenyList extends Deployable {
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
