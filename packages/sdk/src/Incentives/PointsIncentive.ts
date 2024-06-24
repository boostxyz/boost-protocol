import {
  type PreparePointsIncentivePayload,
  preparePointsIncentivePayload,
  readPointsIncentiveIsClaimable,
  readPointsIncentiveLimit,
  readPointsIncentiveQuantity,
  readPointsIncentiveSelector,
  readPointsIncentiveVenue,
  writePointsIncentiveClaim,
} from '@boostxyz/evm';
import PointsIncentiveArtifact from '@boostxyz/evm/artifacts/contracts/incentives/PointsIncentive.sol/PointsIncentive.json';
import type { Config } from '@wagmi/core';
import { type Hex, zeroAddress, zeroHash } from 'viem';
import {
  Deployable,
  type GenericDeployableParams,
} from '../Deployable/Deployable';
import { DeployableAddressRequiredError } from '../errors';

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

  public async venue(config: Config) {
    if (!this.address) throw new DeployableAddressRequiredError();
    return readPointsIncentiveVenue(config, {
      address: this.address,
    });
  }

  public async quantity(config: Config) {
    if (!this.address) throw new DeployableAddressRequiredError();
    return readPointsIncentiveQuantity(config, {
      address: this.address,
    });
  }

  public async limit(config: Config) {
    if (!this.address) throw new DeployableAddressRequiredError();
    return readPointsIncentiveLimit(config, {
      address: this.address,
    });
  }

  public async selector(config: Config) {
    if (!this.address) throw new DeployableAddressRequiredError();
    return readPointsIncentiveSelector(config, {
      address: this.address,
    });
  }

  //prepareClaimPayload
  public async claim(data: Hex, config: Config) {
    if (!this.address) throw new DeployableAddressRequiredError();
    return writePointsIncentiveClaim(config, {
      address: this.address,
      args: [data],
    });
  }

  //prepareClaimPayload
  public async isClaimable(data: Hex, config: Config) {
    if (!this.address) throw new DeployableAddressRequiredError();
    return readPointsIncentiveIsClaimable(config, {
      address: this.address,
      args: [data],
    });
  }

  public override buildParameters(_config: Config): GenericDeployableParams {
    return {
      abi: PointsIncentiveArtifact.abi,
      bytecode: PointsIncentiveArtifact.bytecode as Hex,
      args: [preparePointsIncentivePayload(this.payload)],
    };
  }
}
