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
import type { CallParams } from '../utils';

export type { SignerValidatorPayload };

export class SignerValidator extends Deployable<SignerValidatorPayload> {
  public async signers(
    address: Address,
    params: CallParams<typeof readSignerValidatorSigners> = {},
  ) {
    return readSignerValidatorSigners(this._config, {
      address: this.assertValidAddress(),
      args: [address],
      ...params,
    });
  }

  public async validate(
    payload: SignerValidatorValidatePayload,
    params: CallParams<typeof writeSignerValidatorValidate> = {},
  ) {
    return writeSignerValidatorValidate(this._config, {
      address: this.assertValidAddress(),
      args: [prepareSignerValidatorValidatePayload(payload)],
      ...params,
    });
  }

  public async setAuthorized(
    addresses: Address[],
    allowed: boolean[],
    params: CallParams<typeof writeSignerValidatorSetAuthorized> = {},
  ) {
    return await writeSignerValidatorSetAuthorized(this._config, {
      address: this.assertValidAddress(),
      args: [addresses, allowed],
      ...params,
    });
  }

  public override buildParameters(
    _payload?: SignerValidatorPayload,
    _config?: Config,
  ): GenericDeployableParams {
    const [payload] = this.validateDeploymentConfig(_payload, _config);
    return {
      abi: SignerValidatorArtifact.abi,
      bytecode: SignerValidatorArtifact.bytecode as Hex,
      args: [prepareSignerValidatorPayload(payload)],
    };
  }
}
