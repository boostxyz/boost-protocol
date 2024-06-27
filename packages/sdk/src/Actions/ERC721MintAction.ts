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
  type DeployableOptions,
  type GenericDeployableParams,
} from '../Deployable/Deployable';
import type { CallParams } from '../utils';
import { ContractAction } from './ContractAction';

export type { ERC721MintActionPayload };

export class ERC721MintAction extends ContractAction {
  public override async execute(
    data: Hex,
    params: CallParams<typeof writeErc721MintActionExecute> = {},
  ) {
    return writeErc721MintActionExecute(this._config, {
      address: this.assertValidAddress(),
      args: [data],
      ...this.optionallyAttachAccount(),
      ...params,
    });
  }

  public override async prepare(
    data: Hex,
    params: CallParams<typeof readErc721MintActionPrepare> = {},
  ) {
    return readErc721MintActionPrepare(this._config, {
      address: this.assertValidAddress(),
      args: [data],
      ...this.optionallyAttachAccount(),
      ...params,
    });
  }

  public async validate(
    data: Hex,
    params: CallParams<typeof writeErc721MintActionValidate> = {},
  ) {
    return writeErc721MintActionValidate(this._config, {
      address: this.assertValidAddress(),
      args: [data],
      ...this.optionallyAttachAccount(),
      ...params,
    });
  }

  public override buildParameters(
    _payload?: ERC721MintActionPayload,
    _options?: DeployableOptions,
  ): GenericDeployableParams {
    const [payload, options] = this.validateDeploymentConfig(
      _payload,
      _options,
    );
    return {
      abi: ERC721MintActionArtifact.abi,
      bytecode: ERC721MintActionArtifact.bytecode as Hex,
      args: [prepareERC721MintActionPayload(payload)],
      ...this.optionallyAttachAccount(options.account),
    };
  }
}
