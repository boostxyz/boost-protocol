# CompTimelock
Copyright 2020 Compound Labs, Inc.
Redistribution and use in source and binary forms, with or without modification, are permitted provided that the
following conditions are met:
1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following
disclaimer.
2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the
following disclaimer in the documentation and/or other materials provided with the distribution.
3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote
products derived from this software without specific prior written permission.
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES,
INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.


## State Variables
### GRACE_PERIOD

```solidity
uint256 public constant GRACE_PERIOD = 14 days;
```


### MINIMUM_DELAY

```solidity
uint256 public constant MINIMUM_DELAY = 2 days;
```


### MAXIMUM_DELAY

```solidity
uint256 public constant MAXIMUM_DELAY = 30 days;
```


### admin

```solidity
address public admin;
```


### pendingAdmin

```solidity
address public pendingAdmin;
```


### delay

```solidity
uint256 public delay;
```


### queuedTransactions

```solidity
mapping(bytes32 => bool) public queuedTransactions;
```


## Functions
### constructor


```solidity
constructor(address admin_, uint256 delay_);
```

### receive


```solidity
receive() external payable;
```

### setDelay


```solidity
function setDelay(uint256 delay_) public;
```

### acceptAdmin


```solidity
function acceptAdmin() public;
```

### setPendingAdmin


```solidity
function setPendingAdmin(address pendingAdmin_) public;
```

### queueTransaction


```solidity
function queueTransaction(address target, uint256 value, string memory signature, bytes memory data, uint256 eta)
    public
    returns (bytes32);
```

### cancelTransaction


```solidity
function cancelTransaction(address target, uint256 value, string memory signature, bytes memory data, uint256 eta)
    public;
```

### executeTransaction


```solidity
function executeTransaction(address target, uint256 value, string memory signature, bytes memory data, uint256 eta)
    public
    payable
    returns (bytes memory);
```

### getBlockTimestamp


```solidity
function getBlockTimestamp() internal view returns (uint256);
```

## Events
### NewAdmin

```solidity
event NewAdmin(address indexed newAdmin);
```

### NewPendingAdmin

```solidity
event NewPendingAdmin(address indexed newPendingAdmin);
```

### NewDelay

```solidity
event NewDelay(uint256 indexed newDelay);
```

### CancelTransaction

```solidity
event CancelTransaction(
    bytes32 indexed txHash, address indexed target, uint256 value, string signature, bytes data, uint256 eta
);
```

### ExecuteTransaction

```solidity
event ExecuteTransaction(
    bytes32 indexed txHash, address indexed target, uint256 value, string signature, bytes data, uint256 eta
);
```

### QueueTransaction

```solidity
event QueueTransaction(
    bytes32 indexed txHash, address indexed target, uint256 value, string signature, bytes data, uint256 eta
);
```

