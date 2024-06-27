import {
  type ClaimPayload,
  type ERC1155IncentivePayload,
  type StrategyType,
  prepareClaimPayload,
  prepareERC1155IncentivePayload,
  readErc1155IncentiveAsset,
  readErc1155IncentiveExtraData,
  readErc1155IncentiveIsClaimable,
  readErc1155IncentiveLimit,
  readErc1155IncentivePreflight,
  readErc1155IncentiveStrategy,
  readErc1155IncentiveTokenId,
  readErc1155SupportsInterface,
  writeErc1155IncentiveClaim,
  writeErc1155IncentiveReclaim,
} from '@boostxyz/evm';
import ERC1155IncentiveArtifact from '@boostxyz/evm/artifacts/contracts/incentives/ERC1155Incentive.sol/ERC1155Incentive.json';
import type { Hex } from 'viem';
import type {
  DeployableOptions,
  GenericDeployableParams,
} from '../Deployable/Deployable';
import { DeployableTarget } from '../Deployable/DeployableTarget';
import type { CallParams } from '../utils';

export type { ERC1155IncentivePayload };

export class ERC1155Incentive extends DeployableTarget<ERC1155IncentivePayload> {
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

  public override buildParameters(
    _payload?: ERC1155IncentivePayload,
    _options?: DeployableOptions,
  ): GenericDeployableParams {
    const [payload, options] = this.validateDeploymentConfig(
      _payload,
      _options,
    );
    return {
      abi: ERC1155IncentiveArtifact.abi,
      bytecode: ERC1155IncentiveArtifact.bytecode as Hex,
      args: [prepareERC1155IncentivePayload(payload)],
      ...this.optionallyAttachAccount(options.account),
    };
  }
}
