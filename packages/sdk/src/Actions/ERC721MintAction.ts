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
import type { ReadParams, WriteParams } from '../utils';
import { ContractAction } from './ContractAction';

export type { ERC721MintActionPayload };

export class ERC721MintAction extends ContractAction {
  public static override base = import.meta.env.VITE_ERC721_MINT_ACTION_BASE;
  public override readonly base = ERC721MintAction.base;

  public override async execute(
    data: Hex,
    params?: WriteParams<typeof erc721MintActionAbi, 'execute'>,
  ) {
    return this.awaitResult(
      this.executeRaw(data, params),
      erc721MintActionAbi,
      simulateErc721MintActionExecute,
    );
  }

  public override async executeRaw(
    data: Hex,
    params?: WriteParams<typeof erc721MintActionAbi, 'execute'>,
  ) {
    return writeErc721MintActionExecute(this._config, {
      address: this.assertValidAddress(),
      args: [data],
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  public override async prepare(
    data: Hex,
    params?: ReadParams<typeof erc721MintActionAbi, 'prepare'>,
  ) {
    return readErc721MintActionPrepare(this._config, {
      address: this.assertValidAddress(),
      args: [data],
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  public async validate(
    data: Hex,
    params?: WriteParams<typeof erc721MintActionAbi, 'validate'>,
  ) {
    return this.awaitResult(
      this.validateRaw(data, params),
      erc721MintActionAbi,
      simulateErc721MintActionValidate,
    );
  }

  public async validateRaw(
    data: Hex,
    params?: WriteParams<typeof erc721MintActionAbi, 'validate'>,
  ) {
    return writeErc721MintActionValidate(this._config, {
      address: this.assertValidAddress(),
      args: [data],
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  public override async supportsInterface(
    interfaceId: Hex,
    params?: ReadParams<typeof erc721MintActionAbi, 'supportsInterface'>,
  ) {
    return readErc721MintActionSupportsInterface(this._config, {
      address: this.assertValidAddress(),
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
      args: [interfaceId],
    });
  }

  public override async getComponentInterface(
    params?: ReadParams<typeof erc721MintActionAbi, 'getComponentInterface'>,
  ) {
    return readErc721MintActionGetComponentInterface(this._config, {
      address: this.assertValidAddress(),
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
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
