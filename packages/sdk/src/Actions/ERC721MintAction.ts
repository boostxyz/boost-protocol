import {
  type ERC721MintActionPayload,
  prepareERC721MintActionPayload,
  readErc721MintActionPrepare,
  writeErc721MintActionExecute,
  writeErc721MintActionValidate,
} from '@boostxyz/evm';
import ERC721MintActionArtifact from '@boostxyz/evm/artifacts/contracts/actions/ERC721MintAction.sol/ERC721MintAction.json';
import type { Config } from '@wagmi/core';
import type { Hex } from 'viem';
import {
  Deployable,
  type GenericDeployableParams,
} from '../Deployable/Deployable';
import type { CallParams } from '../utils';

export type { ERC721MintActionPayload };

export class ERC721MintAction extends Deployable<ERC721MintActionPayload> {
  // use what? also, payable
  public async execute(
    data: Hex,
    params: CallParams<typeof writeErc721MintActionExecute> = {},
  ) {
    return writeErc721MintActionExecute(this._config, {
      address: this.assertValidAddress(),
      args: [data],
      ...params,
    });
  }

  // TODO use data structure
  public async prepare(
    data: Hex,
    params: CallParams<typeof readErc721MintActionPrepare> = {},
  ) {
    return readErc721MintActionPrepare(this._config, {
      address: this.assertValidAddress(),
      args: [data],
      ...params,
    });
  }

  // TODO use data structure
  public async validate(
    data: Hex,
    params: CallParams<typeof writeErc721MintActionValidate> = {},
  ) {
    return writeErc721MintActionValidate(this._config, {
      address: this.assertValidAddress(),
      args: [data],
      ...params,
    });
  }

  public override buildParameters(
    _payload?: ERC721MintActionPayload,
    _config?: Config,
  ): GenericDeployableParams {
    const [payload] = this.validateDeploymentConfig(_payload, _config);
    return {
      abi: ERC721MintActionArtifact.abi,
      bytecode: ERC721MintActionArtifact.bytecode as Hex,
      args: [prepareERC721MintActionPayload(payload)],
    };
  }
}
