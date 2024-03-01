# Clone
**Authors:**
Solady (https://github.com/vectorized/solady/blob/main/src/utils/Clone.sol), Adapted from clones with immutable args by zefram.eth, Saw-mon & Natalie
(https://github.com/Saw-mon-and-Natalie/clones-with-immutable-args)

Class with helper read functions for clone with immutable args.


## Functions
### _getArgBytes

*Reads all of the immutable args.*


```solidity
function _getArgBytes() internal pure returns (bytes memory arg);
```

### _getArgBytes

*Reads an immutable arg with type bytes.*


```solidity
function _getArgBytes(uint256 argOffset, uint256 length) internal pure returns (bytes memory arg);
```

### _getArgAddress

*Reads an immutable arg with type address.*


```solidity
function _getArgAddress(uint256 argOffset) internal pure returns (address arg);
```

### _getArgUint256Array

*Reads a uint256 array stored in the immutable args.*


```solidity
function _getArgUint256Array(uint256 argOffset, uint256 length) internal pure returns (uint256[] memory arg);
```

### _getArgBytes32Array

*Reads a bytes32 array stored in the immutable args.*


```solidity
function _getArgBytes32Array(uint256 argOffset, uint256 length) internal pure returns (bytes32[] memory arg);
```

### _getArgBytes32

*Reads an immutable arg with type bytes32.*


```solidity
function _getArgBytes32(uint256 argOffset) internal pure returns (bytes32 arg);
```

### _getArgUint256

*Reads an immutable arg with type uint256.*


```solidity
function _getArgUint256(uint256 argOffset) internal pure returns (uint256 arg);
```

### _getArgUint248

*Reads an immutable arg with type uint248.*


```solidity
function _getArgUint248(uint256 argOffset) internal pure returns (uint248 arg);
```

### _getArgUint240

*Reads an immutable arg with type uint240.*


```solidity
function _getArgUint240(uint256 argOffset) internal pure returns (uint240 arg);
```

### _getArgUint232

*Reads an immutable arg with type uint232.*


```solidity
function _getArgUint232(uint256 argOffset) internal pure returns (uint232 arg);
```

### _getArgUint224

*Reads an immutable arg with type uint224.*


```solidity
function _getArgUint224(uint256 argOffset) internal pure returns (uint224 arg);
```

### _getArgUint216

*Reads an immutable arg with type uint216.*


```solidity
function _getArgUint216(uint256 argOffset) internal pure returns (uint216 arg);
```

### _getArgUint208

*Reads an immutable arg with type uint208.*


```solidity
function _getArgUint208(uint256 argOffset) internal pure returns (uint208 arg);
```

### _getArgUint200

*Reads an immutable arg with type uint200.*


```solidity
function _getArgUint200(uint256 argOffset) internal pure returns (uint200 arg);
```

### _getArgUint192

*Reads an immutable arg with type uint192.*


```solidity
function _getArgUint192(uint256 argOffset) internal pure returns (uint192 arg);
```

### _getArgUint184

*Reads an immutable arg with type uint184.*


```solidity
function _getArgUint184(uint256 argOffset) internal pure returns (uint184 arg);
```

### _getArgUint176

*Reads an immutable arg with type uint176.*


```solidity
function _getArgUint176(uint256 argOffset) internal pure returns (uint176 arg);
```

### _getArgUint168

*Reads an immutable arg with type uint168.*


```solidity
function _getArgUint168(uint256 argOffset) internal pure returns (uint168 arg);
```

### _getArgUint160

*Reads an immutable arg with type uint160.*


```solidity
function _getArgUint160(uint256 argOffset) internal pure returns (uint160 arg);
```

### _getArgUint152

*Reads an immutable arg with type uint152.*


```solidity
function _getArgUint152(uint256 argOffset) internal pure returns (uint152 arg);
```

### _getArgUint144

*Reads an immutable arg with type uint144.*


```solidity
function _getArgUint144(uint256 argOffset) internal pure returns (uint144 arg);
```

### _getArgUint136

*Reads an immutable arg with type uint136.*


```solidity
function _getArgUint136(uint256 argOffset) internal pure returns (uint136 arg);
```

### _getArgUint128

*Reads an immutable arg with type uint128.*


```solidity
function _getArgUint128(uint256 argOffset) internal pure returns (uint128 arg);
```

### _getArgUint120

*Reads an immutable arg with type uint120.*


```solidity
function _getArgUint120(uint256 argOffset) internal pure returns (uint120 arg);
```

### _getArgUint112

*Reads an immutable arg with type uint112.*


```solidity
function _getArgUint112(uint256 argOffset) internal pure returns (uint112 arg);
```

### _getArgUint104

*Reads an immutable arg with type uint104.*


```solidity
function _getArgUint104(uint256 argOffset) internal pure returns (uint104 arg);
```

### _getArgUint96

*Reads an immutable arg with type uint96.*


```solidity
function _getArgUint96(uint256 argOffset) internal pure returns (uint96 arg);
```

### _getArgUint88

*Reads an immutable arg with type uint88.*


```solidity
function _getArgUint88(uint256 argOffset) internal pure returns (uint88 arg);
```

### _getArgUint80

*Reads an immutable arg with type uint80.*


```solidity
function _getArgUint80(uint256 argOffset) internal pure returns (uint80 arg);
```

### _getArgUint72

*Reads an immutable arg with type uint72.*


```solidity
function _getArgUint72(uint256 argOffset) internal pure returns (uint72 arg);
```

### _getArgUint64

*Reads an immutable arg with type uint64.*


```solidity
function _getArgUint64(uint256 argOffset) internal pure returns (uint64 arg);
```

### _getArgUint56

*Reads an immutable arg with type uint56.*


```solidity
function _getArgUint56(uint256 argOffset) internal pure returns (uint56 arg);
```

### _getArgUint48

*Reads an immutable arg with type uint48.*


```solidity
function _getArgUint48(uint256 argOffset) internal pure returns (uint48 arg);
```

### _getArgUint40

*Reads an immutable arg with type uint40.*


```solidity
function _getArgUint40(uint256 argOffset) internal pure returns (uint40 arg);
```

### _getArgUint32

*Reads an immutable arg with type uint32.*


```solidity
function _getArgUint32(uint256 argOffset) internal pure returns (uint32 arg);
```

### _getArgUint24

*Reads an immutable arg with type uint24.*


```solidity
function _getArgUint24(uint256 argOffset) internal pure returns (uint24 arg);
```

### _getArgUint16

*Reads an immutable arg with type uint16.*


```solidity
function _getArgUint16(uint256 argOffset) internal pure returns (uint16 arg);
```

### _getArgUint8

*Reads an immutable arg with type uint8.*


```solidity
function _getArgUint8(uint256 argOffset) internal pure returns (uint8 arg);
```

### _getImmutableArgsOffset


```solidity
function _getImmutableArgsOffset() internal pure returns (uint256 offset);
```
**Returns**

|Name|Type|Description|
|----|----|-----------|
|`offset`|`uint256`|The offset of the packed immutable args in calldata.|


