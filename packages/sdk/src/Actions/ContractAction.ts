import {
  type ContractActionPayload,
  prepareContractActionPayload,
} from '@boostxyz/evm';
import ContractActionArtifact from '@boostxyz/evm/artifacts/contracts/actions/ContractAction.sol/ContractAction.json';
import type { Config } from '@wagmi/core';
import { type Hex, zeroAddress, zeroHash } from 'viem';
import {
  Deployable,
  type GenericDeployableParams,
} from '../Deployable/Deployable';

export type { ContractActionPayload };

export class ContractAction extends Deployable {
  protected payload: ContractActionPayload = {
    chainId: 0n,
    target: zeroAddress,
    selector: zeroHash,
    value: 0n,
  };

  constructor(config: Partial<ContractActionPayload> = {}) {
    super();
    this.payload = {
      ...this.payload,
      ...config,
    };
  }

  public override buildParameters(_config: Config): GenericDeployableParams {
    return {
      abi: ContractActionArtifact.abi,
      bytecode: ContractActionArtifact.bytecode as Hex,
      args: [prepareContractActionPayload(this.payload)],
    };
  }
}
