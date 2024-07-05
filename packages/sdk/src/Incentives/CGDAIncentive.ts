import {
  type CGDAIncentivePayload,
  type CGDAParameters,
  type ClaimPayload,
  cgdaIncentiveAbi,
  prepareCGDAIncentivePayload,
  prepareClaimPayload,
  readCgdaIncentiveAsset,
  readCgdaIncentiveCgdaParams,
  readCgdaIncentiveClaimed,
  readCgdaIncentiveClaims,
  readCgdaIncentiveCurrentReward,
  readCgdaIncentiveGetComponentInterface,
  readCgdaIncentiveIsClaimable,
  readCgdaIncentiveReward,
  readCgdaIncentiveSupportsInterface,
  readCgdaIncentiveTotalBudget,
  simulateCgdaIncentiveClaim,
  simulateCgdaIncentiveReclaim,
  writeCgdaIncentiveClaim,
  writeCgdaIncentiveReclaim,
} from '@boostxyz/evm';
import { bytecode } from '@boostxyz/evm/artifacts/contracts/incentives/CGDAIncentive.sol/CGDAIncentive.json';
import type { Address, Hex } from 'viem';
import type {
  DeployableOptions,
  GenericDeployableParams,
} from '../Deployable/Deployable';
import { DeployableTarget } from '../Deployable/DeployableTarget';
import type { CallParams } from '../utils';

export type { CGDAIncentivePayload };

export class CGDAIncentive extends DeployableTarget<CGDAIncentivePayload> {
  public static base = import.meta.env.VITE_CGDA_INCENTIVE_BASE;

  public async claims(params: CallParams<typeof readCgdaIncentiveClaims> = {}) {
    return readCgdaIncentiveClaims(this._config, {
      address: this.assertValidAddress(),
      args: [],
      ...params,
    });
  }

  public async reward(params: CallParams<typeof readCgdaIncentiveReward> = {}) {
    return readCgdaIncentiveReward(this._config, {
      address: this.assertValidAddress(),
      args: [],
      ...params,
    });
  }

  public async claimed(
    address: Address,
    params: CallParams<typeof readCgdaIncentiveClaimed> = {},
  ) {
    return readCgdaIncentiveClaimed(this._config, {
      address: this.assertValidAddress(),
      args: [address],
      ...params,
    });
  }

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

  public async claim(
    payload: ClaimPayload,
    params: CallParams<typeof writeCgdaIncentiveClaim> = {},
  ) {
    return this.awaitResult(
      this.claimRaw(payload, params),
      cgdaIncentiveAbi,
      simulateCgdaIncentiveClaim,
    );
  }

  public async claimRaw(
    payload: ClaimPayload,
    params: CallParams<typeof writeCgdaIncentiveClaim> = {},
  ) {
    return writeCgdaIncentiveClaim(this._config, {
      address: this.assertValidAddress(),
      args: [prepareClaimPayload(payload)],
      ...params,
    });
  }

  public async reclaim(
    payload: ClaimPayload,
    params: CallParams<typeof writeCgdaIncentiveReclaim> = {},
  ) {
    return this.awaitResult(
      this.reclaimRaw(payload, params),
      cgdaIncentiveAbi,
      simulateCgdaIncentiveReclaim,
    );
  }

  public async reclaimRaw(
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

  public async supportsInterface(
    interfaceId: Hex,
    params: CallParams<typeof readCgdaIncentiveSupportsInterface> = {},
  ) {
    return readCgdaIncentiveSupportsInterface(this._config, {
      address: this.assertValidAddress(),
      ...this.optionallyAttachAccount(),
      ...params,
      args: [interfaceId],
    });
  }

  public async getComponentInterface(
    params: CallParams<typeof readCgdaIncentiveGetComponentInterface> = {},
  ) {
    return readCgdaIncentiveGetComponentInterface(this._config, {
      address: this.assertValidAddress(),
      ...this.optionallyAttachAccount(),
      ...params,
      args: [],
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
      abi: cgdaIncentiveAbi,
      bytecode: bytecode as Hex,
      args: [prepareCGDAIncentivePayload(payload)],
      ...this.optionallyAttachAccount(options.account),
    };
  }
}
