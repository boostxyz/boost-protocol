import {
  type SimpleAllowListPayload,
  prepareSimpleAllowListPayload,
} from '@boostxyz/evm';
import SimpleAllowListArtifact from '@boostxyz/evm/artifacts/contracts/allowlists/SimpleAllowList.sol/SimpleAllowList.json';
import { type Config, getAccount } from '@wagmi/core';
import { type Hex, zeroAddress } from 'viem';
import {
  Deployable,
  type GenericDeployableParams,
} from '../Deployable/Deployable';

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
      abi: SimpleAllowListArtifact.abi,
      bytecode: SimpleAllowListArtifact.bytecode as Hex,
      args: [prepareSimpleAllowListPayload(this.payload)],
    };
  }
}
