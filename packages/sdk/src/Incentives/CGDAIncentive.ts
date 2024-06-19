import {
  type PrepareCGDAIncentivePayload,
  prepareCGDAIncentivePayload,
} from '@boostxyz/evm';
import CGDAIncentiveArtifact from '@boostxyz/evm/artifacts/contracts/incentives/CGDAIncentive.sol/CGDAIncentive.json';
import type { Config } from '@wagmi/core';
import { type Hex, zeroAddress } from 'viem';
import {
  Deployable,
  type GenericDeployableParams,
} from '../Deployable/Deployable';

export type { PrepareCGDAIncentivePayload };

export class CGDAIncentive extends Deployable {
  protected payload: PrepareCGDAIncentivePayload = {
    asset: zeroAddress,
    initialReward: 0n,
    rewardDecay: 0n,
    rewardBoost: 0n,
    totalBudget: 0n,
  };

  constructor(config: PrepareCGDAIncentivePayload) {
    super();
    this.payload = {
      ...this.payload,
      ...config,
    };
  }

  public override buildParameters(_config: Config): GenericDeployableParams {
    return {
      abi: CGDAIncentiveArtifact.abi,
      bytecode: CGDAIncentiveArtifact.bytecode as Hex,
      args: [prepareCGDAIncentivePayload(this.payload)],
    };
  }
}
