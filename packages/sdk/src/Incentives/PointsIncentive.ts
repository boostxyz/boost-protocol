import type { Config } from '@wagmi/core';
import type { Hex } from 'viem';
import {
  type ClaimPayload,
  type PointsIncentivePayload,
  prepareClaimPayload,
  preparePointsIncentivePayload,
  readPointsIncentiveIsClaimable,
  readPointsIncentiveLimit,
  readPointsIncentiveQuantity,
  readPointsIncentiveSelector,
  readPointsIncentiveVenue,
  writePointsIncentiveClaim,
} from '../../../evm/artifacts';
import PointsIncentiveArtifact from '../../../evm/artifacts/contracts/incentives/PointsIncentive.sol/PointsIncentive.json';
import {
  Deployable,
  type GenericDeployableParams,
} from '../Deployable/Deployable';
import type { CallParams } from '../utils';

export type { PointsIncentivePayload };

export class PointsIncentive extends Deployable<PointsIncentivePayload> {
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

  //prepareClaimPayload
  public async claim(
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
    _config?: Config,
  ): GenericDeployableParams {
    const [payload] = this.validateDeploymentConfig(_payload, _config);
    return {
      abi: PointsIncentiveArtifact.abi,
      bytecode: PointsIncentiveArtifact.bytecode as Hex,
      args: [preparePointsIncentivePayload(payload)],
    };
  }
}