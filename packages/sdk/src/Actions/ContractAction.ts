import {
  contractActionAbi,
  readContractActionChainId,
  readContractActionPrepare,
  readContractActionSelector,
  readContractActionTarget,
  readContractActionValue,
  simulateContractActionExecute,
  writeContractActionExecute,
} from '@boostxyz/evm';
import { bytecode } from '@boostxyz/evm/artifacts/contracts/actions/ContractAction.sol/ContractAction.json';
import type { Abi, Address, ContractEventName, Hex } from 'viem';
import type {
  DeployableOptions,
  GenericDeployableParams,
} from '../Deployable/Deployable';
import { DeployableTarget } from '../Deployable/DeployableTarget';
import {
  type ContractActionPayload,
  type GenericLog,
  type ReadParams,
  RegistryType,
  type WriteParams,
  prepareContractActionPayload,
} from '../utils';

export { contractActionAbi };
export type { ContractActionPayload };

/**
 * A generic `viem.Log` event with support for `ContractAction` event types.
 *
 * @export
 * @typedef {ContractActionLog}
 * @template {ContractEventName<typeof contractActionAbi>} [event=ContractEventName<
 *     typeof contractActionAbi
 *   >]
 */
export type ContractActionLog<
  event extends ContractEventName<typeof contractActionAbi> = ContractEventName<
    typeof contractActionAbi
  >,
> = GenericLog<typeof contractActionAbi, event>;

/**
 * A generic contract action
 *
 * @export
 * @class ContractAction
 * @typedef {ContractAction}
 * @extends {DeployableTarget<ContractActionPayload>}
 */
export class ContractAction<
  ContractActionAbi extends Abi = typeof contractActionAbi,
> extends DeployableTarget<ContractActionPayload, ContractActionAbi> {
  //@ts-expect-error should never be constructed with variant typ
  public override readonly abi = contractActionAbi;

  /**
   * @inheritdoc
   *
   * @public
   * @static
   * @type {Address}
   */
  public static override base: Address = import.meta.env
    .VITE_CONTRACT_ACTION_BASE;
  /**
   * @inheritdoc
   *
   * @public
   * @static
   * @type {RegistryType}
   */
  public static override registryType: RegistryType = RegistryType.ACTION;

  /**
   * The target chain ID
   *
   * @public
   * @async
   * @param {?ReadParams<typeof contractActionAbi, 'chainId'>} [params]
   * @returns {Promise<bigint>}
   */
  public async chainId(
    params?: ReadParams<typeof contractActionAbi, 'chainId'>,
  ) {
    return readContractActionChainId(this._config, {
      address: this.assertValidAddress(),
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  /**
   * The target contract
   *
   * @public
   * @async
   * @param {?ReadParams<typeof contractActionAbi, 'target'>} [params]
   * @returns {Promise<`0x${string}`>}
   */
  public async target(params?: ReadParams<typeof contractActionAbi, 'target'>) {
    return readContractActionTarget(this._config, {
      address: this.assertValidAddress(),
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  /**
   * The selector for the function to be called
   *
   * @example `function mint(address to, uint256 amount)`
   * @public
   * @async
   * @param {?ReadParams<typeof contractActionAbi, 'selector'>} [params]
   * @returns {Promise<`0x${string}`>}
   */
  public async selector(
    params?: ReadParams<typeof contractActionAbi, 'selector'>,
  ) {
    return readContractActionSelector(this._config, {
      address: this.assertValidAddress(),
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  /**
   * The native token value to send with the function call
   *
   * @public
   * @async
   * @param {?ReadParams<typeof contractActionAbi, 'value'>} [params]
   * @returns {Promise<bigint>}
   */
  public async value(params?: ReadParams<typeof contractActionAbi, 'value'>) {
    return readContractActionValue(this._config, {
      address: this.assertValidAddress(),
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  /**
   * Executes a prepared contract action
   *
   * @public
   * @async
   * @param {Hex} data
   * @param {?WriteParams<typeof contractActionAbi, 'execute'>} [params]
   * @returns {Promise<readonly [boolean, `0x${string}`]>}
   */
  public async execute(
    data: Hex,
    params?: WriteParams<typeof contractActionAbi, 'execute'>,
  ) {
    return this.awaitResult(this.executeRaw(data, params));
  }

  /**
   * Executes a prepared contract action
   *
   * @public
   * @async
   * @param {Hex} data
   * @param {?WriteParams<typeof contractActionAbi, 'execute'>} [params]
   * @returns {unknown}
   */
  public async executeRaw(
    data: Hex,
    params?: WriteParams<typeof contractActionAbi, 'execute'>,
  ) {
    const { request, result } = await simulateContractActionExecute(
      this._config,
      {
        address: this.assertValidAddress(),
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
        args: [data],
      },
    );
    const hash = await writeContractActionExecute(this._config, request);
    return { hash, result };
  }

  /**
   * The encoded execution payload
   *
   * @public
   * @async
   * @param {Hex} calldata
   * @param {?ReadParams<typeof contractActionAbi, 'prepare'>} [params]
   * @returns {unknown}
   */
  public async prepare(
    calldata: Hex,
    params?: ReadParams<typeof contractActionAbi, 'prepare'>,
  ) {
    return readContractActionPrepare(this._config, {
      address: this.assertValidAddress(),
      args: [calldata],
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  /**
   * @inheritdoc
   *
   * @public
   * @param {?ContractActionPayload} [_payload]
   * @param {?DeployableOptions} [_options]
   * @returns {GenericDeployableParams}
   */
  public override buildParameters(
    _payload?: ContractActionPayload,
    _options?: DeployableOptions,
  ): GenericDeployableParams {
    const [payload, options] = this.validateDeploymentConfig(
      _payload,
      _options,
    );
    return {
      abi: contractActionAbi,
      bytecode: bytecode as Hex,
      args: [prepareContractActionPayload(payload)],
      ...this.optionallyAttachAccount(options.account),
    };
  }
}
