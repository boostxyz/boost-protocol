import {
  ERC1155StrategyType,
  type PrepareERC1155IncentivePayload,
  type StrategyType,
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
import type { Config } from '@wagmi/core';
import { type Hex, zeroAddress, zeroHash } from 'viem';
import {
  Deployable,
  type GenericDeployableParams,
} from '../Deployable/Deployable';
import { DeployableAddressRequiredError } from '../errors';

export type { PrepareERC1155IncentivePayload };

export class ERC1155Incentive extends Deployable {
  protected payload: PrepareERC1155IncentivePayload = {
    asset: zeroAddress,
    strategy: ERC1155StrategyType.POOL,
    tokenId: 0n,
    limit: 0n,
    extraData: zeroHash,
  };

  constructor(config: PrepareERC1155IncentivePayload) {
    super();
    this.payload = {
      ...this.payload,
      ...config,
    };
  }

  public async asset(config: Config) {
    if (!this.address) throw new DeployableAddressRequiredError();
    return readErc1155IncentiveAsset(config, {
      address: this.address,
    });
  }

  public async strategy(config: Config): Promise<StrategyType> {
    if (!this.address) throw new DeployableAddressRequiredError();
    return readErc1155IncentiveStrategy(config, {
      address: this.address,
    }) as Promise<StrategyType>;
  }

  public async limit(config: Config) {
    if (!this.address) throw new DeployableAddressRequiredError();
    return readErc1155IncentiveLimit(config, {
      address: this.address,
    });
  }

  public async tokenId(config: Config) {
    if (!this.address) throw new DeployableAddressRequiredError();
    return readErc1155IncentiveTokenId(config, {
      address: this.address,
    });
  }

  public async extraData(config: Config) {
    if (!this.address) throw new DeployableAddressRequiredError();
    return readErc1155IncentiveExtraData(config, {
      address: this.address,
    });
  }

  //prepareClaimPayload
  public async claim(data: Hex, config: Config) {
    if (!this.address) throw new DeployableAddressRequiredError();
    return writeErc1155IncentiveClaim(config, {
      address: this.address,
      args: [data],
    });
  }

  //prepareClaimPayload
  public async reclaim(data: Hex, config: Config) {
    if (!this.address) throw new DeployableAddressRequiredError();
    return writeErc1155IncentiveReclaim(config, {
      address: this.address,
      args: [data],
    });
  }

  //prepareClaimPayload
  public async isClaimable(data: Hex, config: Config) {
    if (!this.address) throw new DeployableAddressRequiredError();
    return readErc1155IncentiveIsClaimable(config, {
      address: this.address,
      args: [data],
    });
  }

  public async preflight(data: PrepareERC1155IncentivePayload, config: Config) {
    if (!this.address) throw new DeployableAddressRequiredError();
    return readErc1155IncentivePreflight(config, {
      address: this.address,
      args: [prepareERC1155IncentivePayload(data)],
    });
  }

  public async supportsInterface(interfaceId: Hex, config: Config) {
    if (!this.address) throw new DeployableAddressRequiredError();
    return readErc1155SupportsInterface(config, {
      address: this.address,
      args: [interfaceId],
    });
  }

  public override buildParameters(_config: Config): GenericDeployableParams {
    return {
      abi: ERC1155IncentiveArtifact.abi,
      bytecode: ERC1155IncentiveArtifact.bytecode as Hex,
      args: [prepareERC1155IncentivePayload(this.payload)],
    };
  }
}
