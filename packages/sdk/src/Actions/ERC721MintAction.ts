import {
  type ERC721MintActionPayload,
  erc721MintActionAbi,
  prepareERC721MintActionPayload,
  readErc721MintActionGetComponentInterface,
  readErc721MintActionPrepare,
  readErc721MintActionSupportsInterface,
  simulateErc721MintActionExecute,
  simulateErc721MintActionValidate,
  writeErc721MintActionExecute,
  writeErc721MintActionValidate,
} from '@boostxyz/evm';
import { bytecode } from '@boostxyz/evm/artifacts/contracts/actions/ERC721MintAction.sol/ERC721MintAction.json';
import type { Hex } from 'viem';
import type {
  DeployableOptions,
  GenericDeployableParams,
} from '../Deployable/Deployable';
import type { CallParams } from '../utils';
import { ContractAction } from './ContractAction';

export type { ERC721MintActionPayload };

export class ERC721MintAction extends ContractAction {
  public static override base = import.meta.env.VITE_ERC721_MINT_ACTION_BASE;

  public override async execute(
    data: Hex,
    params: CallParams<typeof writeErc721MintActionExecute> = {},
  ) {
    return this.awaitResult(
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
    return this.awaitResult(
      this.validateRaw(data, params),
      erc721MintActionAbi,
      simulateErc721MintActionValidate,
    );
  }

  public async validateRaw(
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

  public override async supportsInterface(
    interfaceId: Hex,
    params: CallParams<typeof readErc721MintActionSupportsInterface> = {},
  ) {
    return readErc721MintActionSupportsInterface(this._config, {
      address: this.assertValidAddress(),
      ...this.optionallyAttachAccount(),
      ...params,
      args: [interfaceId],
    });
  }

  public override async getComponentInterface(
    params: CallParams<typeof readErc721MintActionGetComponentInterface> = {},
  ) {
    return readErc721MintActionGetComponentInterface(this._config, {
      address: this.assertValidAddress(),
      ...this.optionallyAttachAccount(),
      ...params,
      args: [],
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
      abi: erc721MintActionAbi,
      bytecode: bytecode as Hex,
      args: [prepareERC721MintActionPayload(payload)],
      ...this.optionallyAttachAccount(options.account),
    };
  }
}
