import SimpleBudgetArtifact from '@boostxyz/evm/artifacts/contracts/budgets/SimpleBudget.sol/SimpleBudget.json';
import VestingBudgetArtifact from '@boostxyz/evm/artifacts/contracts/budgets/VestingBudget.sol/VestingBudget.json';
import { Deployable } from '../Deployable/Deployable';
import type { Artifact } from '../artifact';

export class SimpleBudget extends Deployable {
  public get artifact(): Artifact {
    return SimpleBudgetArtifact as Artifact;
  }
}

export class VestingBudget extends Deployable {
  public get artifact(): Artifact {
    return VestingBudgetArtifact as Artifact;
  }
}

export type Budget = SimpleBudget | VestingBudget;
