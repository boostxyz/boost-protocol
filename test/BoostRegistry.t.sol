// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Test, console} from "lib/forge-std/src/Test.sol";
import {LibClone} from "lib/solady/src/utils/LibClone.sol";
import {LibZip} from "lib/solady/src/utils/LibZip.sol";

import {ERC165} from "lib/openzeppelin-contracts/contracts/utils/introspection/ERC165.sol";

import {AllowList} from "src/allowlists/AllowList.sol";
import {SimpleAllowList} from "src/allowlists/SimpleAllowList.sol";

import {Budget} from "src/budgets/Budget.sol";
import {SimpleBudget} from "src/budgets/SimpleBudget.sol";

import {Incentive} from "src/incentives/Incentive.sol";

import {BoostRegistry} from "src/BoostRegistry.sol";
import {Cloneable} from "src/shared/Cloneable.sol";

contract NotCloneable is ERC165 {
    function supportsInterface(bytes4 interfaceId) public view override returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}

contract MockAllowList is AllowList {
    function isAllowed(address guy, bytes calldata) external view override returns (bool) {
        return guy == owner() || guy == address(0xdeadbeef);
    }
}

contract MockIncentive is Incentive {
    function initialize(bytes calldata) external override {}

    function claim(bytes calldata) external virtual override returns (bool) {
        return true;
    }

    function isClaimable(bytes calldata) external view virtual override returns (bool) {
        return true;
    }

    function preflight(bytes calldata) external view virtual override returns (bytes memory) {
        return new bytes(0);
    }

    function reclaim(bytes calldata) external virtual override returns (bool) {
        return true;
    }
}

contract BoostRegistryTest is Test {
    BoostRegistry registry;

    SimpleAllowList baseAllowListImpl;
    bytes32 constant SIMPLE_ALLOW_LIST_IDENTIFIER = keccak256(
        abi.encodePacked(BoostRegistry.RegistryType.ALLOW_LIST, keccak256(abi.encodePacked("SimpleAllowList")))
    );

    SimpleBudget baseBudgetImpl;
    bytes32 constant SIMPLE_BUDGET_IDENTIFIER =
        keccak256(abi.encodePacked(BoostRegistry.RegistryType.BUDGET, keccak256(abi.encodePacked("SimpleBudget"))));

    function setUp() public {
        registry = new BoostRegistry();
        baseAllowListImpl = new SimpleAllowList();
        baseBudgetImpl = new SimpleBudget();

        // The AllowList is needed for later tests, so we register it during setup
        registry.register(BoostRegistry.RegistryType.ALLOW_LIST, "SimpleAllowList", address(baseAllowListImpl));
    }

    ////////////////////////////
    // BoostRegistry.register //
    ////////////////////////////

    function testRegister() public {
        bytes32 identifier = registry.getIdentifier(BoostRegistry.RegistryType.BUDGET, "SimpleBudget");
        vm.expectEmit(true, true, true, true);
        emit BoostRegistry.Registered(BoostRegistry.RegistryType.BUDGET, identifier, address(baseBudgetImpl));
        registry.register(BoostRegistry.RegistryType.BUDGET, "SimpleBudget", address(baseBudgetImpl));
        assertEq(address(registry.getBaseImplementation(SIMPLE_BUDGET_IDENTIFIER)), address(baseBudgetImpl));
    }

    function testRegister_Duplicate() public {
        // SimpleAllowList was registered during setup
        assertEq(address(registry.getBaseImplementation(SIMPLE_ALLOW_LIST_IDENTIFIER)), address(baseAllowListImpl));

        // Registering the same implementation should revert
        vm.expectRevert(
            abi.encodeWithSelector(
                BoostRegistry.AlreadyRegistered.selector,
                BoostRegistry.RegistryType.ALLOW_LIST,
                SIMPLE_ALLOW_LIST_IDENTIFIER
            )
        );

        registry.register(BoostRegistry.RegistryType.ALLOW_LIST, "SimpleAllowList", address(baseAllowListImpl));
    }

    function testRegister_NotCloneable() public {
        NotCloneable notCloneable = new NotCloneable();

        // Attempting to register a non-Cloneable implementation should revert
        vm.expectRevert(abi.encodeWithSelector(BoostRegistry.NotCloneable.selector, address(notCloneable)));

        registry.register(BoostRegistry.RegistryType.ACTION, "NotClonable", address(notCloneable));
    }

    /////////////////////////////////////////
    // BoostRegistry.getBaseImplementation //
    /////////////////////////////////////////

    function testGetBaseImplementation() public {
        // SimpleAllowList was registered during setup, so ensure we can retrieve it
        assertEq(address(registry.getBaseImplementation(SIMPLE_ALLOW_LIST_IDENTIFIER)), address(baseAllowListImpl));

        // Ensure we can register and retrieve the SimpleBudget implementation
        registry.register(BoostRegistry.RegistryType.BUDGET, "SimpleBudget", address(baseBudgetImpl));
        assertEq(address(registry.getBaseImplementation(SIMPLE_BUDGET_IDENTIFIER)), address(baseBudgetImpl));
    }

    function testGetBaseImplementation_NotRegistered() public {
        // Ensure we can't retrieve an unregistered implementation
        vm.expectRevert(abi.encodeWithSelector(BoostRegistry.NotRegistered.selector, SIMPLE_BUDGET_IDENTIFIER));
        registry.getBaseImplementation(SIMPLE_BUDGET_IDENTIFIER);
    }

    /////////////////////////////////
    // BoostRegistry.getIdentifier //
    /////////////////////////////////

    function testGetIdentifier() public {
        assertEq(
            registry.getIdentifier(BoostRegistry.RegistryType.ALLOW_LIST, "SimpleAllowList"),
            SIMPLE_ALLOW_LIST_IDENTIFIER
        );

        assertEq(registry.getIdentifier(BoostRegistry.RegistryType.BUDGET, "SimpleBudget"), SIMPLE_BUDGET_IDENTIFIER);
    }

    //////////////////////////////////////
    // BoostRegistry.getCloneIdentifier //
    //////////////////////////////////////

    function testGetCloneIdentifier() public {
        bytes32 identifier = registry.getCloneIdentifier(
            BoostRegistry.RegistryType.ALLOW_LIST, address(baseAllowListImpl), address(this), "Test AllowList"
        );

        bytes32 expected = keccak256(
            abi.encodePacked(
                BoostRegistry.RegistryType.ALLOW_LIST,
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
            abi.encodePacked(BoostRegistry.RegistryType.ALLOW_LIST, baseAllowListImpl, "Test AllowList", address(this))
        );
        address predictedAddress =
            LibClone.predictDeterministicAddress(address(baseAllowListImpl), salt, address(registry));

        // Assert that the Deployed event is emitted with the correct parameters
        vm.expectEmit(true, true, true, true);
        emit BoostRegistry.Deployed(
            BoostRegistry.RegistryType.ALLOW_LIST,
            registry.getCloneIdentifier(
                BoostRegistry.RegistryType.ALLOW_LIST, address(baseAllowListImpl), address(this), "Test AllowList"
            ),
            address(baseAllowListImpl),
            Cloneable(predictedAddress)
        );

        registry.deployClone(
            BoostRegistry.RegistryType.ALLOW_LIST,
            address(baseAllowListImpl),
            "Test AllowList",
            LibZip.cdCompress(abi.encode(address(this), new address[](0), new bool[](0)))
        );
    }

    function testDeployClone_Initialize() public {
        registry.register(BoostRegistry.RegistryType.BUDGET, "SimpleBudget", address(baseBudgetImpl));

        address[] memory authorized = new address[](1);
        authorized[0] = address(this);

        bytes32 salt = keccak256(
            abi.encodePacked(BoostRegistry.RegistryType.BUDGET, baseBudgetImpl, "Testing Budget", address(this))
        );
        address predictedAddress =
            LibClone.predictDeterministicAddress(address(baseBudgetImpl), salt, address(registry));

        vm.expectEmit(true, true, true, true);
        emit BoostRegistry.Deployed(
            BoostRegistry.RegistryType.BUDGET,
            registry.getCloneIdentifier(
                BoostRegistry.RegistryType.BUDGET, address(baseBudgetImpl), address(this), "Testing Budget"
            ),
            address(baseBudgetImpl),
            Cloneable(predictedAddress)
        );

        Cloneable instance = registry.deployClone(
            BoostRegistry.RegistryType.BUDGET,
            address(baseBudgetImpl),
            "Testing Budget",
            LibZip.cdCompress(abi.encode(SimpleBudget.InitPayload({owner: address(this), authorized: authorized})))
        );

        assertTrue(instance.supportsInterface(type(Budget).interfaceId));
        assertEq(SimpleBudget(payable(address(instance))).owner(), address(this));
    }

    function testDeployClone_Initialize_Fail() public {
        registry.register(BoostRegistry.RegistryType.BUDGET, "SimpleBudget", address(baseBudgetImpl));

        vm.expectRevert(); // Totally invalid initialization data => EVM panic
        registry.deployClone(
            BoostRegistry.RegistryType.BUDGET,
            address(baseBudgetImpl),
            "Testing Budget",
            LibZip.cdCompress(
                abi.encode(
                    unicode"🦄 unicorns (and 🌈 rainbows!) are *so cool* but not valid here... panic at the EVM disco!"
                )
            )
        );
    }

    ////////////////////////////
    // BoostRegistry.getClone //
    ////////////////////////////

    function testGetClone() public {
        registry.register(BoostRegistry.RegistryType.BUDGET, "SimpleBudget", address(baseBudgetImpl));

        bytes32 cloneId = registry.getCloneIdentifier(
            BoostRegistry.RegistryType.BUDGET, address(baseBudgetImpl), address(this), "Testing Budget"
        );
        registry.deployClone(
            BoostRegistry.RegistryType.BUDGET,
            address(baseBudgetImpl),
            "Testing Budget",
            LibZip.cdCompress(
                abi.encode(SimpleBudget.InitPayload({owner: address(this), authorized: new address[](0)}))
            )
        );

        BoostRegistry.Clone memory clone = registry.getClone(cloneId);

        assertTrue(clone.baseType == BoostRegistry.RegistryType.BUDGET);
        assertEq(address(clone.deployer), address(this));
        assertEq(clone.name, "Testing Budget");
    }

    function testGetClone_NotRegistered() public {
        bytes32 cloneId = registry.getCloneIdentifier(
            BoostRegistry.RegistryType.BUDGET, address(baseBudgetImpl), address(this), "Testing Budget"
        );

        vm.expectRevert(abi.encodeWithSelector(BoostRegistry.NotRegistered.selector, cloneId));
        registry.getClone(cloneId);
    }

    /////////////////////////////
    // BoostRegistry.getClones //
    /////////////////////////////

    function testGetClones() public {
        _deployAllowListClone("Uno", new address[](0));
        assertEq(registry.getClones(address(this)).length, 1);

        (bytes32 id, Cloneable clone) = _deployAllowListClone("Dos", new address[](0));
        assertEq(registry.getClones(address(this)).length, 2);

        assertEq(registry.getClones(address(this))[1], id);
        assertEq(registry.getClone(id).deployer, address(this));
        assertEq(address(registry.getClone(id).instance), address(clone));
    }

    ///////////////////////////
    // Test Helper Functions //
    ///////////////////////////

    function _deployAllowListClone(string memory name, address[] memory signers)
        internal
        returns (bytes32 cloneId, Cloneable clone)
    {
        bool[] memory authorized = new bool[](signers.length);
        for (uint256 i = 0; i < signers.length; i++) {
            authorized[i] = true;
        }

        cloneId = registry.getCloneIdentifier(
            BoostRegistry.RegistryType.ALLOW_LIST, address(baseAllowListImpl), address(this), name
        );

        clone = registry.deployClone(
            BoostRegistry.RegistryType.ALLOW_LIST,
            address(baseAllowListImpl),
            name,
            LibZip.cdCompress(abi.encode(address(this), signers, authorized))
        );
    }
}
