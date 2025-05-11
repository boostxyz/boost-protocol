import {
  erc20PeggedVariableCriteriaIncentiveV2Abi,
  readErc20PeggedVariableCriteriaIncentiveV2Asset,
  readErc20PeggedVariableCriteriaIncentiveV2Claimed,
  readErc20PeggedVariableCriteriaIncentiveV2Claims,
  readErc20PeggedVariableCriteriaIncentiveV2CurrentReward,
  readErc20PeggedVariableCriteriaIncentiveV2GetIncentiveCriteria,
  readErc20PeggedVariableCriteriaIncentiveV2GetMaxReward,
  readErc20PeggedVariableCriteriaIncentiveV2GetPeg,
  readErc20PeggedVariableCriteriaIncentiveV2IsClaimable,
  readErc20PeggedVariableCriteriaIncentiveV2Limit,
  readErc20PeggedVariableCriteriaIncentiveV2Owner,
  readErc20PeggedVariableCriteriaIncentiveV2Peg,
  readErc20PeggedVariableCriteriaIncentiveV2Reward,
  readErc20PeggedVariableCriteriaIncentiveV2TotalClaimed,
  simulateErc20PeggedVariableCriteriaIncentiveV2Claim,
  simulateErc20PeggedVariableCriteriaIncentiveV2Clawback,
  writeErc20PeggedVariableCriteriaIncentiveV2Claim,
  writeErc20PeggedVariableCriteriaIncentiveV2Clawback,
} from '@boostxyz/evm';
import { bytecode } from '@boostxyz/evm/artifacts/contracts/incentives/ERC20PeggedVariableCriteriaIncentiveV2.sol/ERC20PeggedVariableCriteriaIncentiveV2.json';
import { getTransaction, getTransactionReceipt } from '@wagmi/core';
import type { AbiEvent } from 'abitype';
import {
  type AbiFunction,
  type Address,
  type ContractEventName,
  type Hex,
  decodeAbiParameters,
  decodeFunctionData,
  encodeAbiParameters,
  pad,
  parseEther,
  parseEventLogs,
  zeroAddress,
  zeroHash,
} from 'viem';
import { ERC20PeggedVariableCriteriaIncentiveV2 as ERC20PeggedVariableCriteriaIncentiveV2Bases } from '../../dist/deployments.json';
import {
  SignatureType,
  getScalarValueFromTuple,
  isCriteriaFieldIndexTuple,
} from '../Actions/EventAction';
import type {
  DeployableOptions,
  GenericDeployableParams,
} from '../Deployable/Deployable';
import { DeployableTarget } from '../Deployable/DeployableTarget';
import { type ClaimPayload, prepareClaimPayload } from '../claiming';
import {
  DecodedArgsError,
  IncentiveCriteriaNotFoundError,
  InvalidCriteriaTypeError,
  NoMatchingLogsError,
} from '../errors';
import {
  CheatCodes,
  type GenericLog,
  type ReadParams,
  RegistryType,
  type WriteParams,
} from '../utils';
import type {
  GetIncentiveScalarV2Params,
  IncentiveCriteriaV2,
} from './ERC20VariableCriteriaIncentiveV2';

export { erc20PeggedVariableCriteriaIncentiveV2Abi };

/**
 * The object representation of a `Erc20PeggedVariableCriteriaIncentiveV2.InitPayload`
 *
 * @export
 * @interface Erc20PeggedVariableCriteriaIncentiveV2
 * @typedef {Erc20PeggedVariableCriteriaIncentiveV2}
 */
export interface ERC20PeggedVariableCriteriaIncentiveV2Payload {
  /**
   * The address of the incentivized asset.
   *
   * @type {Address}
   */
  asset: Address;
  /**
   * The peg to normalize to.
   *
   * @type {Address}
   */
  peg: Address;
  /**
   * The amount of the asset to distribute.
   *
   * @type {bigint}
   */
  reward: bigint;
  /**
   * Total spend for the incentive.
   *
   * @type {bigint}
   */
  limit: bigint;
  /**
   * Maximum reward each claim is elligible for.
   *
   * @type {bigint}
   */
  maxReward: bigint;
  /**
   * (Optional) The address of the entity that can managed the incentive.
   *
   * @type {Address}
   * @optional
   */
  manager?: Address;
  /**
   * The criteria for the incentive that determines how the reward is distributed.
   *
   * @type {IncentiveCriteria}
   */
  criteria: IncentiveCriteriaV2;
}

/**
 * A generic `viem.Log` event with support for `Erc20PeggedVariableCriteriaIncentiveV2` event types.
 *
 * @export
 * @typedef {Erc20PeggedVariableCriteriaIncentiveV2Log}
 * @template {ContractEventName<typeof erc20PeggedVariableCriteriaIncentiveV2Abi>} [event=ContractEventName<
 *     typeof erc20PeggedVariableCriteriaIncentiveV2Abi
 *   >]
 */
export type Erc20PeggedVariableCriteriaIncentiveV2Log<
  event extends ContractEventName<
    typeof erc20PeggedVariableCriteriaIncentiveV2Abi
  > = ContractEventName<typeof erc20PeggedVariableCriteriaIncentiveV2Abi>,
> = GenericLog<typeof erc20PeggedVariableCriteriaIncentiveV2Abi, event>;

/**
 * A simple ERC20 incentive implementation that allows claiming of tokens
 *
 * @export
 * @class Erc20PeggedVariableCriteriaIncentive
 * @typedef {ERC20PeggedVariableCriteriaIncentiveV2}
 * @extends {DeployableTarget<ERC20PeggedVariableCriteriaIncentiveV2>}
 */
export class ERC20PeggedVariableCriteriaIncentiveV2 extends DeployableTarget<
  ERC20PeggedVariableCriteriaIncentiveV2Payload,
  typeof erc20PeggedVariableCriteriaIncentiveV2Abi
> {
  public override readonly abi = erc20PeggedVariableCriteriaIncentiveV2Abi;
  /**
   * @inheritdoc
   *
   * @public
   * @static
   * @type {Record<number, Address>}
   */
  public static override bases: Record<number, Address> = {
    31337: import.meta.env
      .VITE_ERC20_PEGGED_VARIABLE_CRITERIA_INCENTIVE_V2_BASE,
    ...(ERC20PeggedVariableCriteriaIncentiveV2Bases as Record<number, Address>),
  };
  /**
   * @inheritdoc
   *
   * @public
   * @static
   * @type {RegistryType}
   */
  public static override registryType: RegistryType = RegistryType.INCENTIVE;

  /**
   * The owner of the incentive
   *
   * @public
   * @async
   * @param {?ReadParams} [params]
   * @returns {Promise<Address>}
   */
  public async owner(params?: ReadParams) {
    return await readErc20PeggedVariableCriteriaIncentiveV2Owner(this._config, {
      address: this.assertValidAddress(),
      args: [],
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  /**
   * Calculates the current reward based on the time since the last claim. The reward is calculated based on the time since the last claim, the available budget, and the reward parameters. It increases linearly over time in the absence of claims, with each hour adding `rewardBoost` to the current reward, up to the available budget. For example, if there is one claim in the first hour, then no claims for three hours, the claimable reward would be `initialReward - rewardDecay + (rewardBoost * 3)`
   *
   * @public
   * @async
   * @param {?ReadParams} [params]
   * @returns {Promise<bigint>} - The current reward
   */
  public async currentReward(params?: ReadParams) {
    return await readErc20PeggedVariableCriteriaIncentiveV2CurrentReward(
      this._config,
      {
        address: this.assertValidAddress(),
        args: [],
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      },
    );
  }

  /**
   * Retrieves the maximum reward amount per claim.
   *
   * @public
   * @async
   * @param {?ReadParams} [params]
   * @returns {Promise<bigint>} The maximum reward amount per claim
   */
  public async getMaxReward(params?: ReadParams): Promise<bigint> {
    const maxReward =
      await readErc20PeggedVariableCriteriaIncentiveV2GetMaxReward(
        this._config,
        {
          ...params,
          address: this.assertValidAddress(),
        },
      );

    return maxReward;
  }

  /**
   * Fetches the incentive scalar from a transaction hash
   *
   * @param {GetIncentiveScalarParams} params
   * @param {?ReadParams} [params]
   * @returns {Promise<bigint>}
   * @throws {InvalidCriteriaTypeError | NoMatchingLogsError | DecodedArgsError}
   */
  public async getIncentiveScalar(
    { chainId, hash, knownSignatures }: GetIncentiveScalarV2Params,
    params?: ReadParams,
  ): Promise<bigint> {
    const criteria = await this.getIncentiveCriteria(params);
    if (criteria.criteriaType === SignatureType.EVENT) {
      const transactionReceipt = await getTransactionReceipt(this._config, {
        chainId,
        hash,
      });
      if (criteria.fieldIndex === CheatCodes.GAS_REBATE_INCENTIVE) {
        const totalCost =
          transactionReceipt.gasUsed * transactionReceipt.effectiveGasPrice + // Normal gas cost
          (transactionReceipt.blobGasUsed ?? 0n) *
            (transactionReceipt.blobGasPrice ?? 0n); // Blob gas cost - account for potential undefined values
        return totalCost;
      }
      const logs = transactionReceipt.logs;

      if (logs.length === 0) {
        throw new NoMatchingLogsError(
          `No logs found for event signature ${criteria.signature}`,
        );
      }

      // Decode the event log
      try {
        const eventAbi = knownSignatures[criteria.signature] as AbiEvent;
        const decodedEvents = parseEventLogs({
          abi: [eventAbi],
          logs,
        });
        if (decodedEvents == undefined || decodedEvents.length === 0) {
          throw new NoMatchingLogsError(
            `No logs found for event signature ${criteria.signature}`,
          );
        }

        if (isCriteriaFieldIndexTuple(criteria.fieldIndex)) {
          return getScalarValueFromTuple(
            decodedEvents[0]?.args as unknown[],
            criteria.fieldIndex,
          );
        }

        const scalarValue =
          decodedEvents[0] && decodedEvents[0].args
            ? (decodedEvents[0].args as string[])[criteria.fieldIndex]
            : undefined;
        if (scalarValue === undefined) {
          throw new DecodedArgsError(
            `Decoded argument at index ${criteria.fieldIndex} is undefined`,
          );
        }
        return BigInt(scalarValue);
      } catch (e) {
        throw new DecodedArgsError(
          `Failed to decode event log for signature ${criteria.signature}: ${(e as Error).message}`,
        );
      }
    } else if (criteria.criteriaType === SignatureType.FUNC) {
      // Fetch the transaction data
      const transaction = await getTransaction(this._config, {
        chainId,
        hash,
      });
      try {
        // Decode function data
        const func = knownSignatures[criteria.signature] as AbiFunction;
        const decodedFunction = decodeFunctionData({
          abi: [func],
          data: transaction.input,
        });

        if (isCriteriaFieldIndexTuple(criteria.fieldIndex)) {
          return getScalarValueFromTuple(
            decodedFunction.args as unknown[],
            criteria.fieldIndex,
          );
        }

        const scalarValue = decodedFunction.args[criteria.fieldIndex] as string;
        if (scalarValue === undefined || scalarValue === null) {
          throw new DecodedArgsError(
            `Decoded argument at index ${criteria.fieldIndex} is undefined`,
          );
        }
        return BigInt(scalarValue);
      } catch (e) {
        throw new DecodedArgsError(
          `Failed to decode function data for signature ${criteria.signature}: ${(e as Error).message}`,
        );
      }
    } else {
      throw new InvalidCriteriaTypeError(
        `Invalid criteria type ${criteria.criteriaType}`,
      );
    }
  }

  /**
   * The number of claims that have been made
   *
   * @public
   * @async
   * @param {?ReadParams} [params]
   * @returns {Promise<bigint>}
   */
  public async claims(params?: ReadParams) {
    return await readErc20PeggedVariableCriteriaIncentiveV2Claims(
      this._config,
      {
        address: this.assertValidAddress(),
        args: [],
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      },
    );
  }

  /**
   * The total amount of rewards claimed
   *
   * @public
   * @async
   * @param {?ReadParams} [params]
   * @returns {Promise<bigint>}
   */
  public async totalClaimed(params?: ReadParams) {
    return await readErc20PeggedVariableCriteriaIncentiveV2TotalClaimed(
      this._config,
      {
        address: this.assertValidAddress(),
        args: [],
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      },
    );
  }

  /**
   * A mapping of address to claim status
   *
   * @public
   * @async
   * @param {Address} address
   * @param {?ReadParams} [params]
   * @returns {Promise<boolean>}
   */
  public async claimed(address: Address, params?: ReadParams) {
    return await readErc20PeggedVariableCriteriaIncentiveV2Claimed(
      this._config,
      {
        address: this.assertValidAddress(),
        args: [address],
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      },
    );
  }

  /**
   * The address of the ERC20-like token
   *
   * @public
   * @async
   * @param {?ReadParams} [params]
   * @returns {Promise<Address>}
   */
  public async asset(params?: ReadParams) {
    return await readErc20PeggedVariableCriteriaIncentiveV2Asset(this._config, {
      address: this.assertValidAddress(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  /**
   * The address of the pegged ERC20-like token
   *
   * @public
   * @async
   * @param {?ReadParams} [params]
   * @returns {Promise<Address>}
   */
  public async peg(params?: ReadParams) {
    return await readErc20PeggedVariableCriteriaIncentiveV2Peg(this._config, {
      address: this.assertValidAddress(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  /**
   * The reward amount issued for each claim
   *
   * @public
   * @async
   * @param {?ReadParams} [params]
   * @returns {Promise<bigint>}
   */
  public async reward(params?: ReadParams) {
    return await readErc20PeggedVariableCriteriaIncentiveV2Reward(
      this._config,
      {
        address: this.assertValidAddress(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      },
    );
  }

  /**
   * The limit (max possible rewards payout in reward token)
   *
   * @public
   * @async
   * @param {?ReadParams} [params]
   * @returns {Promise<bigint>}
   */
  public async limit(params?: ReadParams) {
    return await readErc20PeggedVariableCriteriaIncentiveV2Limit(this._config, {
      address: this.assertValidAddress(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  /**
   * Claim the incentive
   *
   * @public
   * @async
   * @param {ClaimPayload} payload
   * @param {?WriteParams} [params]
   * @returns {Promise<boolean>} - Returns true if successfully claimed
   */
  protected async claim(payload: ClaimPayload, params?: WriteParams) {
    return await this.awaitResult(this.claimRaw(payload, params));
  }

  /**
   * Claim the incentive
   *
   * @public
   * @async
   * @param {ClaimPayload} payload
   * @param {?WriteParams} [params]
   * @returns {Promise<{ hash: `0x${string}`; result: boolean; }>} - Returns true if successfully claimed
   */
  protected async claimRaw(payload: ClaimPayload, params?: WriteParams) {
    const { request, result } =
      await simulateErc20PeggedVariableCriteriaIncentiveV2Claim(this._config, {
        address: this.assertValidAddress(),
        args: [prepareClaimPayload(payload)],
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      });
    const hash = await writeErc20PeggedVariableCriteriaIncentiveV2Claim(
      this._config,
      request,
    );
    return { hash, result };
  }

  /**
   * Clawback assets from the incentive
   *
   * @public
   * @async
   * @param {ClaimPayload} payload
   * @param {?WriteParams} [params]
   * @returns {Promise<boolean>} -  True if the assets were successfully clawbacked
   */
  public async clawback(payload: ClaimPayload, params?: WriteParams) {
    return await this.awaitResult(this.clawbackRaw(payload, params));
  }

  /**
   * Clawback assets from the incentive
   *
   * @public
   * @async
   * @param {ClaimPayload} payload
   * @param {?WriteParams} [params]
   * @returns {Promise<{ hash: `0x${string}`; result: boolean; }>} -  True if the assets were successfully clawbacked
   */
  public async clawbackRaw(payload: ClaimPayload, params?: WriteParams) {
    const { request, result } =
      await simulateErc20PeggedVariableCriteriaIncentiveV2Clawback(
        this._config,
        {
          address: this.assertValidAddress(),
          args: [prepareClaimPayload(payload)],
          ...this.optionallyAttachAccount(),
          // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
          ...(params as any),
        },
      );
    const hash = await writeErc20PeggedVariableCriteriaIncentiveV2Clawback(
      this._config,
      request,
    );
    return { hash, result };
  }

  /**
   * Check if an incentive is claimable.
   *
   * @public
   * @async
   * @param {ClaimPayload} payload
   * @param {?ReadParams} [params]
   * @returns {Promise<boolean>} = True if the incentive is claimable based on the data payload
   */
  public async isClaimable(payload: ClaimPayload, params?: ReadParams) {
    return await readErc20PeggedVariableCriteriaIncentiveV2IsClaimable(
      this._config,
      {
        address: this.assertValidAddress(),
        args: [payload.target, payload.data],
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      },
    );
  }

  /**
   * read the peg token for the incentive.
   *
   * @public
   * @async
   * @param {?ReadParams} [params]
   * @returns {Promise<Address>} = The address of the token the reward is pegged to
   */
  public async getPeg(params?: ReadParams) {
    return await readErc20PeggedVariableCriteriaIncentiveV2GetPeg(
      this._config,
      {
        address: this.assertValidAddress(),
        args: [],
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      },
    );
  }

  /**
   * Get the maximum amount that can be claimed by this incentive. Useful when used in conjunction with `BoostCore.calculateProtocolFee`
   *
   * @public
   * @async
   * @param {?ReadParams} [params]
   * @returns {Promise<bigint>} = Return a bigint representing that maximum amount that can be distributed by this incentive.
   */
  public async getTotalBudget(params?: ReadParams) {
    return await this.limit(params);
  }

  /**
   * Check if any claims remain by comparing the incentive's total claims against its limit. Does not take requesting user's elligibility into account.
   *
   * @public
   * @async
   * @param {?ReadParams} [params]
   * @returns {Promise<boolean>} - True if total claims is less than limit
   */
  public async canBeClaimed(params?: ReadParams) {
    return (await this.getRemainingClaimPotential(params)) > 0n;
  }

  /**
   * Check how many claims remain by comparing the incentive's total claims against its limit. Does not take requesting user's elligibility into account.
   *
   * @public
   * @async
   * @param {?ReadParams} [params]
   * @returns {Promise<bigint>} - True if total claims is less than limit
   */
  public async getRemainingClaimPotential(params?: ReadParams) {
    const [totalClaimed, limit] = await Promise.all([
      this.totalClaimed(params),
      this.limit(params),
    ]);
    return limit - totalClaimed;
  }

  /**
   *Functions from the ERC20VariableIncentive contract
   */

  /**
   * Fetches the IncentiveCriteria struct from the contract
   *
   * @param {?ReadParams} [params]
   * @returns {Promise<IncentiveCriteria>} Incentive criteria structure
   * @throws {IncentiveCriteriaNotFoundError}
   */
  public async getIncentiveCriteria(
    params?: ReadParams,
  ): Promise<IncentiveCriteriaV2> {
    try {
      const criteria =
        await readErc20PeggedVariableCriteriaIncentiveV2GetIncentiveCriteria(
          this._config,
          {
            ...params,
            address: this.assertValidAddress(),
          },
        );

      return criteria;
    } catch (e) {
      throw new IncentiveCriteriaNotFoundError(e as Error);
    }
  }

  /**
   * Generates a top-up payload for the ERC20PeggedIncentive contract by incrementing
   * the existing `limit` field by `netAmount`. The entire payload is then re-encoded
   * via `prepareERC20PeggedIncentivePayload(...)`.
   *
   * @public
   * @param {bigint} netAmount - The additional limit to add to this incentive.
   * @returns {Hex} The ABI-encoded payload with the updated `limit`.
   */
  public async getTopupPayload(netAmount: bigint): Promise<Hex> {
    return prepareERC20PeggedVariableCriteriaIncentiveV2Payload({
      asset: (await this.asset()) ?? zeroAddress,
      peg: this.payload?.peg ?? zeroAddress,
      reward: this.payload?.reward ?? 0n,
      limit: netAmount,
      maxReward: this.payload?.maxReward ?? 0n,
      manager: this.payload?.manager ?? zeroAddress,
      criteria: this.payload?.criteria ?? {
        criteriaType: 0,
        signature: zeroHash,
        fieldIndex: 0,
        targetContract: zeroAddress,
        valueType: 0,
      },
    });
  }

  /**
   * @inheritdoc
   *
   * @public
   * @param {?ERC20PeggedVariableCriteriaIncentiveV2Payload} [_payload]
   * @param {?DeployableOptions} [_options]
   * @returns {GenericDeployableParams}
   */
  public override buildParameters(
    _payload?: ERC20PeggedVariableCriteriaIncentiveV2Payload,
    _options?: DeployableOptions,
  ): GenericDeployableParams {
    const [payload, options] = this.validateDeploymentConfig(
      _payload,
      _options,
    );
    return {
      abi: erc20PeggedVariableCriteriaIncentiveV2Abi,
      bytecode: bytecode as Hex,
      args: [prepareERC20PeggedVariableCriteriaIncentiveV2Payload(payload)],
      ...this.optionallyAttachAccount(options.account),
    };
  }

  /**
   * Encodes an amount to clawback from the incentive
   *
   * @public
   * @param {bigint} amount - How much of the asset to clawback
   * @returns {Hex} - Returns an encoded uint256
   */
  public buildClawbackData(amount: bigint) {
    return encodeAbiParameters([{ type: 'uint256' }], [amount]);
  }

  /**
   * Builds the claim data for the ERC20PeggedVariableCriteriaIncentivePayload.
   *
   * @public
   * @param {bigint} signedAmount
   * @returns {Hash} Returns the encoded claim data
   * @description This function returns the encoded claim data for the ERC20PeggedVariableCriteriaIncentiveV2Payload.
   */
  public buildClaimData(signedAmount: bigint) {
    return encodeAbiParameters(
      [{ type: 'uint256', name: 'signedAmount' }],
      [signedAmount],
    );
  }

  /**
   * Decodes claim data for the ERC20PeggedVariableCriteriaIncentiveV2, returning the claim amount.
   * Useful when deriving amount claimed from logs.
   *
   * @public
   * @param {Hex} claimData
   * @returns {Promise<bigint>} Returns the reward amount from a claim data payload
   */
  public async decodeClaimData(claimData: Hex) {
    const boostClaimData = decodeAbiParameters(
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
      claimData,
    );
    const signedAmount = decodeAbiParameters(
      [{ type: 'uint256' }],
      boostClaimData[0].incentiveData,
    )[0];
    let claimAmount = signedAmount;
    const [reward, maxReward] = await Promise.all([
      this.reward(),
      this.getMaxReward(),
    ]);

    if (reward === 0n) {
      return claimAmount;
    } else {
      claimAmount = (reward * signedAmount) / parseEther('1');
    }

    if (maxReward !== 0n && claimAmount > maxReward) {
      claimAmount = maxReward;
    }

    return claimAmount;
  }

  /**
   * Decodes claim data for the ERC20PeggedVariableCriteriaIncentiveV2, returning the claim amount.
   * Useful when deriving amount claimed from logs.
   * Use this function instead of `decodeClaimData` if you have reward details.
   *
   * @public
   * @param {Hex} claimData
   * @param {bigint} [reward]
   * @param {bigint} [maxReward]
   * @returns {BigInt} Returns the reward amount from a claim data payload
   */
  public decodeClaimDataWithRewardDetails(
    claimData: Hex,
    reward: bigint,
    maxReward: bigint,
  ) {
    const boostClaimData = decodeAbiParameters(
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
      claimData,
    );
    const signedAmount = decodeAbiParameters(
      [{ type: 'uint256' }],
      boostClaimData[0].incentiveData,
    )[0];
    let claimAmount = signedAmount;

    if (reward === 0n) {
      return claimAmount;
    } else {
      claimAmount = (reward * signedAmount) / parseEther('1');
    }

    if (maxReward !== 0n && claimAmount > maxReward) {
      claimAmount = maxReward;
    }

    return claimAmount;
  }
}

/**
 * Given a {@link ERC20PeggedVariableCriteriaIncentiveV2Payload}, properly encode a `ERC20PeggedVariableCriteriaIncentiveV2Payload.InitPayload` for use with {@link ERC20PeggedVariableCriteriaIncentiveV2Payload} initialization.
 *
 * @param {ERC20PeggedVariableCriteriaIncentiveV2Payload} param0
 * @param {Address} param0.asset - The address of the incentivized asset.
 * @param {Address} param0.peg - The peg to normalize to.
 * @param {bigint} param0.reward - The amount of the asset to distribute.
 * @param {bigint} param0.limit - How many times can this incentive be claimed.
 * @param {Address} [param0.manager=zeroAddress] - The entity that can manage the incentive.
 * @param {IncentiveCriteria} param0.criteria - The incentive criteria for reward distribution.
 * @returns {Hex}
 */
export function prepareERC20PeggedVariableCriteriaIncentiveV2Payload({
  asset,
  peg,
  reward,
  limit,
  maxReward = 0n,
  manager = zeroAddress,
  criteria,
}: ERC20PeggedVariableCriteriaIncentiveV2Payload) {
  return encodeAbiParameters(
    [
      {
        type: 'tuple',
        name: 'initPayloadExtended',
        components: [
          { type: 'address', name: 'asset' },
          { type: 'address', name: 'peg' },
          { type: 'uint256', name: 'reward' },
          { type: 'uint256', name: 'limit' },
          { type: 'address', name: 'manager' },
          { type: 'uint256', name: 'maxReward' },
          {
            type: 'tuple',
            name: 'criteria',
            components: [
              { type: 'uint8', name: 'criteriaType' },
              { type: 'bytes32', name: 'signature' },
              { type: 'uint8', name: 'fieldIndex' },
              { type: 'address', name: 'targetContract' },
              { type: 'uint8', name: 'valueType' },
            ],
          },
        ],
      },
    ],
    [
      {
        asset,
        peg,
        reward,
        limit,
        manager,
        maxReward,
        criteria: {
          criteriaType: criteria.criteriaType,
          signature: pad(criteria.signature),
          fieldIndex: criteria.fieldIndex,
          targetContract: criteria.targetContract,
          valueType: criteria.valueType,
        },
      },
    ],
  );
}
