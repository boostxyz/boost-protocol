import {
  type PrepareSimpleBudgetPayload,
  prepareSimpleBudgetPayload,
} from '@boostxyz/evm';
import SimpleBudgetArtifact from '@boostxyz/evm/artifacts/contracts/budgets/SimpleBudget.sol/SimpleBudget.json';
import { type Config, getAccount } from '@wagmi/core';
import { type Hex, zeroAddress } from 'viem';
import {
  Deployable,
  type GenericDeployableParams,
} from '../Deployable/Deployable';

export type { PrepareSimpleBudgetPayload };

export class SimpleBudget extends Deployable {
  protected payload: PrepareSimpleBudgetPayload = {
    owner: zeroAddress,
    authorized: [],
  };

  constructor(config: Partial<PrepareSimpleBudgetPayload> = {}) {
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
      abi: SimpleBudgetArtifact.abi,
      bytecode: SimpleBudgetArtifact.bytecode as Hex,
      args: [prepareSimpleBudgetPayload(this.payload)],
    };
  }
}
