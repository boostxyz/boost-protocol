// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Test, console} from "lib/forge-std/src/Test.sol";
import {MockERC20, MockERC721, MockAuth} from "contracts/shared/Mocks.sol";

import {LibClone} from "@solady/utils/LibClone.sol";
import {LibZip} from "@solady/utils/LibZip.sol";

// Actions
import {AAction} from "contracts/actions/AAction.sol";
import {AContractAction, ContractAction} from "contracts/actions/ContractAction.sol";
import {ERC721MintAction} from "contracts/actions/ERC721MintAction.sol";

// Allowlists
import {AAllowList} from "contracts/allowlists/AAllowList.sol";
import {SimpleAllowList} from "contracts/allowlists/SimpleAllowList.sol";

// Budgets
import {ABudget} from "contracts/budgets/ABudget.sol";
import {SimpleBudget} from "contracts/budgets/SimpleBudget.sol";

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

contract BoostCoreTest is Test {
    using LibClone for address;

    MockERC20 mockERC20 = new MockERC20();
    MockERC721 mockERC721 = new MockERC721();
    MockAuth mockAuth;
    address[] mockAddresses;

    BoostCore boostCore = new BoostCore(new BoostRegistry(), address(1));
    BoostLib.Target action = _makeAction(address(mockERC721), MockERC721.mint.selector, mockERC721.mintPrice());
    BoostLib.Target allowList = _makeAllowList(address(this));

    address[] authorized = [address(boostCore)];
    ABudget budget = _makeBudget(address(this), authorized);

    bytes validCreateCalldata = LibZip.cdCompress(
        abi.encode(
            BoostCore.InitPayload({
                budget: budget,
                action: action,
                validator: BoostLib.Target({isBase: true, instance: address(0), parameters: ""}),
                allowList: allowList,
                incentives: _makeIncentives(1),
                protocolFee: 500, // 5%
                referralFee: 1000, // 10%
                maxParticipants: 10_000,
                owner: address(1)
            })
        )
    );

    function setUp() public {
        mockERC20.mint(address(this), 100 ether);
        mockERC20.approve(address(budget), 100 ether);
        budget.allocate(
            abi.encode(
                ABudget.Transfer({
                    assetType: ABudget.AssetType.ERC20,
                    asset: address(mockERC20),
                    target: address(this),
                    data: abi.encode(ABudget.FungiblePayload({amount: 100 ether}))
                })
            )
        );
        mockAddresses.push(address(this));
        mockAuth = new MockAuth(mockAddresses);
    }

    ///////////////////////////
    // BoostCore.Constructor //
    ///////////////////////////

    function testConstructor() public {
        BoostRegistry registry = new BoostRegistry();
        address protocolFeeReceiver = address(1);
        BoostCore boostCoreInstance = new BoostCore(registry, protocolFeeReceiver);

        // Check the owner
        assertEq(address(this), boostCoreInstance.owner());

        // Check the registry
        assertEq(address(registry), address(boostCoreInstance.registry()));

        // Check the protocol fee receiver
        assertEq(protocolFeeReceiver, boostCoreInstance.protocolFeeReceiver());
    }

    /////////////////////////////
    // BoostCore Initial State //
    /////////////////////////////

    function testInitialOwner() public view {
        assertEq(address(this), boostCore.owner());
    }

    function testInitialBoostCount() public view {
        assertEq(0, boostCore.getBoostCount());
    }

    ///////////////////////////
    // BoostCore.createBoost //
    ///////////////////////////

    function testCreateBoost() public {
        boostCore.createBoost(validCreateCalldata);
        assertEq(1, boostCore.getBoostCount());
    }

    function testCreateBoost_FullValidation() public {
        // Create the Boost
        BoostLib.Boost memory boost = boostCore.createBoost(validCreateCalldata);

        // Check the basics
        assertEq(boost.owner, address(1));
        assertEq(boost.protocolFee, boostCore.protocolFee() + 500);
        assertEq(boost.referralFee, boostCore.referralFee() + 1000);
        assertEq(boost.maxParticipants, 10_000);

        // Check the ABudget
        assertEq(address(boost.budget), address(budget));
        assertTrue(boost.budget.isAuthorized(address(this)));

        // Check the AAction
        ERC721MintAction _action = ERC721MintAction(address(boost.action));
        assertTrue(_action.supportsInterface(type(AAction).interfaceId));
        assertEq(_action.target(), address(mockERC721));
        assertEq(_action.selector(), MockERC721.mint.selector);
        assertEq(_action.value(), mockERC721.mintPrice());

        // Check the AllowList
        SimpleAllowList _allowList = SimpleAllowList(address(boost.allowList));
        assertTrue(_allowList.supportsInterface(type(AAllowList).interfaceId));
        assertEq(_allowList.owner(), address(this));
        assertTrue(_allowList.isAllowed(address(this), bytes("")));
        assertFalse(_allowList.isAllowed(address(1), bytes("")));

        // Check the Incentives
        assertEq(1, boost.incentives.length);
        ERC20Incentive _incentive = ERC20Incentive(address(boost.incentives[0]));
        assertTrue(_incentive.supportsInterface(type(AIncentive).interfaceId));
        assertTrue(_incentive.strategy() == AERC20Incentive.Strategy.POOL);
        assertEq(_incentive.asset(), address(mockERC20));
        assertEq(_incentive.currentReward(), 1 ether);
        assertEq(_incentive.limit(), 100);
        assertEq(_incentive.claims(), 0);

        // Check the Validator (which should be the AAction)
        assertTrue(boost.validator.supportsInterface(type(AValidator).interfaceId));
        assertEq(address(boost.validator), address(boost.action));
    }

    function testCreateBoost_NoBudget() public {
        // Try to create a Boost without a ABudget (should fail)
        bytes memory invalidBudgetCalldata = LibZip.cdCompress(
            abi.encode(
                address(0),
                action,
                BoostLib.Target({isBase: true, instance: address(0), parameters: ""}),
                allowList,
                _makeIncentives(1),
                0.01 ether,
                0.001 ether,
                10_000,
                address(this)
            )
        );

        vm.expectRevert(
            abi.encodeWithSelector(BoostError.InvalidInstance.selector, type(ABudget).interfaceId, address(0))
        );
        boostCore.createBoost(invalidBudgetCalldata);
    }

    function testCreateBoost_InvalidBudgetNoERC165() public {
        // Try to create a Boost with an address that doesn't respond to ERC165 (should fail)
        bytes memory calldata_ = LibZip.cdCompress(
            abi.encode(
                address(1),
                action,
                BoostLib.Target({isBase: true, instance: address(0), parameters: ""}),
                allowList,
                _makeIncentives(1),
                0.01 ether,
                0.001 ether,
                10_000,
                address(this)
            )
        );

        // No ERC165 support => Generic EVM exception
        vm.expectRevert(bytes(""));
        boostCore.createBoost(calldata_);

        // Nothing should be created
        assertEq(0, boostCore.getBoostCount());
    }

    function testCreateBoost_InvalidBudgetNoSupport() public {
        // Try to create a Boost with an address that doesn't support the ABudget interface (should fail)
        bytes memory calldata_ = LibZip.cdCompress(
            abi.encode(
                BoostCore.InitPayload(
                    ABudget(payable(action.instance)),
                    action,
                    BoostLib.Target({isBase: true, instance: address(0), parameters: ""}),
                    allowList,
                    _makeIncentives(1),
                    0.01 ether,
                    0.001 ether,
                    10_000,
                    address(this)
                )
            )
        );

        // Supports ERC165, but is not a ABudget => InvalidBudget
        vm.expectRevert(
            abi.encodeWithSelector(BoostError.InvalidInstance.selector, type(ABudget).interfaceId, action.instance)
        );
        boostCore.createBoost(calldata_);

        // Nothing should be created
        assertEq(0, boostCore.getBoostCount());
    }

    function testCreateBoost_InvalidAction() public {
        // Try to create a Boost with an invalid AAction (should fail)
        bytes memory invalidActionCalldata = LibZip.cdCompress(
            abi.encode(
                BoostCore.InitPayload(
                    budget,
                    BoostLib.Target({isBase: true, instance: address(0), parameters: ""}),
                    action,
                    allowList,
                    _makeIncentives(1),
                    0.01 ether,
                    0.001 ether,
                    10_000,
                    address(this)
                )
            )
        );

        vm.expectRevert(
            abi.encodeWithSelector(BoostError.InvalidInstance.selector, type(AAction).interfaceId, address(0))
        );
        boostCore.createBoost(invalidActionCalldata);
    }

    //////////////////////////////////
    // BoostCore.setCreateBoostAuth //
    /////////////////////////////////

    function testSetAuthToMockAuth() public {
        // Assuming BoostCore has a function to set the auth strategy
        boostCore.setCreateBoostAuth(address(mockAuth));
        assertTrue(address(boostCore.createBoostAuth()) == address(mockAuth), "Auth strategy not set correctly");
    }

    function testAuthorizedUserCanCreateBoost() public {
        // Set the auth strategy to MockAuth
        boostCore.setCreateBoostAuth(address(mockAuth));

        // Use an authorized address (this contract)
        boostCore.createBoost(validCreateCalldata);

        // Verify the boost was created
        assertEq(1, boostCore.getBoostCount(), "Authorized user should be able to create boost");
    }

    function testUnauthorizedUserCannotCreateBoost() public {
        // Set the auth strategy to MockAuth
        boostCore.setCreateBoostAuth(address(mockAuth));

        // Use an unauthorized address
        vm.prank(makeAddr("unauthorizedBoostCreator"));

        // Expect a revert due to unauthorized access
        vm.expectRevert(BoostError.Unauthorized.selector);
        boostCore.createBoost(validCreateCalldata);

        // Verify no boost was created
        assertEq(0, boostCore.getBoostCount(), "Unauthorized user should not be able to create boost");
    }

    ///////////////////////////
    // BoostCore.claimIncentive //
    ///////////////////////////

    function testClaimIncentive() public {
        // Create a Boost first
        boostCore.createBoost(validCreateCalldata);

        // Mint an ERC721 token to the claimant (this contract)
        uint256 tokenId = 1;
        mockERC721.mint{value: 0.1 ether}(address(this));
        mockERC721.mint{value: 0.1 ether}(address(this));
        mockERC721.mint{value: 0.1 ether}(address(this));

        // Prepare the data payload for validation
        bytes memory data = abi.encode(address(this), abi.encode(tokenId));

        // Claim the incentive
        boostCore.claimIncentive{value: 0.000075 ether}(0, 0, address(0), data);

        // Check the claims
        BoostLib.Boost memory boost = boostCore.getBoost(0);
        ERC20Incentive _incentive = ERC20Incentive(address(boost.incentives[0]));
        assertEq(_incentive.claims(), 1);
    }

    function testClaimIncentive_InsufficientFunds() public {
        // Create a Boost first
        boostCore.createBoost(validCreateCalldata);

        // Mint an ERC721 token to the claimant (this contract)
        uint256 tokenId = 1;
        mockERC721.mint{value: 0.1 ether}(address(this));
        mockERC721.mint{value: 0.1 ether}(address(this));
        mockERC721.mint{value: 0.1 ether}(address(this));

        // Prepare the data payload for validation
        bytes memory data = abi.encode(address(this), abi.encode(tokenId));

        // Try to claim the incentive with insufficient funds
        vm.expectRevert(
            abi.encodeWithSelector(
                BoostError.InsufficientFunds.selector, 0x0000000000000000000000000000000000000000, 0, 75000000000000
            )
        );
        boostCore.claimIncentive{value: 0}(0, 0, address(0), "");
    }

    function testClaimIncentive_Unauthorized() public {
        // Create a Boost first
        boostCore.createBoost(validCreateCalldata);

        // Mint an ERC721 token to the claimant (this contract)
        uint256 tokenId = 1;
        mockERC721.mint{value: 0.1 ether}(address(this));
        mockERC721.mint{value: 0.1 ether}(address(this));
        mockERC721.mint{value: 0.1 ether}(address(this));

        // Prepare the data payload for validation

        // Try to claim the incentive with an unauthorized address
        address unauthorizedClaimant = makeAddr("unauthorizedClaimant");
        // NOTE: this claimant can just be passed in as _anything_ - not ideal
        bytes memory data = abi.encode(address(unauthorizedClaimant), abi.encode(tokenId));
        vm.deal(unauthorizedClaimant, 1 ether);
        vm.startPrank(unauthorizedClaimant);
        vm.expectRevert(BoostError.Unauthorized.selector);
        boostCore.claimIncentive{value: 0.000075 ether}(0, 0, address(0), data);
        vm.stopPrank();
    }

    function testClaimIncentive_WithReferrer() public {
        // Create a Boost first
        boostCore.createBoost(validCreateCalldata);

        // Mint an ERC721 token to the claimant (this contract)
        uint256 tokenId = 1;
        mockERC721.mint{value: 0.1 ether}(address(this));
        mockERC721.mint{value: 0.1 ether}(address(this));
        mockERC721.mint{value: 0.1 ether}(address(this));

        // Define a referrer
        address referrer = makeAddr("referrer");
        vm.deal(referrer, 1 ether); // Fund the referrer for testing purposes

        // Prepare the data payload for validation
        bytes memory data = abi.encode(address(this), abi.encode(tokenId));

        // Claim the incentive with a referrer
        boostCore.claimIncentive{value: 0.000075 ether}(0, 0, referrer, data);

        // Check the claims
        BoostLib.Boost memory boost = boostCore.getBoost(0);
        ERC20Incentive _incentive = ERC20Incentive(address(boost.incentives[0]));
        assertEq(_incentive.claims(), 1);

        // Check that the claim fee was routed to the referrer
        uint256 expectedReferrerBalance = 1 ether + (0.000075 ether * 2000 / 10000);
        assertEq(referrer.balance, expectedReferrerBalance);
    }

    ///////////////////////////
    // BoostCore.getBoost //
    ///////////////////////////

    function testGetBoost() public {
        // Create a Boost first
        boostCore.createBoost(validCreateCalldata);

        // Get the Boost
        BoostLib.Boost memory boost = boostCore.getBoost(0);

        // Check the Boost details
        assertEq(boost.owner, address(1));
        assertEq(boost.protocolFee, boostCore.protocolFee() + 500);
        assertEq(boost.referralFee, boostCore.referralFee() + 1000);
        assertEq(boost.maxParticipants, 10_000);
    }

    ///////////////////////////
    // BoostCore.getBoostCount //
    ///////////////////////////

    function testGetBoostCount() public {
        // Initially, there should be no Boosts
        assertEq(boostCore.getBoostCount(), 0);

        // Create a Boost
        boostCore.createBoost(validCreateCalldata);

        // Now, there should be one Boost
        assertEq(boostCore.getBoostCount(), 1);
    }

    ///////////////////////////
    // BoostCore.setProtocolFeeReceiver //
    ///////////////////////////

    function testSetProtocolFeeReceiver() public {
        address newReceiver = address(2);
        boostCore.setProtocolFeeReceiver(newReceiver);
        assertEq(boostCore.protocolFeeReceiver(), newReceiver);
    }

    ///////////////////////////
    // BoostCore.setClaimFee //
    ///////////////////////////

    function testSetClaimFee() public {
        uint256 newClaimFee = 0.0001 ether;
        boostCore.setClaimFee(newClaimFee);
        assertEq(boostCore.claimFee(), newClaimFee);
    }

    //////////////////////////////
    // BoostCore.setProtocolFee //
    //////////////////////////////

    function testSetProtocolFee() public {
        uint64 newProtocolFee = 700; // 7%
        boostCore.setProtocolFee(newProtocolFee);
        assertEq(boostCore.protocolFee(), newProtocolFee);
    }

    //////////////////////////////
    // BoostCore.setReferralFee //
    //////////////////////////////

    function testSetReferralFee() public {
        uint64 newReferralFee = 1500; // 15%
        boostCore.setReferralFee(newReferralFee);
        assertEq(boostCore.referralFee(), newReferralFee);
    }

    ///////////////////////////
    // Test Helper Functions //
    ///////////////////////////

    function _makeAction(address target, bytes4 selector, uint256 value) internal returns (BoostLib.Target memory) {
        return BoostLib.Target({
            isBase: true,
            instance: address(new ERC721MintAction()),
            parameters: abi.encode(
                AContractAction.InitPayload({chainId: block.chainid, target: target, selector: selector, value: value})
            )
        });
    }

    function _makeAllowList(address addr) internal returns (BoostLib.Target memory) {
        address[] memory list = new address[](1);
        list[0] = addr;
        return BoostLib.Target({
            isBase: true,
            instance: address(new SimpleAllowList()),
            parameters: abi.encode(address(this), list)
        });
    }

    function _makeBudget(address owner_, address[] memory authorized_) internal returns (ABudget _budget) {
        _budget = ABudget(payable(address(new SimpleBudget()).clone()));
        _budget.initialize(abi.encode(SimpleBudget.InitPayload({owner: owner_, authorized: authorized_})));
    }

    function _makeIncentives(uint256 count) internal returns (BoostLib.Target[] memory) {
        BoostLib.Target[] memory incentives = new BoostLib.Target[](count);
        for (uint256 i = 0; i < count; i++) {
            incentives[i] = BoostLib.Target({
                isBase: true,
                instance: address(new ERC20Incentive()),
                parameters: abi.encode(
                    ERC20Incentive.InitPayload({
                        asset: address(mockERC20),
                        strategy: AERC20Incentive.Strategy.POOL,
                        reward: 1 ether,
                        limit: 100
                    })
                )
            });
        }
        return incentives;
    }
}
