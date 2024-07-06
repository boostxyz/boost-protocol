import {
  type ClaimPayload,
  type PointsIncentivePayload,
  pointsIncentiveAbi,
  prepareClaimPayload,
  preparePointsIncentivePayload,
  readPointsIncentiveClaimed,
  readPointsIncentiveClaims,
  readPointsIncentiveCurrentReward,
  readPointsIncentiveGetComponentInterface,
  readPointsIncentiveIsClaimable,
  readPointsIncentiveLimit,
  readPointsIncentiveReward,
  readPointsIncentiveSelector,
  readPointsIncentiveSupportsInterface,
  readPointsIncentiveVenue,
  simulatePointsIncentiveClaim,
  writePointsIncentiveClaim,
} from '@boostxyz/evm';
import { bytecode } from '@boostxyz/evm/artifacts/contracts/incentives/PointsIncentive.sol/PointsIncentive.json';
import type { Address, Hex } from 'viem';
import type {
  DeployableOptions,
  GenericDeployableParams,
} from '../Deployable/Deployable';
import { DeployableTarget } from '../Deployable/DeployableTarget';
import type { CallParams } from '../utils';

export type { PointsIncentivePayload };

export class PointsIncentive extends DeployableTarget<PointsIncentivePayload> {
  public static base = import.meta.env.VITE_POINTS_INCENTIVE_BASE;
  public override readonly base = PointsIncentive.base;

  public async claims(
    params: CallParams<typeof readPointsIncentiveClaims> = {},
  ) {
    return readPointsIncentiveClaims(this._config, {
      address: this.assertValidAddress(),
      args: [],
      ...params,
    });
  }

  public async currentReward(
    params: CallParams<typeof readPointsIncentiveCurrentReward> = {},
  ) {
    return readPointsIncentiveCurrentReward(this._config, {
      address: this.assertValidAddress(),
      args: [],
      ...params,
    });
  }

  public async reward(
    params: CallParams<typeof readPointsIncentiveReward> = {},
  ) {
    return readPointsIncentiveReward(this._config, {
      address: this.assertValidAddress(),
      args: [],
      ...params,
    });
  }

  public async claimed(
    address: Address,
    params: CallParams<typeof readPointsIncentiveClaimed> = {},
  ) {
    return readPointsIncentiveClaimed(this._config, {
      address: this.assertValidAddress(),
      args: [address],
      ...params,
    });
  }

  public async venue(params: CallParams<typeof readPointsIncentiveVenue> = {}) {
    return readPointsIncentiveVenue(this._config, {
      address: this.assertValidAddress(),
      ...params,
    });
  }

  public async limit(params: CallParams<typeof readPointsIncentiveLimit> = {}) {
    return readPointsIncentiveLimit(this._config, {
      address: this.assertValidAddress(),
      ...params,
    });
  }

  public async selector(
    params: CallParams<typeof readPointsIncentiveSelector> = {},
  ) {
    return readPointsIncentiveSelector(this._config, {
      address: this.assertValidAddress(),
      ...params,
    });
  }

  public async claim(
    payload: ClaimPayload,
    params: CallParams<typeof writePointsIncentiveClaim> = {},
  ) {
    return this.awaitResult(
      this.claimRaw(payload, params),
      pointsIncentiveAbi,
      simulatePointsIncentiveClaim,
    );
  }

  public async claimRaw(
    payload: ClaimPayload,
    params: CallParams<typeof writePointsIncentiveClaim> = {},
  ) {
    return writePointsIncentiveClaim(this._config, {
      address: this.assertValidAddress(),
      args: [prepareClaimPayload(payload)],
      ...params,
    });
  }

  //prepareClaimPayload
  public async isClaimable(
    payload: ClaimPayload,
    params: CallParams<typeof readPointsIncentiveIsClaimable> = {},
  ) {
    return readPointsIncentiveIsClaimable(this._config, {
      address: this.assertValidAddress(),
      args: [prepareClaimPayload(payload)],
      ...params,
    });
  }

  public async supportsInterface(
    interfaceId: Hex,
    params: CallParams<typeof readPointsIncentiveSupportsInterface> = {},
  ) {
    return readPointsIncentiveSupportsInterface(this._config, {
      address: this.assertValidAddress(),
      args: [interfaceId],
      ...params,
    });
  }

  public async getComponentInterface(
    params: CallParams<typeof readPointsIncentiveGetComponentInterface> = {},
  ) {
    return readPointsIncentiveGetComponentInterface(this._config, {
      address: this.assertValidAddress(),
      ...this.optionallyAttachAccount(),
      ...params,
      args: [],
    });
  }

  public override buildParameters(
    _payload?: PointsIncentivePayload,
    _options?: DeployableOptions,
  ): GenericDeployableParams {
    const [payload, options] = this.validateDeploymentConfig(
      _payload,
      _options,
    );
    return {
      abi: pointsIncentiveAbi,
      bytecode: bytecode as Hex,
      args: [preparePointsIncentivePayload(payload)],
      ...this.optionallyAttachAccount(options.account),
    };
  }
}
