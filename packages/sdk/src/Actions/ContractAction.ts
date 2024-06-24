import {
  type ContractActionPayload,
  prepareContractActionPayload,
  readContractActionChainId,
  readContractActionPrepare,
  readContractActionSelector,
  readContractActionTarget,
  readContractActionValue,
  writeContractActionExecute,
} from '@boostxyz/evm';
import ContractActionArtifact from '@boostxyz/evm/artifacts/contracts/actions/ContractAction.sol/ContractAction.json';
import type { Config } from '@wagmi/core';
import { type Hex, zeroAddress, zeroHash } from 'viem';
import {
  Deployable,
  type GenericDeployableParams,
} from '../Deployable/Deployable';
import { DeployableAddressRequiredError } from '../errors';

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

  public async chainId(config: Config) {
    if (!this.address) throw new DeployableAddressRequiredError();
    return readContractActionChainId(config, {
      address: this.address,
    });
  }

  public async target(config: Config) {
    if (!this.address) throw new DeployableAddressRequiredError();
    return readContractActionTarget(config, {
      address: this.address,
    });
  }

  public async selector(config: Config) {
    if (!this.address) throw new DeployableAddressRequiredError();
    return readContractActionSelector(config, {
      address: this.address,
    });
  }

  public async readContractActionValue(config: Config) {
    if (!this.address) throw new DeployableAddressRequiredError();
    return readContractActionValue(config, {
      address: this.address,
    });
  }

  // use what? also, payable
  public async execute(data: Hex, config: Config) {
    if (!this.address) throw new DeployableAddressRequiredError();
    return writeContractActionExecute(config, {
      address: this.address,
      args: [data],
    });
  }

  // TODO use data structure
  public async prepare(data: Hex, config: Config) {
    if (!this.address) throw new DeployableAddressRequiredError();
    return readContractActionPrepare(config, {
      address: this.address,
      args: [data],
    });
  }

  public override buildParameters(_config: Config): GenericDeployableParams {
    return {
      abi: ContractActionArtifact.abi,
      bytecode: ContractActionArtifact.bytecode as Hex,
      args: [prepareContractActionPayload(this.payload)],
    };
  }
}
