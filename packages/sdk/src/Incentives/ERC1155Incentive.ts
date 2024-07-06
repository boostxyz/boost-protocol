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
import type { CallParams } from '../utils';

export type { ERC1155IncentivePayload, ERC1155StrategyType };

export class ERC1155Incentive extends DeployableTarget<ERC1155IncentivePayload> {
  public static base = import.meta.env.VITE_ERC1155_INCENTIVE_BASE;
  public override readonly base = ERC1155Incentive.base;

  public async claims(
    params: CallParams<typeof readErc1155IncentiveClaims> = {},
  ) {
    return readErc1155IncentiveClaims(this._config, {
      address: this.assertValidAddress(),
      args: [],
      ...params,
    });
  }

  public async reward(
    params: CallParams<typeof readErc1155IncentiveReward> = {},
  ) {
    return readErc1155IncentiveReward(this._config, {
      address: this.assertValidAddress(),
      args: [],
      ...params,
    });
  }

  public async claimed(
    address: Address,
    params: CallParams<typeof readErc1155IncentiveClaimed> = {},
  ) {
    return readErc1155IncentiveClaimed(this._config, {
      address: this.assertValidAddress(),
      args: [address],
      ...params,
    });
  }

  public async asset(
    params: CallParams<typeof readErc1155IncentiveAsset> = {},
  ) {
    return readErc1155IncentiveAsset(this._config, {
      address: this.assertValidAddress(),
      ...params,
    });
  }

  public async strategy(
    params: CallParams<typeof readErc1155IncentiveStrategy> = {},
  ): Promise<StrategyType> {
    return readErc1155IncentiveStrategy(this._config, {
      address: this.assertValidAddress(),
      ...params,
    }) as Promise<StrategyType>;
  }

  public async limit(
    params: CallParams<typeof readErc1155IncentiveLimit> = {},
  ) {
    return readErc1155IncentiveLimit(this._config, {
      address: this.assertValidAddress(),
      ...params,
    });
  }

  public async tokenId(
    params: CallParams<typeof readErc1155IncentiveTokenId> = {},
  ) {
    return readErc1155IncentiveTokenId(this._config, {
      address: this.assertValidAddress(),
      ...params,
    });
  }

  public async extraData(
    params: CallParams<typeof readErc1155IncentiveExtraData> = {},
  ) {
    return readErc1155IncentiveExtraData(this._config, {
      address: this.assertValidAddress(),
      ...params,
    });
  }

  public async claim(
    payload: ClaimPayload,
    params: CallParams<typeof writeErc1155IncentiveClaim> = {},
  ) {
    return this.awaitResult(
      this.claimRaw(payload, params),
      erc1155IncentiveAbi,
      simulateErc1155IncentiveClaim,
    );
  }

  public async claimRaw(
    payload: ClaimPayload,
    params: CallParams<typeof writeErc1155IncentiveClaim> = {},
  ) {
    return writeErc1155IncentiveClaim(this._config, {
      address: this.assertValidAddress(),
      args: [prepareClaimPayload(payload)],
      ...params,
    });
  }

  public async reclaim(
    payload: ClaimPayload,
    params: CallParams<typeof writeErc1155IncentiveReclaim> = {},
  ) {
    return this.awaitResult(
      this.reclaimRaw(payload, params),
      erc1155IncentiveAbi,
      simulateErc1155IncentiveReclaim,
    );
  }

  public async reclaimRaw(
    payload: ClaimPayload,
    params: CallParams<typeof writeErc1155IncentiveReclaim> = {},
  ) {
    return writeErc1155IncentiveReclaim(this._config, {
      address: this.assertValidAddress(),
      args: [prepareClaimPayload(payload)],
      ...params,
    });
  }

  public async isClaimable(
    payload: ClaimPayload,
    params: CallParams<typeof readErc1155IncentiveIsClaimable> = {},
  ) {
    return readErc1155IncentiveIsClaimable(this._config, {
      address: this.assertValidAddress(),
      args: [prepareClaimPayload(payload)],
      ...params,
    });
  }

  public async preflight(
    data: ERC1155IncentivePayload,
    params: CallParams<typeof readErc1155IncentivePreflight> = {},
  ) {
    return readErc1155IncentivePreflight(this._config, {
      address: this.assertValidAddress(),
      args: [prepareERC1155IncentivePayload(data)],
      ...params,
    });
  }

  public async supportsInterface(
    interfaceId: Hex,
    params: CallParams<typeof readErc1155SupportsInterface> = {},
  ) {
    return readErc1155SupportsInterface(this._config, {
      address: this.assertValidAddress(),
      args: [interfaceId],
      ...params,
    });
  }

  public async getComponentInterface(
    params: CallParams<typeof readErc1155IncentiveGetComponentInterface> = {},
  ) {
    return readErc1155IncentiveGetComponentInterface(this._config, {
      address: this.assertValidAddress(),
      ...this.optionallyAttachAccount(),
      ...params,
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
