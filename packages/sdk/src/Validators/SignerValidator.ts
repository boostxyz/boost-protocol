import {
  readSignerValidatorSigners,
  signerValidatorAbi,
  simulateSignerValidatorSetAuthorized,
  simulateSignerValidatorValidate,
  writeSignerValidatorSetAuthorized,
  writeSignerValidatorValidate,
} from '@boostxyz/evm';
import { bytecode } from '@boostxyz/evm/artifacts/contracts/validators/SignerValidator.sol/SignerValidator.json';
import { watchContractEvent } from '@wagmi/core';
import type { ExtractAbiEvent } from 'abitype';
import type {
  AbiEvent,
  Address,
  ContractEventName,
  GetLogsReturnType,
  Hex,
} from 'viem';
import { getLogs } from 'viem/actions';
import type {
  DeployableOptions,
  GenericDeployableParams,
} from '../Deployable/Deployable';
import { DeployableTarget } from '../Deployable/DeployableTarget';
import {
  type GenericLog,
  type GetLogsParams,
  type ReadParams,
  RegistryType,
  type SignerValidatorPayload,
  type SignerValidatorValidatePayload,
  type WatchParams,
  type WriteParams,
  prepareSignerValidatorPayload,
  prepareSignerValidatorValidatePayload,
} from '../utils';

export type { SignerValidatorPayload };

/**
 * A record of `SignerValidator` event names to `AbiEvent` objects for use with `getLogs`
 *
 * @export
 * @typedef {SignerValidatorAbiEvents}
 * @template {ContractEventName<
 *     typeof signerValidatorAbi
 *   >} [eventName=ContractEventName<typeof signerValidatorAbi>]
 */
export type SignerValidatorAbiEvents<
  eventName extends ContractEventName<
    typeof signerValidatorAbi
  > = ContractEventName<typeof signerValidatorAbi>,
> = {
  [name in eventName]: ExtractAbiEvent<typeof signerValidatorAbi, name>;
};

/**
 * A record of `SignerValidator` event names to `AbiEvent` objects for use with `getLogs`
 *
 * @type {SignerValidatorAbiEvents}
 */
export const SignerValidatorAbiEvents: SignerValidatorAbiEvents = import.meta
  .env.SignerValidatorAbiEvents;

/**
 * A generic `viem.Log` event with support for `BoostCore` event types.
 *
 * @export
 * @typedef {SignerValidatorEvent}
 * @template {ContractEventName<
 *     typeof signerValidatorAbi
 *   >} [event=ContractEventName<typeof signerValidatorAbi>]
 */
export type SignerValidatorEvent<
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

  /**
   * A typed wrapper for `viem.getLogs`
   *
   * @public
   * @async
   * @template {ContractEventName<typeof signerValidatorAbi>} event
   * @template {ExtractAbiEvent<
   *       typeof signerValidatorAbi,
   *       event
   *     >} [abiEvent=ExtractAbiEvent<typeof signerValidatorAbi, event>]
   * @template {| readonly AbiEvent[]
   *       | readonly unknown[]
   *       | undefined} [abiEvents=abiEvent extends AbiEvent ? [abiEvent] : undefined]
   * @param {?GetLogsParams<
   *       typeof signerValidatorAbi,
   *       event,
   *       abiEvent,
   *       abiEvents
   *     > & {
   *       event?: abiEvent;
   *       events?: abiEvents;
   *     }} [params]
   * @returns {Promise<GetLogsReturnType<abiEvent, abiEvents>>}
   */
  public async getLogs<
    event extends ContractEventName<typeof signerValidatorAbi>,
    const abiEvent extends ExtractAbiEvent<
      typeof signerValidatorAbi,
      event
    > = ExtractAbiEvent<typeof signerValidatorAbi, event>,
    const abiEvents extends
      | readonly AbiEvent[]
      | readonly unknown[]
      | undefined = abiEvent extends AbiEvent ? [abiEvent] : undefined,
  >(
    params?: GetLogsParams<
      typeof signerValidatorAbi,
      event,
      abiEvent,
      abiEvents
    > & {
      event?: abiEvent;
      events?: abiEvents;
    },
  ): Promise<GetLogsReturnType<abiEvent, abiEvents>> {
    return getLogs(this._config.getClient({ chainId: params?.chainId }), {
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wag
      ...(params as any),
      address: this.assertValidAddress(),
    });
  }

  /**
   * Subscribes to one or all events from `SignerValidator`
   *
   * @public
   * @async
   * @template {ContractEventName<typeof signerValidatorAbi>} event
   * @param {(log: SignerValidatorEvent<event>) => unknown} cb
   * @param {?WatchParams<typeof signerValidatorAbi, event> & {
   *       eventName?: event;
   *     }} [params]
   * @returns {unknown, params?: any) => unknown} Unsubscribe function
   */
  public async subscribe<
    event extends ContractEventName<typeof signerValidatorAbi>,
  >(
    cb: (log: SignerValidatorEvent<event>) => unknown,
    params?: WatchParams<typeof signerValidatorAbi, event> & {
      eventName?: event;
    },
  ) {
    return watchContractEvent<
      typeof this._config,
      (typeof this._config)['chains'][number]['id'],
      typeof signerValidatorAbi,
      event
    >(this._config, {
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
      eventName: params?.eventName,
      abi: signerValidatorAbi,
      address: this.assertValidAddress(),
      onLogs: (logs) => {
        for (let l of logs) {
          cb(l as unknown as SignerValidatorEvent<event>);
        }
      },
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
