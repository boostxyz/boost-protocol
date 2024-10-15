// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Test, console} from "lib/forge-std/src/Test.sol";
import {LibClone} from "@solady/utils/LibClone.sol";

import {ERC165, IERC165} from "@openzeppelin/contracts/utils/introspection/ERC165.sol";

import {AAllowList} from "contracts/allowlists/AAllowList.sol";
import {SimpleAllowList} from "contracts/allowlists/SimpleAllowList.sol";

import {ABudget} from "contracts/budgets/ABudget.sol";
import {ManagedBudget} from "contracts/budgets/ManagedBudget.sol";

import {AIncentive} from "contracts/incentives/AIncentive.sol";

import {BoostRegistry, ABoostRegistry} from "contracts/BoostRegistry.sol";
import {ACloneable} from "contracts/shared/ACloneable.sol";
import {BoostError} from "contracts/shared/BoostError.sol";

contract NotACloneable is ERC165 {
    function supportsInterface(bytes4 interfaceId) public view override returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}

contract BoostRegistryTest is Test {
    BoostRegistry registry;

    SimpleAllowList baseAllowListImpl;
    bytes32 constant SIMPLE_ALLOW_LIST_IDENTIFIER = keccak256(
        abi.encodePacked(ABoostRegistry.RegistryType.ALLOW_LIST, keccak256(abi.encodePacked("SimpleAllowList")))
    );

    ManagedBudget baseBudgetImpl;
    bytes32 constant MANAGED_BUDGET_IDENTIFIER =
        keccak256(abi.encodePacked(ABoostRegistry.RegistryType.BUDGET, keccak256(abi.encodePacked("ManagedBudget"))));

    function setUp() public {
        registry = new BoostRegistry();
        baseAllowListImpl = new SimpleAllowList();
        baseBudgetImpl = new ManagedBudget();

        // The AllowList is needed for later tests, so we register it during setup
        registry.register(ABoostRegistry.RegistryType.ALLOW_LIST, "SimpleAllowList", address(baseAllowListImpl));
    }

    ////////////////////////////
    // BoostRegistry.register //
    ////////////////////////////

    function testRegister() public {
        bytes32 identifier = registry.getIdentifier(ABoostRegistry.RegistryType.BUDGET, "ManagedBudget");
        vm.expectEmit(true, true, true, true);
        emit ABoostRegistry.Registered(ABoostRegistry.RegistryType.BUDGET, identifier, address(baseBudgetImpl));
        registry.register(ABoostRegistry.RegistryType.BUDGET, "ManagedBudget", address(baseBudgetImpl));
        assertEq(address(registry.getBaseImplementation(MANAGED_BUDGET_IDENTIFIER)), address(baseBudgetImpl));
    }

    function testRegister_Duplicate() public {
        // SimpleAllowList was registered during setup
        assertEq(address(registry.getBaseImplementation(SIMPLE_ALLOW_LIST_IDENTIFIER)), address(baseAllowListImpl));

        // Registering the same implementation should revert
        vm.expectRevert(
            abi.encodeWithSelector(
                ABoostRegistry.AlreadyRegistered.selector,
                ABoostRegistry.RegistryType.ALLOW_LIST,
                SIMPLE_ALLOW_LIST_IDENTIFIER
            )
        );

        registry.register(ABoostRegistry.RegistryType.ALLOW_LIST, "SimpleAllowList", address(baseAllowListImpl));
    }

    function testRegister_NotACloneable() public {
        NotACloneable notACloneable = new NotACloneable();

        // Attempting to register a non-ACloneable implementation should revert
        vm.expectRevert(abi.encodeWithSelector(ABoostRegistry.NotACloneable.selector, address(notACloneable)));

        registry.register(ABoostRegistry.RegistryType.ACTION, "NotClonable", address(notACloneable));
    }

    /////////////////////////////////////////
    // BoostRegistry.getBaseImplementation //
    /////////////////////////////////////////

    function testGetBaseImplementation() public {
        // SimpleAllowList was registered during setup, so ensure we can retrieve it
        assertEq(address(registry.getBaseImplementation(SIMPLE_ALLOW_LIST_IDENTIFIER)), address(baseAllowListImpl));

        // Ensure we can register and retrieve the ManagedBudget implementation
        registry.register(ABoostRegistry.RegistryType.BUDGET, "ManagedBudget", address(baseBudgetImpl));
        assertEq(address(registry.getBaseImplementation(MANAGED_BUDGET_IDENTIFIER)), address(baseBudgetImpl));
    }

    function testGetBaseImplementation_NotRegistered() public {
        // Ensure we can't retrieve an unregistered implementation
        vm.expectRevert(abi.encodeWithSelector(ABoostRegistry.NotRegistered.selector, MANAGED_BUDGET_IDENTIFIER));
        registry.getBaseImplementation(MANAGED_BUDGET_IDENTIFIER);
    }

    /////////////////////////////////
    // BoostRegistry.getIdentifier //
    /////////////////////////////////

    function testGetIdentifier() public view {
        assertEq(
            registry.getIdentifier(ABoostRegistry.RegistryType.ALLOW_LIST, "SimpleAllowList"),
            SIMPLE_ALLOW_LIST_IDENTIFIER
        );

        assertEq(registry.getIdentifier(ABoostRegistry.RegistryType.BUDGET, "ManagedBudget"), MANAGED_BUDGET_IDENTIFIER);
    }

    //////////////////////////////////////
    // BoostRegistry.getCloneIdentifier //
    //////////////////////////////////////

    function testGetCloneIdentifier() public view {
        bytes32 identifier = registry.getCloneIdentifier(
            ABoostRegistry.RegistryType.ALLOW_LIST, address(baseAllowListImpl), address(this), "Test AllowList"
        );

        bytes32 expected = keccak256(
            abi.encodePacked(
                ABoostRegistry.RegistryType.ALLOW_LIST,
                keccak256(abi.encodePacked(address(baseAllowListImpl), address(this), "Test AllowList"))
            )
        );

        assertEq(identifier, expected);
    }

    ///////////////////////////////
    // BoostRegistry.deployClone //
    ///////////////////////////////

    function testDeployClone() public {
        // Predict the address of the clone using the salt and the registry address
        bytes32 salt = keccak256(
            abi.encodePacked(ABoostRegistry.RegistryType.ALLOW_LIST, baseAllowListImpl, "Test AllowList", address(this))
        );
        address predictedAddress =
            LibClone.predictDeterministicAddress(address(baseAllowListImpl), salt, address(registry));

        // Assert that the Deployed event is emitted with the correct parameters
        vm.expectEmit(true, true, true, true);
        emit ABoostRegistry.Deployed(
            ABoostRegistry.RegistryType.ALLOW_LIST,
            registry.getCloneIdentifier(
                ABoostRegistry.RegistryType.ALLOW_LIST, address(baseAllowListImpl), address(this), "Test AllowList"
            ),
            address(baseAllowListImpl),
            ACloneable(predictedAddress)
        );

        registry.deployClone(
            ABoostRegistry.RegistryType.ALLOW_LIST,
            address(baseAllowListImpl),
            "Test AllowList",
            abi.encode(address(this), new address[](0), new bool[](0))
        );
    }

    function testDeployClone_Initialize() public {
        registry.register(ABoostRegistry.RegistryType.BUDGET, "ManagedBudget", address(baseBudgetImpl));

        address[] memory authorized = new address[](1);
        authorized[0] = address(this);

        uint256[] memory roles = new uint256[](1);
        roles[0] = 1 << 0;

        bytes32 salt = keccak256(
            abi.encodePacked(ABoostRegistry.RegistryType.BUDGET, baseBudgetImpl, "Testing ABudget", address(this))
        );
        address predictedAddress =
            LibClone.predictDeterministicAddress(address(baseBudgetImpl), salt, address(registry));

        vm.expectEmit(true, true, true, true);
        emit ABoostRegistry.Deployed(
            ABoostRegistry.RegistryType.BUDGET,
            registry.getCloneIdentifier(
                ABoostRegistry.RegistryType.BUDGET, address(baseBudgetImpl), address(this), "Testing ABudget"
            ),
            address(baseBudgetImpl),
            ACloneable(predictedAddress)
        );

        ACloneable instance = registry.deployClone(
            ABoostRegistry.RegistryType.BUDGET,
            address(baseBudgetImpl),
            "Testing ABudget",
            abi.encode(ManagedBudget.InitPayload({owner: address(this), authorized: authorized, roles: roles}))
        );

        assertTrue(instance.supportsInterface(type(ABudget).interfaceId));
        assertEq(ManagedBudget(payable(address(instance))).owner(), address(this));
    }

    function testDeployClone_Initialize_Fail() public {
        registry.register(ABoostRegistry.RegistryType.BUDGET, "ManagedBudget", address(baseBudgetImpl));

        vm.expectRevert(); // Totally invalid initialization data => EVM panic
        registry.deployClone(
            ABoostRegistry.RegistryType.BUDGET,
            address(baseBudgetImpl),
            "Testing ABudget",
            abi.encode(
                unicode"🦄 unicorns (and 🌈 rainbows!) are *so cool* but not valid here... panic at the EVM disco!"
            )
        );
    }

    ////////////////////////////
    // BoostRegistry.getClone //
    ////////////////////////////

    function testGetClone() public {
        registry.register(ABoostRegistry.RegistryType.BUDGET, "ManagedBudget", address(baseBudgetImpl));

        bytes32 cloneId = registry.getCloneIdentifier(
            ABoostRegistry.RegistryType.BUDGET, address(baseBudgetImpl), address(this), "Testing ABudget"
        );
        registry.deployClone(
            ABoostRegistry.RegistryType.BUDGET,
            address(baseBudgetImpl),
            "Testing ABudget",
            abi.encode(
                ManagedBudget.InitPayload({owner: address(this), authorized: new address[](0), roles: new uint256[](0)})
            )
        );

        ABoostRegistry.Clone memory clone = registry.getClone(cloneId);

        assertTrue(clone.baseType == ABoostRegistry.RegistryType.BUDGET);
        assertEq(address(clone.deployer), address(this));
        assertEq(clone.name, "Testing ABudget");
    }

    function testGetClone_NotRegistered() public {
        bytes32 cloneId = registry.getCloneIdentifier(
            ABoostRegistry.RegistryType.BUDGET, address(baseBudgetImpl), address(this), "Testing ABudget"
        );

        vm.expectRevert(abi.encodeWithSelector(ABoostRegistry.NotRegistered.selector, cloneId));
        registry.getClone(cloneId);
    }

    /////////////////////////////
    // BoostRegistry.getClones //
    /////////////////////////////

    function testGetClones() public {
        _deployAllowListClone("Uno", new address[](0));
        assertEq(registry.getClones(address(this)).length, 1);

        (bytes32 id, ACloneable clone) = _deployAllowListClone("Dos", new address[](0));
        assertEq(registry.getClones(address(this)).length, 2);

        assertEq(registry.getClones(address(this))[1], id);
        assertEq(registry.getClone(id).deployer, address(this));
        assertEq(address(registry.getClone(id).instance), address(clone));
    }

    /////////////////////////////
    //    ERC165 interface     //
    /////////////////////////////

    function testSupportsInterface() public view {
        // ERC165 interface ID for ERC165 itself
        bytes4 erc165InterfaceId = type(IERC165).interfaceId;
        assertTrue(registry.supportsInterface(erc165InterfaceId));

        // ERC165 interface ID for ABoostRegistry
        bytes4 registryInterfaceId = type(ABoostRegistry).interfaceId;
        assertTrue(registry.supportsInterface(registryInterfaceId));

        // Random interface ID (should not be supported)
        bytes4 randomInterfaceId = 0x12345678;
        assertFalse(registry.supportsInterface(randomInterfaceId));
    }

    ///////////////////////////
    // Test Helper Functions //
    ///////////////////////////

    function _deployAllowListClone(string memory name, address[] memory signers)
        internal
        returns (bytes32 cloneId, ACloneable clone)
    {
        bool[] memory authorized = new bool[](signers.length);
        for (uint256 i = 0; i < signers.length; i++) {
            authorized[i] = true;
        }

        cloneId = registry.getCloneIdentifier(
            ABoostRegistry.RegistryType.ALLOW_LIST, address(baseAllowListImpl), address(this), name
        );

        clone = registry.deployClone(
            ABoostRegistry.RegistryType.ALLOW_LIST,
            address(baseAllowListImpl),
            name,
            abi.encode(address(this), signers, authorized)
        );
    }
}
