import {
  type PrepareAllowListIncentivePayload,
  prepareAllowListIncentivePayload,
  readAllowListIncentiveAllowList,
  readAllowListIncentiveIsClaimable,
  readAllowListIncentiveLimit,
  writeAllowListIncentiveClaim,
} from '@boostxyz/evm';
import AllowListIncentiveArtifact from '@boostxyz/evm/artifacts/contracts/incentives/AllowListIncentive.sol/AllowListIncentive.json';
import type { Config } from '@wagmi/core';
import { type Hex, zeroAddress } from 'viem';
import { SimpleAllowList } from '../AllowLists/AllowList';
import {
  Deployable,
  type GenericDeployableParams,
} from '../Deployable/Deployable';
import { DeployableAddressRequiredError } from '../errors';

export type { PrepareAllowListIncentivePayload };

export class AllowListIncentive extends Deployable {
  protected payload: PrepareAllowListIncentivePayload = {
    allowList: zeroAddress,
    limit: 0n,
  };

  constructor(config: PrepareAllowListIncentivePayload) {
    super();
    this.payload = {
      ...this.payload,
      ...config,
    };
  }

  public async allowList(config: Config): Promise<SimpleAllowList> {
    if (!this.address) throw new DeployableAddressRequiredError();
    const address = await readAllowListIncentiveAllowList(config, {
      address: this.address,
    });
    return new SimpleAllowList().at(address);
  }

  public async limit(config: Config) {
    if (!this.address) throw new DeployableAddressRequiredError();
    return readAllowListIncentiveLimit(config, {
      address: this.address,
    });
  }

  // use prepareClaimPayload
  public async claim(data: Hex, config: Config) {
    if (!this.address) throw new DeployableAddressRequiredError();
    return writeAllowListIncentiveClaim(config, {
      address: this.address,
      args: [data],
    });
  }

  // use prepareClaimPayload?
  public async isClaimable(data: Hex, config: Config) {
    if (!this.address) throw new DeployableAddressRequiredError();
    return readAllowListIncentiveIsClaimable(config, {
      address: this.address,
      args: [data],
    });
  }

  public override buildParameters(_config: Config): GenericDeployableParams {
    return {
      abi: AllowListIncentiveArtifact.abi,
      bytecode: AllowListIncentiveArtifact.bytecode as Hex,
      args: [prepareAllowListIncentivePayload(this.payload)],
    };
  }
}
