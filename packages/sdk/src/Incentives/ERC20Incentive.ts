import {
  type ERC20IncentivePayload,
  type PrepareERC20IncentivePayload,
  StrategyType,
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
import { type Hex, zeroAddress } from 'viem';
import {
  Deployable,
  type GenericDeployableParams,
} from '../Deployable/Deployable';
import { DeployableAddressRequiredError } from '../errors';

export type { PrepareERC20IncentivePayload };

export class ERC20Incentive extends Deployable {
  protected payload: PrepareERC20IncentivePayload = {
    asset: zeroAddress,
    strategy: StrategyType.POOL,
    reward: 0n,
    limit: 0n,
  };

  constructor(config: PrepareERC20IncentivePayload) {
    super();
    this.payload = {
      ...this.payload,
      ...config,
    };
  }

  public async asset(config: Config) {
    if (!this.address) throw new DeployableAddressRequiredError();
    return readErc20IncentiveAsset(config, {
      address: this.address,
    });
  }

  public async strategy(config: Config): Promise<StrategyType> {
    if (!this.address) throw new DeployableAddressRequiredError();
    return readErc20IncentiveStrategy(config, {
      address: this.address,
    }) as Promise<StrategyType>;
  }

  public async reward(config: Config) {
    if (!this.address) throw new DeployableAddressRequiredError();
    return readErc20IncentiveReward(config, {
      address: this.address,
    });
  }

  public async limit(config: Config) {
    if (!this.address) throw new DeployableAddressRequiredError();
    return readErc20IncentiveLimit(config, {
      address: this.address,
    });
  }

  public async entries(i: bigint, config: Config) {
    if (!this.address) throw new DeployableAddressRequiredError();
    return readErc20IncentiveEntries(config, {
      address: this.address,
      args: [i],
    });
  }

  //prepareClaimPayload
  public async claim(data: Hex, config: Config) {
    if (!this.address) throw new DeployableAddressRequiredError();
    return writeErc20IncentiveClaim(config, {
      address: this.address,
      args: [data],
    });
  }

  //prepareClaimPayload
  public async reclaim(data: Hex, config: Config) {
    if (!this.address) throw new DeployableAddressRequiredError();
    return writeErc20IncentiveReclaim(config, {
      address: this.address,
      args: [data],
    });
  }

  //prepareClaimPayload
  public async isClaimable(data: Hex, config: Config) {
    if (!this.address) throw new DeployableAddressRequiredError();
    return readErc20IncentiveIsClaimable(config, {
      address: this.address,
      args: [data],
    });
  }

  public async preflight(data: ERC20IncentivePayload, config: Config) {
    if (!this.address) throw new DeployableAddressRequiredError();
    return readErc20IncentivePreflight(config, {
      address: this.address,
      args: [prepareERC20IncentivePayload(data)],
    });
  }

  public async drawRaffle(config: Config) {
    if (!this.address) throw new DeployableAddressRequiredError();
    return writeErc20IncentiveDrawRaffle(config, {
      address: this.address,
    });
  }

  public override buildParameters(_config: Config): GenericDeployableParams {
    return {
      abi: ERC20IncentiveArtifact.abi,
      bytecode: ERC20IncentiveArtifact.bytecode as Hex,
      args: [prepareERC20IncentivePayload(this.payload)],
    };
  }
}
