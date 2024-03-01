# StdCheatsTest
**Inherits:**
[Test](/lib/forge-std/src/Test.sol/abstract.Test.md)


## State Variables
### test

```solidity
Bar test;
```


## Functions
### setUp


```solidity
function setUp() public;
```

### test_Skip


```solidity
function test_Skip() public;
```

### test_Rewind


```solidity
function test_Rewind() public;
```

### test_Hoax


```solidity
function test_Hoax() public;
```

### test_HoaxOrigin


```solidity
function test_HoaxOrigin() public;
```

### test_HoaxDifferentAddresses


```solidity
function test_HoaxDifferentAddresses() public;
```

### test_StartHoax


```solidity
function test_StartHoax() public;
```

### test_StartHoaxOrigin


```solidity
function test_StartHoaxOrigin() public;
```

### test_ChangePrankMsgSender


```solidity
function test_ChangePrankMsgSender() public;
```

### test_ChangePrankMsgSenderAndTxOrigin


```solidity
function test_ChangePrankMsgSenderAndTxOrigin() public;
```

### test_MakeAccountEquivalence


```solidity
function test_MakeAccountEquivalence() public;
```

### test_MakeAddrEquivalence


```solidity
function test_MakeAddrEquivalence() public;
```

### test_MakeAddrSigning


```solidity
function test_MakeAddrSigning() public;
```

### test_Deal


```solidity
function test_Deal() public;
```

### test_DealToken


```solidity
function test_DealToken() public;
```

### test_DealTokenAdjustTotalSupply


```solidity
function test_DealTokenAdjustTotalSupply() public;
```

### test_DealERC1155Token


```solidity
function test_DealERC1155Token() public;
```

### test_DealERC1155TokenAdjustTotalSupply


```solidity
function test_DealERC1155TokenAdjustTotalSupply() public;
```

### test_DealERC721Token


```solidity
function test_DealERC721Token() public;
```

### test_DeployCode


```solidity
function test_DeployCode() public;
```

### test_DestroyAccount


```solidity
function test_DestroyAccount() public;
```

### test_DeployCodeNoArgs


```solidity
function test_DeployCodeNoArgs() public;
```

### test_DeployCodeVal


```solidity
function test_DeployCodeVal() public;
```

### test_DeployCodeValNoArgs


```solidity
function test_DeployCodeValNoArgs() public;
```

### deployCodeHelper


```solidity
function deployCodeHelper(string memory what) external;
```

### test_DeployCodeFail


```solidity
function test_DeployCodeFail() public;
```

### getCode


```solidity
function getCode(address who) internal view returns (bytes memory o_code);
```

### test_DeriveRememberKey


```solidity
function test_DeriveRememberKey() public;
```

### test_BytesToUint


```solidity
function test_BytesToUint() public;
```

### test_ParseJsonTxDetail


```solidity
function test_ParseJsonTxDetail() public;
```

### test_ReadEIP1559Transaction


```solidity
function test_ReadEIP1559Transaction() public view;
```

### test_ReadEIP1559Transactions


```solidity
function test_ReadEIP1559Transactions() public view;
```

### test_ReadReceipt


```solidity
function test_ReadReceipt() public;
```

### test_ReadReceipts


```solidity
function test_ReadReceipts() public view;
```

### test_GasMeteringModifier


```solidity
function test_GasMeteringModifier() public;
```

### addInLoop


```solidity
function addInLoop() internal pure returns (uint256);
```

### addInLoopNoGas


```solidity
function addInLoopNoGas() internal noGasMetering returns (uint256);
```

### addInLoopNoGasNoGas


```solidity
function addInLoopNoGasNoGas() internal noGasMetering returns (uint256);
```

### bytesToUint_test


```solidity
function bytesToUint_test(bytes memory b) private pure returns (uint256);
```

### testFuzz_AssumeAddressIsNot


```solidity
function testFuzz_AssumeAddressIsNot(address addr) external;
```

### test_AssumePayable


```solidity
function test_AssumePayable() external;
```

### test_AssumeNotPayable


```solidity
function test_AssumeNotPayable() external;
```

### testFuzz_AssumeNotPrecompile


```solidity
function testFuzz_AssumeNotPrecompile(address addr) external;
```

### testFuzz_AssumeNotForgeAddress


```solidity
function testFuzz_AssumeNotForgeAddress(address addr) external;
```

### test_CannotDeployCodeTo


```solidity
function test_CannotDeployCodeTo() external;
```

### _revertDeployCodeTo


```solidity
function _revertDeployCodeTo() external;
```

### test_DeployCodeTo


```solidity
function test_DeployCodeTo() external;
```

