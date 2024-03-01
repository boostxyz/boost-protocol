# IERC1155
**Inherits:**
[IERC165](/lib/forge-std/src/interfaces/IERC165.sol/interface.IERC165.md)

*See https://eips.ethereum.org/EIPS/eip-1155
Note: The ERC-165 identifier for this interface is 0xd9b67a26.*


## Functions
### safeTransferFrom

Transfers `_value` amount of an `_id` from the `_from` address to the `_to` address specified (with safety call).

*Caller must be approved to manage the tokens being transferred out of the `_from` account (see "Approval" section of the standard).
- MUST revert if `_to` is the zero address.
- MUST revert if balance of holder for token `_id` is lower than the `_value` sent.
- MUST revert on any other error.
- MUST emit the `TransferSingle` event to reflect the balance change (see "Safe Transfer Rules" section of the standard).
- After the above conditions are met, this function MUST check if `_to` is a smart contract (e.g. code size > 0). If so, it MUST call `onERC1155Received` on `_to` and act appropriately (see "Safe Transfer Rules" section of the standard).*


```solidity
function safeTransferFrom(address _from, address _to, uint256 _id, uint256 _value, bytes calldata _data) external;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_from`|`address`|Source address|
|`_to`|`address`|Target address|
|`_id`|`uint256`|ID of the token type|
|`_value`|`uint256`|Transfer amount|
|`_data`|`bytes`|Additional data with no specified format, MUST be sent unaltered in call to `onERC1155Received` on `_to`|


### safeBatchTransferFrom

Transfers `_values` amount(s) of `_ids` from the `_from` address to the `_to` address specified (with safety call).

*Caller must be approved to manage the tokens being transferred out of the `_from` account (see "Approval" section of the standard).
- MUST revert if `_to` is the zero address.
- MUST revert if length of `_ids` is not the same as length of `_values`.
- MUST revert if any of the balance(s) of the holder(s) for token(s) in `_ids` is lower than the respective amount(s) in `_values` sent to the recipient.
- MUST revert on any other error.
- MUST emit `TransferSingle` or `TransferBatch` event(s) such that all the balance changes are reflected (see "Safe Transfer Rules" section of the standard).
- Balance changes and events MUST follow the ordering of the arrays (_ids[0]/_values[0] before _ids[1]/_values[1], etc).
- After the above conditions for the transfer(s) in the batch are met, this function MUST check if `_to` is a smart contract (e.g. code size > 0). If so, it MUST call the relevant `ERC1155TokenReceiver` hook(s) on `_to` and act appropriately (see "Safe Transfer Rules" section of the standard).*


```solidity
function safeBatchTransferFrom(
    address _from,
    address _to,
    uint256[] calldata _ids,
    uint256[] calldata _values,
    bytes calldata _data
) external;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_from`|`address`|Source address|
|`_to`|`address`|Target address|
|`_ids`|`uint256[]`|IDs of each token type (order and length must match _values array)|
|`_values`|`uint256[]`|Transfer amounts per token type (order and length must match _ids array)|
|`_data`|`bytes`|Additional data with no specified format, MUST be sent unaltered in call to the `ERC1155TokenReceiver` hook(s) on `_to`|


### balanceOf

Get the balance of an account's tokens.


```solidity
function balanceOf(address _owner, uint256 _id) external view returns (uint256);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_owner`|`address`|The address of the token holder|
|`_id`|`uint256`|ID of the token|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`uint256`|The _owner's balance of the token type requested|


### balanceOfBatch

Get the balance of multiple account/token pairs


```solidity
function balanceOfBatch(address[] calldata _owners, uint256[] calldata _ids) external view returns (uint256[] memory);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_owners`|`address[]`|The addresses of the token holders|
|`_ids`|`uint256[]`|ID of the tokens|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`uint256[]`|The _owner's balance of the token types requested (i.e. balance for each (owner, id) pair)|


### setApprovalForAll

Enable or disable approval for a third party ("operator") to manage all of the caller's tokens.

*MUST emit the ApprovalForAll event on success.*


```solidity
function setApprovalForAll(address _operator, bool _approved) external;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_operator`|`address`|Address to add to the set of authorized operators|
|`_approved`|`bool`|True if the operator is approved, false to revoke approval|


### isApprovedForAll

Queries the approval status of an operator for a given owner.


```solidity
function isApprovedForAll(address _owner, address _operator) external view returns (bool);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_owner`|`address`|The owner of the tokens|
|`_operator`|`address`|Address of authorized operator|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`bool`|True if the operator is approved, false if not|


## Events
### TransferSingle
*
- Either `TransferSingle` or `TransferBatch` MUST emit when tokens are transferred, including zero value transfers as well as minting or burning (see "Safe Transfer Rules" section of the standard).
- The `_operator` argument MUST be the address of an account/contract that is approved to make the transfer (SHOULD be msg.sender).
- The `_from` argument MUST be the address of the holder whose balance is decreased.
- The `_to` argument MUST be the address of the recipient whose balance is increased.
- The `_id` argument MUST be the token type being transferred.
- The `_value` argument MUST be the number of tokens the holder balance is decreased by and match what the recipient balance is increased by.
- When minting/creating tokens, the `_from` argument MUST be set to `0x0` (i.e. zero address).
- When burning/destroying tokens, the `_to` argument MUST be set to `0x0` (i.e. zero address).*


```solidity
event TransferSingle(
    address indexed _operator, address indexed _from, address indexed _to, uint256 _id, uint256 _value
);
```

### TransferBatch
*
- Either `TransferSingle` or `TransferBatch` MUST emit when tokens are transferred, including zero value transfers as well as minting or burning (see "Safe Transfer Rules" section of the standard).
- The `_operator` argument MUST be the address of an account/contract that is approved to make the transfer (SHOULD be msg.sender).
- The `_from` argument MUST be the address of the holder whose balance is decreased.
- The `_to` argument MUST be the address of the recipient whose balance is increased.
- The `_ids` argument MUST be the list of tokens being transferred.
- The `_values` argument MUST be the list of number of tokens (matching the list and order of tokens specified in _ids) the holder balance is decreased by and match what the recipient balance is increased by.
- When minting/creating tokens, the `_from` argument MUST be set to `0x0` (i.e. zero address).
- When burning/destroying tokens, the `_to` argument MUST be set to `0x0` (i.e. zero address).*


```solidity
event TransferBatch(
    address indexed _operator, address indexed _from, address indexed _to, uint256[] _ids, uint256[] _values
);
```

### ApprovalForAll
*MUST emit when approval for a second party/operator address to manage all tokens for an owner address is enabled or disabled (absence of an event assumes disabled).*


```solidity
event ApprovalForAll(address indexed _owner, address indexed _operator, bool _approved);
```

### URI
*MUST emit when the URI is updated for a token ID. URIs are defined in RFC 3986.
The URI MUST point to a JSON file that conforms to the "ERC-1155 Metadata URI JSON Schema".*


```solidity
event URI(string _value, uint256 indexed _id);
```

