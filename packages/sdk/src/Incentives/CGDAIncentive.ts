import {
  type CGDAIncentivePayload,
  type CGDAParameters,
  type ClaimPayload,
  RegistryType,
  cgdaIncentiveAbi,
  prepareCGDAIncentivePayload,
  prepareClaimPayload,
  readCgdaIncentiveAsset,
  readCgdaIncentiveCgdaParams,
  readCgdaIncentiveClaimed,
  readCgdaIncentiveClaims,
  readCgdaIncentiveCurrentReward,
  readCgdaIncentiveGetComponentInterface,
  readCgdaIncentiveIsClaimable,
  readCgdaIncentiveReward,
  readCgdaIncentiveSupportsInterface,
  readCgdaIncentiveTotalBudget,
  simulateCgdaIncentiveClaim,
  simulateCgdaIncentiveReclaim,
  writeCgdaIncentiveClaim,
  writeCgdaIncentiveReclaim,
} from '@boostxyz/evm';
import { bytecode } from '@boostxyz/evm/artifacts/contracts/incentives/CGDAIncentive.sol/CGDAIncentive.json';
import type { Address, Hex } from 'viem';
import type {
  DeployableOptions,
  GenericDeployableParams,
} from '../Deployable/Deployable';
import { DeployableTarget } from '../Deployable/DeployableTarget';
import type { ReadParams, WriteParams } from '../utils';

export type { CGDAIncentivePayload };

export class CGDAIncentive extends DeployableTarget<CGDAIncentivePayload> {
  public static override base = import.meta.env.VITE_CGDA_INCENTIVE_BASE;
  public static override registryType: RegistryType = RegistryType.INCENTIVE;

  constructor(options: DeployableOptions, payload: CGDAIncentivePayload) {
    super(options, payload, true);
  }

  public async claims(params?: ReadParams<typeof cgdaIncentiveAbi, 'claims'>) {
    return readCgdaIncentiveClaims(this._config, {
      address: this.assertValidAddress(),
      args: [],
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  public async reward(params?: ReadParams<typeof cgdaIncentiveAbi, 'reward'>) {
    return readCgdaIncentiveReward(this._config, {
      address: this.assertValidAddress(),
      args: [],
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  public async claimed(
    address: Address,
    params?: ReadParams<typeof cgdaIncentiveAbi, 'claimed'>,
  ) {
    return readCgdaIncentiveClaimed(this._config, {
      address: this.assertValidAddress(),
      args: [address],
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  public async asset(params?: ReadParams<typeof cgdaIncentiveAbi, 'asset'>) {
    return readCgdaIncentiveAsset(this._config, {
      address: this.assertValidAddress(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  public async cgdaParams(
    params?: ReadParams<typeof cgdaIncentiveAbi, 'cgdaParams'>,
  ): Promise<CGDAParameters> {
    const [rewardDecay, rewardBoost, lastClaimTime, currentReward] =
      await readCgdaIncentiveCgdaParams(this._config, {
        address: this.assertValidAddress(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      });
    return {
      rewardDecay,
      rewardBoost,
      lastClaimTime,
      currentReward,
    };
  }

  public async totalBudget(
    params?: ReadParams<typeof cgdaIncentiveAbi, 'totalBudget'>,
  ) {
    return readCgdaIncentiveTotalBudget(this._config, {
      address: this.assertValidAddress(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  public async claim(
    payload: ClaimPayload,
    params?: WriteParams<typeof cgdaIncentiveAbi, 'claim'>,
  ) {
    return this.awaitResult(this.claimRaw(payload, params));
  }

  public async claimRaw(
    payload: ClaimPayload,
    params?: WriteParams<typeof cgdaIncentiveAbi, 'claim'>,
  ) {
    const { request, result } = await simulateCgdaIncentiveClaim(this._config, {
      address: this.assertValidAddress(),
      args: [prepareClaimPayload(payload)],
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
    const hash = await writeCgdaIncentiveClaim(this._config, request);
    return { hash, result };
  }

  public async reclaim(
    payload: ClaimPayload,
    params?: WriteParams<typeof cgdaIncentiveAbi, 'reclaim'>,
  ) {
    return this.awaitResult(this.reclaimRaw(payload, params));
  }

  public async reclaimRaw(
    payload: ClaimPayload,
    params?: WriteParams<typeof cgdaIncentiveAbi, 'reclaim'>,
  ) {
    const { request, result } = await simulateCgdaIncentiveReclaim(
      this._config,
      {
        address: this.assertValidAddress(),
        args: [prepareClaimPayload(payload)],
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      },
    );
    const hash = await writeCgdaIncentiveReclaim(this._config, request);
    return { hash, result };
  }

  public async isClaimable(
    payload: ClaimPayload,
    params?: ReadParams<typeof cgdaIncentiveAbi, 'isClaimable'>,
  ) {
    return readCgdaIncentiveIsClaimable(this._config, {
      address: this.assertValidAddress(),
      args: [prepareClaimPayload(payload)],
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  public async currentReward(
    params?: ReadParams<typeof cgdaIncentiveAbi, 'currentReward'>,
  ) {
    return readCgdaIncentiveCurrentReward(this._config, {
      address: this.assertValidAddress(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  public async supportsInterface(
    interfaceId: Hex,
    params?: ReadParams<typeof cgdaIncentiveAbi, 'supportsInterface'>,
  ) {
    return readCgdaIncentiveSupportsInterface(this._config, {
      address: this.assertValidAddress(),
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
      args: [interfaceId],
    });
  }

  public async getComponentInterface(
    params?: ReadParams<typeof cgdaIncentiveAbi, 'getComponentInterface'>,
  ) {
    return readCgdaIncentiveGetComponentInterface(this._config, {
      address: this.assertValidAddress(),
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
      args: [],
    });
  }

  public override buildParameters(
    _payload?: CGDAIncentivePayload,
    _options?: DeployableOptions,
  ): GenericDeployableParams {
    const [payload, options] = this.validateDeploymentConfig(
      _payload,
      _options,
    );
    return {
      abi: cgdaIncentiveAbi,
      bytecode: bytecode as Hex,
      args: [prepareCGDAIncentivePayload(payload)],
      ...this.optionallyAttachAccount(options.account),
    };
  }
}
