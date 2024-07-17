import {
  RegistryType,
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

export type { SignerValidatorPayload, prepareSignerValidatorValidatePayload };

/**
 * Description placeholder
 *
 * @export
 * @class SignerValidator
 * @typedef {SignerValidator}
 * @extends {DeployableTarget<SignerValidatorPayload>}
 */
export class SignerValidator extends DeployableTarget<SignerValidatorPayload> {
  /**
   * @inheritdoc
   *
   * @public
   * @static
   * @type {Address}
   */
  public static override base: Address = import.meta.env
    .VITE_SIGNER_VALIDATOR_BASE;
  /**
   * @inheritdoc
   *
   * @public
   * @static
   * @type {RegistryType}
   */
  public static override registryType: RegistryType = RegistryType.VALIDATOR;

  /**
   * Description placeholder
   *
   * @public
   * @async
   * @param {Address} address
   * @param {?ReadParams<typeof signerValidatorAbi, 'signers'>} [params]
   * @returns {unknown}
   */
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

  /**
   * Description placeholder
   *
   * @public
   * @async
   * @param {SignerValidatorValidatePayload} payload
   * @param {?WriteParams<typeof signerValidatorAbi, 'validate'>} [params]
   * @returns {unknown}
   */
  public async validate(
    payload: SignerValidatorValidatePayload,
    params?: WriteParams<typeof signerValidatorAbi, 'validate'>,
  ) {
    return this.awaitResult(this.validateRaw(payload, params));
  }

  /**
   * Description placeholder
   *
   * @public
   * @async
   * @param {SignerValidatorValidatePayload} payload
   * @param {?ReadParams<typeof signerValidatorAbi, 'validate'>} [params]
   * @returns {unknown}
   */
  public async validateRaw(
    payload: SignerValidatorValidatePayload,
    params?: ReadParams<typeof signerValidatorAbi, 'validate'>,
  ) {
    const { request, result } = await simulateSignerValidatorValidate(
      this._config,
      {
        address: this.assertValidAddress(),
        args: [prepareSignerValidatorValidatePayload(payload)],
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      },
    );
    const hash = await writeSignerValidatorValidate(this._config, request);
    return { hash, result };
  }

  /**
   * Description placeholder
   *
   * @public
   * @async
   * @param {Address[]} addresses
   * @param {boolean[]} allowed
   * @param {?WriteParams<typeof signerValidatorAbi, 'setAuthorized'>} [params]
   * @returns {unknown}
   */
  public async setAuthorized(
    addresses: Address[],
    allowed: boolean[],
    params?: WriteParams<typeof signerValidatorAbi, 'setAuthorized'>,
  ) {
    return this.awaitResult(this.setAuthorizedRaw(addresses, allowed, params));
  }

  /**
   * Description placeholder
   *
   * @public
   * @async
   * @param {Address[]} addresses
   * @param {boolean[]} allowed
   * @param {?WriteParams<typeof signerValidatorAbi, 'setAuthorized'>} [params]
   * @returns {unknown}
   */
  public async setAuthorizedRaw(
    addresses: Address[],
    allowed: boolean[],
    params?: WriteParams<typeof signerValidatorAbi, 'setAuthorized'>,
  ) {
    const { request, result } = await simulateSignerValidatorSetAuthorized(
      this._config,
      {
        address: this.assertValidAddress(),
        args: [addresses, allowed],
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      },
    );
    const hash = await writeSignerValidatorSetAuthorized(this._config, request);
    return { hash, result };
  }

  /**
   * @inheritdoc
   *
   * @public
   * @param {?SignerValidatorPayload} [_payload]
   * @param {?DeployableOptions} [_options]
   * @returns {GenericDeployableParams}
   */
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
