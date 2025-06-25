import {
  payableLimitedSignerValidatorAbi,
  readPayableLimitedSignerValidatorGetClaimFee,
  readPayableLimitedSignerValidatorHashSignerData,
  readPayableLimitedSignerValidatorSigners,
  simulatePayableLimitedSignerValidatorSetAuthorized,
  simulatePayableLimitedSignerValidatorSetClaimFee,
  simulatePayableLimitedSignerValidatorSetValidatorCaller,
  simulatePayableLimitedSignerValidatorValidate,
  writePayableLimitedSignerValidatorSetAuthorized,
  writePayableLimitedSignerValidatorSetClaimFee,
  writePayableLimitedSignerValidatorSetValidatorCaller,
  writePayableLimitedSignerValidatorValidate,
} from '@boostxyz/evm';
import { bytecode } from '@boostxyz/evm/artifacts/contracts/validators/PayableLimitedSignerValidator.sol/PayableLimitedSignerValidator.json';
import {
  type Address,
  type ContractEventName,
  type Hex,
  type PrivateKeyAccount,
  encodeAbiParameters,
  zeroAddress,
} from 'viem';
import { PayableLimitedSignerValidator as PayableLimitedSignerValidatorBases } from '../../dist/deployments.json';
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
import type {
  LimitedSignerValidatorInputParams,
  LimitedSignerValidatorValidatePayload,
} from './LimitedSignerValidator';

export { payableLimitedSignerValidatorAbi };

/**
 * Object representation of a {@link PayableLimitedSignerValidator} initialization payload
 *
 * @export
 * @interface PayableLimitedSignerValidatorPayload
 * @typedef {PayableLimitedSignerValidatorPayload}
 */
export interface PayableLimitedSignerValidatorPayload {
  /**
   * The list of authorized signers. The first address in the list will be the initial owner of the contract.
   *
   * @type {Address[]}
   */
  signers: Address[];
  /**
   * The authorized caller of the validator function
   * @type {Address}
   */
  validatorCaller: Address;
  /**
   * The max quantity of claims a user can make for a given incentive
   * @type {number}
   */
  maxClaimCount: number;
}

/**
 * Extended validate payload that includes the payment value
 *
 * @export
 * @interface PayableLimitedSignerValidatorValidatePayload
 * @typedef {PayableLimitedSignerValidatorValidatePayload}
 */
export interface PayableLimitedSignerValidatorValidatePayload
  extends LimitedSignerValidatorValidatePayload {
  /**
   * The amount of ETH to send with the validation call (must match claimFee exactly)
   *
   * @type {bigint}
   */
  value: bigint;
}

/**
 * Signer Validator Claim Data Payload
 *
 * @export
 * @interface PayableLimitedSignerValidatorClaimDataParams
 * @typedef {PayableLimitedSignerValidatorClaimDataParams}
 */
export interface PayableLimitedSignerValidatorClaimDataParams {
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
   * The encoded data to provide the underlying incentive
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
 * Object representing the payload for signing before validation.
 *
 * @export
 * @interface PayableLimitedSignerValidatorSignaturePayload
 * @typedef {PayableLimitedSignerValidatorSignaturePayload}
 */
export interface PayableLimitedSignerValidatorSignaturePayload {
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
 * A generic `viem.Log` event with support for `PayableLimitedSignerValidator` event types.
 *
 * @export
 * @typedef {PayableLimitedSignerValidatorLog}
 */
export type PayableLimitedSignerValidatorLog<
  event extends ContractEventName<
    typeof payableLimitedSignerValidatorAbi
  > = ContractEventName<typeof payableLimitedSignerValidatorAbi>,
> = GenericLog<typeof payableLimitedSignerValidatorAbi, event>;

/**
 * A validator that verifies signatures, limits claims per address, and requires a claim fee.
 * The claim fee is stored on the base implementation and all clones read from it.
 * This allows updating the fee globally by only changing it on the base.
 *
 * @export
 * @class PayableLimitedSignerValidator
 * @extends {DeployableTarget}
 */
export class PayableLimitedSignerValidator extends DeployableTarget<
  PayableLimitedSignerValidatorPayload,
  typeof payableLimitedSignerValidatorAbi
> {
  /**
   * @inheritdoc
   *
   * @public
   * @readonly
   * @type {*}
   */
  public override readonly abi = payableLimitedSignerValidatorAbi;

  /**
   * @inheritdoc
   *
   * @public
   * @static
   * @type {Record<number, Address>}
   */
  public static override bases: Record<number, Address> = {
    ...(import.meta.env?.VITE_PAYABLE_LIMITED_SIGNER_VALIDATOR_BASE
      ? { 31337: import.meta.env.VITE_PAYABLE_LIMITED_SIGNER_VALIDATOR_BASE }
      : {}),
    ...(PayableLimitedSignerValidatorBases as Record<number, Address>),
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
   * Get the current claim fee. For clones, this reads from the base implementation.
   *
   * @public
   * @async
   * @param {?ReadParams} [params]
   * @returns {Promise<bigint>}
   */
  public async getClaimFee(params?: ReadParams): Promise<bigint> {
    return await readPayableLimitedSignerValidatorGetClaimFee(this._config, {
      address: this.assertValidAddress(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters
      ...(params as any),
    });
  }

  /**
   * Set the claim fee (only callable on the base implementation by the owner)
   *
   * @public
   * @async
   * @param {bigint} newFee - The new claim fee amount in wei
   * @param {?WriteParams} [params]
   * @returns {Promise<void>}
   */
  public async setClaimFee(
    newFee: bigint,
    params?: WriteParams,
  ): Promise<void> {
    return await this.awaitResult(this.setClaimFeeRaw(newFee, params));
  }

  /**
   * Set the claim fee (only callable on the base implementation by the owner)
   *
   * @public
   * @async
   * @param {bigint} newFee - The new claim fee amount in wei
   * @param {?WriteParams} [params]
   * @returns {Promise<{ hash: `0x${string}`; result: void; }>}
   */
  public async setClaimFeeRaw(newFee: bigint, params?: WriteParams) {
    const { request, result } =
      await simulatePayableLimitedSignerValidatorSetClaimFee(this._config, {
        address: this.assertValidAddress(),
        args: [newFee],
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters
        ...(params as any),
      });
    const hash = await writePayableLimitedSignerValidatorSetClaimFee(
      this._config,
      request,
    );
    return { hash, result };
  }

  /**
   * The set of authorized signers
   *
   * @public
   * @async
   * @param {Address} address
   * @param {?ReadParams} [params]
   * @returns {Promise<boolean>}
   */
  public async signers(address: Address, params?: ReadParams) {
    return await readPayableLimitedSignerValidatorSigners(this._config, {
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
   * @param {PayableLimitedSignerValidatorSignaturePayload} payload
   * @param {?ReadParams} [params]
   * @returns {Promise<Hex>}
   */
  public async hashSignerData(
    payload: PayableLimitedSignerValidatorSignaturePayload,
    params?: ReadParams,
  ) {
    return await readPayableLimitedSignerValidatorHashSignerData(this._config, {
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
   * Validate that the action has been completed successfully.
   * Requires exact payment of the claim fee.
   *
   * @public
   * @async
   * @param {PayableLimitedSignerValidatorValidatePayload} payload
   * @param {?WriteParams} [params]
   * @returns {Promise<boolean>} - True if the action has been validated
   */
  protected async validate(
    payload: PayableLimitedSignerValidatorValidatePayload,
    params?: WriteParams,
  ): Promise<boolean> {
    return await this.awaitResult(this.validateRaw(payload, params));
  }

  /**
   * Validate that the action has been completed successfully.
   * Requires exact payment of the claim fee.
   *
   * @public
   * @async
   * @param {PayableLimitedSignerValidatorValidatePayload} payload
   * @param {?WriteParams} [params]
   * @returns {Promise<{ hash: `0x${string}`; result: boolean; }>}
   */
  protected async validateRaw(
    payload: PayableLimitedSignerValidatorValidatePayload,
    params?: WriteParams,
  ) {
    const { request, result } =
      await simulatePayableLimitedSignerValidatorValidate(this._config, {
        address: this.assertValidAddress(),
        args: [
          payload.boostId,
          payload.incentiveId,
          payload.claimant,
          payload.claimData,
        ],
        value: payload.value,
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters
        ...(params as any),
      });
    const hash = await writePayableLimitedSignerValidatorValidate(
      this._config,
      request,
    );
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
    params?: WriteParams,
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
    params?: WriteParams,
  ) {
    const { request, result } =
      await simulatePayableLimitedSignerValidatorSetAuthorized(this._config, {
        address: this.assertValidAddress(),
        args: [addresses, allowed],
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters
        ...(params as any),
      });
    const hash = await writePayableLimitedSignerValidatorSetAuthorized(
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
   * @returns {Promise<{ hash: `0x${string}`; result: void; }>}
   */
  public async setValidatorCallerRaw(address: Address, params?: WriteParams) {
    const { request, result } =
      await simulatePayableLimitedSignerValidatorSetValidatorCaller(
        this._config,
        {
          address: this.assertValidAddress(),
          args: [address],
          ...this.optionallyAttachAccount(),
          // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters
          ...(params as any),
        },
      );
    const hash = await writePayableLimitedSignerValidatorSetValidatorCaller(
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
  public async setValidatorCaller(address: Address, params?: WriteParams) {
    return await this.awaitResult(this.setValidatorCallerRaw(address, params));
  }

  /**
   * Properly encodes the data needed to claim
   *
   * @public
   * @async
   * @param {PayableLimitedSignerValidatorClaimDataParams} params
   * @returns {Promise<Hex>}
   */
  public async encodeClaimData(
    params: Omit<PayableLimitedSignerValidatorClaimDataParams, 'validator'>,
  ): Promise<Hex> {
    return await preparePayableLimitedSignerValidatorClaimDataPayload({
      ...params,
      validator: this.assertValidAddress(),
    });
  }

  /**
   * @inheritdoc
   *
   * @public
   * @param {?PayableLimitedSignerValidatorPayload} [_payload]
   * @param {?DeployableOptions} [_options]
   * @returns {GenericDeployableParams}
   */
  public override buildParameters(
    _payload?: PayableLimitedSignerValidatorPayload,
    _options?: DeployableOptions,
  ): GenericDeployableParams {
    const [payload, options] = this.validateDeploymentConfig(
      _payload,
      _options,
    );

    // set the base implementation address
    const chainId = this._config.getClient().chain?.id;
    const baseImplementation = chainId
      ? PayableLimitedSignerValidator.bases[chainId] || zeroAddress
      : zeroAddress;

    return {
      abi: payableLimitedSignerValidatorAbi,
      bytecode: bytecode as Hex,
      args: [
        preparePayableLimitedSignerValidatorPayload({
          ...payload,
          baseImplementation,
        }),
      ],
      ...this.optionallyAttachAccount(options.account),
    };
  }
}

/**
 * Payable Limited Signer Validator Claim Data Payload Preparation
 *
 * @export
 * @async
 * @param {PayableLimitedSignerValidatorClaimDataParams} param0
 * @returns {Promise<Hex>}
 */
export async function preparePayableLimitedSignerValidatorClaimDataPayload({
  signer,
  incentiveData,
  chainId,
  validator,
  incentiveQuantity,
  claimant,
  boostId,
}: PayableLimitedSignerValidatorClaimDataParams): Promise<Hex> {
  const domain = {
    name: 'PayableLimitedSignerValidator',
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

  const trustedSignature = await signer.privateKey.signTypedData(typedData);

  // Prepare the claim data payload using the new helper
  const validatorData = preparePayableLimitedSignerValidatorInputParams({
    signer: signer.account,
    signature: trustedSignature,
    incentiveQuantity,
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
 * Given a {@link PayableLimitedSignerValidatorInputParams}, properly encode the initialization payload.
 *
 * @param {LimitedSignerValidatorInputParams} param0
 * @param {Address} param0.signer
 * @param {Hex} param0.signature
 * @param {number} param0.incentiveQuantity
 * @returns {Hex}
 */
export function preparePayableLimitedSignerValidatorInputParams({
  signer,
  signature,
  incentiveQuantity,
}: LimitedSignerValidatorInputParams) {
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
 * Prepare the initialization payload for a PayableLimitedSignerValidator
 *
 * @export
 * @param {PayableLimitedSignerValidatorPayload & { baseImplementation: Address }} payload
 * @returns {Hex}
 */
export function preparePayableLimitedSignerValidatorPayload(
  payload: PayableLimitedSignerValidatorPayload & {
    baseImplementation: Address;
  },
): Hex {
  return encodeAbiParameters(
    [
      { name: 'signers', type: 'address[]' },
      { name: 'validatorCaller', type: 'address' },
      { name: 'maxClaimCount', type: 'uint256' },
      { name: 'baseImplementation', type: 'address' },
    ],
    [
      payload.signers,
      payload.validatorCaller,
      BigInt(payload.maxClaimCount),
      payload.baseImplementation,
    ],
  );
}
