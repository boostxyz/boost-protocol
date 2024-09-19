import {
  eventActionAbi,
  readEventActionGetActionClaimant,
  readEventActionGetActionSteps,
  simulateEventActionExecute,
  writeEventActionExecute,
} from '@boostxyz/evm';
import { bytecode } from '@boostxyz/evm/artifacts/contracts/actions/EventAction.sol/EventAction.json';
import events from '@boostxyz/signatures/events';
import {
  type Abi,
  type AbiEvent,
  type Address,
  type ContractEventName,
  type Hex,
  type Log,
  isAddressEqual,
} from 'viem';
import { getLogs } from 'viem/actions';
import type {
  DeployableOptions,
  GenericDeployableParams,
} from '../Deployable/Deployable';
import { DeployableTarget } from '../Deployable/DeployableTarget';
import {
  FieldValueNotComparableError,
  FieldValueUndefinedError,
  InvalidNumericalCriteriaError,
  NoEventActionStepsProvidedError,
  TooManyEventActionStepsProvidedError,
  UnrecognizedFilterTypeError,
} from '../errors';
import {
  type ActionClaimant,
  type ActionStep,
  type Criteria,
  type EventActionPayload,
  type EventActionPayloadRaw,
  FilterType,
  type GetLogsParams,
  PrimitiveType,
  type ReadParams,
  RegistryType,
  type WriteParams,
  dedupeActionSteps,
  isEventActionPayloadSimple,
  prepareEventActionPayload,
} from '../utils';

export type { EventActionPayload };

/**
 * A generic event action
 *
 * @export
 * @class EventAction
 * @typedef {EventAction}
 * @extends {DeployableTarget<EventActionPayload>}
 */
export class EventAction extends DeployableTarget<
  EventActionPayload,
  typeof eventActionAbi
> {
  /**
   * @inheritdoc
   *
   * @public
   * @readonly
   * @type {*}
   */
  public override readonly abi = eventActionAbi;
  /**
   * @inheritdoc
   *
   * @public
   * @static
   * @type {Address}
   */
  public static override base: Address = import.meta.env.VITE_EVENT_ACTION_BASE;
  /**
   * @inheritdoc
   *
   * @public
   * @static
   * @type {RegistryType}
   */
  public static override registryType: RegistryType = RegistryType.ACTION;

  /**
   * Gets a specific action event by index
   *
   * @public
   * @async
   * @param {number} index The index of the action event to retrieve
   * @param {?ReadParams<typeof eventActionAbi, 'getActionStep'>} [params]
   * @returns {Promise<ActionStep>}
   */
  public async getActionStep(
    index: number,
    params?: ReadParams<typeof eventActionAbi, 'getActionStep'>,
  ) {
    const steps = await this.getActionSteps(params);
    return steps.at(index);
  }

  /**
   * Gets all action events
   *
   * @public
   * @async
   * @param {?ReadParams<typeof eventActionAbi, 'getActionSteps'>} [params]
   * @returns {Promise<ActionStep[]>}
   */
  public async getActionSteps(
    params?: ReadParams<typeof eventActionAbi, 'getActionSteps'>,
  ) {
    const steps = (await readEventActionGetActionSteps(this._config, {
      address: this.assertValidAddress(),
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    })) as ActionStep[];
    return dedupeActionSteps(steps);
  }

  /**
   * Gets the count of action events
   *
   * @public
   * @async
   * @param {?ReadParams<typeof eventActionAbi, 'getActionStepsCount'>} [params]
   * @returns {Promise<bigint>}
   */
  public async getActionStepsCount(
    params?: ReadParams<typeof eventActionAbi, 'getActionStepsCount'>,
  ) {
    const steps = await this.getActionSteps(params);
    return steps.length;
  }

  /**
   * Retrieves the payload describing how claimants can be identified from logs or function calls.
   *
   * @public
   * @async
   * @param {?ReadParams<typeof eventActionAbi, 'getActionClaimant'>} [params]
   * @returns {Promise<ActionClaimant>}
   */
  public async getActionClaimant(
    params?: ReadParams<typeof eventActionAbi, 'getActionClaimant'>,
  ) {
    return readEventActionGetActionClaimant(this._config, {
      address: this.assertValidAddress(),
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    }) as Promise<ActionClaimant>;
  }

  /**
   * Executes a prepared event action
   *
   * @public
   * @async
   * @param {Hex} data
   * @param {?WriteParams<typeof eventActionAbi, 'execute'>} [params]
   * @returns {Promise<readonly [boolean, `0x${string}`]>}
   */
  public async execute(
    data: Hex,
    params?: WriteParams<typeof eventActionAbi, 'execute'>,
  ) {
    return this.awaitResult(this.executeRaw(data, params));
  }

  /**
   * Executes a prepared event action
   *
   * @public
   * @async
   * @param {Hex} data
   * @param {?WriteParams<typeof eventActionAbi, 'execute'>} [params]
   * @returns {unknown}
   */
  public async executeRaw(
    data: Hex,
    params?: WriteParams<typeof eventActionAbi, 'execute'>,
  ) {
    const { request, result } = await simulateEventActionExecute(this._config, {
      address: this.assertValidAddress(),
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
      args: [data],
    });
    const hash = await writeEventActionExecute(this._config, request);
    return { hash, result };
  }

  /**
   * Retrieves action steps, and uses them to validate against, and optionally fetch logs that match the step's signature.
   * If logs are provided in the optional `params` argument, then those logs will be used instead of fetched with the configured client.
   *
   * @public
   * @async
   * @param {?ReadParams<typeof eventActionAbi, 'getActionSteps'> &
   *       GetLogsParams<Abi, ContractEventName<Abi>> & {
   *         knownEvents?: Record<Hex, AbiEvent>;
   *         logs?: Log[];
   *       }} [params]
   * @returns {Promise<boolean>}
   */
  public async validateActionSteps(
    params?: ReadParams<typeof eventActionAbi, 'getActionSteps'> &
      GetLogsParams<Abi, ContractEventName<Abi>> & {
        knownEvents?: Record<Hex, AbiEvent>;
        logs?: Log[];
      },
  ) {
    const actionSteps = await this.getActionSteps(params);
    for (const actionStep of actionSteps) {
      if (!(await this.isActionStepValid(actionStep, params))) {
        return false;
      }
    }
    return true;
  }

  /**
   * Validates a single action step with a given criteria against logs.
   * If logs are provided in the optional `params` argument, then those logs will be used instead of fetched with the configured client.
   *
   * @public
   * @async
   * @param {ActionStep} actionStep
   * @param {?GetLogsParams<Abi, ContractEventName<Abi>> & {
   *       knownEvents?: Record<Hex, AbiEvent>;
   *       logs?: Log[];
   *     }} [params]
   * @returns {Promise<boolean>}
   */
  public async isActionStepValid(
    actionStep: ActionStep,
    params?: GetLogsParams<Abi, ContractEventName<Abi>> & {
      knownEvents?: Record<Hex, AbiEvent>;
      logs?: Log[];
    },
  ) {
    const criteria = actionStep.actionParameter;
    const signature = actionStep.signature;
    let event: AbiEvent;
    // Lookup ABI based on event signature
    if (params?.knownEvents) {
      event = params.knownEvents[signature] as AbiEvent;
    } else {
      event = (events.abi as Record<Hex, AbiEvent>)[signature] as AbiEvent;
    }
    if (!event) {
      throw new Error(`No known ABI for given event signature: ${signature}`);
    }
    const targetContract = actionStep.targetContract;
    // Get all logs matching the event signature from the target contract
    const logs =
      params?.logs ||
      (await getLogs(this._config.getClient({ chainId: params?.chainId }), {
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        ...(params as any),
        address: targetContract,
        event,
      }));
    if (!logs.length) return false;
    for (let log of logs) {
      if (!(await this.validateLogAgainstCriteria(criteria, log))) {
        return false;
      }
    }
    return true;
  }

  /**
   * Validates a {@link Log} against a given criteria.
   *
   * @param {Criteria} criteria - The criteria to validate against.
   * @param {Log} log - The Viem event log.
   * @returns {Promise<boolean>} - Returns true if the log passes the criteria, false otherwise.
   */
  public async validateLogAgainstCriteria(criteria: Criteria, log: Log) {
    const fieldValue = log.topics.at(criteria.fieldIndex);
    if (fieldValue === undefined) {
      throw new FieldValueUndefinedError({ log, criteria, fieldValue });
    }
    // Type narrow based on criteria.filterType
    switch (criteria.filterType) {
      case FilterType.EQUAL:
        if (criteria.fieldType === PrimitiveType.ADDRESS) {
          return isAddressEqual(
            criteria.filterData,
            `0x${fieldValue.slice(-40)}`,
          );
        }
        return fieldValue === criteria.filterData;

      case FilterType.NOT_EQUAL:
        return fieldValue !== criteria.filterData;

      case FilterType.GREATER_THAN:
        if (criteria.fieldType === PrimitiveType.UINT) {
          return BigInt(fieldValue) > BigInt(criteria.filterData);
        }
        throw new InvalidNumericalCriteriaError({ log, criteria, fieldValue });

      case FilterType.LESS_THAN:
        if (criteria.fieldType === PrimitiveType.UINT) {
          return BigInt(fieldValue) < BigInt(criteria.filterData);
        }
        throw new InvalidNumericalCriteriaError({ log, criteria, fieldValue });

      case FilterType.CONTAINS:
        if (
          criteria.fieldType === PrimitiveType.BYTES ||
          criteria.fieldType === PrimitiveType.STRING
        ) {
          return fieldValue.includes(criteria.filterData);
        }
        throw new FieldValueNotComparableError({ log, criteria, fieldValue });

      default:
        throw new UnrecognizedFilterTypeError({ log, criteria, fieldValue });
    }
  }

  /**
   * @inheritdoc
   *
   * @public
   * @param {?EventActionPayload} [_payload]
   * @param {?DeployableOptions} [_options]
   * @returns {GenericDeployableParams}
   */
  public override buildParameters(
    _payload?: EventActionPayload,
    _options?: DeployableOptions,
  ): GenericDeployableParams {
    const [payload, options] = this.validateDeploymentConfig(
      _payload,
      _options,
    );
    let rawPayload: EventActionPayloadRaw;
    if (isEventActionPayloadSimple(payload)) {
      // filter out any falsy potential values
      let tmpSteps = payload.actionSteps.filter((step) => !!step);
      if (tmpSteps.length === 0) {
        throw new NoEventActionStepsProvidedError();
      }
      if (tmpSteps.length > 4) {
        throw new TooManyEventActionStepsProvidedError();
      }
      let steps: ActionStep[] = Array.from({ length: 4 }, (_, i) => {
        // use either the provided step at the given index, or reuse the previous step
        // should aways exist
        return tmpSteps.at(i)! || tmpSteps.slice(0, i).at(-1)!;
      });
      rawPayload = {
        actionClaimant: payload.actionClaimant,
        actionStepOne: steps.at(0)!,
        actionStepTwo: steps.at(1)!,
        actionStepThree: steps.at(2)!,
        actionStepFour: steps.at(3)!,
      };
    } else {
      rawPayload = payload;
    }
    return {
      abi: eventActionAbi,
      bytecode: bytecode as Hex,
      args: [prepareEventActionPayload(rawPayload)],
      ...this.optionallyAttachAccount(options.account),
    };
  }
}
