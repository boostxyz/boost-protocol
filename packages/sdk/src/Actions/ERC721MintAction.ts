import {
  type ERC721MintActionPayload,
  prepareERC721MintActionPayload,
  readErc721MintActionPrepare,
  writeErc721MintActionExecute,
  writeErc721MintActionValidate,
} from '@boostxyz/evm';
import ERC721MintActionArtifact from '@boostxyz/evm/artifacts/contracts/actions/ERC721MintAction.sol/ERC721MintAction.json';
import type { Config } from '@wagmi/core';
import { type Hex, zeroAddress, zeroHash } from 'viem';
import {
  Deployable,
  type GenericDeployableParams,
} from '../Deployable/Deployable';
import { DeployableAddressRequiredError } from '../errors';

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

  // use what? also, payable
  public async execute(data: Hex, config: Config) {
    if (!this.address) throw new DeployableAddressRequiredError();
    return writeErc721MintActionExecute(config, {
      address: this.address,
      args: [data],
    });
  }

  // TODO use data structure
  public async prepare(data: Hex, config: Config) {
    if (!this.address) throw new DeployableAddressRequiredError();
    return readErc721MintActionPrepare(config, {
      address: this.address,
      args: [data],
    });
  }

  // TODO use data structure
  public async validate(data: Hex, config: Config) {
    if (!this.address) throw new DeployableAddressRequiredError();
    return writeErc721MintActionValidate(config, {
      address: this.address,
      args: [data],
    });
  }

  // TODO use data structure
  public override buildParameters(_config: Config): GenericDeployableParams {
    return {
      abi: ERC721MintActionArtifact.abi,
      bytecode: ERC721MintActionArtifact.bytecode as Hex,
      args: [prepareERC721MintActionPayload(this.payload)],
    };
  }
}
