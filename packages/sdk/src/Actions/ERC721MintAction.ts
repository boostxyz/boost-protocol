import {
  type ERC721MintActionPayload,
  erc721MintActionAbi,
  prepareERC721MintActionPayload,
  readErc721MintActionPrepare,
  simulateErc721MintActionExecute,
  writeErc721MintActionExecute,
  writeErc721MintActionValidate,
} from '@boostxyz/evm';
import {
  type Config,
  getTransaction,
  waitForTransactionReceipt,
} from '@wagmi/core';
import { type Hex, decodeFunctionData } from 'viem';
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
    return this.awaitResult<typeof erc721MintActionAbi, 'execute'>(
      this.executeRaw(data, params),
      erc721MintActionAbi,
      simulateErc721MintActionExecute,
    );
  }

  public override async executeRaw(
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
