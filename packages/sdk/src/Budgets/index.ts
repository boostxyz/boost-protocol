import { simpleBudgetAbi, writeSimpleBudget } from '@boostxyz/evm';
import SimpleBudgetArtifact from '@boostxyz/evm/artifacts/contracts/budgets/SimpleBudget.sol/SimpleBudget.json';
import { Config, deployContract } from '@wagmi/core';
import { Hex, WalletClient } from 'viem';

export abstract class Budget {
  abstract deploy(config: Config): Promise<void>;
}

export class SimpleBudget implements Budget {
  async deploy(config: Config): Promise<void> {
    const t = await deployContract(config, {
      abi: SimpleBudgetArtifact.abi,
      bytecode: SimpleBudgetArtifact.bytecode as Hex,
    });
  }
}

export class VestingBudget implements Budget {
  async deploy(): Promise<void> {
    // await writeSimpleBudget;
  }
}
