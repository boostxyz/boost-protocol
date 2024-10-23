// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {BoostError} from "contracts/shared/BoostError.sol";
import {IncentiveBits} from "contracts/shared/IncentiveBits.sol";
import {Test, console} from "lib/forge-std/src/Test.sol";

contract IncentiveBitsTest is Test {
    using IncentiveBits for IncentiveBits.IncentiveMap;

    IncentiveBits.IncentiveMap _used;

    bytes32 private fakeHash = hex"123abc";

    function testIncentiveBitsWorks() public {
        for (uint8 x = 0; x < 8; x++) {
            _used.setOrThrow(fakeHash, x);
        }
        uint8 map = _used.map[fakeHash];
        assertEq(type(uint8).max, map);
    }

    function testIncentiveBitsBitTooLarge(uint8 badIndex) public {
        vm.assume(badIndex > 7);
        vm.expectRevert(abi.encodeWithSelector(BoostError.IncentiveToBig.selector, badIndex));
        _used.setOrThrow(fakeHash, badIndex);
    }

    function testIncentiveRevertsIfToggledAgain() public {
        _used.setOrThrow(fakeHash, 7);
        vm.expectRevert(abi.encodeWithSelector(BoostError.IncentiveClaimed.selector, 7));
        _used.setOrThrow(fakeHash, 7);
    }

    function testIncentiveWorksOutofOrder() public {
        unchecked {
            for (uint256 x = 7; x < 8; x--) {
                _used.setOrThrow(fakeHash, x);
            }
        }
        uint8 map = _used.map[fakeHash];
        assertEq(type(uint8).max, map);
    }
}
