import {
  ERC1155StrategyType,
  type PrepareERC1155IncentivePayload,
  prepareERC1155IncentivePayload,
} from '@boostxyz/evm';
import ERC1155IncentiveArtifact from '@boostxyz/evm/artifacts/contracts/incentives/ERC1155Incentive.sol/ERC1155Incentive.json';
import type { Config } from '@wagmi/core';
import { type Hex, zeroAddress, zeroHash } from 'viem';
import {
  Deployable,
  type GenericDeployableParams,
} from '../Deployable/Deployable';

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

  public override buildParameters(_config: Config): GenericDeployableParams {
    return {
      abi: ERC1155IncentiveArtifact.abi,
      bytecode: ERC1155IncentiveArtifact.bytecode as Hex,
      args: [prepareERC1155IncentivePayload(this.payload)],
    };
  }
}
