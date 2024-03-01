# Panic
*Helper library for emitting standardized panic codes.
```solidity
contract Example {
using Panic for uint256;
// Use any of the declared internal constants
function foo() { Panic.GENERIC.panic(); }
// Alternatively
function foo() { Panic.panic(Panic.GENERIC); }
}
```
Follows the list from https://github.com/ethereum/solidity/blob/v0.8.24/libsolutil/ErrorCodes.h[libsolutil].*


## State Variables
### GENERIC
*generic / unspecified error*


```solidity
uint256 internal constant GENERIC = 0x00;
```


### ASSERT
*used by the assert() builtin*


```solidity
uint256 internal constant ASSERT = 0x01;
```


### UNDER_OVERFLOW
*arithmetic underflow or overflow*


```solidity
uint256 internal constant UNDER_OVERFLOW = 0x11;
```


### DIVISION_BY_ZERO
*division or modulo by zero*


```solidity
uint256 internal constant DIVISION_BY_ZERO = 0x12;
```


### ENUM_CONVERSION_ERROR
*enum conversion error*


```solidity
uint256 internal constant ENUM_CONVERSION_ERROR = 0x21;
```


### STORAGE_ENCODING_ERROR
*invalid encoding in storage*


```solidity
uint256 internal constant STORAGE_ENCODING_ERROR = 0x22;
```


### EMPTY_ARRAY_POP
*empty array pop*


```solidity
uint256 internal constant EMPTY_ARRAY_POP = 0x31;
```


### ARRAY_OUT_OF_BOUNDS
*array out of bounds access*


```solidity
uint256 internal constant ARRAY_OUT_OF_BOUNDS = 0x32;
```


### RESOURCE_ERROR
*resource error (too large allocation or too large array)*


```solidity
uint256 internal constant RESOURCE_ERROR = 0x41;
```


### INVALID_INTERNAL_FUNCTION
*calling invalid internal function*


```solidity
uint256 internal constant INVALID_INTERNAL_FUNCTION = 0x51;
```


## Functions
### panic

*Reverts with a panic code. Recommended to use with
the internal constants with predefined codes.*


```solidity
function panic(uint256 code) internal pure;
```

