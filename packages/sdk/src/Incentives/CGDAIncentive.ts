import {
  type CGDAIncentivePayload,
  type CGDAParameters,
  type ClaimPayload,
  prepareCGDAIncentivePayload,
  prepareClaimPayload,
  readCgdaIncentiveAsset,
  readCgdaIncentiveCgdaParams,
  readCgdaIncentiveCurrentReward,
  readCgdaIncentiveIsClaimable,
  readCgdaIncentiveTotalBudget,
  writeCgdaIncentiveClaim,
  writeCgdaIncentiveReclaim,
} from '@boostxyz/evm';
import CGDAIncentiveArtifact from '@boostxyz/evm/artifacts/contracts/incentives/CGDAIncentive.sol/CGDAIncentive.json';
import type { Hex } from 'viem';
import type {
  DeployableOptions,
  GenericDeployableParams,
} from '../Deployable/Deployable';
import { DeployableTarget } from '../Deployable/DeployableTarget';
import type { CallParams } from '../utils';

export type { CGDAIncentivePayload };

export class CGDAIncentive extends DeployableTarget<CGDAIncentivePayload> {
  public async asset(params: CallParams<typeof readCgdaIncentiveAsset> = {}) {
    return readCgdaIncentiveAsset(this._config, {
      address: this.assertValidAddress(),
      ...params,
    });
  }

  public async cgdaParams(
    params: CallParams<typeof readCgdaIncentiveCgdaParams> = {},
  ): Promise<CGDAParameters> {
    const [rewardDecay, rewardBoost, lastClaimTime, currentReward] =
      await readCgdaIncentiveCgdaParams(this._config, {
        address: this.assertValidAddress(),
        ...params,
      });
    return {
      rewardDecay,
      rewardBoost,
      lastClaimTime,
      currentReward,
    };
  }

  public async totalBudget(
    params: CallParams<typeof readCgdaIncentiveTotalBudget> = {},
  ) {
    return readCgdaIncentiveTotalBudget(this._config, {
      address: this.assertValidAddress(),
      ...params,
    });
  }

  //prepareClaimPayload
  public async claim(
    payload: ClaimPayload,
    params: CallParams<typeof writeCgdaIncentiveClaim> = {},
  ) {
    return writeCgdaIncentiveClaim(this._config, {
      address: this.assertValidAddress(),
      args: [prepareClaimPayload(payload)],
      ...params,
    });
  }

  //prepareClaimPayload
  public async reclaim(
    payload: ClaimPayload,
    params: CallParams<typeof writeCgdaIncentiveReclaim> = {},
  ) {
    return writeCgdaIncentiveReclaim(this._config, {
      address: this.assertValidAddress(),
      args: [prepareClaimPayload(payload)],
      ...params,
    });
  }

  public async isClaimable(
    payload: ClaimPayload,
    params: CallParams<typeof readCgdaIncentiveIsClaimable> = {},
  ) {
    return readCgdaIncentiveIsClaimable(this._config, {
      address: this.assertValidAddress(),
      args: [prepareClaimPayload(payload)],
      ...params,
    });
  }

  public async preflight(
    data: CGDAIncentivePayload,
    params: CallParams<typeof readCgdaIncentiveIsClaimable> = {},
  ) {
    return readCgdaIncentiveIsClaimable(this._config, {
      address: this.assertValidAddress(),
      args: [prepareCGDAIncentivePayload(data)],
      ...params,
    });
  }

  public async currentReward(
    params: CallParams<typeof readCgdaIncentiveCurrentReward> = {},
  ) {
    return readCgdaIncentiveCurrentReward(this._config, {
      address: this.assertValidAddress(),
      ...params,
    });
  }

  public override buildParameters(
    _payload?: CGDAIncentivePayload,
    _options?: DeployableOptions,
  ): GenericDeployableParams {
    const [payload, options] = this.validateDeploymentConfig(
      _payload,
      _options,
    );
    return {
      abi: CGDAIncentiveArtifact.abi,
      bytecode: CGDAIncentiveArtifact.bytecode as Hex,
      args: [prepareCGDAIncentivePayload(payload)],
      ...this.optionallyAttachAccount(options.account),
    };
  }
}
