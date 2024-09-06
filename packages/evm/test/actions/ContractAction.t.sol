// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Test, console} from "lib/forge-std/src/Test.sol";

import {LibClone} from "@solady/utils/LibClone.sol";
import {Initializable} from "@solady/utils/Initializable.sol";

import {MockERC20} from "contracts/shared/Mocks.sol";
import {AAction} from "contracts/actions/AAction.sol";
import {ContractAction} from "contracts/actions/ContractAction.sol";
import {AContractAction} from "contracts/actions/AContractAction.sol";

contract ContractActionTest is Test {
    MockERC20 public target = new MockERC20();
    ContractAction baseAction = new ContractAction();
    ContractAction action;
    ContractAction nonPayableTargetAction;
    ContractAction otherChainAction;

    function setUp() public {
        action = ContractAction(LibClone.clone(address(baseAction)));
        ContractAction.InitPayload memory payload = AContractAction.InitPayload({
            chainId: block.chainid,
            target: address(target),
            selector: target.mintPayable.selector,
            value: 0.1 ether
        });
        action.initialize(abi.encode(payload));

        nonPayableTargetAction = ContractAction(LibClone.clone(address(baseAction)));
        ContractAction.InitPayload memory nonPayablePayload = AContractAction.InitPayload({
            chainId: block.chainid,
            target: address(target),
            selector: target.mint.selector,
            value: 0
        });
        nonPayableTargetAction.initialize(abi.encode(nonPayablePayload));

        otherChainAction = ContractAction(LibClone.clone(address(baseAction)));
        ContractAction.InitPayload memory otherChainPayload = AContractAction.InitPayload({
            chainId: block.chainid + 1,
            target: address(target),
            selector: target.mintPayable.selector,
            value: 0.1 ether
        });
        otherChainAction.initialize(abi.encode(otherChainPayload));
    }

    ///////////////////////////////
    // ContractAction.initialize //
    ///////////////////////////////

    function testInitialize() public {
        assertEq(action.target(), address(target));
        assertEq(action.selector(), target.mintPayable.selector);
        assertEq(action.value(), 0.1 ether);
    }

    function testInitialize_NotInitializing() public {
        vm.expectRevert(abi.encodeWithSelector(Initializable.InvalidInitialization.selector));
        baseAction.initialize(
            abi.encode(
                AContractAction.InitPayload({
                    chainId: block.chainid,
                    target: address(target),
                    selector: target.mintPayable.selector,
                    value: 0.1 ether
                })
            )
        );
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
        vm.expectRevert(abi.encodeWithSelector(AContractAction.TargetChainUnsupported.selector, block.chainid + 1));
        (bool success,) = otherChainAction.execute{value: 0.1 ether}(abi.encode(address(0xdeadbeef), 100 ether));
        assertFalse(success);
    }

    ////////////////////////////
    // ContractAction.prepare //
    ////////////////////////////

    function testPrepare() public {
        assertEq(
            action.prepare(abi.encode(address(0xdeadbeef), 100 ether)),
            abi.encodeWithSelector(target.mintPayable.selector, address(0xdeadbeef), 100 ether)
        );
    }

    ////////////////////////////////////
    // ContractAction.getComponentInterface //
    ////////////////////////////////////

    function testGetComponentInterface() public {
        // Retrieve the component interface
        console.logBytes4(action.getComponentInterface());
    }

    ////////////////////////////////////
    // ContractAction.supportsInterface //
    ////////////////////////////////////

    function testSupportsActionInterface() public {
        // Ensure the contract supports the ABudget interface
        assertTrue(action.supportsInterface(type(AAction).interfaceId));
    }
}
