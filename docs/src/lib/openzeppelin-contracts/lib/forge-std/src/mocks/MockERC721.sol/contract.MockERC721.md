# MockERC721
This is a mock contract of the ERC721 standard for testing purposes only, it SHOULD NOT be used in production.

*Forked from: https://github.com/transmissions11/solmate/blob/0384dbaaa4fcb5715738a9254a7c0a4cb62cf458/src/tokens/ERC721.sol*


## State Variables
### name

```solidity
string public name;
```


### symbol

```solidity
string public symbol;
```


### _ownerOf

```solidity
mapping(uint256 => address) internal _ownerOf;
```


### _balanceOf

```solidity
mapping(address => uint256) internal _balanceOf;
```


### getApproved

```solidity
mapping(uint256 => address) public getApproved;
```


### isApprovedForAll

```solidity
mapping(address => mapping(address => bool)) public isApprovedForAll;
```


### initialized
*A bool to track whether the contract has been initialized.*


```solidity
bool private initialized;
```


## Functions
### tokenURI


```solidity
function tokenURI(uint256 id) public view virtual returns (string memory);
```

### ownerOf


```solidity
function ownerOf(uint256 id) public view virtual returns (address owner);
```

### balanceOf


```solidity
function balanceOf(address owner) public view virtual returns (uint256);
```

### initialize

*To hide constructor warnings across solc versions due to different constructor visibility requirements and
syntaxes, we add an initialization function that can be called only once.*


```solidity
function initialize(string memory _name, string memory _symbol) public;
```

### approve


```solidity
function approve(address spender, uint256 id) public virtual;
```

### setApprovalForAll


```solidity
function setApprovalForAll(address operator, bool approved) public virtual;
```

### transferFrom


```solidity
function transferFrom(address from, address to, uint256 id) public virtual;
```

### safeTransferFrom


```solidity
function safeTransferFrom(address from, address to, uint256 id) public virtual;
```

### safeTransferFrom


```solidity
function safeTransferFrom(address from, address to, uint256 id, bytes memory data) public virtual;
```

### supportsInterface


```solidity
function supportsInterface(bytes4 interfaceId) public pure virtual returns (bool);
```

### _mint


```solidity
function _mint(address to, uint256 id) internal virtual;
```

### _burn


```solidity
function _burn(uint256 id) internal virtual;
```

### _safeMint


```solidity
function _safeMint(address to, uint256 id) internal virtual;
```

### _safeMint


```solidity
function _safeMint(address to, uint256 id, bytes memory data) internal virtual;
```

### _isContract


```solidity
function _isContract(address _addr) private view returns (bool);
```

## Events
### Transfer

```solidity
event Transfer(address indexed from, address indexed to, uint256 indexed id);
```

### Approval

```solidity
event Approval(address indexed owner, address indexed spender, uint256 indexed id);
```

### ApprovalForAll

```solidity
event ApprovalForAll(address indexed owner, address indexed operator, bool approved);
```

