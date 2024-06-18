import {
  type PrepareSimpleBudgetPayload,
  prepareSimpleBudgetPayload,
} from '@boostxyz/evm';
import SimpleBudgetArtifact from '@boostxyz/evm/artifacts/contracts/budgets/SimpleBudget.sol/SimpleBudget.json';
import { type Config, deployContract, getAccount } from '@wagmi/core';
import type { Address, Hex } from 'viem';

// TODO create an export for each kind of budget
// TODO make budget a base class, should Deployable be a base class for everything?
export abstract class Budget {
  protected address: Address | undefined;
  abstract deploy(config: Config): Promise<string>;
}

export class SimpleBudget implements Budget {
  protected address: Address | undefined;
  async deploy(
    config: Config,
    payload: Partial<PrepareSimpleBudgetPayload> = {},
  ): Promise<string> {
    if (!payload.authorized) payload.authorized = [];
    if (!payload.owner) payload.owner = getAccount(config).address;
    const address = await deployContract(config, {
      abi: SimpleBudgetArtifact.abi,
      bytecode: SimpleBudgetArtifact.bytecode as Hex,
      args: [
        prepareSimpleBudgetPayload(
          payload as Required<PrepareSimpleBudgetPayload>,
        ),
      ],
    });
    this.address = address;
    return address;
  }
}
