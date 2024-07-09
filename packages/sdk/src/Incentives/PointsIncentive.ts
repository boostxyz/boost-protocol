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
import type { ReadParams, WriteParams } from '../utils';

export type { PointsIncentivePayload };

export class PointsIncentive extends DeployableTarget<PointsIncentivePayload> {
  public static base = import.meta.env.VITE_POINTS_INCENTIVE_BASE;
  public override readonly base = PointsIncentive.base;

  public async claims(
    params?: ReadParams<typeof pointsIncentiveAbi, 'claims'>,
  ) {
    return readPointsIncentiveClaims(this._config, {
      address: this.assertValidAddress(),
      args: [],
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  public async currentReward(
    params?: ReadParams<typeof pointsIncentiveAbi, 'currentReward'>,
  ) {
    return readPointsIncentiveCurrentReward(this._config, {
      address: this.assertValidAddress(),
      args: [],
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  public async reward(
    params?: ReadParams<typeof pointsIncentiveAbi, 'reward'>,
  ) {
    return readPointsIncentiveReward(this._config, {
      address: this.assertValidAddress(),
      args: [],
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  public async claimed(
    address: Address,
    params?: ReadParams<typeof pointsIncentiveAbi, 'claimed'>,
  ) {
    return readPointsIncentiveClaimed(this._config, {
      address: this.assertValidAddress(),
      args: [address],
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  public async venue(params?: ReadParams<typeof pointsIncentiveAbi, 'venue'>) {
    return readPointsIncentiveVenue(this._config, {
      address: this.assertValidAddress(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  public async limit(params?: ReadParams<typeof pointsIncentiveAbi, 'limit'>) {
    return readPointsIncentiveLimit(this._config, {
      address: this.assertValidAddress(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  public async selector(
    params?: ReadParams<typeof pointsIncentiveAbi, 'selector'>,
  ) {
    return readPointsIncentiveSelector(this._config, {
      address: this.assertValidAddress(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  public async claim(
    payload: ClaimPayload,
    params?: WriteParams<typeof pointsIncentiveAbi, 'claim'>,
  ) {
    return this.awaitResult(
      this.claimRaw(payload, params),
      pointsIncentiveAbi,
      simulatePointsIncentiveClaim,
    );
  }

  public async claimRaw(
    payload: ClaimPayload,
    params?: WriteParams<typeof pointsIncentiveAbi, 'claim'>,
  ) {
    return writePointsIncentiveClaim(this._config, {
      address: this.assertValidAddress(),
      args: [prepareClaimPayload(payload)],
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  public async isClaimable(
    payload: ClaimPayload,
    params?: ReadParams<typeof pointsIncentiveAbi, 'isClaimable'>,
  ) {
    return readPointsIncentiveIsClaimable(this._config, {
      address: this.assertValidAddress(),
      args: [prepareClaimPayload(payload)],
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  public async supportsInterface(
    interfaceId: Hex,
    params?: ReadParams<typeof pointsIncentiveAbi, 'supportsInterface'>,
  ) {
    return readPointsIncentiveSupportsInterface(this._config, {
      address: this.assertValidAddress(),
      args: [interfaceId],
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  public async getComponentInterface(
    params?: ReadParams<typeof pointsIncentiveAbi, 'getComponentInterface'>,
  ) {
    return readPointsIncentiveGetComponentInterface(this._config, {
      address: this.assertValidAddress(),
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
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
