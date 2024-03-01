# StdCheatsForkTest
**Inherits:**
[Test](/lib/forge-std/src/Test.sol/abstract.Test.md)


## State Variables
### SHIB

```solidity
address internal constant SHIB = 0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE;
```


### USDC

```solidity
address internal constant USDC = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;
```


### USDC_BLACKLISTED_USER

```solidity
address internal constant USDC_BLACKLISTED_USER = 0x1E34A77868E19A6647b1f2F47B51ed72dEDE95DD;
```


### USDT

```solidity
address internal constant USDT = 0xdAC17F958D2ee523a2206206994597C13D831ec7;
```


### USDT_BLACKLISTED_USER

```solidity
address internal constant USDT_BLACKLISTED_USER = 0x8f8a8F4B54a2aAC7799d7bc81368aC27b852822A;
```


## Functions
### setUp


```solidity
function setUp() public;
```

### test_CannotAssumeNoBlacklisted_EOA


```solidity
function test_CannotAssumeNoBlacklisted_EOA() external;
```

### testFuzz_AssumeNotBlacklisted_TokenWithoutBlacklist


```solidity
function testFuzz_AssumeNotBlacklisted_TokenWithoutBlacklist(address addr) external;
```

### test_AssumeNoBlacklisted_USDC


```solidity
function test_AssumeNoBlacklisted_USDC() external;
```

### testFuzz_AssumeNotBlacklisted_USDC


```solidity
function testFuzz_AssumeNotBlacklisted_USDC(address addr) external;
```

### test_AssumeNoBlacklisted_USDT


```solidity
function test_AssumeNoBlacklisted_USDT() external;
```

### testFuzz_AssumeNotBlacklisted_USDT


```solidity
function testFuzz_AssumeNotBlacklisted_USDT(address addr) external;
```

