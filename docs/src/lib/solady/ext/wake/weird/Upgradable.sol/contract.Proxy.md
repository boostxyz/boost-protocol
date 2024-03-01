# Proxy

## State Variables
### ADMIN_KEY

```solidity
bytes32 constant ADMIN_KEY = bytes32(uint256(keccak256("eip1967.proxy.admin")) - 1);
```


### IMPLEMENTATION_KEY

```solidity
bytes32 constant IMPLEMENTATION_KEY = bytes32(uint256(keccak256("eip1967.proxy.implementation")) - 1);
```


## Functions
### constructor


```solidity
constructor(uint256 totalSupply) public;
```

### auth


```solidity
modifier auth();
```

### owner


```solidity
function owner() public view returns (address usr);
```

### give


```solidity
function give(address usr) public auth;
```

### implementation


```solidity
function implementation() public view returns (address impl);
```

### upgrade


```solidity
function upgrade(address impl) public auth;
```

### fallback


```solidity
fallback() external payable;
```

### receive


```solidity
receive() external payable;
```

