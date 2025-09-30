import {
  limitedSignerValidatorV2Abi,
  readLimitedSignerValidatorV2HashSignerData,
  readLimitedSignerValidatorV2Signers,
  simulateLimitedSignerValidatorV2SetAuthorized,
  simulateLimitedSignerValidatorV2SetValidatorCaller,
  simulateLimitedSignerValidatorV2Validate,
  writeLimitedSignerValidatorV2SetAuthorized,
  writeLimitedSignerValidatorV2SetValidatorCaller,
  writeLimitedSignerValidatorV2Validate,
} from '@boostxyz/evm';
import { bytecode } from '@boostxyz/evm/artifacts/contracts/validators/LimitedSignerValidatorV2.sol/LimitedSignerValidatorV2.json';
import {
  type Address,
  type ContractEventName,
  type Hex,
  type PrivateKeyAccount,
  encodeAbiParameters,
} from 'viem';
import { LimitedSignerValidatorV2 as SignerValidatorBases } from '../../dist/deployments.json';
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

export { limitedSignerValidatorV2Abi };

/**
 * Object reprentation of a {@link LimitedSignerValidatorV2} initialization payload
 *
 * @export
 * @interface LimitedSignerValidatorV2Payload
 * @typedef {LimitedSignerValidatorV2Payload}
 */
export interface LimitedSignerValidatorV2Payload {
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
  /**
   * The max quantity of claims a user can make for a given incentive,
   * regardless of how many valid transactions they have
   * @type {number}
   */
  maxClaimCount: number;
}

/**
 * Description placeholder
 *
 * @export
 * @interface LimitedSignerValidatorV2ValidatePayload
 * @typedef {LimitedSignerValidatorV2ValidatePayload}
 */
export interface LimitedSignerValidatorV2ValidatePayload {
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
 * Object reprentation of a {@link LimitedSignerValidatorV2} initialization payload
 *
 * @export
 * @interface LimitedSignerValidatorV2Payload
 * @typedef {LimitedSignerValidatorV2Payload}
 */
export interface LimitedSignerValidatorV2Payload {
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
 * @interface LimitedSignerValidatorV2ValidatePayload
 * @typedef {LimitedSignerValidatorV2ValidatePayload}
 */
export interface LimitedSignerValidatorV2ValidatePayload {
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
 * @interface LimitedSignerValidatorV2ClaimDataParams
 * @typedef {LimitedSignerValidatorV2ClaimDataParams}
 */
export interface LimitedSignerValidatorV2ClaimDataParams {
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
  /**
   * The address of the referrer
   *
   * @type {?Address}
   */
  referrer?: Address;
}

/**
 * Object representation of a {@link LimitedSignerValidatorV2InputParams} initialization payload
 *
 * @export
 * @interface LimitedSignerValidatorV2InputParams
 * @typedef {LimitedSignerValidatorV2InputParams}
 */
export interface LimitedSignerValidatorV2InputParams {
  /**
   * The signer address.
   *
   * @type {Address}
   */
  signer: Address;

  /**
   * The signature data.
   *
   * @type {Hex}
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
 * @interface LimitedSignerValidatorV2SignaturePayload
 * @typedef {LimitedSignerValidatorV2SignaturePayload}
 */
export interface LimitedSignerValidatorV2SignaturePayload {
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
 * A generic `viem.Log` event with support for `BoostCore` event types.
 *
 * @export
 * @typedef {LimitedSignerValidatorV2Log}
 * @template {ContractEventName<
 *     typeof limitedSignerValidatorV2Abi
 *   >} [event=ContractEventName<typeof limitedSignerValidatorV2Abi>]
 */
export type LimitedSignerValidatorV2Log<
  event extends ContractEventName<
    typeof limitedSignerValidatorV2Abi
  > = ContractEventName<typeof limitedSignerValidatorV2Abi>,
> = GenericLog<typeof limitedSignerValidatorV2Abi, event>;

/**
 *  A simple implementation of a Validator that verifies a given signature and checks the recovered address against a set of authorized signers
 *
 * @export
 * @class LimitedSignerValidatorV2
 * @typedef {LimitedSignerValidatorV2}
 * @extends {DeployableTarget<LimitedSignerValidatorV2Payload>}
 */
export class LimitedSignerValidatorV2 extends DeployableTarget<
  LimitedSignerValidatorV2Payload,
  typeof limitedSignerValidatorV2Abi
> {
  /**
   * @inheritdoc
   *
   * @public
   * @readonly
   * @type {*}
   */
  public override readonly abi = limitedSignerValidatorV2Abi;
  /**
   * @inheritdoc
   *
   * @public
   * @static
   * @type {Record<number, Address>}
   */
  public static override bases: Record<number, Address> = {
    ...(import.meta.env?.VITE_LIMITED_SIGNER_VALIDATOR_BASE
      ? { 31337: import.meta.env.VITE_LIMITED_SIGNER_VALIDATOR_BASE }
      : {}),
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
  public async signers(address: Address, params?: ReadParams) {
    return await readLimitedSignerValidatorV2Signers(this._config, {
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
    payload: LimitedSignerValidatorV2SignaturePayload,
    params?: ReadParams,
  ) {
    const referrer = payload.referrer ?? payload.claimant;
    return await readLimitedSignerValidatorV2HashSignerData(this._config, {
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
    });
  }

  /**
   * Validate that the action has been completed successfully. The data payload is expected to be a tuple of (address signer, bytes32 hash, bytes signature). The signature is expected to be a valid ECDSA or EIP-1271 signature of a unique hash by an authorized signer.
   *
   * @public
   * @async
   * @param {LimitedSignerValidatorV2ValidatePayload} payload
   * @param {?WriteParams} [params]
   * @returns {Promise<boolean>} - True if the action has been validated based on the data payload
   */
  public async validate(
    payload: LimitedSignerValidatorV2ValidatePayload,
    params?: WriteParams,
  ) {
    return await this.awaitResult(this.validateRaw(payload, params));
  }

  /**
   * Validate that the action has been completed successfully. The data payload is expected to be a tuple of (address signer, bytes32 hash, bytes signature). The signature is expected to be a valid ECDSA or EIP-1271 signature of a unique hash by an authorized signer.
   *
   * @public
   * @async
   * @param {LimitedSignerValidatorV2ValidatePayload} payload
   * @param {?WriteParams} [params]
   * @returns {Promise<boolean>} - True if the action has been validated based on the data payload
   */
  public async validateRaw(
    payload: LimitedSignerValidatorV2ValidatePayload,
    params?: WriteParams,
  ) {
    const { request, result } = await simulateLimitedSignerValidatorV2Validate(
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
    const hash = await writeLimitedSignerValidatorV2Validate(
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
      await simulateLimitedSignerValidatorV2SetAuthorized(this._config, {
        address: this.assertValidAddress(),
        args: [addresses, allowed],
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      });
    const hash = await writeLimitedSignerValidatorV2SetAuthorized(
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
      await simulateLimitedSignerValidatorV2SetValidatorCaller(this._config, {
        address: this.assertValidAddress(),
        args: [address],
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      });
    const hash = await writeLimitedSignerValidatorV2SetValidatorCaller(
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
   * @param {LimitedSignerValidatorV2ClaimDataParams} params
   * @returns {Promise<Hex>}
   */
  public async encodeClaimData(
    params: Omit<LimitedSignerValidatorV2ClaimDataParams, 'validator'>,
  ): Promise<Hex> {
    return await prepareLimitedSignerValidatorV2ClaimDataPayload({
      ...params,
      validator: this.assertValidAddress(),
    });
  }

  /**
   * @inheritdoc
   *
   * @public
   * @param {?LimitedSignerValidatorV2Payload} [_payload]
   * @param {?DeployableOptions} [_options]
   * @returns {GenericDeployableParams}
   */
  public override buildParameters(
    _payload?: LimitedSignerValidatorV2Payload,
    _options?: DeployableOptions,
  ): GenericDeployableParams {
    const [payload, options] = this.validateDeploymentConfig(
      _payload,
      _options,
    );
    return {
      abi: limitedSignerValidatorV2Abi,
      bytecode: bytecode as Hex,
      args: [prepareLimitedSignerValidatorV2Payload(payload)],
      ...this.optionallyAttachAccount(options.account),
    };
  }
}

/**
 * Signer Validator Claim Data Payload Preparation
 *
 * @export
 * @async
 * @param {LimitedSignerValidatorV2ClaimDataParams} param0
 * @param {{ account: Address; key: Hex; privateKey: PrivateKeyAccount; }} param0.signer
 * @param {Hex} param0.incentiveData
 * @param {number} param0.chainId
 * @param {Address} param0.validator
 * @param {number} param0.incentiveQuantity
 * @param {Address} param0.claimant
 * @param {bigint} param0.boostId
 * @returns {Promise<Hex>}
 */
export async function prepareLimitedSignerValidatorV2ClaimDataPayload({
  signer,
  incentiveData,
  chainId,
  validator,
  incentiveQuantity,
  claimant,
  boostId,
  referrer,
}: LimitedSignerValidatorV2ClaimDataParams): Promise<Hex> {
  const _referrer = referrer ?? claimant;
  const domain = {
    name: 'LimitedSignerValidatorV2',
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
  const validatorData = prepareLimitedSignerValidatorV2InputParams({
    signer: signer.account,
    signature: trustedSignature,
    incentiveQuantity, // Adjust incentive quantity as necessary
  });

  const boostClaimDataPayload = encodeAbiParameters(
    [
      {
        type: 'tuple',
        name: 'BoostClaimDataWithReferrer',
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
 * Given a {@link SignerValidatorInputParams}, properly encode the initialization payload.
 *
 * @param {SignerValidatorInputParams} param0
 * @param {Address} param0.signer
 * @param {Hex} param0.signature
 * @param {number} param0.incentiveQuantity
 * @returns {Hex}
 */
export function prepareLimitedSignerValidatorV2InputParams({
  signer,
  signature,
  incentiveQuantity,
}: LimitedSignerValidatorV2InputParams) {
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
   * Given a {@link LimitedSignerValidatorV2Payload}, properly encode the initialization payload.
   *
   * @param {LimitedSignerValidatorV2Payload} param0
        SignerValidator: class TSignerValidator extends SignerValidator {
          public static override bases: Record<number, Address> = {
            [chainId]: signerValidatorBase,
          };
        },
   * @param {Address[]} param0.signers
   * @param {Address} param0.validatorCaller
   * @returns {Hex}
   */
export function prepareLimitedSignerValidatorV2Payload({
  signers,
  validatorCaller,
  maxClaimCount,
}: LimitedSignerValidatorV2Payload) {
  return encodeAbiParameters(
    [
      { type: 'address[]', name: 'signers' },
      { type: 'address', name: 'validatorCaller' },
      { type: 'uint256', name: 'maxClaimCount' },
    ],
    [signers, validatorCaller, BigInt(maxClaimCount)],
  );
}
