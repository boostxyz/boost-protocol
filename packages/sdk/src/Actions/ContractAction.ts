import {
  type ContractActionPayload,
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
import type { CallParams } from '../utils';

export type { ContractActionPayload };

export class ContractAction extends DeployableTarget<ContractActionPayload> {
  public static base = import.meta.env.VITE_CONTRACT_ACTION_BASE;
  public override readonly base = ContractAction.base;

  public async chainId(
    params: CallParams<typeof readContractActionChainId> = {},
  ) {
    return readContractActionChainId(this._config, {
      address: this.assertValidAddress(),
      ...this.optionallyAttachAccount(),
      ...params,
    });
  }

  public async target(
    params: CallParams<typeof readContractActionTarget> = {},
  ) {
    return readContractActionTarget(this._config, {
      address: this.assertValidAddress(),
      ...this.optionallyAttachAccount(),
      ...params,
    });
  }

  public async selector(
    params: CallParams<typeof readContractActionSelector> = {},
  ) {
    return readContractActionSelector(this._config, {
      address: this.assertValidAddress(),
      ...this.optionallyAttachAccount(),
      ...params,
    });
  }

  public async value(params: CallParams<typeof readContractActionValue> = {}) {
    return readContractActionValue(this._config, {
      address: this.assertValidAddress(),
      ...this.optionallyAttachAccount(),
      ...params,
    });
  }

  public async execute(
    data: Hex,
    params: CallParams<typeof writeContractActionExecute> = {},
  ) {
    return this.awaitResult(
      this.executeRaw(data, params),
      contractActionAbi,
      simulateContractActionExecute,
    );
  }

  public async executeRaw(
    data: Hex,
    params: CallParams<typeof writeContractActionExecute> = {},
  ) {
    return writeContractActionExecute(this._config, {
      address: this.assertValidAddress(),
      ...this.optionallyAttachAccount(),
      ...params,
      args: [data],
    });
  }

  public async prepare(
    data: Hex,
    params: CallParams<typeof readContractActionPrepare> = {},
  ) {
    return readContractActionPrepare(this._config, {
      address: this.assertValidAddress(),
      args: [data],
      ...this.optionallyAttachAccount(),
      ...params,
    });
  }

  public async supportsInterface(
    interfaceId: Hex,
    params: CallParams<typeof readContractActionSupportsInterface> = {},
  ) {
    return readContractActionSupportsInterface(this._config, {
      address: this.assertValidAddress(),
      ...this.optionallyAttachAccount(),
      ...params,
      args: [interfaceId],
    });
  }

  public async getComponentInterface(
    params: CallParams<typeof readContractActionGetComponentInterface> = {},
  ) {
    return readContractActionGetComponentInterface(this._config, {
      address: this.assertValidAddress(),
      ...this.optionallyAttachAccount(),
      ...params,
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
