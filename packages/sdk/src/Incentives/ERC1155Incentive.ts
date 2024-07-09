import {
  type ClaimPayload,
  type ERC1155IncentivePayload,
  type ERC1155StrategyType,
  type StrategyType,
  erc1155IncentiveAbi,
  prepareClaimPayload,
  prepareERC1155IncentivePayload,
  readErc1155IncentiveAsset,
  readErc1155IncentiveClaimed,
  readErc1155IncentiveClaims,
  readErc1155IncentiveExtraData,
  readErc1155IncentiveGetComponentInterface,
  readErc1155IncentiveIsClaimable,
  readErc1155IncentiveLimit,
  readErc1155IncentivePreflight,
  readErc1155IncentiveReward,
  readErc1155IncentiveStrategy,
  readErc1155IncentiveTokenId,
  readErc1155SupportsInterface,
  simulateErc1155IncentiveClaim,
  simulateErc1155IncentiveReclaim,
  writeErc1155IncentiveClaim,
  writeErc1155IncentiveReclaim,
} from '@boostxyz/evm';
import { bytecode } from '@boostxyz/evm/artifacts/contracts/incentives/ERC1155Incentive.sol/ERC1155Incentive.json';
import type { Address, Hex } from 'viem';
import type {
  DeployableOptions,
  GenericDeployableParams,
} from '../Deployable/Deployable';
import { DeployableTarget } from '../Deployable/DeployableTarget';
import type { ReadParams, WriteParams } from '../utils';

export type { ERC1155IncentivePayload, ERC1155StrategyType };

export class ERC1155Incentive extends DeployableTarget<ERC1155IncentivePayload> {
  public static base = import.meta.env.VITE_ERC1155_INCENTIVE_BASE;
  public override readonly base = ERC1155Incentive.base;

  public async claims(
    params?: ReadParams<typeof erc1155IncentiveAbi, 'claims'>,
  ) {
    return readErc1155IncentiveClaims(this._config, {
      address: this.assertValidAddress(),
      args: [],
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  public async reward(
    params?: ReadParams<typeof erc1155IncentiveAbi, 'reward'>,
  ) {
    return readErc1155IncentiveReward(this._config, {
      address: this.assertValidAddress(),
      args: [],
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  public async claimed(
    address: Address,
    params?: ReadParams<typeof erc1155IncentiveAbi, 'claimed'>,
  ) {
    return readErc1155IncentiveClaimed(this._config, {
      address: this.assertValidAddress(),
      args: [address],
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  public async asset(params?: ReadParams<typeof erc1155IncentiveAbi, 'asset'>) {
    return readErc1155IncentiveAsset(this._config, {
      address: this.assertValidAddress(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  public async strategy(
    params?: ReadParams<typeof erc1155IncentiveAbi, 'strategy'>,
  ): Promise<StrategyType> {
    return readErc1155IncentiveStrategy(this._config, {
      address: this.assertValidAddress(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    }) as Promise<StrategyType>;
  }

  public async limit(params?: ReadParams<typeof erc1155IncentiveAbi, 'limit'>) {
    return readErc1155IncentiveLimit(this._config, {
      address: this.assertValidAddress(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  public async tokenId(
    params?: ReadParams<typeof erc1155IncentiveAbi, 'tokenId'>,
  ) {
    return readErc1155IncentiveTokenId(this._config, {
      address: this.assertValidAddress(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  public async extraData(
    params?: ReadParams<typeof erc1155IncentiveAbi, 'extraData'>,
  ) {
    return readErc1155IncentiveExtraData(this._config, {
      address: this.assertValidAddress(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  public async claim(
    payload: ClaimPayload,
    params?: WriteParams<typeof erc1155IncentiveAbi, 'claim'>,
  ) {
    return this.awaitResult(this.claimRaw(payload, params));
  }

  public async claimRaw(
    payload: ClaimPayload,
    params?: WriteParams<typeof erc1155IncentiveAbi, 'claim'>,
  ) {
    const { request, result } = await simulateErc1155IncentiveClaim(
      this._config,
      {
        address: this.assertValidAddress(),
        args: [prepareClaimPayload(payload)],
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      },
    );
    const hash = await writeErc1155IncentiveClaim(this._config, request);
    return { hash, result };
  }

  public async reclaim(
    payload: ClaimPayload,
    params?: WriteParams<typeof erc1155IncentiveAbi, 'reclaim'>,
  ) {
    return this.awaitResult(this.reclaimRaw(payload, params));
  }

  public async reclaimRaw(
    payload: ClaimPayload,
    params?: WriteParams<typeof erc1155IncentiveAbi, 'reclaim'>,
  ) {
    const { request, result } = await simulateErc1155IncentiveReclaim(
      this._config,
      {
        address: this.assertValidAddress(),
        args: [prepareClaimPayload(payload)],
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      },
    );
    const hash = await writeErc1155IncentiveReclaim(this._config, request);
    return { hash, result };
  }

  public async isClaimable(
    payload: ClaimPayload,
    params?: ReadParams<typeof erc1155IncentiveAbi, 'isClaimable'>,
  ) {
    return readErc1155IncentiveIsClaimable(this._config, {
      address: this.assertValidAddress(),
      args: [prepareClaimPayload(payload)],
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  public async preflight(
    data: ERC1155IncentivePayload,
    params?: ReadParams<typeof erc1155IncentiveAbi, 'preflight'>,
  ) {
    return readErc1155IncentivePreflight(this._config, {
      address: this.assertValidAddress(),
      args: [prepareERC1155IncentivePayload(data)],
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  public async supportsInterface(
    interfaceId: Hex,
    params?: ReadParams<typeof erc1155IncentiveAbi, 'supportsInterface'>,
  ) {
    return readErc1155SupportsInterface(this._config, {
      address: this.assertValidAddress(),
      args: [interfaceId],
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  public async getComponentInterface(
    params?: ReadParams<typeof erc1155IncentiveAbi, 'getComponentInterface'>,
  ) {
    return readErc1155IncentiveGetComponentInterface(this._config, {
      address: this.assertValidAddress(),
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
      args: [],
    });
  }

  public override buildParameters(
    _payload?: ERC1155IncentivePayload,
    _options?: DeployableOptions,
  ): GenericDeployableParams {
    const [payload, options] = this.validateDeploymentConfig(
      _payload,
      _options,
    );
    return {
      abi: erc1155IncentiveAbi,
      bytecode: bytecode as Hex,
      args: [prepareERC1155IncentivePayload(payload)],
      ...this.optionallyAttachAccount(options.account),
    };
  }
}
