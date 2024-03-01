# ERC6551
**Inherits:**
[UUPSUpgradeable](/lib/solady/src/utils/UUPSUpgradeable.sol/abstract.UUPSUpgradeable.md), [Receiver](/lib/solady/src/accounts/Receiver.sol/abstract.Receiver.md), [ERC1271](/lib/solady/src/accounts/ERC1271.sol/abstract.ERC1271.md)

**Authors:**
Solady (https://github.com/vectorized/solady/blob/main/src/accounts/ERC6551.sol), ERC6551 team (https://github.com/erc6551/reference/blob/main/src/examples/upgradeable/ERC6551AccountUpgradeable.sol)

Simple ERC6551 account implementation.

*Recommended usage (regular):
1. Deploy the ERC6551 as an implementation contract, and verify it on Etherscan.
2. Use the canonical ERC6551Registry to deploy a clone to the ERC6551 implementation.
The UUPSUpgradeable functions will simply become no-ops.
Recommended usage (upgradeable):
1. Deploy the ERC6551 as an implementation contract, and verify it on Etherscan.
2. Deploy the ERC6551Proxy pointing to the implementation.
This relay proxy is required, but Etherscan verification of it is optional.
3. Use the canonical ERC6551Registry to deploy a clone to the ERC6551Proxy.
If you want to reveal the "Read as Proxy" and "Write as Proxy" tabs on Etherscan,
send 0 ETH to the clone to initialize its ERC1967 implementation slot,
the click on "Is this a proxy?" on the clone's page on Etherscan.
Note:
- ERC6551 accounts are not compatible with ERC4337
(at least not without crazy hacks)
due to storage access limitations during ERC4337 UserOp validation.
- Please refer to the official [ERC6551](https://github.com/erc6551/reference) reference
for latest updates on the ERC6551 standard, as well as canonical registry information.*


## State Variables
### _ERC6551_STATE_SLOT
*The ERC6551 state slot is given by:
`bytes32(~uint256(uint32(bytes4(keccak256("_ERC6551_STATE_SLOT_NOT")))))`.
It is intentionally chosen to be a high value
to avoid collision with lower slots.
The choice of manual storage layout is to enable compatibility
with both regular and upgradeable contracts.*


```solidity
uint256 internal constant _ERC6551_STATE_SLOT = 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffb919c7a5;
```


## Functions
### token

*Returns the token-bound information.*


```solidity
function token() public view virtual returns (uint256 chainId, address tokenContract, uint256 tokenId);
```

### owner

*Returns the owner of the contract.*


```solidity
function owner() public view virtual returns (address result);
```

### _isValidSigner

*Returns if `signer` is an authorized signer.*


```solidity
function _isValidSigner(address signer) internal view virtual returns (bool);
```

### onlyValidSigner

*Requires that the caller is a valid signer (i.e. the owner), or the contract itself.*


```solidity
modifier onlyValidSigner() virtual;
```

### state

*Returns the current value of the state counter.*


```solidity
function state() public view virtual returns (uint256 result);
```

### incrementState

*Increments the state counter. This modifier is required for every
public / external function that may modify storage or emit events.*


```solidity
modifier incrementState() virtual;
```

### execute

*Execute a call from this account.*


```solidity
function execute(address target, uint256 value, bytes calldata data, uint8 operation)
    public
    payable
    virtual
    onlyValidSigner
    onlyValidExecuteOperation(operation)
    incrementState
    returns (bytes memory result);
```

### executeBatch

*Execute a sequence of calls from this account.*


```solidity
function executeBatch(Call[] calldata calls, uint8 operation)
    public
    payable
    virtual
    onlyValidSigner
    onlyValidExecuteOperation(operation)
    incrementState
    returns (bytes[] memory results);
```

### onlyValidExecuteOperation

*Requires that the execute `operation` is supported.*


```solidity
modifier onlyValidExecuteOperation(uint8 operation) virtual;
```

### supportsInterface

*Returns true if this contract implements the interface defined by `interfaceId`.
See: https://eips.ethereum.org/EIPS/eip-165
This function call must use less than 30000 gas.*


```solidity
function supportsInterface(bytes4 interfaceId) public view virtual returns (bool result);
```

### _authorizeUpgrade

*To ensure that only the owner or the account itself can upgrade the implementation.*


```solidity
function _authorizeUpgrade(address) internal virtual override(UUPSUpgradeable) onlyValidSigner incrementState;
```

### _erc1271Signer

*Uses the `owner` as the ERC1271 signer.*


```solidity
function _erc1271Signer() internal view virtual override(ERC1271) returns (address);
```

### receiverFallback

*For handling token callbacks.
Safe-transferred ERC721 tokens will trigger a ownership cycle check.*


```solidity
modifier receiverFallback() override(Receiver);
```

### fallback

*Handle token callbacks. If no token callback is triggered,
use `LibZip.cdFallback` for generalized calldata decompression.
If you don't need either, re-override this function.*


```solidity
fallback() external payable virtual override(Receiver) receiverFallback;
```

## Errors
### Unauthorized
*The caller is not authorized to call the function.*


```solidity
error Unauthorized();
```

### OperationNotSupported
*The operation is not supported.*


```solidity
error OperationNotSupported();
```

### SelfOwnDetected
*Self ownership detected.*


```solidity
error SelfOwnDetected();
```

## Structs
### Call
*Call struct for the `executeBatch` function.*


```solidity
struct Call {
    address target;
    uint256 value;
    bytes data;
}
```

