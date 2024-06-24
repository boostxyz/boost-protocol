import {
  type CGDAParameters,
  type PrepareCGDAIncentivePayload,
  prepareCGDAIncentivePayload,
  readCgdaIncentiveAsset,
  readCgdaIncentiveCgdaParams,
  readCgdaIncentiveCurrentReward,
  readCgdaIncentiveIsClaimable,
  readCgdaIncentiveTotalBudget,
  writeCgdaIncentiveClaim,
  writeCgdaIncentiveReclaim,
} from '@boostxyz/evm';
import CGDAIncentiveArtifact from '@boostxyz/evm/artifacts/contracts/incentives/CGDAIncentive.sol/CGDAIncentive.json';
import type { Config } from '@wagmi/core';
import { type Hex, zeroAddress } from 'viem';
import {
  Deployable,
  type GenericDeployableParams,
} from '../Deployable/Deployable';
import { DeployableAddressRequiredError } from '../errors';

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

  public async asset(config: Config) {
    if (!this.address) throw new DeployableAddressRequiredError();
    return readCgdaIncentiveAsset(config, {
      address: this.address,
    });
  }

  public async cgdaParams(config: Config): Promise<CGDAParameters> {
    if (!this.address) throw new DeployableAddressRequiredError();
    const [rewardDecay, rewardBoost, lastClaimTime, currentReward] =
      await readCgdaIncentiveCgdaParams(config, {
        address: this.address,
      });
    return {
      rewardDecay,
      rewardBoost,
      lastClaimTime,
      currentReward,
    };
  }

  public async totalBudget(config: Config) {
    if (!this.address) throw new DeployableAddressRequiredError();
    return readCgdaIncentiveTotalBudget(config, {
      address: this.address,
    });
  }

  //prepareClaimPayload
  public async claim(data: Hex, config: Config) {
    if (!this.address) throw new DeployableAddressRequiredError();
    return writeCgdaIncentiveClaim(config, {
      address: this.address,
      args: [data],
    });
  }

  //prepareClaimPayload
  public async reclaim(data: Hex, config: Config) {
    if (!this.address) throw new DeployableAddressRequiredError();
    return writeCgdaIncentiveReclaim(config, {
      address: this.address,
      args: [data],
    });
  }

  //prepareClaimPayload
  public async isClaimable(data: Hex, config: Config) {
    if (!this.address) throw new DeployableAddressRequiredError();
    return readCgdaIncentiveIsClaimable(config, {
      address: this.address,
      args: [data],
    });
  }

  public async preflight(data: PrepareCGDAIncentivePayload, config: Config) {
    if (!this.address) throw new DeployableAddressRequiredError();
    return readCgdaIncentiveIsClaimable(config, {
      address: this.address,
      args: [prepareCGDAIncentivePayload(data)],
    });
  }

  public async currentReward(config: Config) {
    if (!this.address) throw new DeployableAddressRequiredError();
    return readCgdaIncentiveCurrentReward(config, {
      address: this.address,
    });
  }

  public override buildParameters(_config: Config): GenericDeployableParams {
    return {
      abi: CGDAIncentiveArtifact.abi,
      bytecode: CGDAIncentiveArtifact.bytecode as Hex,
      args: [prepareCGDAIncentivePayload(this.payload)],
    };
  }
}
