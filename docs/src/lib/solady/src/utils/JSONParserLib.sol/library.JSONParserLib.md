# JSONParserLib
**Author:**
Solady (https://github.com/vectorized/solady/blob/main/src/utils/JSONParserLib.sol)

Library for parsing JSONs.


## State Variables
### TYPE_UNDEFINED
*For denoting that an item has not been initialized.
A item returned from `parse` will never be of an undefined type.
Parsing a invalid JSON string will simply revert.*


```solidity
uint8 internal constant TYPE_UNDEFINED = 0;
```


### TYPE_ARRAY
*Type representing an array (e.g. `[1,2,3]`).*


```solidity
uint8 internal constant TYPE_ARRAY = 1;
```


### TYPE_OBJECT
*Type representing an object (e.g. `{"a":"A","b":"B"}`).*


```solidity
uint8 internal constant TYPE_OBJECT = 2;
```


### TYPE_NUMBER
*Type representing a number (e.g. `-1.23e+21`).*


```solidity
uint8 internal constant TYPE_NUMBER = 3;
```


### TYPE_STRING
*Type representing a string (e.g. `"hello"`).*


```solidity
uint8 internal constant TYPE_STRING = 4;
```


### TYPE_BOOLEAN
*Type representing a boolean (i.e. `true` or `false`).*


```solidity
uint8 internal constant TYPE_BOOLEAN = 5;
```


### TYPE_NULL
*Type representing null (i.e. `null`).*


```solidity
uint8 internal constant TYPE_NULL = 6;
```


### _BITPOS_STRING

```solidity
uint256 private constant _BITPOS_STRING = 32 * 7 - 8;
```


### _BITPOS_KEY_LENGTH

```solidity
uint256 private constant _BITPOS_KEY_LENGTH = 32 * 6 - 8;
```


### _BITPOS_KEY

```solidity
uint256 private constant _BITPOS_KEY = 32 * 5 - 8;
```


### _BITPOS_VALUE_LENGTH

```solidity
uint256 private constant _BITPOS_VALUE_LENGTH = 32 * 4 - 8;
```


### _BITPOS_VALUE

```solidity
uint256 private constant _BITPOS_VALUE = 32 * 3 - 8;
```


### _BITPOS_CHILD

```solidity
uint256 private constant _BITPOS_CHILD = 32 * 2 - 8;
```


### _BITPOS_SIBLING_OR_PARENT

```solidity
uint256 private constant _BITPOS_SIBLING_OR_PARENT = 32 * 1 - 8;
```


### _BITMASK_POINTER

```solidity
uint256 private constant _BITMASK_POINTER = 0xffffffff;
```


### _BITMASK_TYPE

```solidity
uint256 private constant _BITMASK_TYPE = 7;
```


### _KEY_INITED

```solidity
uint256 private constant _KEY_INITED = 1 << 3;
```


### _VALUE_INITED

```solidity
uint256 private constant _VALUE_INITED = 1 << 4;
```


### _CHILDREN_INITED

```solidity
uint256 private constant _CHILDREN_INITED = 1 << 5;
```


### _PARENT_IS_ARRAY

```solidity
uint256 private constant _PARENT_IS_ARRAY = 1 << 6;
```


### _PARENT_IS_OBJECT

```solidity
uint256 private constant _PARENT_IS_OBJECT = 1 << 7;
```


## Functions
### parse

*Parses the JSON string `s`, and returns the root.
Reverts if `s` is not a valid JSON as specified in RFC 8259.
Object items WILL simply contain all their children, inclusive of repeated keys,
in the same order which they appear in the JSON string.
Note: For efficiency, this function WILL NOT make a copy of `s`.
The parsed tree WILL contain offsets to `s`.
Do NOT pass in a string that WILL be modified later on.*


```solidity
function parse(string memory s) internal pure returns (Item memory result);
```

### value

*Returns the string value of the item.
This is its exact string representation in the original JSON string.
The returned string WILL have leading and trailing whitespace trimmed.
All inner whitespace WILL be preserved, exactly as it is in the original JSON string.
If the item's type is string, the returned string WILL be double-quoted, JSON encoded.
Note: This function lazily instantiates and caches the returned string.
Do NOT modify the returned string.*


```solidity
function value(Item memory item) internal pure returns (string memory result);
```

### index

*Returns the index of the item in the array.
It the item's parent is not an array, returns 0.*


```solidity
function index(Item memory item) internal pure returns (uint256 result);
```

### key

*Returns the key of the item in the object.
It the item's parent is not an object, returns an empty string.
The returned string WILL be double-quoted, JSON encoded.
Note: This function lazily instantiates and caches the returned string.
Do NOT modify the returned string.*


```solidity
function key(Item memory item) internal pure returns (string memory result);
```

### children

*Returns the key of the item in the object.
It the item is neither an array nor object, returns an empty array.
Note: This function lazily instantiates and caches the returned array.
Do NOT modify the returned array.*


```solidity
function children(Item memory item) internal pure returns (Item[] memory result);
```

### size

*Returns the number of children.
It the item is neither an array nor object, returns zero.*


```solidity
function size(Item memory item) internal pure returns (uint256 result);
```

### at

*Returns the item at index `i` for (array).
If `item` is not an array, the result's type WILL be undefined.
If there is no item with the index, the result's type WILL be undefined.*


```solidity
function at(Item memory item, uint256 i) internal pure returns (Item memory result);
```

### at

*Returns the item at key `k` for (object).
If `item` is not an object, the result's type WILL be undefined.
The key MUST be double-quoted, JSON encoded. This is for efficiency reasons.
- Correct : `item.at('"k"')`.
- Wrong   : `item.at("k")`.
For duplicated keys, the last item with the key WILL be returned.
If there is no item with the key, the result's type WILL be undefined.*


```solidity
function at(Item memory item, string memory k) internal pure returns (Item memory result);
```

### getType

*Returns the item's type.*


```solidity
function getType(Item memory item) internal pure returns (uint8 result);
```

### isUndefined

Note: All types are mutually exclusive.

*Returns whether the item is of type undefined.*


```solidity
function isUndefined(Item memory item) internal pure returns (bool result);
```

### isArray

*Returns whether the item is of type array.*


```solidity
function isArray(Item memory item) internal pure returns (bool result);
```

### isObject

*Returns whether the item is of type object.*


```solidity
function isObject(Item memory item) internal pure returns (bool result);
```

### isNumber

*Returns whether the item is of type number.*


```solidity
function isNumber(Item memory item) internal pure returns (bool result);
```

### isString

*Returns whether the item is of type string.*


```solidity
function isString(Item memory item) internal pure returns (bool result);
```

### isBoolean

*Returns whether the item is of type boolean.*


```solidity
function isBoolean(Item memory item) internal pure returns (bool result);
```

### isNull

*Returns whether the item is of type null.*


```solidity
function isNull(Item memory item) internal pure returns (bool result);
```

### parent

*Returns the item's parent.
If the item does not have a parent, the result's type will be undefined.*


```solidity
function parent(Item memory item) internal pure returns (Item memory result);
```

### parseUint

*Parses an unsigned integer from a string (in decimal, i.e. base 10).
Reverts if `s` is not a valid uint256 string matching the RegEx `^[0-9]+$`,
or if the parsed number is too big for a uint256.*


```solidity
function parseUint(string memory s) internal pure returns (uint256 result);
```

### parseInt

*Parses a signed integer from a string (in decimal, i.e. base 10).
Reverts if `s` is not a valid int256 string matching the RegEx `^[+-]?[0-9]+$`,
or if the parsed number cannot fit within `[-2**255 .. 2**255 - 1]`.*


```solidity
function parseInt(string memory s) internal pure returns (int256 result);
```

### parseUintFromHex

*Parses an unsigned integer from a string (in hexadecimal, i.e. base 16).
Reverts if `s` is not a valid uint256 hex string matching the RegEx
`^(0[xX])?[0-9a-fA-F]+$`, or if the parsed number cannot fit within `[0 .. 2**256 - 1]`.*


```solidity
function parseUintFromHex(string memory s) internal pure returns (uint256 result);
```

### decodeString

*Decodes a JSON encoded string.
The string MUST be double-quoted, JSON encoded.
Reverts if the string is invalid.
As you can see, it's pretty complex for a deceptively simple looking task.*


```solidity
function decodeString(string memory s) internal pure returns (string memory result);
```

### _query

*Performs a query on the input with the given mode.*


```solidity
function _query(bytes32 input, uint256 mode) private pure returns (bytes32 result);
```

### _toInput

*Casts the input to a bytes32.*


```solidity
function _toInput(string memory input) private pure returns (bytes32 result);
```

### _toInput

*Casts the input to a bytes32.*


```solidity
function _toInput(Item memory input) private pure returns (bytes32 result);
```

## Errors
### ParsingFailed
*The input is invalid.*


```solidity
error ParsingFailed();
```

## Structs
### Item
*A pointer to a parsed JSON node.*


```solidity
struct Item {
    uint256 _data;
}
```

