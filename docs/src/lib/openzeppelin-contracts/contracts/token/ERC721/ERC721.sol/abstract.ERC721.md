# ERC721
**Inherits:**
[Context](/lib/openzeppelin-contracts/contracts/utils/Context.sol/abstract.Context.md), [ERC165](/lib/openzeppelin-contracts/contracts/utils/introspection/ERC165.sol/abstract.ERC165.md), [IERC721](/lib/forge-std/src/interfaces/IERC721.sol/interface.IERC721.md), [IERC721Metadata](/lib/forge-std/src/interfaces/IERC721.sol/interface.IERC721Metadata.md), [IERC721Errors](/lib/openzeppelin-contracts/contracts/interfaces/draft-IERC6093.sol/interface.IERC721Errors.md)

*Implementation of https://eips.ethereum.org/EIPS/eip-721[ERC-721] Non-Fungible Token Standard, including
the Metadata extension, but not including the Enumerable extension, which is available separately as
{ERC721Enumerable}.*


## State Variables
### _name

```solidity
string private _name;
```


### _symbol

```solidity
string private _symbol;
```


### _owners

```solidity
mapping(uint256 tokenId => address) private _owners;
```


### _balances

```solidity
mapping(address owner => uint256) private _balances;
```


### _tokenApprovals

```solidity
mapping(uint256 tokenId => address) private _tokenApprovals;
```


### _operatorApprovals

```solidity
mapping(address owner => mapping(address operator => bool)) private _operatorApprovals;
```


## Functions
### constructor

*Initializes the contract by setting a `name` and a `symbol` to the token collection.*


```solidity
constructor(string memory name_, string memory symbol_);
```

### supportsInterface

*See [IERC165-supportsInterface](/lib/openzeppelin-contracts/contracts/token/ERC721/extensions/ERC721URIStorage.sol/abstract.ERC721URIStorage.md#supportsinterface).*


```solidity
function supportsInterface(bytes4 interfaceId) public view virtual override(ERC165, IERC165) returns (bool);
```

### balanceOf

*See [IERC721-balanceOf](/lib/openzeppelin-contracts/contracts/token/ERC721/IERC721.sol/interface.IERC721.md#balanceof).*


```solidity
function balanceOf(address owner) public view virtual returns (uint256);
```

### ownerOf

*See [IERC721-ownerOf](/lib/openzeppelin-contracts/contracts/token/ERC721/IERC721.sol/interface.IERC721.md#ownerof).*


```solidity
function ownerOf(uint256 tokenId) public view virtual returns (address);
```

### name

*See [IERC721Metadata-name](/lib/openzeppelin-contracts/contracts/token/ERC721/extensions/IERC721Metadata.sol/interface.IERC721Metadata.md#name).*


```solidity
function name() public view virtual returns (string memory);
```

### symbol

*See [IERC721Metadata-symbol](/lib/openzeppelin-contracts/contracts/token/ERC721/extensions/IERC721Metadata.sol/interface.IERC721Metadata.md#symbol).*


```solidity
function symbol() public view virtual returns (string memory);
```

### tokenURI

*See [IERC721Metadata-tokenURI](/lib/openzeppelin-contracts/contracts/token/ERC721/extensions/ERC721URIStorage.sol/abstract.ERC721URIStorage.md#tokenuri).*


```solidity
function tokenURI(uint256 tokenId) public view virtual returns (string memory);
```

### _baseURI

*Base URI for computing [tokenURI](/lib/openzeppelin-contracts/contracts/token/ERC721/ERC721.sol/abstract.ERC721.md#tokenuri). If set, the resulting URI for each
token will be the concatenation of the `baseURI` and the `tokenId`. Empty
by default, can be overridden in child contracts.*


```solidity
function _baseURI() internal view virtual returns (string memory);
```

### approve

*See [IERC721-approve](/lib/openzeppelin-contracts/contracts/token/ERC721/IERC721.sol/interface.IERC721.md#approve).*


```solidity
function approve(address to, uint256 tokenId) public virtual;
```

### getApproved

*See [IERC721-getApproved](/lib/openzeppelin-contracts/contracts/token/ERC721/IERC721.sol/interface.IERC721.md#getapproved).*


```solidity
function getApproved(uint256 tokenId) public view virtual returns (address);
```

### setApprovalForAll

*See [IERC721-setApprovalForAll](/lib/openzeppelin-contracts/contracts/token/ERC721/IERC721.sol/interface.IERC721.md#setapprovalforall).*


```solidity
function setApprovalForAll(address operator, bool approved) public virtual;
```

### isApprovedForAll

*See [IERC721-isApprovedForAll](/lib/openzeppelin-contracts/contracts/token/ERC721/IERC721.sol/interface.IERC721.md#isapprovedforall).*


```solidity
function isApprovedForAll(address owner, address operator) public view virtual returns (bool);
```

### transferFrom

*See [IERC721-transferFrom](/lib/openzeppelin-contracts/contracts/token/ERC721/IERC721.sol/interface.IERC721.md#transferfrom).*


```solidity
function transferFrom(address from, address to, uint256 tokenId) public virtual;
```

### safeTransferFrom

*See [IERC721-safeTransferFrom](/lib/openzeppelin-contracts/contracts/token/ERC721/IERC721.sol/interface.IERC721.md#safetransferfrom).*


```solidity
function safeTransferFrom(address from, address to, uint256 tokenId) public;
```

### safeTransferFrom

*See [IERC721-safeTransferFrom](/lib/openzeppelin-contracts/contracts/token/ERC721/IERC721.sol/interface.IERC721.md#safetransferfrom).*


```solidity
function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data) public virtual;
```

### _ownerOf

*Returns the owner of the `tokenId`. Does NOT revert if token doesn't exist
IMPORTANT: Any overrides to this function that add ownership of tokens not tracked by the
core ERC-721 logic MUST be matched with the use of [_increaseBalance](/lib/openzeppelin-contracts/contracts/token/ERC721/ERC721.sol/abstract.ERC721.md#_increasebalance) to keep balances
consistent with ownership. The invariant to preserve is that for any address `a` the value returned by
`balanceOf(a)` must be equal to the number of tokens such that `_ownerOf(tokenId)` is `a`.*


```solidity
function _ownerOf(uint256 tokenId) internal view virtual returns (address);
```

### _getApproved

*Returns the approved address for `tokenId`. Returns 0 if `tokenId` is not minted.*


```solidity
function _getApproved(uint256 tokenId) internal view virtual returns (address);
```

### _isAuthorized

*Returns whether `spender` is allowed to manage `owner`'s tokens, or `tokenId` in
particular (ignoring whether it is owned by `owner`).
WARNING: This function assumes that `owner` is the actual owner of `tokenId` and does not verify this
assumption.*


```solidity
function _isAuthorized(address owner, address spender, uint256 tokenId) internal view virtual returns (bool);
```

### _checkAuthorized

*Checks if `spender` can operate on `tokenId`, assuming the provided `owner` is the actual owner.
Reverts if `spender` does not have approval from the provided `owner` for the given token or for all its assets
the `spender` for the specific `tokenId`.
WARNING: This function assumes that `owner` is the actual owner of `tokenId` and does not verify this
assumption.*


```solidity
function _checkAuthorized(address owner, address spender, uint256 tokenId) internal view virtual;
```

### _increaseBalance

*Unsafe write access to the balances, used by extensions that "mint" tokens using an [ownerOf](/lib/openzeppelin-contracts/contracts/token/ERC721/ERC721.sol/abstract.ERC721.md#ownerof) override.
NOTE: the value is limited to type(uint128).max. This protect against _balance overflow. It is unrealistic that
a uint256 would ever overflow from increments when these increments are bounded to uint128 values.
WARNING: Increasing an account's balance using this function tends to be paired with an override of the
{_ownerOf} function to resolve the ownership of the corresponding tokens so that balances and ownership
remain consistent with one another.*


```solidity
function _increaseBalance(address account, uint128 value) internal virtual;
```

### _update

*Transfers `tokenId` from its current owner to `to`, or alternatively mints (or burns) if the current owner
(or `to`) is the zero address. Returns the owner of the `tokenId` before the update.
The `auth` argument is optional. If the value passed is non 0, then this function will check that
`auth` is either the owner of the token, or approved to operate on the token (by the owner).
Emits a {Transfer} event.
NOTE: If overriding this function in a way that tracks balances, see also {_increaseBalance}.*


```solidity
function _update(address to, uint256 tokenId, address auth) internal virtual returns (address);
```

### _mint

*Mints `tokenId` and transfers it to `to`.
WARNING: Usage of this method is discouraged, use [_safeMint](/lib/openzeppelin-contracts/contracts/token/ERC721/ERC721.sol/abstract.ERC721.md#_safemint) whenever possible
Requirements:
- `tokenId` must not exist.
- `to` cannot be the zero address.
Emits a {Transfer} event.*


```solidity
function _mint(address to, uint256 tokenId) internal;
```

### _safeMint

*Mints `tokenId`, transfers it to `to` and checks for `to` acceptance.
Requirements:
- `tokenId` must not exist.
- If `to` refers to a smart contract, it must implement [IERC721Receiver-onERC721Received](/lib/openzeppelin-contracts/contracts/token/ERC721/utils/ERC721Holder.sol/abstract.ERC721Holder.md#onerc721received), which is called upon a safe transfer.
Emits a {Transfer} event.*


```solidity
function _safeMint(address to, uint256 tokenId) internal;
```

### _safeMint

*Same as [`_safeMint`](/lib/openzeppelin-contracts/lib/forge-std/src/mocks/MockERC721.sol/contract.MockERC721.md#_safemint), with an additional `data` parameter which is
forwarded in {IERC721Receiver-onERC721Received} to contract recipients.*


```solidity
function _safeMint(address to, uint256 tokenId, bytes memory data) internal virtual;
```

### _burn

*Destroys `tokenId`.
The approval is cleared when the token is burned.
This is an internal function that does not check if the sender is authorized to operate on the token.
Requirements:
- `tokenId` must exist.
Emits a {Transfer} event.*


```solidity
function _burn(uint256 tokenId) internal;
```

### _transfer

*Transfers `tokenId` from `from` to `to`.
As opposed to [transferFrom](/lib/openzeppelin-contracts/contracts/token/ERC721/ERC721.sol/abstract.ERC721.md#transferfrom), this imposes no restrictions on msg.sender.
Requirements:
- `to` cannot be the zero address.
- `tokenId` token must be owned by `from`.
Emits a {Transfer} event.*


```solidity
function _transfer(address from, address to, uint256 tokenId) internal;
```

### _safeTransfer

*Safely transfers `tokenId` token from `from` to `to`, checking that contract recipients
are aware of the ERC-721 standard to prevent tokens from being forever locked.
`data` is additional data, it has no specified format and it is sent in call to `to`.
This internal function is like [safeTransferFrom](/lib/openzeppelin-contracts/contracts/token/ERC721/ERC721.sol/abstract.ERC721.md#safetransferfrom) in the sense that it invokes
{IERC721Receiver-onERC721Received} on the receiver, and can be used to e.g.
implement alternative mechanisms to perform token transfer, such as signature-based.
Requirements:
- `tokenId` token must exist and be owned by `from`.
- `to` cannot be the zero address.
- `from` cannot be the zero address.
- If `to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer.
Emits a {Transfer} event.*


```solidity
function _safeTransfer(address from, address to, uint256 tokenId) internal;
```

### _safeTransfer

*Same as {xref-ERC721-_safeTransfer-address-address-uint256-}[`_safeTransfer`], with an additional `data` parameter which is
forwarded in {IERC721Receiver-onERC721Received} to contract recipients.*


```solidity
function _safeTransfer(address from, address to, uint256 tokenId, bytes memory data) internal virtual;
```

### _approve

*Approve `to` to operate on `tokenId`
The `auth` argument is optional. If the value passed is non 0, then this function will check that `auth` is
either the owner of the token, or approved to operate on all tokens held by this owner.
Emits an {Approval} event.
Overrides to this logic should be done to the variant with an additional `bool emitEvent` argument.*


```solidity
function _approve(address to, uint256 tokenId, address auth) internal;
```

### _approve

*Variant of `_approve` with an optional flag to enable or disable the {Approval} event. The event is not
emitted in the context of transfers.*


```solidity
function _approve(address to, uint256 tokenId, address auth, bool emitEvent) internal virtual;
```

### _setApprovalForAll

*Approve `operator` to operate on all of `owner` tokens
Requirements:
- operator can't be the address zero.
Emits an {ApprovalForAll} event.*


```solidity
function _setApprovalForAll(address owner, address operator, bool approved) internal virtual;
```

### _requireOwned

*Reverts if the `tokenId` doesn't have a current owner (it hasn't been minted, or it has been burned).
Returns the owner.
Overrides to ownership logic should be done to [_ownerOf](/lib/openzeppelin-contracts/contracts/token/ERC721/ERC721.sol/abstract.ERC721.md#_ownerof).*


```solidity
function _requireOwned(uint256 tokenId) internal view returns (address);
```

