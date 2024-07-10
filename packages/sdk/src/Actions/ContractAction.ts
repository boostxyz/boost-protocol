import {
  type ContractActionPayload,
  RegistryType,
  contractActionAbi,
  prepareContractActionPayload,
  readContractActionChainId,
  readContractActionGetComponentInterface,
  readContractActionPrepare,
  readContractActionSelector,
  readContractActionSupportsInterface,
  readContractActionTarget,
  readContractActionValue,
  simulateContractActionExecute,
  writeContractActionExecute,
} from '@boostxyz/evm';
import { bytecode } from '@boostxyz/evm/artifacts/contracts/actions/ContractAction.sol/ContractAction.json';
import type { Hex } from 'viem';
import type {
  DeployableOptions,
  GenericDeployableParams,
} from '../Deployable/Deployable';
import { DeployableTarget } from '../Deployable/DeployableTarget';
import type { ReadParams, WriteParams } from '../utils';

export type { ContractActionPayload };

export class ContractAction extends DeployableTarget<ContractActionPayload> {
  public static base = import.meta.env.VITE_CONTRACT_ACTION_BASE;
  public override readonly base = ContractAction.base;

  public static registryType: RegistryType = RegistryType.ACTION;
  public override readonly registryType: RegistryType = RegistryType.ACTION;

  public async chainId(
    params?: ReadParams<typeof contractActionAbi, 'chainId'>,
  ) {
    return readContractActionChainId(this._config, {
      address: this.assertValidAddress(),
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  public async target(params?: ReadParams<typeof contractActionAbi, 'target'>) {
    return readContractActionTarget(this._config, {
      address: this.assertValidAddress(),
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  public async selector(
    params?: ReadParams<typeof contractActionAbi, 'selector'>,
  ) {
    return readContractActionSelector(this._config, {
      address: this.assertValidAddress(),
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  public async value(params?: ReadParams<typeof contractActionAbi, 'value'>) {
    return readContractActionValue(this._config, {
      address: this.assertValidAddress(),
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  public async execute(
    data: Hex,
    params?: WriteParams<typeof contractActionAbi, 'execute'>,
  ) {
    return this.awaitResult(this.executeRaw(data, params));
  }

  public async executeRaw(
    data: Hex,
    params?: WriteParams<typeof contractActionAbi, 'execute'>,
  ) {
    const { request, result } = await simulateContractActionExecute(
      this._config,
      {
        address: this.assertValidAddress(),
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
        args: [data],
      },
    );
    const hash = await writeContractActionExecute(this._config, request);
    return { hash, result };
  }

  public async prepare(
    data: Hex,
    params?: ReadParams<typeof contractActionAbi, 'prepare'>,
  ) {
    return readContractActionPrepare(this._config, {
      address: this.assertValidAddress(),
      args: [data],
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  public async supportsInterface(
    interfaceId: Hex,
    params?: ReadParams<typeof contractActionAbi, 'supportsInterface'>,
  ) {
    return readContractActionSupportsInterface(this._config, {
      address: this.assertValidAddress(),
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
      args: [interfaceId],
    });
  }

  public async getComponentInterface(
    params?: ReadParams<typeof contractActionAbi, 'getComponentInterface'>,
  ) {
    return readContractActionGetComponentInterface(this._config, {
      address: this.assertValidAddress(),
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
      args: [],
    });
  }

  public override buildParameters(
    _payload?: ContractActionPayload,
    _options?: DeployableOptions,
  ): GenericDeployableParams {
    const [payload, options] = this.validateDeploymentConfig(
      _payload,
      _options,
    );
    return {
      abi: contractActionAbi,
      bytecode: bytecode as Hex,
      args: [prepareContractActionPayload(payload)],
      ...this.optionallyAttachAccount(options.account),
    };
  }
}
