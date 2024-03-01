# stdStorageSafe

## State Variables
### vm

```solidity
Vm private constant vm = Vm(address(uint160(uint256(keccak256("hevm cheat code")))));
```


## Functions
### sigs


```solidity
function sigs(string memory sigStr) internal pure returns (bytes4);
```

### find

find an arbitrary storage slot given a function sig, input data, address of the contract and a value to check against


```solidity
function find(StdStorage storage self) internal returns (uint256);
```

### target


```solidity
function target(StdStorage storage self, address _target) internal returns (StdStorage storage);
```

### sig


```solidity
function sig(StdStorage storage self, bytes4 _sig) internal returns (StdStorage storage);
```

### sig


```solidity
function sig(StdStorage storage self, string memory _sig) internal returns (StdStorage storage);
```

### with_key


```solidity
function with_key(StdStorage storage self, address who) internal returns (StdStorage storage);
```

### with_key


```solidity
function with_key(StdStorage storage self, uint256 amt) internal returns (StdStorage storage);
```

### with_key


```solidity
function with_key(StdStorage storage self, bytes32 key) internal returns (StdStorage storage);
```

### depth


```solidity
function depth(StdStorage storage self, uint256 _depth) internal returns (StdStorage storage);
```

### read


```solidity
function read(StdStorage storage self) private returns (bytes memory);
```

### read_bytes32


```solidity
function read_bytes32(StdStorage storage self) internal returns (bytes32);
```

### read_bool


```solidity
function read_bool(StdStorage storage self) internal returns (bool);
```

### read_address


```solidity
function read_address(StdStorage storage self) internal returns (address);
```

### read_uint


```solidity
function read_uint(StdStorage storage self) internal returns (uint256);
```

### read_int


```solidity
function read_int(StdStorage storage self) internal returns (int256);
```

### parent


```solidity
function parent(StdStorage storage self) internal returns (uint256, bytes32);
```

### root


```solidity
function root(StdStorage storage self) internal returns (uint256);
```

### bytesToBytes32


```solidity
function bytesToBytes32(bytes memory b, uint256 offset) private pure returns (bytes32);
```

### flatten


```solidity
function flatten(bytes32[] memory b) private pure returns (bytes memory);
```

## Events
### SlotFound

```solidity
event SlotFound(address who, bytes4 fsig, bytes32 keysHash, uint256 slot);
```

### WARNING_UninitedSlot

```solidity
event WARNING_UninitedSlot(address who, uint256 slot);
```

