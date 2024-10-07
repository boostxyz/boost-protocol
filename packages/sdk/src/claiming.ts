import { type Address, type Hex, encodeAbiParameters, zeroHash } from 'viem';

/**
 * Enum representing incentive disbursement strategies.
 *
 * @export
 * @enum {number}
 */
export enum StrategyType {
  POOL = 0,
  MINT = 1,
  RAFFLE = 2,
}

/**
 * The object representation of an `Incentive.ClaimPayload`
 *
 * @export
 * @interface ClaimPayload
 * @typedef {ClaimPayload}
 */
export interface ClaimPayload {
  /**
   * The address of the recipient
   *
   * @type {Address}
   */
  target: Address;
  /**
   * The implementation-specific data for the claim, if needed
   *
   * @type {?Hex}
   */
  data?: Hex;
}

/**
 * Given a valid {@link ClaimPayload}, encode the payload for use with Incentive operations.
 *
 * @param {ClaimPayload} param0
 * @param {Address} param0.target - The address of the recipient
 * @param {Hex} [param0.data=zeroHash] - The implementation-specific data for the claim, if needed
 * @returns {Hex}
 */
export const prepareClaimPayload = ({
  target,
  data = zeroHash,
}: ClaimPayload) => {
  return encodeAbiParameters(
    [
      { type: 'address', name: 'target' },
      { type: 'bytes', name: 'data' },
    ],
    [target, data],
  );
};
