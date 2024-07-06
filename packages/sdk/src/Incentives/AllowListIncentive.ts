import {
  type AllowListIncentivePayload,
  type ClaimPayload,
  allowListIncentiveAbi,
  prepareAllowListIncentivePayload,
  prepareClaimPayload,
  readAllowListIncentiveAllowList,
  readAllowListIncentiveClaimed,
  readAllowListIncentiveClaims,
  readAllowListIncentiveGetComponentInterface,
  readAllowListIncentiveIsClaimable,
  readAllowListIncentiveLimit,
  readAllowListIncentiveReward,
  readAllowListIncentiveSupportsInterface,
  simulateAllowListIncentiveClaim,
  writeAllowListIncentiveClaim,
} from '@boostxyz/evm';
import { bytecode } from '@boostxyz/evm/artifacts/contracts/incentives/AllowListIncentive.sol/AllowListIncentive.json';
import type { Address, Hex } from 'viem';
import { SimpleAllowList } from '../AllowLists/AllowList';
import type {
  DeployableOptions,
  GenericDeployableParams,
} from '../Deployable/Deployable';
import { DeployableTarget } from '../Deployable/DeployableTarget';
import type { CallParams } from '../utils';

export type { AllowListIncentivePayload };

export class AllowListIncentive extends DeployableTarget<AllowListIncentivePayload> {
  public static base = import.meta.env.VITE_ALLOWLIST_INCENTIVE_BASE;
  public override readonly base = AllowListIncentive.base;

  public async claims(
    params: CallParams<typeof readAllowListIncentiveClaims> = {},
  ) {
    return readAllowListIncentiveClaims(this._config, {
      address: this.assertValidAddress(),
      args: [],
      ...params,
    });
  }

  public async reward(
    params: CallParams<typeof readAllowListIncentiveReward> = {},
  ) {
    return readAllowListIncentiveReward(this._config, {
      address: this.assertValidAddress(),
      args: [],
      ...params,
    });
  }

  public async claimed(
    address: Address,
    params: CallParams<typeof readAllowListIncentiveClaimed> = {},
  ) {
    return readAllowListIncentiveClaimed(this._config, {
      address: this.assertValidAddress(),
      args: [address],
      ...params,
    });
  }

  public async allowList(
    params: CallParams<typeof readAllowListIncentiveAllowList> = {},
  ): Promise<SimpleAllowList> {
    const address = await readAllowListIncentiveAllowList(this._config, {
      address: this.assertValidAddress(),
      ...params,
    });
    return new SimpleAllowList(
      { config: this._config, account: this._account },
      address,
    );
  }

  public async limit(
    params: CallParams<typeof readAllowListIncentiveLimit> = {},
  ) {
    return readAllowListIncentiveLimit(this._config, {
      address: this.assertValidAddress(),
      ...params,
    });
  }

  public async claim(
    payload: ClaimPayload,
    params: CallParams<typeof writeAllowListIncentiveClaim> = {},
  ) {
    return this.awaitResult(
      this.claimRaw(payload, params),
      allowListIncentiveAbi,
      simulateAllowListIncentiveClaim,
    );
  }

  public async claimRaw(
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

  public async supportsInterface(
    interfaceId: Hex,
    params: CallParams<typeof readAllowListIncentiveSupportsInterface> = {},
  ) {
    return readAllowListIncentiveSupportsInterface(this._config, {
      address: this.assertValidAddress(),
      ...this.optionallyAttachAccount(),
      ...params,
      args: [interfaceId],
    });
  }

  public async getComponentInterface(
    params: CallParams<typeof readAllowListIncentiveGetComponentInterface> = {},
  ) {
    return readAllowListIncentiveGetComponentInterface(this._config, {
      address: this.assertValidAddress(),
      ...this.optionallyAttachAccount(),
      ...params,
      args: [],
    });
  }

  public override buildParameters(
    _payload?: AllowListIncentivePayload,
    _options?: DeployableOptions,
  ): GenericDeployableParams {
    const [payload, options] = this.validateDeploymentConfig(
      _payload,
      _options,
    );
    return {
      abi: allowListIncentiveAbi,
      bytecode: bytecode as Hex,
      args: [prepareAllowListIncentivePayload(payload)],
      ...this.optionallyAttachAccount(options.account),
    };
  }
}
