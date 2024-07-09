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
import type { ReadParams, WriteParams } from '../utils';

export type { SignerValidatorPayload };

export class SignerValidator extends DeployableTarget<SignerValidatorPayload> {
  public static base = import.meta.env.VITE_SIGNER_VALIDATOR_BASE;
  public override readonly base = SignerValidator.base;

  public async signers(
    address: Address,
    params?: ReadParams<typeof signerValidatorAbi, 'signers'>,
  ) {
    return readSignerValidatorSigners(this._config, {
      address: this.assertValidAddress(),
      args: [address],
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  public async validate(
    payload: SignerValidatorValidatePayload,
    params?: WriteParams<typeof signerValidatorAbi, 'validate'>,
  ) {
    return this.awaitResult(
      this.validateRaw(payload, params),
      signerValidatorAbi,
      simulateSignerValidatorValidate,
    );
  }

  public async validateRaw(
    payload: SignerValidatorValidatePayload,
    params?: ReadParams<typeof signerValidatorAbi, 'validate'>,
  ) {
    return writeSignerValidatorValidate(this._config, {
      address: this.assertValidAddress(),
      args: [prepareSignerValidatorValidatePayload(payload)],
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  public async setAuthorized(
    addresses: Address[],
    allowed: boolean[],
    params?: WriteParams<typeof signerValidatorAbi, 'setAuthorized'>,
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
    params?: WriteParams<typeof signerValidatorAbi, 'setAuthorized'>,
  ) {
    return await writeSignerValidatorSetAuthorized(this._config, {
      address: this.assertValidAddress(),
      args: [addresses, allowed],
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
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
