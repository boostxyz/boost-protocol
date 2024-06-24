import {
  type SignerValidatorPayload,
  type SignerValidatorValidatePayload,
  type SimpleAllowListPayload,
  prepareSignerValidatorPayload,
  prepareSignerValidatorValidatePayload,
  readSignerValidatorSigners,
  writeSignerValidatorSetAuthorized,
  writeSignerValidatorValidate,
} from '@boostxyz/evm';
import SignerValidatorArtifact from '@boostxyz/evm/artifacts/contracts/validators/SignerValidator.sol/SignerValidator.json';
import type { Config } from '@wagmi/core';
import type { Address, Hex } from 'viem';
import {
  Deployable,
  type GenericDeployableParams,
} from '../Deployable/Deployable';
import { DeployableAddressRequiredError } from '../errors';

export type { SimpleAllowListPayload };

export class SignerValidator extends Deployable {
  protected payload: SignerValidatorPayload = {
    signers: [],
  };

  constructor(config: Partial<SignerValidatorPayload> = {}) {
    super();
    this.payload = {
      ...this.payload,
      ...config,
    };
  }

  public async signers(address: Address, config: Config) {
    if (!this.address) throw new DeployableAddressRequiredError();
    return readSignerValidatorSigners(config, {
      address: this.address,
      args: [address],
    });
  }

  public async validate(
    payload: SignerValidatorValidatePayload,
    config: Config,
  ) {
    if (!this.address) throw new DeployableAddressRequiredError();
    return writeSignerValidatorValidate(config, {
      address: this.address,
      args: [prepareSignerValidatorValidatePayload(payload)],
    });
  }

  public async setAuthorized(
    addresses: Address[],
    allowed: boolean[],
    config: Config,
  ) {
    if (!this.address) throw new DeployableAddressRequiredError();
    return await writeSignerValidatorSetAuthorized(config, {
      address: this.address,
      args: [addresses, allowed],
    });
  }

  public override buildParameters(_config: Config): GenericDeployableParams {
    return {
      abi: SignerValidatorArtifact.abi,
      bytecode: SignerValidatorArtifact.bytecode as Hex,
      args: [prepareSignerValidatorPayload(this.payload)],
    };
  }
}
