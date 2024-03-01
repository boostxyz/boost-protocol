# StorageTest

## State Variables
### exists

```solidity
uint256 public exists = 1;
```


### map_addr

```solidity
mapping(address => uint256) public map_addr;
```


### map_uint

```solidity
mapping(uint256 => uint256) public map_uint;
```


### map_packed

```solidity
mapping(address => uint256) public map_packed;
```


### map_struct

```solidity
mapping(address => UnpackedStruct) public map_struct;
```


### deep_map

```solidity
mapping(address => mapping(address => uint256)) public deep_map;
```


### deep_map_struct

```solidity
mapping(address => mapping(address => UnpackedStruct)) public deep_map_struct;
```


### basic

```solidity
UnpackedStruct public basic;
```


### tA

```solidity
uint248 public tA;
```


### tB

```solidity
bool public tB;
```


### tC

```solidity
bool public tC = false;
```


### tD

```solidity
uint248 public tD = 1;
```


### map_bool

```solidity
mapping(address => bool) public map_bool;
```


### tE

```solidity
bytes32 public tE = hex"1337";
```


### tF

```solidity
address public tF = address(1337);
```


### tG

```solidity
int256 public tG = type(int256).min;
```


### tH

```solidity
bool public tH = true;
```


### tI

```solidity
bytes32 private tI = ~bytes32(hex"1337");
```


## Functions
### constructor


```solidity
constructor();
```

### read_struct_upper


```solidity
function read_struct_upper(address who) public view returns (uint256);
```

### read_struct_lower


```solidity
function read_struct_lower(address who) public view returns (uint256);
```

### hidden


```solidity
function hidden() public view returns (bytes32 t);
```

### const


```solidity
function const() public pure returns (bytes32 t);
```

### extra_sload


```solidity
function extra_sload() public view returns (bytes32 t);
```

## Structs
### UnpackedStruct

```solidity
struct UnpackedStruct {
    uint256 a;
    uint256 b;
}
```

