# StorageSlotMock

## State Variables
### stringMap

```solidity
mapping(uint256 key => string) public stringMap;
```


### bytesMap

```solidity
mapping(uint256 key => bytes) public bytesMap;
```


## Functions
### setBooleanSlot


```solidity
function setBooleanSlot(bytes32 slot, bool value) public;
```

### setAddressSlot


```solidity
function setAddressSlot(bytes32 slot, address value) public;
```

### setBytes32Slot


```solidity
function setBytes32Slot(bytes32 slot, bytes32 value) public;
```

### setUint256Slot


```solidity
function setUint256Slot(bytes32 slot, uint256 value) public;
```

### getBooleanSlot


```solidity
function getBooleanSlot(bytes32 slot) public view returns (bool);
```

### getAddressSlot


```solidity
function getAddressSlot(bytes32 slot) public view returns (address);
```

### getBytes32Slot


```solidity
function getBytes32Slot(bytes32 slot) public view returns (bytes32);
```

### getUint256Slot


```solidity
function getUint256Slot(bytes32 slot) public view returns (uint256);
```

### setStringSlot


```solidity
function setStringSlot(bytes32 slot, string calldata value) public;
```

### setStringStorage


```solidity
function setStringStorage(uint256 key, string calldata value) public;
```

### getStringSlot


```solidity
function getStringSlot(bytes32 slot) public view returns (string memory);
```

### getStringStorage


```solidity
function getStringStorage(uint256 key) public view returns (string memory);
```

### setBytesSlot


```solidity
function setBytesSlot(bytes32 slot, bytes calldata value) public;
```

### setBytesStorage


```solidity
function setBytesStorage(uint256 key, bytes calldata value) public;
```

### getBytesSlot


```solidity
function getBytesSlot(bytes32 slot) public view returns (bytes memory);
```

### getBytesStorage


```solidity
function getBytesStorage(uint256 key) public view returns (bytes memory);
```

