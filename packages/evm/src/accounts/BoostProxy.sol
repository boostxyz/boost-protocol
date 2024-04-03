// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

abstract contract BoostProxy {
    function createProxy(address owner_) public virtual returns (address);
}
