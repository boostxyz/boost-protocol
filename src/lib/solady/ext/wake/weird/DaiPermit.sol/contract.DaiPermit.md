# DaiPermit
**Inherits:**
[Math](/lib/solady/ext/wake/weird/Bytes32Metadata.sol/contract.Math.md)


## State Variables
### name

```solidity
string public constant name = "Token";
```


### symbol

```solidity
string public constant symbol = "TKN";
```


### decimals

```solidity
uint8 public decimals = 18;
```


### totalSupply

```solidity
uint256 public totalSupply;
```


### PERMIT_TYPEHASH

```solidity
bytes32 public constant PERMIT_TYPEHASH = 0xea2aa0a1be11a07ed86d755c93467f4f82362b452371d1ba94d1715123511acb;
```


### DOMAIN_SEPARATOR

```solidity
bytes32 public immutable DOMAIN_SEPARATOR = keccak256(
    abi.encode(
        keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
        keccak256(bytes(name)),
        keccak256(bytes("1")),
        block.chainid,
        address(this)
    )
);
```


### balanceOf

```solidity
mapping(address => uint256) public balanceOf;
```


### allowance

```solidity
mapping(address => mapping(address => uint256)) public allowance;
```


### nonces

```solidity
mapping(address => uint256) public nonces;
```


## Functions
### constructor


```solidity
constructor(uint256 _totalSupply) public;
```

### transfer


```solidity
function transfer(address dst, uint256 wad) public virtual returns (bool);
```

### transferFrom


```solidity
function transferFrom(address src, address dst, uint256 wad) public virtual returns (bool);
```

### approve


```solidity
function approve(address usr, uint256 wad) public virtual returns (bool);
```

### permit


```solidity
function permit(
    address holder,
    address spender,
    uint256 nonce,
    uint256 expiry,
    bool allowed,
    uint8 v,
    bytes32 r,
    bytes32 s
) external;
```

## Events
### Approval

```solidity
event Approval(address indexed src, address indexed guy, uint256 wad);
```

### Transfer

```solidity
event Transfer(address indexed src, address indexed dst, uint256 wad);
```

