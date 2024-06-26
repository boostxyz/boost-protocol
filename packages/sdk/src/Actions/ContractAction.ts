import type { Config } from '@wagmi/core';
import type { Hex } from 'viem';
import {
  type ContractActionPayload,
  prepareContractActionPayload,
  readContractActionChainId,
  readContractActionPrepare,
  readContractActionSelector,
  readContractActionTarget,
  readContractActionValue,
  writeContractActionExecute,
} from '../../../evm/artifacts';
import ContractActionArtifact from '../../../evm/artifacts/contracts/actions/ContractAction.sol/ContractAction.json';
import {
  Deployable,
  type GenericDeployableParams,
} from '../Deployable/Deployable';
import type { CallParams } from '../utils';

export type { ContractActionPayload };

export class ContractAction extends Deployable<ContractActionPayload> {
  public async chainId(
    params: CallParams<typeof readContractActionChainId> = {},
  ) {
    return readContractActionChainId(this._config, {
      address: this.assertValidAddress(),
      ...params,
    });
  }

  public async target(
    params: CallParams<typeof readContractActionTarget> = {},
  ) {
    return readContractActionTarget(this._config, {
      address: this.assertValidAddress(),
      ...params,
    });
  }

  public async selector(
    params: CallParams<typeof readContractActionSelector> = {},
  ) {
    return readContractActionSelector(this._config, {
      address: this.assertValidAddress(),
      ...params,
    });
  }

  public async value(params: CallParams<typeof readContractActionValue> = {}) {
    return readContractActionValue(this._config, {
      address: this.assertValidAddress(),
      ...params,
    });
  }

  public async execute(
    data: Hex,
    params: CallParams<typeof writeContractActionExecute> = {},
  ) {
    return writeContractActionExecute(this._config, {
      address: this.assertValidAddress(),
      args: [data],
      ...params,
    });
  }

  public async prepare(
    data: Hex,
    params: CallParams<typeof readContractActionPrepare> = {},
  ) {
    return readContractActionPrepare(this._config, {
      address: this.assertValidAddress(),
      args: [data],
      ...params,
    });
  }

  public override buildParameters(
    _payload?: ContractActionPayload,
    _config?: Config,
  ): GenericDeployableParams {
    const [payload] = this.validateDeploymentConfig(_payload, _config);
    return {
      abi: ContractActionArtifact.abi,
      bytecode: ContractActionArtifact.bytecode as Hex,
      args: [prepareContractActionPayload(payload)],
    };
  }
}
