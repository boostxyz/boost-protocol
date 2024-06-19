import {
  type SignerValidatorPayload,
  type SimpleAllowListPayload,
  prepareSignerValidatorPayload,
} from '@boostxyz/evm';
import SignerValidatorArtifact from '@boostxyz/evm/artifacts/contracts/validators/SignerValidator.sol/SignerValidator.json';
import type { Config } from '@wagmi/core';
import type { Hex } from 'viem';
import {
  Deployable,
  type GenericDeployableParams,
} from '../Deployable/Deployable';

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

  public override buildParameters(_config: Config): GenericDeployableParams {
    return {
      abi: SignerValidatorArtifact.abi,
      bytecode: SignerValidatorArtifact.bytecode as Hex,
      args: [prepareSignerValidatorPayload(this.payload)],
    };
  }
}
