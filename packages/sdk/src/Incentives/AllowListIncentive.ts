import {
  type AllowListIncentivePayload,
  type ClaimPayload,
  prepareAllowListIncentivePayload,
  prepareClaimPayload,
  readAllowListIncentiveAllowList,
  readAllowListIncentiveIsClaimable,
  readAllowListIncentiveLimit,
  writeAllowListIncentiveClaim,
} from '@boostxyz/evm';
import AllowListIncentiveArtifact from '@boostxyz/evm/artifacts/contracts/incentives/AllowListIncentive.sol/AllowListIncentive.json';
import type { Config } from '@wagmi/core';
import type { Hex } from 'viem';
import { SimpleAllowList } from '../AllowLists/AllowList';
import {
  Deployable,
  type GenericDeployableParams,
} from '../Deployable/Deployable';
import type { CallParams } from '../utils';

export type { AllowListIncentivePayload };

export class AllowListIncentive extends Deployable<AllowListIncentivePayload> {
  public async allowList(
    params: CallParams<typeof readAllowListIncentiveAllowList> = {},
  ): Promise<SimpleAllowList> {
    const address = await readAllowListIncentiveAllowList(this._config, {
      address: this.assertValidAddress(),
      ...params,
    });
    return new SimpleAllowList(this._config, address);
  }

  public async limit(
    params: CallParams<typeof readAllowListIncentiveLimit> = {},
  ) {
    return readAllowListIncentiveLimit(this._config, {
      address: this.assertValidAddress(),
      ...params,
    });
  }

  // use prepareClaimPayload
  public async claim(
    payload: ClaimPayload,
    params: CallParams<typeof writeAllowListIncentiveClaim> = {},
  ) {
    return writeAllowListIncentiveClaim(this._config, {
      address: this.assertValidAddress(),
      args: [prepareClaimPayload(payload)],
      ...params,
    });
  }

  // use prepareClaimPayload?
  public async isClaimable(
    payload: ClaimPayload,
    params: CallParams<typeof readAllowListIncentiveIsClaimable> = {},
  ) {
    return readAllowListIncentiveIsClaimable(this._config, {
      address: this.assertValidAddress(),
      args: [prepareClaimPayload(payload)],
      ...params,
    });
  }

  public override buildParameters(
    _payload?: AllowListIncentivePayload,
    _config?: Config,
  ): GenericDeployableParams {
    const [payload] = this.validateDeploymentConfig(_payload, _config);
    return {
      abi: AllowListIncentiveArtifact.abi,
      bytecode: AllowListIncentiveArtifact.bytecode as Hex,
      args: [prepareAllowListIncentivePayload(payload)],
    };
  }
}
