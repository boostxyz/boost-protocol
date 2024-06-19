import {
  type PrepareAllowListIncentivePayload,
  prepareAllowListIncentivePayload,
} from '@boostxyz/evm';
import AllowListIncentiveArtifact from '@boostxyz/evm/artifacts/contracts/incentives/AllowListIncentive.sol/AllowListIncentive.json';
import type { Config } from '@wagmi/core';
import { type Hex, zeroAddress } from 'viem';
import {
  Deployable,
  type GenericDeployableParams,
} from '../Deployable/Deployable';

export type { PrepareAllowListIncentivePayload };

export class AllowListIncentive extends Deployable {
  protected payload: PrepareAllowListIncentivePayload = {
    allowList: zeroAddress,
    limit: 0n,
  };

  constructor(config: PrepareAllowListIncentivePayload) {
    super();
    this.payload = {
      ...this.payload,
      ...config,
    };
  }

  public override buildParameters(_config: Config): GenericDeployableParams {
    return {
      abi: AllowListIncentiveArtifact.abi,
      bytecode: AllowListIncentiveArtifact.bytecode as Hex,
      args: [prepareAllowListIncentivePayload(this.payload)],
    };
  }
}
