import {
  type ClaimPayload,
  type ERC20IncentivePayload,
  RegistryType,
  type StrategyType,
  erc20IncentiveAbi,
  prepareClaimPayload,
  prepareERC20IncentivePayload,
  readErc20IncentiveAsset,
  readErc20IncentiveClaimed,
  readErc20IncentiveClaims,
  readErc20IncentiveCurrentReward,
  readErc20IncentiveEntries,
  readErc20IncentiveGetComponentInterface,
  readErc20IncentiveIsClaimable,
  readErc20IncentiveLimit,
  readErc20IncentiveReward,
  readErc20IncentiveStrategy,
  readErc20IncentiveSupportsInterface,
  simulateErc20IncentiveClaim,
  simulateErc20IncentiveDrawRaffle,
  simulateErc20IncentiveReclaim,
  writeErc20IncentiveClaim,
  writeErc20IncentiveDrawRaffle,
  writeErc20IncentiveReclaim,
} from '@boostxyz/evm';
import { bytecode } from '@boostxyz/evm/artifacts/contracts/incentives/ERC20Incentive.sol/ERC20Incentive.json';
import type { Address, Hex } from 'viem';
import type {
  DeployableOptions,
  GenericDeployableParams,
} from '../Deployable/Deployable';
import { DeployableTarget } from '../Deployable/DeployableTarget';
import type { ReadParams, WriteParams } from '../utils';

export type { ERC20IncentivePayload };

export class ERC20Incentive extends DeployableTarget<ERC20IncentivePayload> {
  public static override base = import.meta.env.VITE_ERC20_INCENTIVE_BASE;
  public static override registryType: RegistryType = RegistryType.INCENTIVE;

  constructor(options: DeployableOptions, payload: ERC20IncentivePayload) {
    super(options, payload, true);
  }

  public async currentReward(
    params?: ReadParams<typeof erc20IncentiveAbi, 'currentReward'>,
  ) {
    return readErc20IncentiveCurrentReward(this._config, {
      address: this.assertValidAddress(),
      args: [],
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  public async claims(params?: ReadParams<typeof erc20IncentiveAbi, 'claims'>) {
    return readErc20IncentiveClaims(this._config, {
      address: this.assertValidAddress(),
      args: [],
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  public async claimed(
    address: Address,
    params?: ReadParams<typeof erc20IncentiveAbi, 'claimed'>,
  ) {
    return readErc20IncentiveClaimed(this._config, {
      address: this.assertValidAddress(),
      args: [address],
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  public async asset(params?: ReadParams<typeof erc20IncentiveAbi, 'asset'>) {
    return readErc20IncentiveAsset(this._config, {
      address: this.assertValidAddress(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  public async strategy(
    params?: ReadParams<typeof erc20IncentiveAbi, 'strategy'>,
  ): Promise<StrategyType> {
    return readErc20IncentiveStrategy(this._config, {
      address: this.assertValidAddress(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    }) as Promise<StrategyType>;
  }

  public async reward(params?: ReadParams<typeof erc20IncentiveAbi, 'reward'>) {
    return readErc20IncentiveReward(this._config, {
      address: this.assertValidAddress(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  public async limit(params?: ReadParams<typeof erc20IncentiveAbi, 'limit'>) {
    return readErc20IncentiveLimit(this._config, {
      address: this.assertValidAddress(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  public async entries(
    i: bigint,
    params?: ReadParams<typeof erc20IncentiveAbi, 'entries'>,
  ) {
    return readErc20IncentiveEntries(this._config, {
      address: this.assertValidAddress(),
      args: [i],
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  public async claim(
    payload: ClaimPayload,
    params?: WriteParams<typeof erc20IncentiveAbi, 'claim'>,
  ) {
    return this.awaitResult(this.claimRaw(payload, params));
  }

  public async claimRaw(
    payload: ClaimPayload,
    params?: WriteParams<typeof erc20IncentiveAbi, 'claim'>,
  ) {
    const { request, result } = await simulateErc20IncentiveClaim(
      this._config,
      {
        address: this.assertValidAddress(),
        args: [prepareClaimPayload(payload)],
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      },
    );
    const hash = await writeErc20IncentiveClaim(this._config, request);
    return { hash, result };
  }

  public async reclaim(
    payload: ClaimPayload,
    params?: WriteParams<typeof erc20IncentiveAbi, 'reclaim'>,
  ) {
    return this.awaitResult(this.reclaimRaw(payload, params));
  }

  public async reclaimRaw(
    payload: ClaimPayload,
    params?: WriteParams<typeof erc20IncentiveAbi, 'reclaim'>,
  ) {
    const { request, result } = await simulateErc20IncentiveReclaim(
      this._config,
      {
        address: this.assertValidAddress(),
        args: [prepareClaimPayload(payload)],
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      },
    );
    const hash = await writeErc20IncentiveReclaim(this._config, request);
    return { hash, result };
  }

  public async isClaimable(
    payload: ClaimPayload,
    params?: ReadParams<typeof erc20IncentiveAbi, 'isClaimable'>,
  ) {
    return readErc20IncentiveIsClaimable(this._config, {
      address: this.assertValidAddress(),
      args: [prepareClaimPayload(payload)],
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  public async drawRaffle(
    params?: WriteParams<typeof erc20IncentiveAbi, 'drawRaffle'>,
  ) {
    return this.awaitResult(this.drawRaffleRaw(params));
  }

  public async drawRaffleRaw(
    params?: WriteParams<typeof erc20IncentiveAbi, 'drawRaffle'>,
  ) {
    const { request, result } = await simulateErc20IncentiveDrawRaffle(
      this._config,
      {
        address: this.assertValidAddress(),
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      },
    );
    const hash = await writeErc20IncentiveDrawRaffle(this._config, request);
    return { hash, result };
  }

  public async supportsInterface(
    interfaceId: Hex,
    params?: ReadParams<typeof erc20IncentiveAbi, 'supportsInterface'>,
  ) {
    return readErc20IncentiveSupportsInterface(this._config, {
      address: this.assertValidAddress(),
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
      args: [interfaceId],
    });
  }

  public async getComponentInterface(
    params?: ReadParams<typeof erc20IncentiveAbi, 'getComponentInterface'>,
  ) {
    return readErc20IncentiveGetComponentInterface(this._config, {
      address: this.assertValidAddress(),
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
      args: [],
    });
  }

  public override buildParameters(
    _payload?: ERC20IncentivePayload,
    _options?: DeployableOptions,
  ): GenericDeployableParams {
    const [payload, options] = this.validateDeploymentConfig(
      _payload,
      _options,
    );
    return {
      abi: erc20IncentiveAbi,
      bytecode: bytecode as Hex,
      args: [prepareERC20IncentivePayload(payload)],
      ...this.optionallyAttachAccount(options.account),
    };
  }
}
