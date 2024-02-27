// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Test, console} from "lib/forge-std/src/Test.sol";
import {LibClone} from "lib/solady/src/utils/LibClone.sol";
import {LibZip} from "lib/solady/src/utils/LibZip.sol";

import {AllowList} from "src/allowlists/AllowList.sol";
import {SimpleAllowList} from "src/allowlists/SimpleAllowList.sol";

import {Budget} from "src/budgets/Budget.sol";
import {SimpleBudget} from "src/budgets/SimpleBudget.sol";

import {BoostRegistry} from "src/BoostRegistry.sol";
import {Cloneable} from "src/Cloneable.sol";

contract BoostRegistryTest is Test {
    BoostRegistry registry;

    bytes32 constant SALT = bytes32(uint256(0xdeadbeef));

    SimpleAllowList baseAllowListImpl;
    bytes32 constant SIMPLE_ALLOW_LIST_IDENTIFIER =
        keccak256(abi.encodePacked(BoostRegistry.RegistryType.ALLOW_LIST, "SimpleAllowList"));

    SimpleBudget baseBudgetImpl;
    bytes32 constant SIMPLE_BUDGET_IDENTIFIER =
        keccak256(abi.encodePacked(BoostRegistry.RegistryType.BUDGET, "SimpleBudget"));

    function setUp() public {
        registry = new BoostRegistry();
        baseAllowListImpl = new SimpleAllowList();
        baseBudgetImpl = new SimpleBudget();
    }

    function testRegister() public {
        registry.register(BoostRegistry.RegistryType.ALLOW_LIST, "SimpleAllowList", address(baseAllowListImpl));

        assertEq(registry.getBaseImplementation(SIMPLE_ALLOW_LIST_IDENTIFIER), address(baseAllowListImpl));
    }

    function testRegister_Duplicate() public {
        registry.register(BoostRegistry.RegistryType.ALLOW_LIST, "SimpleAllowList", address(baseAllowListImpl));

        assertEq(registry.getBaseImplementation(SIMPLE_ALLOW_LIST_IDENTIFIER), address(baseAllowListImpl));

        vm.expectRevert(
            abi.encodeWithSelector(
                BoostRegistry.AlreadyRegistered.selector,
                BoostRegistry.RegistryType.ALLOW_LIST,
                SIMPLE_ALLOW_LIST_IDENTIFIER
            )
        );

        registry.register(BoostRegistry.RegistryType.ALLOW_LIST, "SimpleAllowList", address(baseAllowListImpl));
    }

    /////////////////////////////////////////
    // BoostRegistry.getBaseImplementation //
    /////////////////////////////////////////

    function testGetBaseImplementation() public {
        registry.register(BoostRegistry.RegistryType.ALLOW_LIST, "SimpleAllowList", address(baseAllowListImpl));

        assertEq(registry.getBaseImplementation(SIMPLE_ALLOW_LIST_IDENTIFIER), address(baseAllowListImpl));
    }

    function testGetBaseImplementation_NotRegistered() public {
        vm.expectRevert(abi.encodeWithSelector(BoostRegistry.NotRegistered.selector, SIMPLE_ALLOW_LIST_IDENTIFIER));

        registry.getBaseImplementation(SIMPLE_ALLOW_LIST_IDENTIFIER);
    }

    /////////////////////////////////
    // BoostRegistry.getIdentifier //
    /////////////////////////////////

    function testGetIdentifier() public {
        assertEq(
            registry.getIdentifier(BoostRegistry.RegistryType.ALLOW_LIST, "SimpleAllowList"),
            SIMPLE_ALLOW_LIST_IDENTIFIER
        );
    }

    ///////////////////////////////
    // BoostRegistry.deployClone //
    ///////////////////////////////

    function testDeploy() public {
        registry.register(BoostRegistry.RegistryType.BUDGET, "SimpleBudget", address(baseBudgetImpl));

        address baseImpl = registry.getBaseImplementation(SIMPLE_BUDGET_IDENTIFIER);

        // Predict the address of the deployed instance
        address predictedAddress = LibClone.predictDeterministicAddress(baseImpl, SALT, address(registry));

        // Assert that the Deployed event is emitted with the correct parameters
        vm.expectEmit(true, true, true, true);
        emit BoostRegistry.Deployed(
            BoostRegistry.RegistryType.BUDGET, SIMPLE_BUDGET_IDENTIFIER, baseImpl, predictedAddress
        );

        registry.deployClone(
            BoostRegistry.RegistryType.BUDGET,
            SIMPLE_BUDGET_IDENTIFIER,
            SALT,
            LibZip.cdCompress(abi.encode(address(this)))
        );
    }

    function testDeploy_NotRegistered() public {
        bytes32 identifier_ = registry.getIdentifier(BoostRegistry.RegistryType.BUDGET, "SimpleBudget");
        bytes32 salt_ = bytes32(uint256(0xdeadbeef));

        vm.expectRevert(abi.encodeWithSelector(BoostRegistry.NotRegistered.selector, identifier_));

        registry.deployClone(
            BoostRegistry.RegistryType.BUDGET, identifier_, salt_, LibZip.cdCompress(abi.encode(address(this)))
        );
    }

    function testDeploy_Initialize() public {
        registry.register(BoostRegistry.RegistryType.BUDGET, "SimpleBudget", address(baseBudgetImpl));

        address baseImpl = registry.getBaseImplementation(SIMPLE_BUDGET_IDENTIFIER);
        address predictedAddress = LibClone.predictDeterministicAddress(baseImpl, SALT, address(registry));

        vm.expectEmit(true, true, true, true);
        emit BoostRegistry.Deployed(
            BoostRegistry.RegistryType.BUDGET, SIMPLE_BUDGET_IDENTIFIER, baseImpl, predictedAddress
        );

        address instance = registry.deployClone(
            BoostRegistry.RegistryType.BUDGET,
            SIMPLE_BUDGET_IDENTIFIER,
            SALT,
            LibZip.cdCompress(abi.encode(address(this)))
        );

        assertEq(baseImpl, address(baseBudgetImpl));
        assertTrue(Cloneable(instance).supportsInterface(type(Budget).interfaceId));
        assertEq(SimpleBudget(payable(instance)).owner(), address(this));
    }

    function testDeploy_Initialize_Fail() public {
        registry.register(BoostRegistry.RegistryType.BUDGET, "SimpleBudget", address(baseBudgetImpl));

        vm.expectRevert(abi.encodeWithSelector(Cloneable.InvalidInitializationData.selector));

        registry.deployClone(
            BoostRegistry.RegistryType.BUDGET,
            SIMPLE_BUDGET_IDENTIFIER,
            SALT,
            LibZip.cdCompress(
                abi.encode(
                    unicode"🦄 unicorns (and 🌈 rainbows!) are *so cool* but not expected by the implementation... wcgw?!"
                )
            )
        );
    }
}
