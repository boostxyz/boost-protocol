// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Test, console} from "lib/forge-std/src/Test.sol";

import {LibClone} from "lib/solady/src/utils/LibClone.sol";
import {LibZip} from "lib/solady/src/utils/LibZip.sol";

import {MockERC20} from "src/shared/Mocks.sol";
import {ContractAction} from "src/actions/ContractAction.sol";

// contract TargetContract {
//     event Called(address indexed sender, bytes message, uint256 count);
//     uint256 public callCount;
//     function callMeMaybe(bytes calldata message) payable public returns (address, uint256, string memory, address) {
//         // (uint256 number, string memory str, address addr) = abi.decode(message, (uint256, string, address));
//         // emit Called(msg.sender, message, ++callCount);
//         // return (msg.sender, number, str, addr);
//     }
// }

contract ContractActionTest is Test {
    MockERC20 public target = new MockERC20();
    ContractAction baseAction = new ContractAction();
    ContractAction action;
    ContractAction nonPayableTargetAction;
    ContractAction otherChainAction;

    function setUp() public {
        action = ContractAction(LibClone.clone(address(baseAction)));
        ContractAction.InitPayload memory payload = ContractAction.InitPayload({
            chainId: block.chainid,
            target: address(target),
            selector: target.mintPayable.selector,
            value: 0.1 ether
        });
        action.initialize(LibZip.cdCompress(abi.encode(payload)));

        nonPayableTargetAction = ContractAction(LibClone.clone(address(baseAction)));
        ContractAction.InitPayload memory nonPayablePayload = ContractAction.InitPayload({
            chainId: block.chainid,
            target: address(target),
            selector: target.mint.selector,
            value: 0
        });
        nonPayableTargetAction.initialize(LibZip.cdCompress(abi.encode(nonPayablePayload)));

        otherChainAction = ContractAction(LibClone.clone(address(baseAction)));
        ContractAction.InitPayload memory otherChainPayload = ContractAction.InitPayload({
            chainId: block.chainid + 1,
            target: address(target),
            selector: target.mintPayable.selector,
            value: 0.1 ether
        });
        otherChainAction.initialize(LibZip.cdCompress(abi.encode(otherChainPayload)));
    }

    ///////////////////////////////
    // ContractAction.initialize //
    ///////////////////////////////

    function testInitialize() public {
        assertEq(action.target(), address(target));
        assertEq(action.selector(), target.mintPayable.selector);
        assertEq(action.value(), 0.1 ether);
    }

    ////////////////////////////
    // ContractAction.execute //
    ////////////////////////////

    function testExecute() public {
        // Execute the remote call (currently only possible from the same chain as the target contract)
        bytes memory payload = action.prepare(abi.encode(address(0xdeadbeef), 100 ether));
        (bool success,) = address(target).call{value: 1 ether}(payload);
        assertTrue(success);

        assertEq(target.balanceOf(address(0xdeadbeef)), 100 ether);
    }

    function testExecute_NonPayable() public {
        (bool success,) = nonPayableTargetAction.execute(abi.encode(address(0xdeadbeef), 100 ether));
        assertTrue(success);
    }

    function testExecute_DifferentChainId() public {
        // Target chain is different from the current context => revert
        vm.expectRevert(abi.encodeWithSelector(ContractAction.TargetChainUnsupported.selector, block.chainid + 1));
        (bool success,) = otherChainAction.execute{value: 0.1 ether}(abi.encode(address(0xdeadbeef), 100 ether));
        assertFalse(success);
    }

    ////////////////////////////
    // ContractAction.prepare //
    ////////////////////////////

    function testPrepare() public {
        assertEq(action.prepare(abi.encode(address(0xdeadbeef), 100 ether)), abi.encodeWithSelector(target.mintPayable.selector, address(0xdeadbeef), 100 ether));
    }
}