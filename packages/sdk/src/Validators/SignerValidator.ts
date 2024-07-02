import {
  type SignerValidatorPayload,
  type SignerValidatorValidatePayload,
  prepareSignerValidatorPayload,
  prepareSignerValidatorValidatePayload,
  readSignerValidatorSigners,
  signerValidatorAbi,
  simulateSignerValidatorSetAuthorized,
  simulateSignerValidatorValidate,
  writeSignerValidatorSetAuthorized,
  writeSignerValidatorValidate,
} from '@boostxyz/evm';
import { bytecode } from '@boostxyz/evm/artifacts/contracts/validators/SignerValidator.sol/SignerValidator.json';
import type { Address, Hex } from 'viem';
import type {
  DeployableOptions,
  GenericDeployableParams,
} from '../Deployable/Deployable';
import { DeployableTarget } from '../Deployable/DeployableTarget';
import type { CallParams } from '../utils';

export type { SignerValidatorPayload };

export class SignerValidator extends DeployableTarget<SignerValidatorPayload> {
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
    return this.awaitResult(
      this.validateRaw(payload, params),
      signerValidatorAbi,
      simulateSignerValidatorValidate,
    );
  }

  public async validateRaw(
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
    return this.awaitResult(
      this.setAuthorizedRaw(addresses, allowed, params),
      signerValidatorAbi,
      simulateSignerValidatorSetAuthorized,
    );
  }

  public async setAuthorizedRaw(
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
    _options?: DeployableOptions,
  ): GenericDeployableParams {
    const [payload, options] = this.validateDeploymentConfig(
      _payload,
      _options,
    );
    return {
      abi: signerValidatorAbi,
      bytecode: bytecode as Hex,
      args: [prepareSignerValidatorPayload(payload)],
      ...this.optionallyAttachAccount(options.account),
    };
  }
}
