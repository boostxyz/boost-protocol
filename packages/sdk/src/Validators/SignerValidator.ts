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
import {
  type Address,
  type ContractEventName,
  type Hex,
  type PrivateKeyAccount,
  encodeAbiParameters,
} from 'viem';
import { signTypedData } from 'viem/accounts';
import { SignerValidator as SignerValidatorBases } from '../../dist/deployments.json';
import type {
  DeployableOptions,
  GenericDeployableParams,
} from '../Deployable/Deployable';
import { DeployableTarget } from '../Deployable/DeployableTarget';
import {
  type GenericLog,
  type ReadParams,
  RegistryType,
  type WriteParams,
} from '../utils';

export { signerValidatorAbi };

/**
 * Object reprentation of a {@link SignerValidator} initialization payload
 *
 * @export
 * @interface SignerValidatorPayload
 * @typedef {SignerValidatorPayload}
 */
export interface SignerValidatorPayload {
  /**
   * The list of authorized signers. The first address in the list will be the initial owner of the contract.
   *
   * @type {Address[]}
   */
  signers: Address[];
  /**
   * The authorized caller of the {@link prepareSignerValidator} function
   * @type {Address}
   */
  validatorCaller: Address;
}

/**
 * Description placeholder
 *
 * @export
 * @interface SignerValidatorValidatePayload
 * @typedef {SignerValidatorValidatePayload}
 */
export interface SignerValidatorValidatePayload {
  /**
   * The ID of the boost.
   *
   * @type {bigint}
   */
  boostId: bigint;
  /**
   * The ID of the incentive.
   *
   * @type {bigint}
   */
  incentiveId: bigint;
  /**
   * The address of the claimant.
   *
   * @type {Address}
   */
  claimant: Address;
  /**
   * The claim data.
   *
   * @type {Hex}
   */
  claimData: Hex;
}

/**
 * Object reprentation of a {@link SignerValidator} initialization payload
 *
 * @export
 * @interface SignerValidatorPayload
 * @typedef {SignerValidatorPayload}
 */
export interface SignerValidatorPayload {
  /**
   * The list of authorized signers. The first address in the list will be the initial owner of the contract.
   *
   * @type {Address[]}
   */
  signers: Address[];
  /**
   * The authorized caller of the {@link prepareSignerValidator} function
   * @type {Address}
   */
  validatorCaller: Address;
}

/**
 * Description placeholder
 *
 * @export
 * @interface SignerValidatorValidatePayload
 * @typedef {SignerValidatorValidatePayload}
 */
export interface SignerValidatorValidatePayload {
  /**
   * The ID of the boost.
   *
   * @type {bigint}
   */
  boostId: bigint;
  /**
   * The ID of the incentive.
   *
   * @type {bigint}
   */
  incentiveId: bigint;
  /**
   * The address of the claimant.
   *
   * @type {Address}
   */
  claimant: Address;
  /**
   * The claim data.
   *
   * @type {Hex}
   */
  claimData: Hex;
}

/**
 * Signer Validator Claim Data Payload
 *
 * @export
 * @interface SignerValidatorClaimDataParams
 * @typedef {SignerValidatorClaimDataParams}
 */
export interface SignerValidatorClaimDataParams {
  /**
   * The signer with which to sign the input
   *
   * @type {{
   *     account: Address;
   *     key: Hex;
   *     privateKey: PrivateKeyAccount;
   *   }}
   */
  signer: {
    account: Address;
    key: Hex;
    privateKey: PrivateKeyAccount;
  };
  /**
   * The encoded data to provide the underlying incentive. You can use {@link prepareAllowListIncentivePayload}, {@link prepareCGDAIncentivePayload}, {@link prepareERC20IncentivePayload}, {@link prepareERC1155IncentivePayload}, or {@link preparePointsIncentivePayload}
   *
   * @type {Hex}
   */
  incentiveData: Hex;
  /**
   * The chain id to target
   *
   * @type {number}
   */
  chainId: number;
  /**
   * The address of the validator
   *
   * @type {Address}
   */
  validator: Address;
  /**
   * The incentive quantity.
   *
   * @type {number}
   */
  incentiveQuantity: number;
  /**
   * The address of the claimant
   *
   * @type {Address}
   */
  claimant: Address;
  /**
   * The ID of the boost
   *
   * @type {bigint}
   */
  boostId: bigint;
}

/**
 * Object representation of a {@link SignerValidatorInputParams} initialization payload
 *
 * @export
 * @interface SignerValidatorInputParams
 * @typedef {SignerValidatorInputParams}
 */
export interface SignerValidatorInputParams {
  /**
   * The signer address.
   *
   * @type {Address}
   */
  signer: Address;

  /**
   * The signature data.
   *
   * @type {string}
   */
  signature: Hex;

  /**
   * The incentive quantity.
   *
   * @type {number}
   */
  incentiveQuantity: number;
}

/**
 * Object representing the payload for signing before validaton.
 *
 * @export
 * @interface SignerValidatorSignaturePayload
 * @typedef {SignerValidatorSignaturePayload}
 */
export interface SignerValidatorSignaturePayload {
  /**
   * The ID of the boost.
   *
   * @type {bigint}
   */
  boostId: bigint;
  /**
   * The ID of the incentive.
   *
   * @type {number}
   */
  incentiveQuantity: number;
  /**
   * The address of the claimant.
   *
   * @type {Address}
   */
  claimant: Address;
  /**
   * The claim data.
   *
   * @type {Hex}
   */
  incentiveData: Hex;
}

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
  /**
   * @inheritdoc
   *
   * @public
   * @readonly
   * @type {*}
   */
  public override readonly abi = signerValidatorAbi;
  /**
   * @inheritdoc
   *
   * @public
   * @static
   * @type {Record<number, Address>}
   */
  public static override bases: Record<number, Address> = {
    ...(SignerValidatorBases as Record<number, Address>),
  };
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
   * @param {?ReadParams} [params]
   * @returns {Promise<boolean>}
   */
  public async signers(
    address: Address,
    params?: ReadParams<typeof signerValidatorAbi, 'signers'>,
  ) {
    return await readSignerValidatorSigners(this._config, {
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
   * @param {?ReadParams} [params]
   * @returns {Promise<Hex>}
   */
  public async hashSignerData(
    payload: SignerValidatorSignaturePayload,
    params?: ReadParams<typeof signerValidatorAbi, 'hashSignerData'>,
  ) {
    return await readSignerValidatorHashSignerData(this._config, {
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
   * @param {?WriteParams} [params]
   * @returns {Promise<boolean>} - True if the action has been validated based on the data payload
   */
  protected async validate(
    payload: SignerValidatorValidatePayload,
    params?: WriteParams<typeof signerValidatorAbi, 'validate'>,
  ) {
    return await this.awaitResult(this.validateRaw(payload, params));
  }

  /**
   * Validate that the action has been completed successfully. The data payload is expected to be a tuple of (address signer, bytes32 hash, bytes signature). The signature is expected to be a valid ECDSA or EIP-1271 signature of a unique hash by an authorized signer.
   *
   * @public
   * @async
   * @param {SignerValidatorValidatePayload} payload
   * @param {?WriteParams} [params]
   * @returns {Promise<boolean>} - True if the action has been validated based on the data payload
   */
  protected async validateRaw(
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
   * @param {?WriteParams} [params]
   * @returns {Promise<void>}
   */
  public async setAuthorized(
    addresses: Address[],
    allowed: boolean[],
    params?: WriteParams<typeof signerValidatorAbi, 'setAuthorized'>,
  ) {
    return await this.awaitResult(
      this.setAuthorizedRaw(addresses, allowed, params),
    );
  }

  /**
   * Set the authorized status of a signer
   *
   * @public
   * @async
   * @param {Address[]} addresses - The list of signers to update
   * @param {boolean[]} allowed - The authorized status of each signer
   * @param {?WriteParams} [params]
   * @returns {Promise<{ hash: `0x${string}`; result: void; }>}
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
   * Update the authorized caller of the validator function
   *
   * @public
   * @async
   * @param {Address} address
   * @param {?WriteParams} [params]
   * @returns {Promise<{ hash: `0x${string}`; result: void; }>}
   */
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

  /**
   * Update the authorized caller of the validator function
   *
   * @public
   * @async
   * @param {Address} address
   * @param {?WriteParams} [params]
   * @returns {Promise<void>}
   */
  public async setValidatorCaller(
    address: Address,
    params?: WriteParams<typeof signerValidatorAbi, 'setValidatorCaller'>,
  ) {
    return await this.awaitResult(this.setValidatorCallerRaw(address, params));
  }

  /**
   * Properly encodes the data needed to claim
   *
   * @public
   * @async
   * @param {SignerValidatorClaimDataParams} params
   * @returns {Promise<Hex>}
   */
  public async encodeClaimData(
    params: Omit<SignerValidatorClaimDataParams, 'validator'>,
  ): Promise<Hex> {
    return await prepareSignerValidatorClaimDataPayload({
      ...params,
      validator: this.assertValidAddress(),
    });
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

/**
 * Signer Validator Claim Data Payload Preparation
 *
 * @export
 * @async
 * @param {SignerValidatorClaimDataParams} param0
 * @param {{ account: Address; key: Hex; privateKey: PrivateKeyAccount; }} param0.signer
 * @param {Hex} param0.incentiveData
 * @param {number} param0.chainId
 * @param {Address} param0.validator
 * @param {number} param0.incentiveQuantity
 * @param {Address} param0.claimant
 * @param {bigint} param0.boostId
 * @returns {Promise<Hex>}
 */
export async function prepareSignerValidatorClaimDataPayload({
  signer,
  incentiveData,
  chainId,
  validator,
  incentiveQuantity,
  claimant,
  boostId,
}: SignerValidatorClaimDataParams): Promise<Hex> {
  const domain = {
    name: 'SignerValidator',
    version: '1',
    chainId: chainId,
    verifyingContract: validator,
  };
  const typedData = {
    domain,
    types: {
      SignerValidatorData: [
        { name: 'boostId', type: 'uint256' },
        { name: 'incentiveQuantity', type: 'uint8' },
        { name: 'claimant', type: 'address' },
        { name: 'incentiveData', type: 'bytes' },
      ],
    },
    primaryType: 'SignerValidatorData' as const,
    message: {
      boostId,
      incentiveQuantity,
      claimant,
      incentiveData: incentiveData,
    },
  };

  const trustedSignature = await signTypedData({
    ...typedData,
    privateKey: signer.key,
  });

  // Prepare the claim data payload using the new helper
  const validatorData = prepareSignerValidatorInputParams({
    signer: signer.account,
    signature: trustedSignature,
    incentiveQuantity, // Adjust incentive quantity as necessary
  });

  const boostClaimDataPayload = encodeAbiParameters(
    [
      {
        type: 'tuple',
        name: 'BoostClaimData',
        components: [
          { type: 'bytes', name: 'validatorData' },
          { type: 'bytes', name: 'incentiveData' },
        ],
      },
    ],
    [{ validatorData, incentiveData }],
  );

  return boostClaimDataPayload;
}

/**
 * Given a {@link SignerValidatorInputParams}, properly encode the initialization payload.
 *
 * @param {SignerValidatorInputParams} param0
 * @param {Address} param0.signer
 * @param {Hex} param0.signature
 * @param {number} param0.incentiveQuantity
 * @returns {Hex}
 */
export function prepareSignerValidatorInputParams({
  signer,
  signature,
  incentiveQuantity,
}: SignerValidatorInputParams) {
  return encodeAbiParameters(
    [
      {
        type: 'tuple',
        name: 'SignerValidatorInputParams',
        components: [
          { type: 'address', name: 'signer' },
          { type: 'bytes', name: 'signature' },
          { type: 'uint8', name: 'incentiveQuantity' },
        ],
      },
    ],
    [{ signer, signature, incentiveQuantity }],
  );
}

/**
 * Given a {@link SignerValidatorPayload}, properly encode the initialization payload.
 *
 * @param {SignerValidatorPayload} param0
 * @param {Address[]} param0.signers
 * @param {Address} param0.validatorCaller
 * @returns {Hex}
 */
export function prepareSignerValidatorPayload({
  signers,
  validatorCaller,
}: SignerValidatorPayload) {
  return encodeAbiParameters(
    [
      { type: 'address[]', name: 'signers' },
      { type: 'address', name: 'validatorCaller' },
    ],
    [signers, validatorCaller],
  );
}
