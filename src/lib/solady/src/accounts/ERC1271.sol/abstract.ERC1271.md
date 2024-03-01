# ERC1271
**Inherits:**
[EIP712](/lib/solady/src/utils/EIP712.sol/abstract.EIP712.md)

**Author:**
Solady (https://github.com/vectorized/solady/blob/main/src/accounts/ERC1271.sol)

ERC1271 mixin with nested EIP-712 approach.


## Functions
### _erc1271Signer

*Returns the ERC1271 signer.
Override to return the signer `isValidSignature` checks against.*


```solidity
function _erc1271Signer() internal view virtual returns (address);
```

### isValidSignature

*Validates the signature with ERC1271 return,
so that this account can also be used as a signer.
This implementation uses ECDSA recovery. It also uses a nested EIP-712 approach to
prevent signature replays when a single EOA owns multiple smart contract accounts,
while still enabling wallet UIs (e.g. Metamask) to show the EIP-712 values.
For the nested EIP-712 workflow, the final hash will be:
```
keccak256(\x19\x01 || DOMAIN_SEP_A ||
hashStruct(Parent({
childHash: keccak256(\x19\x01 || DOMAIN_SEP_B || hashStruct(originalStruct)),
child: hashStruct(originalStruct)
}))
)
```
where `||` denotes the concatenation operator for bytes.
The signature will be `r || s || v || PARENT_TYPEHASH || DOMAIN_SEP_B || child`.
The `DOMAIN_SEP_B` and `child` will be used to verify if `childHash` is indeed correct.
For the `personal_sign` workflow, the final hash will be:
```
keccak256(\x19\x01 || DOMAIN_SEP_A ||
hashStruct(Parent({
childHash: personalSign(someBytes)
}))
)
```
where `||` denotes the concatenation operator for bytes.
The signature will be `r || s || v || PARENT_TYPEHASH`.
For demo and typescript code, see:
- https://github.com/junomonster/nested-eip-712
- https://github.com/frangio/eip712-wrapper-for-eip1271
Of course, if you are a wallet app maker and can update your app's UI at will,
you can choose a more minimalistic signature scheme like
`keccak256(abi.encode(address(this), hash))` instead of all these acrobatics.
All these are just for widespead out-of-the-box compatibility with other wallet apps.
The `hash` parameter is the `childHash`.*


```solidity
function isValidSignature(bytes32 hash, bytes calldata signature) public view virtual returns (bytes4 result);
```

