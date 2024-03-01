# ERC721Consecutive
**Inherits:**
[IERC2309](/lib/openzeppelin-contracts/contracts/interfaces/IERC2309.sol/interface.IERC2309.md), [ERC721](/lib/solady/src/tokens/ERC721.sol/abstract.ERC721.md)

*Implementation of the ERC-2309 "Consecutive Transfer Extension" as defined in
https://eips.ethereum.org/EIPS/eip-2309[ERC-2309].
This extension allows the minting of large batches of tokens, during contract construction only. For upgradeable
contracts this implies that batch minting is only available during proxy deployment, and not in subsequent upgrades.
These batches are limited to 5000 tokens at a time by default to accommodate off-chain indexers.
Using this extension removes the ability to mint single tokens during contract construction. This ability is
regained after construction. During construction, only batch minting is allowed.
IMPORTANT: This extension does not call the [_update](/lib/openzeppelin-contracts/contracts/token/ERC721/extensions/ERC721Consecutive.sol/abstract.ERC721Consecutive.md#_update) function for tokens minted in batch. Any logic added to this
function through overrides will not be triggered when token are minted in batch. You may want to also override
{_increaseBalance} or {_mintConsecutive} to account for these mints.
IMPORTANT: When overriding {_mintConsecutive}, be careful about call ordering. {ownerOf} may return invalid
values during the {_mintConsecutive} execution if the super call is not called first. To be safe, execute the
super call before your custom logic.*


## State Variables
### _sequentialOwnership

```solidity
Checkpoints.Trace160 private _sequentialOwnership;
```


### _sequentialBurn

```solidity
BitMaps.BitMap private _sequentialBurn;
```


## Functions
### _maxBatchSize

*Maximum size of a batch of consecutive tokens. This is designed to limit stress on off-chain indexing
services that have to record one entry per token, and have protections against "unreasonably large" batches of
tokens.
NOTE: Overriding the default value of 5000 will not cause on-chain issues, but may result in the asset not being
correctly supported by off-chain indexing services (including marketplaces).*


```solidity
function _maxBatchSize() internal view virtual returns (uint96);
```

### _ownerOf

*See {ERC721-_ownerOf}. Override that checks the sequential ownership structure for tokens that have
been minted as part of a batch, and not yet transferred.*


```solidity
function _ownerOf(uint256 tokenId) internal view virtual override returns (address);
```

### _mintConsecutive

*Mint a batch of tokens of length `batchSize` for `to`. Returns the token id of the first token minted in the
batch; if `batchSize` is 0, returns the number of consecutive ids minted so far.
Requirements:
- `batchSize` must not be greater than [_maxBatchSize](/lib/openzeppelin-contracts/contracts/token/ERC721/extensions/ERC721Consecutive.sol/abstract.ERC721Consecutive.md#_maxbatchsize).
- The function is called in the constructor of the contract (directly or indirectly).
CAUTION: Does not emit a `Transfer` event. This is ERC-721 compliant as long as it is done inside of the
constructor, which is enforced by this function.
CAUTION: Does not invoke `onERC721Received` on the receiver.
Emits a {IERC2309-ConsecutiveTransfer} event.*


```solidity
function _mintConsecutive(address to, uint96 batchSize) internal virtual returns (uint96);
```

### _update

*See [ERC721-_update](/lib/openzeppelin-contracts/contracts/token/ERC1155/ERC1155.sol/abstract.ERC1155.md#_update). Override version that restricts normal minting to after construction.
WARNING: Using {ERC721Consecutive} prevents minting during construction in favor of {_mintConsecutive}.
After construction, {_mintConsecutive} is no longer available and minting through {_update} becomes available.*


```solidity
function _update(address to, uint256 tokenId, address auth) internal virtual override returns (address);
```

### _firstConsecutiveId

*Used to offset the first token id in [_nextConsecutiveId](/lib/openzeppelin-contracts/contracts/token/ERC721/extensions/ERC721Consecutive.sol/abstract.ERC721Consecutive.md#_nextconsecutiveid)*


```solidity
function _firstConsecutiveId() internal view virtual returns (uint96);
```

### _nextConsecutiveId

*Returns the next tokenId to mint using [_mintConsecutive](/lib/openzeppelin-contracts/contracts/token/ERC721/extensions/ERC721Consecutive.sol/abstract.ERC721Consecutive.md#_mintconsecutive). It will return {_firstConsecutiveId}
if no consecutive tokenId has been minted before.*


```solidity
function _nextConsecutiveId() private view returns (uint96);
```

## Errors
### ERC721ForbiddenBatchMint
*Batch mint is restricted to the constructor.
Any batch mint not emitting the [IERC721-Transfer](/lib/openzeppelin-contracts/lib/forge-std/src/mocks/MockERC20.sol/contract.MockERC20.md#transfer) event outside of the constructor
is non ERC-721 compliant.*


```solidity
error ERC721ForbiddenBatchMint();
```

### ERC721ExceededMaxBatchMint
*Exceeds the max amount of mints per batch.*


```solidity
error ERC721ExceededMaxBatchMint(uint256 batchSize, uint256 maxBatch);
```

### ERC721ForbiddenMint
*Individual minting is not allowed.*


```solidity
error ERC721ForbiddenMint();
```

### ERC721ForbiddenBatchBurn
*Batch burn is not supported.*


```solidity
error ERC721ForbiddenBatchBurn();
```

