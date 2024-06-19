import {
  type ERC721MintActionPayload,
  prepareERC721MintActionPayload,
} from '@boostxyz/evm';
import ERC721MintActionArtifact from '@boostxyz/evm/artifacts/contracts/actions/ERC721MintAction.sol/ERC721MintAction.json';
import type { Config } from '@wagmi/core';
import { type Hex, zeroAddress, zeroHash } from 'viem';
import {
  Deployable,
  type GenericDeployableParams,
} from '../Deployable/Deployable';

export type { ERC721MintActionPayload };

export class ERC721MintAction extends Deployable {
  protected payload: ERC721MintActionPayload = {
    chainId: 0n,
    target: zeroAddress,
    selector: zeroHash,
    value: 0n,
  };

  constructor(config: Partial<ERC721MintActionPayload> = {}) {
    super();
    this.payload = {
      ...this.payload,
      ...config,
    };
  }

  public override buildParameters(_config: Config): GenericDeployableParams {
    return {
      abi: ERC721MintActionArtifact.abi,
      bytecode: ERC721MintActionArtifact.bytecode as Hex,
      args: [prepareERC721MintActionPayload(this.payload)],
    };
  }
}
