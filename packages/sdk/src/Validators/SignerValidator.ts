import {
  readSignerValidatorHashSignerData,
  readSignerValidatorSigners,
  signerValidatorAbi,
  simulateSignerValidatorSetAuthorized,
  simulateSignerValidatorSetValidatorCaller,
  simulateSignerValidatorValidate,
  writeSignerValidatorSetAuthorized,
  writeSignerValidatorSetValidatorCaller,
  writeSignerValidatorValidate,
} from '@boostxyz/evm';
import { bytecode } from '@boostxyz/evm/artifacts/contracts/validators/SignerValidator.sol/SignerValidator.json';
import type { Address, ContractEventName, Hex } from 'viem';
import type {
  DeployableOptions,
  GenericDeployableParams,
} from '../Deployable/Deployable';
import { DeployableTarget } from '../Deployable/DeployableTarget';
import {
  type GenericLog,
  type ReadParams,
  RegistryType,
  type SignerValidatorPayload,
  type SignerValidatorSignaturePayload,
  type SignerValidatorValidatePayload,
  type WriteParams,
  prepareSignerValidatorPayload,
} from '../utils';

export { signerValidatorAbi };
export type { SignerValidatorPayload };

/**
 * A generic `viem.Log` event with support for `BoostCore` event types.
 *
 * @export
 * @typedef {SignerValidatorLog}
 * @template {ContractEventName<
 *     typeof signerValidatorAbi
 *   >} [event=ContractEventName<typeof signerValidatorAbi>]
 */
export type SignerValidatorLog<
  event extends ContractEventName<
    typeof signerValidatorAbi
  > = ContractEventName<typeof signerValidatorAbi>,
> = GenericLog<typeof signerValidatorAbi, event>;

/**
 *  A simple implementation of a Validator that verifies a given signature and checks the recovered address against a set of authorized signers
 *
 * @export
 * @class SignerValidator
 * @typedef {SignerValidator}
 * @extends {DeployableTarget<SignerValidatorPayload>}
 */
export class SignerValidator extends DeployableTarget<
  SignerValidatorPayload,
  typeof signerValidatorAbi
> {
  public override readonly abi = signerValidatorAbi;
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
   * The set of authorized signers
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
   * Retrieve the hash and signer data for a given hash
   *
   * @public
   * @async
   * @param {SignerValidatorSignaturePayload} payload
   * @param {?ReadParams<typeof signerValidatorAbi, 'hashSignerData'>} [params]
   * @returns {unknown}
   */
  public async hashSignerData(
    payload: SignerValidatorSignaturePayload,
    params?: ReadParams<typeof signerValidatorAbi, 'hashSignerData'>,
  ) {
    return readSignerValidatorHashSignerData(this._config, {
      address: this.assertValidAddress(),
      args: [
        payload.boostId,
        payload.incentiveQuantity,
        payload.claimant,
        payload.incentiveData,
      ],
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  /**
   * Validate that the action has been completed successfully. The data payload is expected to be a tuple of (address signer, bytes32 hash, bytes signature). The signature is expected to be a valid ECDSA or EIP-1271 signature of a unique hash by an authorized signer.
   *
   * @public
   * @async
   * @param {SignerValidatorValidatePayload} payload
   * @param {?WriteParams<typeof signerValidatorAbi, 'validate'>} [params]
   * @returns {Promise<boolean>} - True if the action has been validated based on the data payload
   */
  public async validate(
    payload: SignerValidatorValidatePayload,
    params?: WriteParams<typeof signerValidatorAbi, 'validate'>,
  ) {
    return this.awaitResult(this.validateRaw(payload, params));
  }

  /**
   * Validate that the action has been completed successfully. The data payload is expected to be a tuple of (address signer, bytes32 hash, bytes signature). The signature is expected to be a valid ECDSA or EIP-1271 signature of a unique hash by an authorized signer.
   *
   * @public
   * @async
   * @param {SignerValidatorValidatePayload} payload
   * @param {?WriteParams<typeof signerValidatorAbi, 'validate'>} [params]
   * @returns {Promise<boolean>} - True if the action has been validated based on the data payload
   */
  public async validateRaw(
    payload: SignerValidatorValidatePayload,
    params?: ReadParams<typeof signerValidatorAbi, 'validate'>,
  ) {
    const { request, result } = await simulateSignerValidatorValidate(
      this._config,
      {
        address: this.assertValidAddress(),
        args: [
          payload.boostId,
          payload.incentiveId,
          payload.claimant,
          payload.claimData,
        ],
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      },
    );
    const hash = await writeSignerValidatorValidate(this._config, request);
    return { hash, result };
  }

  /**
   * Set the authorized status of a signer
   *
   * @public
   * @async
   * @param {Address[]} addresses - The list of signers to update
   * @param {boolean[]} allowed - The authorized status of each signer
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
   * Set the authorized status of a signer
   *
   * @public
   * @async
   * @param {Address[]} addresses - The list of signers to update
   * @param {boolean[]} allowed - The authorized status of each signer
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

  public async setValidatorCallerRaw(
    address: Address,
    params?: WriteParams<typeof signerValidatorAbi, 'setValidatorCaller'>,
  ) {
    const { request, result } = await simulateSignerValidatorSetValidatorCaller(
      this._config,
      {
        address: this.assertValidAddress(),
        args: [address],
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      },
    );
    const hash = await writeSignerValidatorSetValidatorCaller(
      this._config,
      request,
    );
    return { hash, result };
  }

  public async setValidatorCaller(
    address: Address,
    params?: WriteParams<typeof signerValidatorAbi, 'setValidatorCaller'>,
  ) {
    return this.awaitResult(this.setValidatorCallerRaw(address, params));
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
