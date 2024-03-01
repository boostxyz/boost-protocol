# ERC4337
**Inherits:**
[Ownable](/lib/solady/src/auth/Ownable.sol/abstract.Ownable.md), [UUPSUpgradeable](/lib/solady/src/utils/UUPSUpgradeable.sol/abstract.UUPSUpgradeable.md), [Receiver](/lib/solady/src/accounts/Receiver.sol/abstract.Receiver.md), [ERC1271](/lib/solady/src/accounts/ERC1271.sol/abstract.ERC1271.md)

**Authors:**
Solady (https://github.com/vectorized/solady/blob/main/src/accounts/ERC4337.sol), Infinitism (https://github.com/eth-infinitism/account-abstraction/blob/develop/contracts/samples/SimpleAccount.sol)

Simple ERC4337 account implementation.

*Recommended usage:
1. Deploy the ERC4337 as an implementation contract, and verify it on Etherscan.
2. Create a factory that uses `LibClone.deployERC1967` or
`LibClone.deployDeterministicERC1967` to clone the implementation.
See: `ERC4337Factory.sol`.
Note:
ERC4337 is a very complicated standard with many potential gotchas.
Usually, ERC4337 account implementations are developed by companies with ample funds
for security reviews. This implementation is intended to serve as a base reference
for smart account developers working in such companies. If you are using this
implementation, please do get one or more security reviews before deployment.*


## Functions
### constructor


```solidity
constructor();
```

### _disableERC4337ImplementationInitializer

*Automatically initializes the owner for the implementation. This blocks someone
from initializing the implementation and doing a delegatecall to SELFDESTRUCT.
Proxies to the implementation will still be able to initialize as per normal.*


```solidity
function _disableERC4337ImplementationInitializer() internal virtual;
```

### initialize

*Initializes the account with the owner. Can only be called once.*


```solidity
function initialize(address newOwner) public payable virtual;
```

### entryPoint

*Returns the canonical ERC4337 EntryPoint contract.
Override this function to return a different EntryPoint.*


```solidity
function entryPoint() public view virtual returns (address);
```

### validateUserOp

*Validates the signature and nonce.
The EntryPoint will make the call to the recipient only if
this validation call returns successfully.
Signature failure should be reported by returning 1 (see: `_validateSignature`).
This allows making a "simulation call" without a valid signature.
Other failures (e.g. nonce mismatch, or invalid signature format)
should still revert to signal failure.*


```solidity
function validateUserOp(UserOperation calldata userOp, bytes32 userOpHash, uint256 missingAccountFunds)
    external
    payable
    virtual
    onlyEntryPoint
    payPrefund(missingAccountFunds)
    returns (uint256 validationData);
```

### _validateSignature

*Validate `userOp.signature` for the `userOpHash`.*


```solidity
function _validateSignature(UserOperation calldata userOp, bytes32 userOpHash)
    internal
    virtual
    returns (uint256 validationData);
```

### _validateNonce

*Override to validate the nonce of the userOp.
This method may validate the nonce requirement of this account.
e.g.
To limit the nonce to use sequenced userOps only (no "out of order" userOps):
`require(nonce < type(uint64).max)`
For a hypothetical account that *requires* the nonce to be out-of-order:
`require(nonce & type(uint64).max == 0)`
The actual nonce uniqueness is managed by the EntryPoint, and thus no other
action is needed by the account itself.*


```solidity
function _validateNonce(uint256 nonce) internal virtual;
```

### payPrefund

*Sends to the EntryPoint (i.e. `msg.sender`) the missing funds for this transaction.
Subclass MAY override this modifier for better funds management.
(e.g. send to the EntryPoint more than the minimum required, so that in future transactions
it will not be required to send again)
`missingAccountFunds` is the minimum value this modifier should send the EntryPoint,
which MAY be zero, in case there is enough deposit, or the userOp has a paymaster.*


```solidity
modifier payPrefund(uint256 missingAccountFunds) virtual;
```

### onlyEntryPoint

*Requires that the caller is the EntryPoint.*


```solidity
modifier onlyEntryPoint() virtual;
```

### execute

*Execute a call from this account.*


```solidity
function execute(address target, uint256 value, bytes calldata data)
    public
    payable
    virtual
    onlyEntryPointOrOwner
    returns (bytes memory result);
```

### executeBatch

*Execute a sequence of calls from this account.*


```solidity
function executeBatch(Call[] calldata calls)
    public
    payable
    virtual
    onlyEntryPointOrOwner
    returns (bytes[] memory results);
```

### delegateExecute

*Execute a delegatecall with `delegate` on this account.*


```solidity
function delegateExecute(address delegate, bytes calldata data)
    public
    payable
    virtual
    onlyEntryPointOrOwner
    delegateExecuteGuard
    returns (bytes memory result);
```

### delegateExecuteGuard

*Ensures that the owner and implementation slots' values aren't changed.
You can override this modifier to ensure the sanctity of other storage slots too.*


```solidity
modifier delegateExecuteGuard() virtual;
```

### onlyEntryPointOrOwner

*Requires that the caller is the EntryPoint, the owner, or the account itself.*


```solidity
modifier onlyEntryPointOrOwner() virtual;
```

### storageLoad

*Returns the raw storage value at `storageSlot`.*


```solidity
function storageLoad(bytes32 storageSlot) public view virtual returns (bytes32 result);
```

### storageStore

*Writes the raw storage value at `storageSlot`.*


```solidity
function storageStore(bytes32 storageSlot, bytes32 storageValue)
    public
    payable
    virtual
    onlyEntryPointOrOwner
    storageStoreGuard(storageSlot);
```

### storageStoreGuard

*Ensures that the `storageSlot` is not prohibited for direct storage writes.
You can override this modifier to ensure the sanctity of other storage slots too.*


```solidity
modifier storageStoreGuard(bytes32 storageSlot) virtual;
```

### getDeposit

*Returns the account's balance on the EntryPoint.*


```solidity
function getDeposit() public view virtual returns (uint256 result);
```

### addDeposit

*Deposit more funds for this account in the EntryPoint.*


```solidity
function addDeposit() public payable virtual;
```

### withdrawDepositTo

*Withdraw ETH from the account's deposit on the EntryPoint.*


```solidity
function withdrawDepositTo(address to, uint256 amount) public payable virtual onlyOwner;
```

### _checkOwner

*Requires that the caller is the owner or the account itself.
This override affects the `onlyOwner` modifier.*


```solidity
function _checkOwner() internal view virtual override(Ownable);
```

### _guardInitializeOwner

*To prevent double-initialization (reuses the owner storage slot for efficiency).*


```solidity
function _guardInitializeOwner() internal pure virtual override(Ownable) returns (bool);
```

### _erc1271Signer

*Uses the `owner` as the ERC1271 signer.*


```solidity
function _erc1271Signer() internal view virtual override(ERC1271) returns (address);
```

### _authorizeUpgrade

*To ensure that only the owner or the account itself can upgrade the implementation.*


```solidity
function _authorizeUpgrade(address) internal virtual override(UUPSUpgradeable) onlyOwner;
```

### fallback

*Handle token callbacks. If no token callback is triggered,
use `LibZip.cdFallback` for generalized calldata decompression.
If you don't need either, re-override this function.*


```solidity
fallback() external payable virtual override(Receiver) receiverFallback;
```

## Structs
### UserOperation
*The ERC4337 user operation (userOp) struct.*


```solidity
struct UserOperation {
    address sender;
    uint256 nonce;
    bytes initCode;
    bytes callData;
    uint256 callGasLimit;
    uint256 verificationGasLimit;
    uint256 preVerificationGas;
    uint256 maxFeePerGas;
    uint256 maxPriorityFeePerGas;
    bytes paymasterAndData;
    bytes signature;
}
```

### Call
*Call struct for the `executeBatch` function.*


```solidity
struct Call {
    address target;
    uint256 value;
    bytes data;
}
```

