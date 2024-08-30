import {
  eventActionAbi,
  readEventActionGetActionEvent,
  readEventActionGetActionEvents,
  readEventActionGetActionEventsCount,
  simulateEventActionExecute,
  writeEventActionExecute,
} from '@boostxyz/evm';
import { bytecode } from '@boostxyz/evm/artifacts/contracts/actions/EventAction.sol/EventAction.json';
import events from '@boostxyz/signatures/events';
import type {
  Abi,
  AbiEvent,
  AbiItem,
  Address,
  ContractEventName,
  Hex,
  Log,
} from 'viem';
import { getLogs } from 'viem/actions';
import type {
  DeployableOptions,
  GenericDeployableParams,
} from '../Deployable/Deployable';
import { DeployableTarget } from '../Deployable/DeployableTarget';
import {
  type ActionEvent,
  type Criteria,
  type EventActionPayload,
  FilterType,
  type GetLogsParams,
  PrimitiveType,
  type ReadParams,
  RegistryType,
  type WriteParams,
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
   * @param {?ReadParams<typeof eventActionAbi, 'getActionEvent'>} [params]
   * @returns {Promise<ActionEvent>}
   */
  public async getActionEvent(
    index: number,
    params?: ReadParams<typeof eventActionAbi, 'getActionEvent'>,
  ) {
    return readEventActionGetActionEvent(this._config, {
      address: this.assertValidAddress(),
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
      args: [index],
    });
  }

  /**
   * Gets all action events
   *
   * @public
   * @async
   * @param {?ReadParams<typeof eventActionAbi, 'getActionEvents'>} [params]
   * @returns {Promise<ActionEvent[]>}
   */
  public async getActionEvents(
    params?: ReadParams<typeof eventActionAbi, 'getActionEvents'>,
  ) {
    return readEventActionGetActionEvents(this._config, {
      address: this.assertValidAddress(),
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  /**
   * Gets the count of action events
   *
   * @public
   * @async
   * @param {?ReadParams<typeof eventActionAbi, 'getActionEventsCount'>} [params]
   * @returns {Promise<bigint>}
   */
  public async getActionEventsCount(
    params?: ReadParams<typeof eventActionAbi, 'getActionEventsCount'>,
  ) {
    return readEventActionGetActionEventsCount(this._config, {
      address: this.assertValidAddress(),
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
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

  /** Validates all action events
   * @public
   * @async
   * @returns {Promise<boolean>}
   * @param {?ReadParams<typeof eventActionAbi, 'getActionEvents'>} [params]
   */
  public async validateActionEvents(
    params?: ReadParams<typeof eventActionAbi, 'getActionEvents'> &
      GetLogsParams<Abi, ContractEventName<Abi>> & {
        knownEvents?: Record<Hex, AbiEvent>;
      },
  ) {
    const actionEvents = await this.getActionEvents(params);
    for (const actionEvent of actionEvents) {
      if (!this.isActionEventValid(actionEvent, params)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Validates a single action event
   * @public
   * @async
   * @param {ActionEvent} actionEvent
   * @returns {boolean}
   */
  public async isActionEventValid(
    actionEvent: ActionEvent,
    params?: GetLogsParams<Abi, ContractEventName<Abi>> & {
      knownEvents?: Record<Hex, AbiEvent>;
    },
  ) {
    const criteria = actionEvent.actionParameter;
    const eventSignature = actionEvent.eventSignature;
    let event: AbiEvent;
    // Lookup ABI based on event signature
    if (params?.knownEvents) {
      event = params.knownEvents[eventSignature] as AbiEvent;
    } else {
      event = (events.abi as Record<Hex, AbiEvent>)[eventSignature] as AbiEvent;
    }
    if (!event) {
      throw new Error(
        `No known ABI for given event signature: ${eventSignature}`,
      );
    }
    const targetContract = actionEvent.targetContract;
    // Get all logs matching the event signature from the target contract
    const logs = await getLogs(
      this._config.getClient({ chainId: params?.chainId }),
      {
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        ...(params as any),
        address: targetContract,
        event,
      },
    );
    for (let log of logs) {
      if (!this.validateLogAgainstCriteria(criteria, log)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Validates a Viem event log against a given criteria.
   *
   * @param {Criteria} criteria - The criteria to validate against.
   * @param {any[]} log - The Viem event log array.
   * @returns {boolean} - Returns true if the log passes the criteria, false otherwise.
   */
  public async validateLogAgainstCriteria(criteria: Criteria, log: Log) {
    const fieldValue = log.topics[criteria.fieldIndex];
    if (fieldValue === undefined) {
      throw new Error('Field value is undefined');
    }
    // Type narrow based on criteria.filterType
    switch (criteria.filterType) {
      case FilterType.EQUAL:
        return fieldValue === criteria.filterData;

      case FilterType.NOT_EQUAL:
        return fieldValue !== criteria.filterData;

      case FilterType.GREATER_THAN:
        if (criteria.fieldType === PrimitiveType.UINT) {
          return BigInt(fieldValue) > BigInt(criteria.filterData);
        }
        throw new Error(
          'GREATER_THAN filter can only be used with UINT fieldType',
        );

      case FilterType.LESS_THAN:
        if (criteria.fieldType === PrimitiveType.UINT) {
          return BigInt(fieldValue) < BigInt(criteria.filterData);
        }
        throw new Error(
          'LESS_THAN filter can only be used with UINT fieldType',
        );

      case FilterType.CONTAINS:
        if (
          criteria.fieldType === PrimitiveType.BYTES ||
          criteria.fieldType === PrimitiveType.STRING
        ) {
          return fieldValue.includes(criteria.filterData);
        }
        throw new Error(
          'CONTAINS filter can only be used with BYTES or STRING fieldType',
        );

      default:
        throw new Error('Invalid FilterType provided');
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
    return {
      abi: eventActionAbi,
      bytecode: bytecode as Hex,
      args: [prepareEventActionPayload(payload)],
      ...this.optionallyAttachAccount(options.account),
    };
  }
}
