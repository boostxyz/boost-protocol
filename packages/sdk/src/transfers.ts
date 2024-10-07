import {
  type Address,
  type Hex,
  encodeAbiParameters,
  parseAbiParameters,
  zeroAddress,
} from 'viem';

/**
 * The various types of assets supported in Budgets and Incentives.
 *
 * @export
 * @enum {number}
 */
export enum AssetType {
  ETH,
  ERC20,
  ERC1155,
}

/**
 * Object representation of a generic `Transfer` struct.
 *
 * @export
 * @interface TransferPayload
 * @typedef {TransferPayload}
 */
export interface TransferPayload {
  /**
   * The type of the asset being transferred.
   *
   * @type {AssetType}
   */
  assetType: AssetType;
  /**
   * The address of the asset to transfer, zero address for ETH.
   *
   * @type {Address}
   */
  address: Address;
  /**
   * The account from which to transfer the assets.
   *
   * @type {Address}
   */
  target: Address;
  /**
   * An encoded {@link FungiblePayload}, use {@link prepareFungiblePayload} to construct.
   *
   * @type {Hex}
   */
  data: Hex;
}

/**
 * Encodes parameters for transferring the transfer of Fungible and ERC1155 assets, used for {@link Budget} operations.
 * Typically you'd use {@link prepareFungibleTransfer} or {@link prepareERC1155Transfer}
 *
 * @param {TransferPayload} param0
 * @param {AssetType} param0.assetType - The asset type being transferred.
 * @param {Address} param0.address - The address of the asset, use zero address for ETH transfers.
 * @param {Address} param0.target - The address of the account being transferred from
 * @param {Hex} param0.data - Use {@link prepareFungiblePayload} to properly encode an amount to transfer
 * @returns {Hex}
 */
export const prepareTransferPayload = ({
  assetType,
  address,
  target,
  data,
}: TransferPayload) => {
  return encodeAbiParameters(
    [
      { type: 'uint8', name: 'assetType' },
      { type: 'address', name: 'asset' },
      { type: 'address', name: 'target' },
      { type: 'bytes', name: 'data' },
    ],
    [assetType, address, target, data],
  );
};

/**
 * Object representation of
 *
 * @export
 * @interface ERC1155Payload
 * @typedef {ERC1155Payload}
 */
export interface ERC1155Payload {
  /**
   * The ERC1155 token ID for the incentive
   *
   * @type {bigint}
   */
  tokenId: bigint;
  /**
   * The amount to transfer
   *
   * @type {bigint}
   */
  amount: bigint;
}

/**
 * Given a token ID and amount, properly encode a `ERC1155Incentive.ERC1155Payload` for use with {@link ERC1155Incentive} initialization.
 *
 * @export
 * @param {ERC1155Payload} param0
 * @param {bigint} param0.tokenId - The ERC1155 token ID for the incentive
 * @param {bigint} param0.amount - The amount to transfer
 * @returns {Hex}
 */
export function prepareERC1155Payload({ tokenId, amount }: ERC1155Payload) {
  return encodeAbiParameters(
    parseAbiParameters([
      'ERC1155Payload payload',
      'struct ERC1155Payload { uint256 tokenId; uint256 amount; bytes data; }',
    ]),
    [{ tokenId, amount, data: '0x' }],
  );
}

/**
 * An object representation of the `Budget.Transfer` contract struct for transfers of ERC1155 assets.
 *
 * @export
 * @interface ERC1155TransferPayload
 * @typedef {ERC1155TransferPayload}
 */
export interface ERC1155TransferPayload {
  /**
   * The token ID to transfer
   *
   * @type {bigint}
   */
  tokenId: bigint;
  /**
   * The amount to transfer
   *
   * @type {bigint}
   */
  amount: bigint;
  /**
   * The address of the asset to target
   *
   * @type {Address}
   */
  asset: Address;
  /**
   * The account to transfer from
   *
   * @type {Address}
   */
  target: Address;
}

/**
 * Encodes parameters for transferring the transfer of ERC1155 assets, used for {@link Budget} operations.
 * The caller must have already approved the contract to transfer the asset.
 *
 * @export
 * @param {ERC1155TransferPayload} param0
 * @param {bigint} param0.tokenId - The token ID to transfer
 * @param {bigint} param0.amount - The amount to transfer
 * @param {Address} param0.asset - The address of the asset to target
 * @param {Address} param0.target - The account to transfer from
 * @returns {Hex}
 */
export function prepareERC1155Transfer({
  tokenId,
  amount,
  asset,
  target,
}: ERC1155TransferPayload) {
  return encodeAbiParameters(
    parseAbiParameters([
      'Transfer request',
      'struct Transfer { uint8 assetType; address asset; address target; bytes data; }',
    ]),
    [
      {
        assetType: AssetType.ERC1155,
        asset,
        data: prepareERC1155Payload({ tokenId, amount }),
        target,
      },
    ],
  );
}

/**
 * An object representation of the `FungiblePayload` struct
 *
 * @export
 * @interface FungiblePayload
 * @typedef {FungiblePayload}
 */
export interface FungiblePayload {
  /**
   * The amount being transferred
   *
   * @type {bigint}
   */
  amount: bigint;
}

/**
 * Encodes an amount for the `FungiblePayload` struct
 *
 * @export
 * @param {FungiblePayload} param0
 * @param {bigint} param0.amount - The amount being transferred
 * @returns {Hex}
 */
export function prepareFungiblePayload({ amount }: FungiblePayload) {
  return encodeAbiParameters(
    parseAbiParameters([
      'FungiblePayload payload',
      'struct FungiblePayload { uint256 amount; }',
    ]),
    [{ amount }],
  );
}

/**
 * An object representation of the `Budget.Transfer` contract struct for transfers of fungible assets.
 *
 * @export
 * @interface FungibleTransferPayload
 * @typedef {FungibleTransferPayload}
 */
export interface FungibleTransferPayload {
  /**
   * The amount to transfer
   *
   * @type {bigint}
   */
  amount: bigint;
  /**
   * The address of the asset. Use zero address for ETH transfers.
   *
   * @type {Address}
   */
  asset: Address;
  /**
   * The account to transfer from
   *
   * @type {Address}
   */
  target: Address;
}

/**
 * Encodes parameters for a Fungible transfer, used for Budget allocations.
 * The caller must have already approved the contract to transfer the asset.
 *
 * @export
 * @param {FungibleTransferPayload} param0
 * @param {bigint} param0.amount - The amount to transfer
 * @param {Address} param0.asset - The address of the asset. Use zero address for ETH transfers.
 * @param {Address} param0.target - The account to transfer from
 * @returns {Hex}
 */
export function prepareFungibleTransfer({
  amount,
  asset,
  target,
}: FungibleTransferPayload) {
  return encodeAbiParameters(
    parseAbiParameters([
      'Transfer request',
      'struct Transfer { uint8 assetType; address asset; address target; bytes data; }',
    ]),
    [
      {
        assetType: asset == zeroAddress ? AssetType.ETH : AssetType.ERC20,
        asset,
        data: prepareFungiblePayload({ amount }),
        target,
      },
    ],
  );
}
