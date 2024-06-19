import {
  type PrepareERC20IncentivePayload,
  StrategyType,
  prepareERC20IncentivePayload,
} from '@boostxyz/evm';
import ERC20IncentiveArtifact from '@boostxyz/evm/artifacts/contracts/incentives/ERC20Incentive.sol/ERC20Incentive.json';
import type { Config } from '@wagmi/core';
import { type Hex, zeroAddress } from 'viem';
import {
  Deployable,
  type GenericDeployableParams,
} from '../Deployable/Deployable';

export type { PrepareERC20IncentivePayload };

export class ERC20Incentive extends Deployable {
  protected payload: PrepareERC20IncentivePayload = {
    asset: zeroAddress,
    strategy: StrategyType.POOL,
    reward: 0n,
    limit: 0n,
  };

  constructor(config: PrepareERC20IncentivePayload) {
    super();
    this.payload = {
      ...this.payload,
      ...config,
    };
  }

  public override buildParameters(_config: Config): GenericDeployableParams {
    return {
      abi: ERC20IncentiveArtifact.abi,
      bytecode: ERC20IncentiveArtifact.bytecode as Hex,
      args: [prepareERC20IncentivePayload(this.payload)],
    };
  }
}
