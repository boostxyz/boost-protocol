import {
  payableLimitedSignerValidatorV2Abi,
  readPayableLimitedSignerValidatorV2GetClaimFee,
  readPayableLimitedSignerValidatorV2HashSignerData,
  readPayableLimitedSignerValidatorV2Signers,
  simulatePayableLimitedSignerValidatorV2SetAuthorized,
  simulatePayableLimitedSignerValidatorV2SetClaimFee,
  simulatePayableLimitedSignerValidatorV2SetValidatorCaller,
  simulatePayableLimitedSignerValidatorV2Validate,
  writePayableLimitedSignerValidatorV2SetAuthorized,
  writePayableLimitedSignerValidatorV2SetClaimFee,
  writePayableLimitedSignerValidatorV2SetValidatorCaller,
  writePayableLimitedSignerValidatorV2Validate,
} from '@boostxyz/evm';
import { bytecode } from '@boostxyz/evm/artifacts/contracts/validators/PayableLimitedSignerValidatorV2.sol/PayableLimitedSignerValidatorV2.json';
import {
  type Address,
  type ContractEventName,
  type Hex,
  type PrivateKeyAccount,
  encodeAbiParameters,
} from 'viem';
import { PayableLimitedSignerValidatorV2 as PayableLimitedSignerValidatorV2Bases } from '../../dist/deployments.json';
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

export { payableLimitedSignerValidatorV2Abi };

/**
 * Object representation of a {@link PayableLimitedSignerValidatorV2} initialization payload
 *
 * @export
 * @interface PayableLimitedSignerValidatorV2Payload
 * @typedef {PayableLimitedSignerValidatorV2Payload}
 */
export interface PayableLimitedSignerValidatorV2Payload {
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
 * @interface PayableLimitedSignerValidatorV2ValidatePayload
 * @typedef {PayableLimitedSignerValidatorV2ValidatePayload}
 */
export interface PayableLimitedSignerValidatorV2ValidatePayload
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
 * @interface PayableLimitedSignerValidatorV2ClaimDataParams
 * @typedef {PayableLimitedSignerValidatorV2ClaimDataParams}
 */
export interface PayableLimitedSignerValidatorV2ClaimDataParams {
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
  /**
   * The address of the referrer
   *
   * @type {?Address}
   */
  referrer?: Address;
}

/**
 * Object representing the payload for signing before validation.
 *
 * @export
 * @interface PayableLimitedSignerValidatorV2SignaturePayload
 * @typedef {PayableLimitedSignerValidatorV2SignaturePayload}
 */
export interface PayableLimitedSignerValidatorV2SignaturePayload {
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
  /**
   * The address of the referrer (defaults to claimant if omitted)
   *
   * @type {?Address}
   */
  referrer?: Address;
}

/**
 * A generic `viem.Log` event with support for `PayableLimitedSignerValidatorV2` event types.
 *
 * @export
 * @typedef {PayableLimitedSignerValidatorV2Log}
 */
export type PayableLimitedSignerValidatorV2Log<
  event extends ContractEventName<
    typeof payableLimitedSignerValidatorV2Abi
  > = ContractEventName<typeof payableLimitedSignerValidatorV2Abi>,
> = GenericLog<typeof payableLimitedSignerValidatorV2Abi, event>;

/**
 * A validator that verifies signatures, limits claims per address, and requires a claim fee.
 * The claim fee is stored on the base implementation and all clones read from it.
 * This allows updating the fee globally by only changing it on the base.
 *
 * @export
 * @class PayableLimitedSignerValidatorV2
 * @extends {DeployableTarget}
 */
export class PayableLimitedSignerValidatorV2 extends DeployableTarget<
  PayableLimitedSignerValidatorV2Payload,
  typeof payableLimitedSignerValidatorV2Abi
> {
  /**
   * @inheritdoc
   *
   * @public
   * @readonly
   * @type {*}
   */
  public override readonly abi = payableLimitedSignerValidatorV2Abi;

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
    ...(PayableLimitedSignerValidatorV2Bases as Record<number, Address>),
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
    return await readPayableLimitedSignerValidatorV2GetClaimFee(this._config, {
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
      await simulatePayableLimitedSignerValidatorV2SetClaimFee(this._config, {
        address: this.assertValidAddress(),
        args: [newFee],
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters
        ...(params as any),
      });
    const hash = await writePayableLimitedSignerValidatorV2SetClaimFee(
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
    return await readPayableLimitedSignerValidatorV2Signers(this._config, {
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
   * @param {PayableLimitedSignerValidatorV2SignaturePayload} payload
   * @param {?ReadParams} [params]
   * @returns {Promise<Hex>}
   */
  public async hashSignerData(
    payload: PayableLimitedSignerValidatorV2SignaturePayload,
    params?: ReadParams,
  ) {
    const referrer = payload.referrer ?? payload.claimant;
    return await readPayableLimitedSignerValidatorV2HashSignerData(
      this._config,
      {
        address: this.assertValidAddress(),
        args: [
          payload.boostId,
          payload.incentiveQuantity,
          payload.claimant,
          payload.incentiveData,
          referrer,
        ],
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      },
    );
  }

  /**
   * Validate that the action has been completed successfully.
   * Requires exact payment of the claim fee.
   *
   * @public
   * @async
   * @param {PayableLimitedSignerValidatorV2ValidatePayload} payload
   * @param {?WriteParams} [params]
   * @returns {Promise<boolean>} - True if the action has been validated
   */
  protected async validate(
    payload: PayableLimitedSignerValidatorV2ValidatePayload,
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
   * @param {PayableLimitedSignerValidatorV2ValidatePayload} payload
   * @param {?WriteParams} [params]
   * @returns {Promise<{ hash: `0x${string}`; result: boolean; }>}
   */
  protected async validateRaw(
    payload: PayableLimitedSignerValidatorV2ValidatePayload,
    params?: WriteParams,
  ) {
    const { request, result } =
      await simulatePayableLimitedSignerValidatorV2Validate(this._config, {
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
    const hash = await writePayableLimitedSignerValidatorV2Validate(
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
      await simulatePayableLimitedSignerValidatorV2SetAuthorized(this._config, {
        address: this.assertValidAddress(),
        args: [addresses, allowed],
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters
        ...(params as any),
      });
    const hash = await writePayableLimitedSignerValidatorV2SetAuthorized(
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
      await simulatePayableLimitedSignerValidatorV2SetValidatorCaller(
        this._config,
        {
          address: this.assertValidAddress(),
          args: [address],
          ...this.optionallyAttachAccount(),
          // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters
          ...(params as any),
        },
      );
    const hash = await writePayableLimitedSignerValidatorV2SetValidatorCaller(
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
   * @param {PayableLimitedSignerValidatorV2ClaimDataParams} params
   * @returns {Promise<Hex>}
   */
  public async encodeClaimData(
    params: Omit<PayableLimitedSignerValidatorV2ClaimDataParams, 'validator'>,
  ): Promise<Hex> {
    return await preparePayableLimitedSignerValidatorV2ClaimDataPayload({
      ...params,
      validator: this.assertValidAddress(),
    });
  }

  /**
   * @inheritdoc
   *
   * @public
   * @param {?PayableLimitedSignerValidatorV2Payload} [_payload]
   * @param {?DeployableOptions} [_options]
   * @returns {GenericDeployableParams}
   */
  public override buildParameters(
    _payload?: PayableLimitedSignerValidatorV2Payload,
    _options?: DeployableOptions,
  ): GenericDeployableParams {
    const [payload, options] = this.validateDeploymentConfig(
      _payload,
      _options,
    );

    // set the base implementation address
    const chainId = this._config.getClient().chain?.id;
    if (!chainId) {
      throw new Error(
        'Chain ID is required for PayableLimitedSignerValidatorV2 deployment',
      );
    }
    const baseImplementation = PayableLimitedSignerValidatorV2.bases[chainId];
    if (!baseImplementation) {
      throw new Error(
        `Base implementation not found for chain ID ${chainId}. Please ensure PayableLimitedSignerValidatorV2 is deployed on this chain.`,
      );
    }

    return {
      abi: payableLimitedSignerValidatorV2Abi,
      bytecode: bytecode as Hex,
      args: [
        preparePayableLimitedSignerValidatorV2Payload({
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
 * @param {PayableLimitedSignerValidatorV2ClaimDataParams} param0
 * @returns {Promise<Hex>}
 */
export async function preparePayableLimitedSignerValidatorV2ClaimDataPayload({
  signer,
  incentiveData,
  chainId,
  validator,
  incentiveQuantity,
  claimant,
  boostId,
  referrer,
}: PayableLimitedSignerValidatorV2ClaimDataParams): Promise<Hex> {
  const _referrer = referrer ?? claimant;
  const domain = {
    name: 'PayableLimitedSignerValidatorV2',
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
        { name: 'referrer', type: 'address' },
      ],
    },
    primaryType: 'SignerValidatorData' as const,
    message: {
      boostId,
      incentiveQuantity,
      claimant,
      incentiveData: incentiveData,
      referrer: _referrer,
    },
  };

  const trustedSignature = await signer.privateKey.signTypedData(typedData);

  // Prepare the claim data payload using the new helper
  const validatorData = preparePayableLimitedSignerValidatorV2InputParams({
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
          { type: 'address', name: 'referrer' },
        ],
      },
    ],
    [{ validatorData, incentiveData, referrer: _referrer }],
  );

  return boostClaimDataPayload;
}

/**
 * Given a {@link PayableLimitedSignerValidatorV2InputParams}, properly encode the initialization payload.
 *
 * @param {LimitedSignerValidatorInputParams} param0
 * @param {Address} param0.signer
 * @param {Hex} param0.signature
 * @param {number} param0.incentiveQuantity
 * @returns {Hex}
 */
export function preparePayableLimitedSignerValidatorV2InputParams({
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
 * Prepare the initialization payload for a PayableLimitedSignerValidatorV2
 *
 * @export
 * @param {PayableLimitedSignerValidatorV2Payload & { baseImplementation: Address }} payload
 * @returns {Hex}
 */
export function preparePayableLimitedSignerValidatorV2Payload(
  payload: PayableLimitedSignerValidatorV2Payload & {
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
