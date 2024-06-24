import {
  type ClaimPayload,
  type ERC20IncentivePayload,
  type StrategyType,
  prepareClaimPayload,
  prepareERC20IncentivePayload,
  readErc20IncentiveAsset,
  readErc20IncentiveEntries,
  readErc20IncentiveIsClaimable,
  readErc20IncentiveLimit,
  readErc20IncentivePreflight,
  readErc20IncentiveReward,
  readErc20IncentiveStrategy,
  writeErc20IncentiveClaim,
  writeErc20IncentiveDrawRaffle,
  writeErc20IncentiveReclaim,
} from '@boostxyz/evm';
import ERC20IncentiveArtifact from '@boostxyz/evm/artifacts/contracts/incentives/ERC20Incentive.sol/ERC20Incentive.json';
import type { Config } from '@wagmi/core';
import type { Hex } from 'viem';
import {
  Deployable,
  type GenericDeployableParams,
} from '../Deployable/Deployable';
import type { CallParams } from '../utils';

export type { ERC20IncentivePayload };

export class ERC20Incentive extends Deployable<ERC20IncentivePayload> {
  public async asset(params: CallParams<typeof readErc20IncentiveAsset> = {}) {
    return readErc20IncentiveAsset(this._config, {
      address: this.assertValidAddress(),
      ...params,
    });
  }

  public async strategy(
    params: CallParams<typeof readErc20IncentiveStrategy> = {},
  ): Promise<StrategyType> {
    return readErc20IncentiveStrategy(this._config, {
      address: this.assertValidAddress(),
      ...params,
    }) as Promise<StrategyType>;
  }

  public async reward(
    params: CallParams<typeof readErc20IncentiveReward> = {},
  ) {
    return readErc20IncentiveReward(this._config, {
      address: this.assertValidAddress(),
      ...params,
    });
  }

  public async limit(params: CallParams<typeof readErc20IncentiveLimit> = {}) {
    return readErc20IncentiveLimit(this._config, {
      address: this.assertValidAddress(),
      ...params,
    });
  }

  public async entries(
    i: bigint,
    params: CallParams<typeof readErc20IncentiveEntries> = {},
  ) {
    return readErc20IncentiveEntries(this._config, {
      address: this.assertValidAddress(),
      args: [i],
      ...params,
    });
  }

  public async claim(
    payload: ClaimPayload,
    params: CallParams<typeof writeErc20IncentiveClaim> = {},
  ) {
    return writeErc20IncentiveClaim(this._config, {
      address: this.assertValidAddress(),
      args: [prepareClaimPayload(payload)],
      ...params,
    });
  }

  //prepareClaimPayload
  public async reclaim(
    payload: ClaimPayload,
    params: CallParams<typeof writeErc20IncentiveReclaim> = {},
  ) {
    return writeErc20IncentiveReclaim(this._config, {
      address: this.assertValidAddress(),
      args: [prepareClaimPayload(payload)],
      ...params,
    });
  }

  //prepareClaimPayload
  public async isClaimable(
    payload: ClaimPayload,
    params: CallParams<typeof readErc20IncentiveIsClaimable> = {},
  ) {
    return readErc20IncentiveIsClaimable(this._config, {
      address: this.assertValidAddress(),
      args: [prepareClaimPayload(payload)],
      ...params,
    });
  }

  public async preflight(
    data: ERC20IncentivePayload,
    params: CallParams<typeof readErc20IncentivePreflight> = {},
  ) {
    return readErc20IncentivePreflight(this._config, {
      address: this.assertValidAddress(),
      args: [prepareERC20IncentivePayload(data)],
      ...params,
    });
  }

  public async drawRaffle(
    params: CallParams<typeof writeErc20IncentiveDrawRaffle> = {},
  ) {
    return writeErc20IncentiveDrawRaffle(this._config, {
      address: this.assertValidAddress(),
      ...params,
    });
  }

  public override buildParameters(
    _payload?: ERC20IncentivePayload,
    _config?: Config,
  ): GenericDeployableParams {
    const [payload] = this.validateDeploymentConfig(_payload, _config);
    return {
      abi: ERC20IncentiveArtifact.abi,
      bytecode: ERC20IncentiveArtifact.bytecode as Hex,
      args: [prepareERC20IncentivePayload(payload)],
    };
  }
}
