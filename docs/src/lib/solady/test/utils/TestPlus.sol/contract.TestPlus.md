# TestPlus

## State Variables
### _VM_ADDRESS
*`address(bytes20(uint160(uint256(keccak256("hevm cheat code")))))`.*


```solidity
address private constant _VM_ADDRESS = 0x7109709ECfa91a80626fF3989D68f67F5b1DD12D;
```


## Functions
### _brutalizeMemory

*Fills the memory with junk, for more robust testing of inline assembly
which reads/write to the memory.*


```solidity
function _brutalizeMemory() internal view;
```

### _brutalizeScratchSpace

*Fills the scratch space with junk, for more robust testing of inline assembly
which reads/write to the memory.*


```solidity
function _brutalizeScratchSpace() internal view;
```

### brutalizeMemory

*Fills the memory with junk, for more robust testing of inline assembly
which reads/write to the memory.*


```solidity
modifier brutalizeMemory();
```

### brutalizeScratchSpace

*Fills the scratch space with junk, for more robust testing of inline assembly
which reads/write to the memory.*


```solidity
modifier brutalizeScratchSpace();
```

### _random

*Returns a pseudorandom random number from [0 .. 2**256 - 1] (inclusive).
For usage in fuzz tests, please ensure that the function has an unnamed uint256 argument.
e.g. `testSomething(uint256) public`.*


```solidity
function _random() internal returns (uint256 r);
```

### _randomSigner

*Returns a random signer and its private key.*


```solidity
function _randomSigner() internal returns (address signer, uint256 privateKey);
```

### _randomAddress

*Returns a random address.*


```solidity
function _randomAddress() internal returns (address result);
```

### _randomNonZeroAddress

*Returns a random non-zero address.*


```solidity
function _randomNonZeroAddress() internal returns (address result);
```

### _roundUpFreeMemoryPointer

*Rounds up the free memory pointer to the next word boundary.
Sometimes, some Solidity operations cause the free memory pointer to be misaligned.*


```solidity
function _roundUpFreeMemoryPointer() internal pure;
```

### _misalignFreeMemoryPointer

*Misaligns the free memory pointer.
The free memory pointer has a 1/32 chance to be aligned.*


```solidity
function _misalignFreeMemoryPointer() internal pure;
```

### _checkMemory

*Check if the free memory pointer and the zero slot are not contaminated.
Useful for cases where these slots are used for temporary storage.*


```solidity
function _checkMemory() internal pure;
```

### _checkMemory

*Check if `s`:
- Has sufficient memory allocated.
- Is zero right padded (cuz some frontends like Etherscan has issues
with decoding non-zero-right-padded strings).*


```solidity
function _checkMemory(bytes memory s) internal pure;
```

### _checkMemory

*For checking the memory allocation for string `s`.*


```solidity
function _checkMemory(string memory s) internal pure;
```

### _hem

*Adapted from `bound`:
https://github.com/foundry-rs/forge-std/blob/ff4bf7db008d096ea5a657f2c20516182252a3ed/src/StdUtils.sol#L10
Differentially fuzzed tested against the original implementation.*


```solidity
function _hem(uint256 x, uint256 min, uint256 max) internal pure virtual returns (uint256 result);
```

### _safeCreate2

*Deploys a contract via 0age's immutable create 2 factory for testing.*


```solidity
function _safeCreate2(uint256 payableAmount, bytes32 salt, bytes memory initializationCode)
    internal
    returns (address deploymentAddress);
```

### _safeCreate2

*Deploys a contract via 0age's immutable create 2 factory for testing.*


```solidity
function _safeCreate2(bytes32 salt, bytes memory initializationCode) internal returns (address deploymentAddress);
```

### test__codesize

*This function will make forge's gas output display the approximate codesize of
the test contract as the amount of gas burnt. Useful for quick guess checking if
certain optimizations actually compiles to similar bytecode.*


```solidity
function test__codesize() external view;
```

## Events
### LogString

```solidity
event LogString(string name, string value);
```

### LogBytes

```solidity
event LogBytes(string name, bytes value);
```

### LogUint

```solidity
event LogUint(string name, uint256 value);
```

### LogInt

```solidity
event LogInt(string name, int256 value);
```

