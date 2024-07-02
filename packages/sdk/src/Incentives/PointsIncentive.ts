import {
  type ClaimPayload,
  type PointsIncentivePayload,
  pointsIncentiveAbi,
  prepareClaimPayload,
  preparePointsIncentivePayload,
  readPointsIncentiveIsClaimable,
  readPointsIncentiveLimit,
  readPointsIncentiveQuantity,
  readPointsIncentiveSelector,
  readPointsIncentiveVenue,
  simulatePointsIncentiveClaim,
  writePointsIncentiveClaim,
} from '@boostxyz/evm';
import { bytecode } from '@boostxyz/evm/artifacts/contracts/incentives/PointsIncentive.sol/PointsIncentive.json';
import type { Hex } from 'viem';
import type {
  DeployableOptions,
  GenericDeployableParams,
} from '../Deployable/Deployable';
import { DeployableTarget } from '../Deployable/DeployableTarget';
import type { CallParams } from '../utils';

export type { PointsIncentivePayload };

export class PointsIncentive extends DeployableTarget<PointsIncentivePayload> {
  public async venue(params: CallParams<typeof readPointsIncentiveVenue> = {}) {
    return readPointsIncentiveVenue(this._config, {
      address: this.assertValidAddress(),
      ...params,
    });
  }

  public async quantity(
    params: CallParams<typeof readPointsIncentiveQuantity> = {},
  ) {
    return readPointsIncentiveQuantity(this._config, {
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
