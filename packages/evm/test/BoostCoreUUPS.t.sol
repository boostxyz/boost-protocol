// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Test, console} from "lib/forge-std/src/Test.sol";
import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import {Ownable} from "@solady/auth/Ownable.sol";

import {MockERC20, MockERC721, MockAuth} from "contracts/shared/Mocks.sol";
import {LibClone} from "@solady/utils/LibClone.sol";
import {LibZip} from "@solady/utils/LibZip.sol";

// Actions
import {AAction} from "contracts/actions/AAction.sol";
import {AContractAction} from "contracts/actions/AContractAction.sol";
import {ERC721MintAction} from "contracts/actions/ERC721MintAction.sol";

// Allowlists
import {AAllowList} from "contracts/allowlists/AAllowList.sol";
import {SimpleAllowList} from "contracts/allowlists/SimpleAllowList.sol";
import {ASimpleAllowList} from "contracts/allowlists/ASimpleAllowList.sol";

// Budgets
import {ABudget} from "contracts/budgets/ABudget.sol";
import {ManagedBudget} from "contracts/budgets/ManagedBudget.sol";

// Incentives
import {AIncentive} from "contracts/incentives/AIncentive.sol";
import {ERC20Incentive} from "contracts/incentives/ERC20Incentive.sol";
import {AERC20Incentive} from "contracts/incentives/AERC20Incentive.sol";

// Validators
import {AValidator} from "contracts/validators/AValidator.sol";
import {SignerValidator} from "contracts/validators/SignerValidator.sol";

// Core and Shared
import {BoostCore} from "contracts/BoostCore.sol";
import {BoostRegistry} from "contracts/BoostRegistry.sol";
import {BoostError} from "contracts/shared/BoostError.sol";
import {BoostLib} from "contracts/shared/BoostLib.sol";
import {ACloneable} from "contracts/shared/ACloneable.sol";

// Mock upgraded version for testing
/// @custom:oz-upgrades-from contracts/BoostCore.sol:BoostCore
contract BoostCoreV2 is BoostCore {
    // New functionality in V2
    uint256 public newFeature;

    function setNewFeature(uint256 _value) external onlyOwner {
        newFeature = _value;
    }

    function version() public pure override returns (string memory) {
        return "2.0.0";
    }

    // New function to test additional functionality
    function calculateWithNewFeature(uint256 input) external view returns (uint256) {
        return input + newFeature;
    }
}

// Bad upgrade example - doesn't inherit from BoostCore
contract BoostCoreBadUpgrade {
    function badFunction() external pure returns (bool) {
        return true;
    }
}

contract BoostCoreUUPSTest is Test {
    using LibClone for address;

    MockERC20 mockERC20;
    MockERC721 mockERC721;
    MockAuth mockAuth;
    BoostRegistry registry;

    BoostCore implementation;
    address proxy;
    BoostCore boostCore;

    address protocolFeeReceiver = address(0x1234);
    address owner = address(this);

    // Test data
    BoostLib.Target action;
    BoostLib.Target allowList;
    ABudget budget;
    address[] mockAddresses;
    bytes validCreateCalldata;

    event Upgraded(address indexed implementation);

    function setUp() public {
        // Deploy mocks
        mockERC20 = new MockERC20();
        mockERC721 = new MockERC721();
        registry = new BoostRegistry();

        // Deploy implementation
        implementation = new BoostCore();

        // Deploy proxy with implementation and initialization data
        bytes memory initData = abi.encodeCall(BoostCore.initialize, (registry, protocolFeeReceiver, owner));

        ERC1967Proxy proxyContract = new ERC1967Proxy(address(implementation), initData);
        proxy = address(proxyContract);
        boostCore = BoostCore(proxy);

        // Set up test data
        action = _makeERC721MintAction(address(mockERC721), MockERC721.mint.selector, mockERC721.mintPrice());
        allowList = _makeAllowList(address(this));

        address[] memory authorized = new address[](2);
        authorized[0] = address(boostCore);
        authorized[1] = address(1);
        uint256[] memory roles = new uint256[](2);
        roles[0] = 1 << 0;
        roles[1] = 1 << 0;
        budget = _makeBudget(address(this), authorized, roles);

        validCreateCalldata = LibZip.cdCompress(
            abi.encode(
                BoostLib.CreateBoostPayload({
                    budget: budget,
                    action: action,
                    validator: BoostLib.Target({isBase: true, instance: address(0), parameters: ""}),
                    allowList: allowList,
                    incentives: _makeIncentives(1, 1 ether, 100),
                    protocolFee: 0,
                    maxParticipants: 10_000,
                    owner: address(1)
                })
            )
        );

        // Fund the budget
        sendFundsToBudget();

        mockAddresses.push(address(this));
        mockAuth = new MockAuth(mockAddresses);
    }

    // Helper function to send erc20 to budget
    function sendFundsToBudget() internal {
        mockERC20.mint(address(this), 110 ether);
        mockERC20.approve(address(budget), 110 ether);
        budget.allocate(
            abi.encode(
                ABudget.Transfer({
                    assetType: ABudget.AssetType.ERC20,
                    asset: address(mockERC20),
                    target: address(this),
                    data: abi.encode(ABudget.FungiblePayload({amount: 110 ether}))
                })
            )
        );
    }

    //////////////////////////
    // Initialization Tests //
    //////////////////////////

    function testInitialization() public view {
        assertEq(address(boostCore.registry()), address(registry), "Registry should be set correctly");
        assertEq(boostCore.protocolFeeReceiver(), protocolFeeReceiver, "Protocol fee receiver should be set correctly");
        assertEq(boostCore.owner(), owner, "Owner should be set correctly");
        assertEq(boostCore.version(), "1.0.0", "Version should be 1.0.0");
    }

    function testCannotInitializeTwice() public {
        vm.expectRevert();
        boostCore.initialize(registry, protocolFeeReceiver, owner);
    }

    function testCannotInitializeImplementation() public {
        vm.expectRevert();
        implementation.initialize(registry, protocolFeeReceiver, owner);
    }

    ////////////////////////////////
    // Basic Functionality Tests //
    ////////////////////////////////

    function testProxiedBoostCreation() public {
        BoostLib.Boost memory boost = boostCore.createBoost(validCreateCalldata);

        assertEq(boost.owner, address(1), "Boost owner should be set correctly");
        assertEq(boostCore.getBoostCount(), 1, "Should have one boost");
    }

    function testProxiedOwnership() public {
        assertEq(boostCore.owner(), owner, "Owner should be set correctly");

        // Test owner-only functions work through proxy
        boostCore.setProtocolFee(2000); // 20%
        assertEq(boostCore.protocolFee(), 2000, "Protocol fee should be updated");

        address newReceiver = address(0x5678);
        boostCore.setProtocolFeeReceiver(newReceiver);
        assertEq(boostCore.protocolFeeReceiver(), newReceiver, "Protocol fee receiver should be updated");
    }

    ////////////////////////
    // Upgrade Tests      //
    ////////////////////////

    function testSuccessfulUpgrade() public {
        // Deploy new implementation and upgrade
        BoostCoreV2 newImplementation = new BoostCoreV2();
        boostCore.upgradeToAndCall(address(newImplementation), "");

        // Test that the upgrade worked
        BoostCoreV2 upgradedCore = BoostCoreV2(proxy);
        assertEq(upgradedCore.version(), "2.0.0", "Version should be updated to 2.0.0");

        // Test new functionality
        upgradedCore.setNewFeature(42);
        assertEq(upgradedCore.newFeature(), 42, "New feature should work");

        // Test that old functionality still works
        assertEq(address(upgradedCore.registry()), address(registry), "Registry should still be accessible");
        assertEq(
            upgradedCore.protocolFeeReceiver(), protocolFeeReceiver, "Protocol fee receiver should still be accessible"
        );
    }

    function testUpgradeWithCall() public {
        // Upgrade with call
        // Deploy new implementation and upgrade with call
        BoostCoreV2 newImplementation = new BoostCoreV2();
        boostCore.upgradeToAndCall(address(newImplementation), abi.encodeCall(BoostCoreV2.setNewFeature, 123));

        // Test that the upgrade and call worked
        BoostCoreV2 upgradedCore = BoostCoreV2(address(proxy));
        assertEq(upgradedCore.newFeature(), 123, "New feature should be set from upgrade call");
        assertEq(upgradedCore.calculateWithNewFeature(100), 223, "New calculation should work");
    }

    function testOnlyOwnerCanUpgrade() public {
        BoostCoreV2 newImplementation = new BoostCoreV2();

        // Test that non-owner cannot upgrade
        vm.prank(address(0x9999));
        vm.expectRevert(Ownable.Unauthorized.selector);
        boostCore.upgradeToAndCall(address(newImplementation), "");
    }

    function testUpgradeToIncompatibleImplementation() public {
        // Deploy bad implementation
        BoostCoreBadUpgrade badImplementation = new BoostCoreBadUpgrade();

        // This should fail because the new implementation doesn't support UUPS
        vm.expectRevert();
        boostCore.upgradeToAndCall(address(badImplementation), "");
    }

    function testUpgradePreservesState() public {
        // Create a boost before upgrade
        BoostLib.Boost memory originalBoost = boostCore.createBoost(validCreateCalldata);
        assertEq(boostCore.getBoostCount(), 1, "Should have one boost before upgrade");

        // Set some state
        boostCore.setProtocolFee(1500); // 15%
        address newReceiver = address(0xABCD);
        boostCore.setProtocolFeeReceiver(newReceiver);

        // Upgrade
        // Deploy new implementation and upgrade
        BoostCoreV2 newImplementation = new BoostCoreV2();
        boostCore.upgradeToAndCall(address(newImplementation), "");

        // Test that state is preserved
        BoostCoreV2 upgradedCore = BoostCoreV2(proxy);
        assertEq(upgradedCore.getBoostCount(), 1, "Boost count should be preserved");
        assertEq(upgradedCore.protocolFee(), 1500, "Protocol fee should be preserved");
        assertEq(upgradedCore.protocolFeeReceiver(), newReceiver, "Protocol fee receiver should be preserved");

        // Test that the original boost is still accessible
        BoostLib.Boost memory preservedBoost = upgradedCore.getBoost(0);
        assertEq(preservedBoost.owner, originalBoost.owner, "Boost owner should be preserved");
        assertEq(preservedBoost.protocolFee, originalBoost.protocolFee, "Boost protocol fee should be preserved");
    }

    function testMultipleUpgrades() public {
        // Initial version should be 1.0.0
        assertEq(boostCore.version(), "1.0.0", "Initial version should be 1.0.0");

        // First upgrade to V2
        // Deploy new implementation and upgrade
        BoostCoreV2 newImplementation = new BoostCoreV2();
        boostCore.upgradeToAndCall(address(newImplementation), "");
        BoostCoreV2 coreV2 = BoostCoreV2(proxy);
        assertEq(coreV2.version(), "2.0.0", "Version should be 2.0.0 after first upgrade");

        // Set some V2 state
        coreV2.setNewFeature(999);
        assertEq(coreV2.newFeature(), 999, "V2 feature should work");

        // Second upgrade to another V2 (simulating bug fix)
        // Deploy new implementation and upgrade
        BoostCoreV2 newImplementation2 = new BoostCoreV2();
        boostCore.upgradeToAndCall(address(newImplementation2), "");
        BoostCoreV2 coreV2Fixed = BoostCoreV2(proxy);

        // State should be preserved across upgrades
        assertEq(coreV2Fixed.newFeature(), 999, "V2 state should be preserved across upgrades");
        assertEq(coreV2Fixed.version(), "2.0.0", "Version should remain 2.0.0");
    }

    ////////////////////////////////
    // Access Control Tests       //
    ////////////////////////////////

    function testUpgradeAccessControl() public {
        // Transfer ownership to different address
        address newOwner = address(0x1111);
        boostCore.transferOwnership(newOwner);

        BoostCoreV2 newImplementation = new BoostCoreV2();

        // Original owner should no longer be able to upgrade
        vm.expectRevert(Ownable.Unauthorized.selector);
        boostCore.upgradeToAndCall(address(newImplementation), "");

        // New owner should be able to upgrade
        vm.startPrank(newOwner);
        // Deploy new implementation and upgrade
        BoostCoreV2 newImplementation3 = new BoostCoreV2();
        boostCore.upgradeToAndCall(address(newImplementation3), "");
        vm.stopPrank();

        // Verify upgrade worked
        BoostCoreV2 upgradedCore = BoostCoreV2(proxy);
        assertEq(upgradedCore.version(), "2.0.0", "Version should be updated");
        assertEq(upgradedCore.owner(), newOwner, "Owner should be preserved");
    }

    function testRenounceOwnershipPreventsUpgrades() public {
        // Renounce ownership
        boostCore.renounceOwnership();

        BoostCoreV2 newImplementation = new BoostCoreV2();

        // Should not be able to upgrade after renouncing ownership
        vm.expectRevert(Ownable.Unauthorized.selector);
        boostCore.upgradeToAndCall(address(newImplementation), "");
    }

    ////////////////////////////////
    // Upgrade Safety Tests       //
    ////////////////////////////////

    function testFunctionalityAfterUpgrade() public {
        // Create a boost before upgrade
        boostCore.createBoost(validCreateCalldata);

        // Upgrade
        // Deploy new implementation and upgrade
        BoostCoreV2 newImplementation = new BoostCoreV2();
        boostCore.upgradeToAndCall(address(newImplementation), "");
        BoostCoreV2 upgradedCore = BoostCoreV2(proxy);

        // Set aside more funds to create new boost
        sendFundsToBudget();

        // Test that we can still create boosts after upgrade
        BoostLib.Boost memory newBoost = upgradedCore.createBoost(validCreateCalldata);
        assertEq(newBoost.owner, address(1), "New boost should be created correctly");
        assertEq(upgradedCore.getBoostCount(), 2, "Should have two boosts after upgrade");

        // Test new functionality
        upgradedCore.setNewFeature(500);
        assertEq(upgradedCore.calculateWithNewFeature(250), 750, "New functionality should work");
    }

    //////////////////////
    // Helper Functions //
    //////////////////////

    function _makeERC721MintAction(address target, bytes4 selector, uint256 value)
        internal
        returns (BoostLib.Target memory)
    {
        ERC721MintAction base = new ERC721MintAction();
        return BoostLib.Target({
            isBase: true,
            instance: address(base),
            parameters: abi.encode(
                AContractAction.InitPayload({chainId: block.chainid, target: target, selector: selector, value: value})
            )
        });
    }

    function _makeAllowList(address budgetOwner) internal returns (BoostLib.Target memory) {
        SimpleAllowList base = new SimpleAllowList();
        SimpleAllowList clone = SimpleAllowList(LibClone.clone(address(base)));
        address[] memory allowedAddresses = new address[](1);
        allowedAddresses[0] = budgetOwner;

        clone.initialize(abi.encode(budgetOwner, allowedAddresses));

        return BoostLib.Target({isBase: false, instance: address(clone), parameters: ""});
    }

    function _makeBudget(address budgetOwner, address[] memory authorized, uint256[] memory roles)
        internal
        returns (ABudget)
    {
        ManagedBudget budgetImpl = new ManagedBudget{salt: keccak256(abi.encode("ManagedBudget"))}();
        ABudget budget_ = ABudget(payable(address(budgetImpl).clone()));
        budget_.initialize(
            abi.encode(ManagedBudget.InitPayload({owner: budgetOwner, authorized: authorized, roles: roles}))
        );
        return budget_;
    }

    function _makeIncentives(uint256 count, uint256 amount, uint256 limit)
        internal
        returns (BoostLib.Target[] memory incentives)
    {
        incentives = new BoostLib.Target[](count);
        for (uint256 i = 0; i < count; i++) {
            ERC20Incentive base = new ERC20Incentive();
            incentives[i] = BoostLib.Target({
                isBase: true,
                instance: address(base),
                parameters: abi.encode(
                    ERC20Incentive.InitPayload({
                        asset: address(mockERC20),
                        strategy: AERC20Incentive.Strategy.POOL,
                        reward: amount,
                        limit: limit,
                        manager: address(0)
                    })
                )
            });
        }
    }
}
