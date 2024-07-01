import {
  type ContractActionPayload,
  prepareContractActionPayload,
  readContractActionChainId,
  readContractActionPrepare,
  readContractActionSelector,
  readContractActionTarget,
  readContractActionValue,
  simulateContractActionExecute,
  writeContractActionExecute,
} from '@boostxyz/evm';
import ContractActionArtifact from '@boostxyz/evm/artifacts/contracts/actions/ContractAction.sol/ContractAction.json';
import { getTransaction, waitForTransactionReceipt } from '@wagmi/core';
import { type Hex, decodeFunctionData } from 'viem';
import type {
  DeployableOptions,
  GenericDeployableParams,
} from '../Deployable/Deployable';
import { DeployableTarget } from '../Deployable/DeployableTarget';
import type { CallParams } from '../utils';

export type { ContractActionPayload };

export class ContractAction extends DeployableTarget<ContractActionPayload> {
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
    const hash = await this.executeRaw(data, params);
    const receipt = await waitForTransactionReceipt(this._config, {
      hash,
    });
    const tx = await getTransaction(this._config, { hash });
    const { args } = decodeFunctionData({
      abi: ContractActionArtifact.abi,
      data: tx.input,
    });
    const { result } = await simulateContractActionExecute(this._config, {
      account: tx.from,
      address: tx.to!,
      args: args as [Hex],
      // value: tx.value, // TS doesn't like me to including this
      blockNumber: receipt.blockNumber,
      // do we need to include nonce, gas price, etc. to properly simulate?
    });
    return result;
  }

  public async executeRaw(
    data: Hex,
    params: CallParams<typeof writeContractActionExecute> = {},
  ) {
    return writeContractActionExecute(this._config, {
      address: this.assertValidAddress(),
      args: [data],
      ...this.optionallyAttachAccount(),
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
      ...this.optionallyAttachAccount(),
      ...params,
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
      abi: ContractActionArtifact.abi,
      bytecode: ContractActionArtifact.bytecode as Hex,
      args: [prepareContractActionPayload(payload)],
      ...this.optionallyAttachAccount(options.account),
    };
  }
}
