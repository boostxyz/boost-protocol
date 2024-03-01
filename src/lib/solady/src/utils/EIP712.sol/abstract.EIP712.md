# EIP712
**Authors:**
Solady (https://github.com/vectorized/solady/blob/main/src/utils/EIP712.sol), Modified from Solbase (https://github.com/Sol-DAO/solbase/blob/main/src/utils/EIP712.sol), Modified from OpenZeppelin (https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/cryptography/EIP712.sol)

Contract for EIP-712 typed structured data hashing and signing.

*Note, this implementation:
- Uses `address(this)` for the `verifyingContract` field.
- Does NOT use the optional EIP-712 salt.
- Does NOT use any EIP-712 extensions.
This is for simplicity and to save gas.
If you need to customize, please fork / modify accordingly.*


## State Variables
### _DOMAIN_TYPEHASH
*`keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)")`.*


```solidity
bytes32 internal constant _DOMAIN_TYPEHASH = 0x8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f;
```


### _cachedThis

```solidity
uint256 private immutable _cachedThis;
```


### _cachedChainId

```solidity
uint256 private immutable _cachedChainId;
```


### _cachedNameHash

```solidity
bytes32 private immutable _cachedNameHash;
```


### _cachedVersionHash

```solidity
bytes32 private immutable _cachedVersionHash;
```


### _cachedDomainSeparator

```solidity
bytes32 private immutable _cachedDomainSeparator;
```


## Functions
### constructor

*Cache the hashes for cheaper runtime gas costs.
In the case of upgradeable contracts (i.e. proxies),
or if the chain id changes due to a hard fork,
the domain separator will be seamlessly calculated on-the-fly.*


```solidity
constructor();
```

### _domainNameAndVersion

*Please override this function to return the domain name and version.
```
function _domainNameAndVersion()
internal
pure
virtual
returns (string memory name, string memory version)
{
name = "Solady";
version = "1";
}
```
Note: If the returned result may change after the contract has been deployed,
you must override `_domainNameAndVersionMayChange()` to return true.*


```solidity
function _domainNameAndVersion() internal view virtual returns (string memory name, string memory version);
```

### _domainNameAndVersionMayChange

*Returns if `_domainNameAndVersion()` may change
after the contract has been deployed (i.e. after the constructor).
Default: false.*


```solidity
function _domainNameAndVersionMayChange() internal pure virtual returns (bool result);
```

### _domainSeparator

*Returns the EIP-712 domain separator.*


```solidity
function _domainSeparator() internal view virtual returns (bytes32 separator);
```

### _hashTypedData

*Returns the hash of the fully encoded EIP-712 message for this domain,
given `structHash`, as defined in
https://eips.ethereum.org/EIPS/eip-712#definition-of-hashstruct.
The hash can be used together with [ECDSA-recover](/lib/openzeppelin-contracts/contracts/utils/cryptography/ECDSA.sol/library.ECDSA.md#recover) to obtain the signer of a message:
```
bytes32 digest = _hashTypedData(keccak256(abi.encode(
keccak256("Mail(address to,string contents)"),
mailTo,
keccak256(bytes(mailContents))
)));
address signer = ECDSA.recover(digest, signature);
```*


```solidity
function _hashTypedData(bytes32 structHash) internal view virtual returns (bytes32 digest);
```

### eip712Domain

*See: https://eips.ethereum.org/EIPS/eip-5267*


```solidity
function eip712Domain()
    public
    view
    virtual
    returns (
        bytes1 fields,
        string memory name,
        string memory version,
        uint256 chainId,
        address verifyingContract,
        bytes32 salt,
        uint256[] memory extensions
    );
```

### _buildDomainSeparator

*Returns the EIP-712 domain separator.*


```solidity
function _buildDomainSeparator() private view returns (bytes32 separator);
```

### _cachedDomainSeparatorInvalidated

*Returns if the cached domain separator has been invalidated.*


```solidity
function _cachedDomainSeparatorInvalidated() private view returns (bool result);
```

