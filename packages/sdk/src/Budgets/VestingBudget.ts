import {
  type PrepareVestingBudgetPayload,
  prepareVestingBudgetPayload,
} from '@boostxyz/evm';
import VestingBudgetArtifact from '@boostxyz/evm/artifacts/contracts/budgets/VestingBudget.sol/VestingBudget.json';
import { type Config, getAccount } from '@wagmi/core';
import { type Hex, zeroAddress } from 'viem';
import {
  Deployable,
  type GenericDeployableParams,
} from '../Deployable/Deployable';

export type { PrepareVestingBudgetPayload };

export class VestingBudget extends Deployable {
  protected payload: PrepareVestingBudgetPayload = {
    owner: zeroAddress,
    authorized: [],
    start: 0n,
    duration: 0n,
    cliff: 0n,
  };

  constructor(config: Partial<PrepareVestingBudgetPayload> = {}) {
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
      abi: VestingBudgetArtifact.abi,
      bytecode: VestingBudgetArtifact.bytecode as Hex,
      args: [prepareVestingBudgetPayload(this.payload)],
    };
  }
}