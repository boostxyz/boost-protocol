import {
  type PreparePointsIncentivePayload,
  preparePointsIncentivePayload,
} from '@boostxyz/evm';
import PointsIncentiveArtifact from '@boostxyz/evm/artifacts/contracts/incentives/PointsIncentive.sol/PointsIncentive.json';
import type { Config } from '@wagmi/core';
import { type Hex, zeroAddress, zeroHash } from 'viem';
import {
  Deployable,
  type GenericDeployableParams,
} from '../Deployable/Deployable';

export type { PreparePointsIncentivePayload };

export class PointsIncentive extends Deployable {
  protected payload: PreparePointsIncentivePayload = {
    venue: zeroAddress,
    selector: zeroHash,
    quantity: 0n,
    limit: 0n,
  };

  constructor(config: PreparePointsIncentivePayload) {
    super();
    this.payload = {
      ...this.payload,
      ...config,
    };
  }

  public override buildParameters(_config: Config): GenericDeployableParams {
    return {
      abi: PointsIncentiveArtifact.abi,
      bytecode: PointsIncentiveArtifact.bytecode as Hex,
      args: [preparePointsIncentivePayload(this.payload)],
    };
  }
}
