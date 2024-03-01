# ERC721ConsecutiveTest
**Inherits:**
[Test](/lib/forge-std/src/Test.sol/abstract.Test.md)


## Functions
### test_balance


```solidity
function test_balance(address receiver, uint256[] calldata batches, uint96 startingId) public;
```

### test_ownership


```solidity
function test_ownership(
    address receiver,
    uint256[] calldata batches,
    uint256[2] calldata unboundedTokenId,
    uint96 startingId
) public;
```

### test_burn


```solidity
function test_burn(address receiver, uint256[] calldata batches, uint256 unboundedTokenId, uint96 startingId) public;
```

### test_transfer


```solidity
function test_transfer(
    address[2] calldata accounts,
    uint256[2] calldata unboundedBatches,
    uint256[2] calldata unboundedTokenId,
    uint96 startingId
) public;
```

### test_start_consecutive_id


```solidity
function test_start_consecutive_id(
    address receiver,
    uint256[2] calldata unboundedBatches,
    uint256[2] calldata unboundedTokenId,
    uint96 startingId
) public;
```

