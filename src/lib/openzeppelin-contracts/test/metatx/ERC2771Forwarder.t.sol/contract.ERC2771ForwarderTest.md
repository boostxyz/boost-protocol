# ERC2771ForwarderTest
**Inherits:**
[Test](/lib/forge-std/src/Test.sol/abstract.Test.md)


## State Variables
### _erc2771Forwarder

```solidity
ERC2771ForwarderMock internal _erc2771Forwarder;
```


### _receiver

```solidity
CallReceiverMockTrustingForwarder internal _receiver;
```


### _signerPrivateKey

```solidity
uint256 internal _signerPrivateKey;
```


### _relayerPrivateKey

```solidity
uint256 internal _relayerPrivateKey;
```


### _signer

```solidity
address internal _signer;
```


### _relayer

```solidity
address internal _relayer;
```


### _MAX_ETHER

```solidity
uint256 internal constant _MAX_ETHER = 10_000_000;
```


## Functions
### setUp


```solidity
function setUp() public;
```

### _forgeRequestData


```solidity
function _forgeRequestData(uint256 value, uint256 nonce, uint48 deadline, bytes memory data)
    private
    view
    returns (ERC2771Forwarder.ForwardRequestData memory);
```

### testExecuteAvoidsETHStuck


```solidity
function testExecuteAvoidsETHStuck(uint256 initialBalance, uint256 value, bool targetReverts) public;
```

### testExecuteBatchAvoidsETHStuck


```solidity
function testExecuteBatchAvoidsETHStuck(uint256 initialBalance, uint256 batchSize, uint256 value) public;
```

