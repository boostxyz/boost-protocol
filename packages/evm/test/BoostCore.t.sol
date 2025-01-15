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
import {SimpleDenyList} from "contracts/allowlists/SimpleDenyList.sol";

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
import {
    MockProtocolFeeModule,
    MockProtocolFeeModuleNoReturn,
    MockProtocolFeeModuleBadReturn
} from "contracts/shared/Mocks.sol";

contract BoostCoreTest is Test {
    using LibClone for address;

    MockERC20 mockERC20 = new MockERC20();
    MockERC721 mockERC721 = new MockERC721();
    MockAuth mockAuth;
    address[] mockAddresses;

    BoostCore boostCore = new BoostCore(new BoostRegistry(), address(1), address(this));
    BoostLib.Target action =
        _makeERC721MintAction(address(mockERC721), MockERC721.mint.selector, mockERC721.mintPrice());
    BoostLib.Target contractAction =
        _makeContractAction(address(mockERC721), MockERC721.mint.selector, mockERC721.mintPrice());
    BoostLib.Target allowList = _makeAllowList(address(this));

    address[] authorized = [address(boostCore)];
    uint256[] roles = [1 << 0];
    ABudget budget = _makeBudget(address(this), authorized, roles);

    bytes validCreateCalldata = LibZip.cdCompress(
        abi.encode(
            BoostLib.CreateBoostPayload({
                budget: budget,
                action: action,
                validator: BoostLib.Target({isBase: true, instance: address(0), parameters: ""}),
                allowList: allowList,
                incentives: _makeIncentives(1, 1 ether, 100),
                protocolFee: 0, // 5%
                maxParticipants: 10_000,
                owner: address(1)
            })
        )
    );

    function setUp() public {
        // We allocate 100 for the boost and 10 for protocol fees
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
        mockAddresses.push(address(this));
        mockAuth = new MockAuth(mockAddresses);
    }

    ///////////////////////////
    // BoostCore.Constructor //
    ///////////////////////////

    function testConstructor() public {
        BoostRegistry registry = new BoostRegistry();
        address protocolFeeReceiver = address(1);
        BoostCore boostCoreInstance = new BoostCore(registry, protocolFeeReceiver, address(this));

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

    function testCreateBoost_NoValidator() public {
        bytes memory invalidCreateCalldata = LibZip.cdCompress(
            abi.encode(
                BoostLib.CreateBoostPayload({
                    budget: budget,
                    action: contractAction,
                    validator: BoostLib.Target({isBase: true, instance: address(0), parameters: ""}),
                    allowList: allowList,
                    incentives: _makeIncentives(1, 1 ether, 100),
                    protocolFee: 0,
                    maxParticipants: 10_000,
                    owner: address(1)
                })
            )
        );

        vm.expectRevert(
            abi.encodeWithSelector(BoostError.InvalidInstance.selector, type(AValidator).interfaceId, address(0))
        );
        boostCore.createBoost(invalidCreateCalldata);
        assertEq(0, boostCore.getBoostCount());
    }

    function testCreateBoost_FullValidation() public {
        // Create the Boost
        BoostLib.Boost memory boost = boostCore.createBoost(validCreateCalldata);

        // Check the basics
        assertEq(boost.owner, address(1));
        assertEq(boost.protocolFee, boostCore.protocolFee());
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

    function testCreateBoost_FullValidationNonManager() public {
        vm.expectRevert(BoostError.Unauthorized.selector);
        hoax(makeAddr("invalid creator"));
        boostCore.createBoost(validCreateCalldata);
    }

    function testCreateBoost_NoBudget() public {
        // Try to create a Boost without a ABudget (should fail)
        bytes memory invalidBudgetCalldata = LibZip.cdCompress(
            abi.encode(
                address(0),
                action,
                BoostLib.Target({isBase: true, instance: address(0), parameters: ""}),
                allowList,
                _makeIncentives(1, 1 ether, 100),
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
                _makeIncentives(1, 1 ether, 100),
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
                BoostLib.CreateBoostPayload(
                    ABudget(payable(action.instance)),
                    action,
                    BoostLib.Target({isBase: true, instance: address(0), parameters: ""}),
                    allowList,
                    _makeIncentives(1, 1 ether, 100),
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
                BoostLib.CreateBoostPayload(
                    budget,
                    BoostLib.Target({isBase: true, instance: address(0), parameters: ""}),
                    action,
                    allowList,
                    _makeIncentives(1, 1 ether, 100),
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

    function testCreateBoost_AfterSetProtocolFeeModule_BadReturn() public {
        // Create a mock protocol fee module with a specific fee
        uint256 moduleFee = 0xFFFFFFFFFFFFFFFFF; // 2^68 - 1 (which is great than the uint64 max value)
        MockProtocolFeeModuleBadReturn mockModule = new MockProtocolFeeModuleBadReturn(moduleFee);

        // Set the protocol fee module
        boostCore.setProtocolFeeModule(address(mockModule));

        // Verify that the protocol fee module is set correctly
        assertEq(boostCore.protocolFeeModule(), address(mockModule), "Protocol fee module not set correctly");

        // Prepare createBoost calldata with payload protocolFee
        uint64 payloadProtocolFee = 100; // 1%

        bytes memory createCalldata = LibZip.cdCompress(
            abi.encode(
                BoostLib.CreateBoostPayload({
                    budget: budget,
                    action: action,
                    validator: BoostLib.Target({isBase: true, instance: address(0), parameters: ""}),
                    allowList: allowList,
                    incentives: _makeIncentives(1, 1 ether, 100),
                    protocolFee: payloadProtocolFee,
                    maxParticipants: 10_000,
                    owner: address(1)
                })
            )
        );

        vm.expectRevert();

        // Call createBoost
        boostCore.createBoost(createCalldata);
    }

    function testCreateBoost_AfterSetProtocolFeeModule_NoReturn() public {
        // Create a mock protocol fee module with a specific fee
        MockProtocolFeeModuleNoReturn mockModule = new MockProtocolFeeModuleNoReturn();

        // Set the protocol fee module
        boostCore.setProtocolFeeModule(address(mockModule));

        // Verify that the protocol fee module is set correctly
        assertEq(boostCore.protocolFeeModule(), address(mockModule), "Protocol fee module not set correctly");

        // Prepare createBoost calldata with payload protocolFee
        uint64 payloadProtocolFee = 100; // 1%

        bytes memory createCalldata = LibZip.cdCompress(
            abi.encode(
                BoostLib.CreateBoostPayload({
                    budget: budget,
                    action: action,
                    validator: BoostLib.Target({isBase: true, instance: address(0), parameters: ""}),
                    allowList: allowList,
                    incentives: _makeIncentives(1, 1 ether, 100),
                    protocolFee: payloadProtocolFee,
                    maxParticipants: 10_000,
                    owner: address(1)
                })
            )
        );
        vm.expectRevert();

        // Call createBoost
        boostCore.createBoost(createCalldata);
    }

    function testCreateBoost_AfterSetProtocolFeeModule() public {
        // Create a mock protocol fee module with a specific fee
        uint64 moduleFee = 200; // 2%
        MockProtocolFeeModule mockModule = new MockProtocolFeeModule(moduleFee);

        // Set the protocol fee module
        boostCore.setProtocolFeeModule(address(mockModule));

        // Verify that the protocol fee module is set correctly
        assertEq(boostCore.protocolFeeModule(), address(mockModule), "Protocol fee module not set correctly");

        // Prepare createBoost calldata with payload protocolFee
        uint64 payloadProtocolFee = 100; // 1%

        bytes memory createCalldata = LibZip.cdCompress(
            abi.encode(
                BoostLib.CreateBoostPayload({
                    budget: budget,
                    action: action,
                    validator: BoostLib.Target({isBase: true, instance: address(0), parameters: ""}),
                    allowList: allowList,
                    incentives: _makeIncentives(1, 1 ether, 100),
                    protocolFee: payloadProtocolFee,
                    maxParticipants: 10_000,
                    owner: address(1)
                })
            )
        );

        // Call createBoost
        boostCore.createBoost(createCalldata);

        // Get the Boost
        BoostLib.Boost memory boost = boostCore.getBoost(0);

        // Expected protocol fee is moduleFee + payloadProtocolFee
        uint64 expectedProtocolFee = moduleFee + payloadProtocolFee;

        // Verify that the boost's protocolFee is correct
        assertEq(boost.protocolFee, expectedProtocolFee, "Protocol fee should be sum of module fee and payload fee");
    }

    //////////////////////////////////////////
    // BoostCore.createBoost - ProtocolAsset //
    //////////////////////////////////////////

    /// @notice Test createBoost when protocolFeeModule is not set, ensuring the protocolAsset is zero
    function testCreateBoost_WithoutProtocolFeeModuleAsset() public {
        // Ensure no protocol fee module is set
        assertEq(boostCore.protocolFeeModule(), address(0));

        // Create the boost
        boostCore.createBoost(validCreateCalldata);

        // Verify that no protocol fee module asset was applied and that the incentive's asset is the original
        bytes32 key = keccak256(abi.encodePacked(uint256(0), uint256(0)));
        BoostCore.IncentiveDisbursalInfo memory info = boostCore.getIncentiveFeesInfo(key);

        // Since no protocol fee module is set, the asset should be the original request.asset
        // which in our setup was the mockERC20.
        assertEq(
            info.asset, address(mockERC20), "When no protocol fee module is set, incentive asset should be original"
        );
    }

    /// @notice Test createBoost with a protocol fee module that returns a custom protocol asset
    function testCreateBoost_WithProtocolFeeModuleAsset() public {
        // Create a mock protocol fee module that returns a custom protocol asset
        address expectedProtocolAsset = address(mockERC20); // Using mockERC20 as the "protocol asset"
        uint64 moduleFee = 200; // 2%
        MockProtocolFeeModule mockModule = new MockProtocolFeeModule(moduleFee);
        mockModule.setProtocolAsset(expectedProtocolAsset);

        // Set the protocol fee module
        boostCore.setProtocolFeeModule(address(mockModule));
        assertEq(boostCore.protocolFeeModule(), address(mockModule), "Protocol fee module not set correctly");

        // Create a Boost
        boostCore.createBoost(validCreateCalldata);

        // Verify that the protocol asset is correctly applied to the incentive
        bytes32 key = keccak256(abi.encodePacked(uint256(0), uint256(0)));
        BoostCore.IncentiveDisbursalInfo memory info = boostCore.getIncentiveFeesInfo(key);

        // Since the protocol fee module is set and returns a specific protocol asset,
        // the incentive's asset should be overridden to that protocol asset.
        assertEq(
            info.asset, expectedProtocolAsset, "Incentive asset should match the protocol asset from the fee module"
        );
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

        // Expect the BoostClaimed event to be emitted
        vm.expectEmit(true, true, true, true);
        emit BoostCore.BoostClaimed(0, 0, address(this), address(0), data);

        // Claim the incentive
        boostCore.claimIncentive{value: 0.000075 ether}(0, 0, address(0), data);

        // Check the claims
        BoostLib.Boost memory boost = boostCore.getBoost(0);
        ERC20Incentive _incentive = ERC20Incentive(address(boost.incentives[0]));
        assertEq(_incentive.claims(), 1);
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

    function testFuzzClaimIncentive_ProtocolFeeTransfer(uint256 rewardAmount, uint64 additionalProtocolFee) public {
        uint160 claimant = uint160(makeAddr("claimant"));
        uint16 claimLimit = 1_000;
        additionalProtocolFee = uint64(bound(additionalProtocolFee, 0, 9_000));
        rewardAmount = bound(rewardAmount, 10_000, (type(uint256).max >> 15) / claimLimit);
        uint64 totalFee = uint64(boostCore.protocolFee()) + additionalProtocolFee;
        uint256 amountToMint = (rewardAmount + rewardAmount * totalFee / boostCore.FEE_DENOMINATOR()) * claimLimit;
        mockERC20.mint(address(this), amountToMint);
        mockERC20.approve(address(budget), amountToMint);
        budget.allocate(
            abi.encode(
                ABudget.Transfer({
                    assetType: ABudget.AssetType.ERC20,
                    asset: address(mockERC20),
                    target: address(this),
                    data: abi.encode(ABudget.FungiblePayload({amount: amountToMint}))
                })
            )
        );
        address feeReceiver = makeAddr("0xfee");
        boostCore.setProtocolFeeReceiver(feeReceiver);

        bytes memory createBoostCalldata =
            _makeValidCreateCalldataWithVariableRewardAmount(1, rewardAmount, claimLimit, additionalProtocolFee);

        // Create the boost
        boostCore.createBoost(createBoostCalldata);

        // Get the boost and incentive contract
        BoostLib.Boost memory boost = boostCore.getBoost(0);
        ERC20Incentive incentive = ERC20Incentive(address(boost.incentives[0]));

        // Calculate expected fee
        uint256 claimAmount = incentive.reward();
        uint256 protocolFeePercentage = boost.protocolFee;

        uint256 expectedFee = (claimAmount * protocolFeePercentage) / boostCore.FEE_DENOMINATOR();

        // Mint an ERC721 token to the claimant

        for (uint160 tokenId = 1; tokenId < 1001; tokenId++) {
            hoax(address(claimant + tokenId));
            mockERC721.mint{value: 0.1 ether}(address(this));

            // Record initial balances
            uint256 initialFeeReceiverBalance = mockERC20.balanceOf(feeReceiver);

            // Prepare claim data
            bytes memory data = abi.encode(address(this), abi.encode(tokenId));

            // Expect the fee ProtocolFeesCollected event
            vm.expectEmit();
            emit BoostCore.ProtocolFeesCollected(0, 0, expectedFee, feeReceiver);

            // Perform claim
            hoax(address(claimant + tokenId));
            boostCore.claimIncentive(0, 0, address(0), data);

            // Verify fee transfer
            assertApproxEqAbs(
                mockERC20.balanceOf(feeReceiver),
                initialFeeReceiverBalance + expectedFee,
                boostCore.DUST_THRESHOLD(),
                "Protocol fee not transferred correctly"
            );
        }

        assertEq(0, mockERC20.balanceOf(address(boostCore)), "unclaimedFunds In boost core");
    }

    function testFuzzTopUpAndClaimIncentive_ProtocolFeeTransfer(uint256 rewardAmount, uint64 additionalProtocolFee)
        internal
    {
        uint160 claimant = uint160(makeAddr("claimant"));
        uint16 claimLimit = 100;
        additionalProtocolFee = uint64(bound(additionalProtocolFee, 0, 9_000));
        rewardAmount = bound(rewardAmount, 10_000, (type(uint256).max >> 15) / claimLimit);
        uint64 totalFee = uint64(boostCore.protocolFee()) + additionalProtocolFee;
        uint256 amountToMint = (rewardAmount + rewardAmount * totalFee / boostCore.FEE_DENOMINATOR()) * claimLimit;
        mockERC20.mint(address(this), amountToMint);
        mockERC20.approve(address(budget), amountToMint);
        budget.allocate(
            abi.encode(
                ABudget.Transfer({
                    assetType: ABudget.AssetType.ERC20,
                    asset: address(mockERC20),
                    target: address(this),
                    data: abi.encode(ABudget.FungiblePayload({amount: amountToMint}))
                })
            )
        );
        address feeReceiver = makeAddr("0xfee");
        boostCore.setProtocolFeeReceiver(feeReceiver);

        bytes memory createBoostCalldata =
            _makeValidCreateCalldataWithVariableRewardAmount(1, rewardAmount, claimLimit, additionalProtocolFee);

        // Create the boost
        boostCore.createBoost(createBoostCalldata);

        // Get the boost and incentive contract
        BoostLib.Boost memory boost = boostCore.getBoost(0);
        ERC20Incentive incentive = ERC20Incentive(address(boost.incentives[0]));

        _do_topup(amountToMint, claimLimit, rewardAmount);

        // Calculate expected fee
        uint256 claimAmount = incentive.reward();
        uint256 protocolFeePercentage = boost.protocolFee;

        uint256 expectedFee = (claimAmount * protocolFeePercentage) / boostCore.FEE_DENOMINATOR();

        // Mint an ERC721 token to the claimant

        for (uint160 tokenId = 1; tokenId < 102; tokenId++) {
            hoax(address(claimant + tokenId));
            mockERC721.mint{value: 0.1 ether}(address(this));

            // Record initial balances
            uint256 initialFeeReceiverBalance = mockERC20.balanceOf(feeReceiver);

            // Prepare claim data
            bytes memory data = abi.encode(address(this), abi.encode(tokenId));

            // Expect the fee ProtocolFeesCollected event
            vm.expectEmit();
            emit BoostCore.ProtocolFeesCollected(0, 0, expectedFee, feeReceiver);

            // Perform claim
            hoax(address(claimant + tokenId));
            boostCore.claimIncentive(0, 0, address(0), data);

            // Verify fee transfer
            assertApproxEqAbs(
                mockERC20.balanceOf(feeReceiver),
                initialFeeReceiverBalance + expectedFee,
                boostCore.DUST_THRESHOLD(),
                "Protocol fee not transferred correctly"
            );
        }

        //assertEq(0, mockERC20.balanceOf(address(boostCore)), "unclaimedFunds In boost core");
    }

    function _do_topup(uint256 amountToMint, uint256 claimLimit, uint256 rewardAmount) internal {
        mockERC20.mint(address(this), amountToMint);
        mockERC20.approve(address(budget), amountToMint);

        budget.allocate(
            abi.encode(
                ABudget.Transfer({
                    assetType: ABudget.AssetType.ERC20,
                    asset: address(mockERC20),
                    target: address(this),
                    data: abi.encode(ABudget.FungiblePayload({amount: amountToMint}))
                })
            )
        );

        bytes memory topupCalldata = abi.encode(
            ERC20Incentive.InitPayload({
                asset: address(mockERC20),
                strategy: AERC20Incentive.Strategy.POOL,
                reward: rewardAmount,
                limit: claimLimit,
                manager: address(budget)
            })
        );

        boostCore.topupIncentiveFromBudget(0, 0, topupCalldata, address(budget));
    }

    function testClaimIncentive_ProtocolFeeTransfer() public {
        address feeReceiver = address(0xfee);
        boostCore.setProtocolFeeReceiver(feeReceiver);

        // Create the boost
        boostCore.createBoost(validCreateCalldata);

        // Get the boost and incentive contract
        BoostLib.Boost memory boost = boostCore.getBoost(0);
        ERC20Incentive incentiveContract = ERC20Incentive(address(boost.incentives[0]));

        // Calculate expected fee
        uint256 claimAmount = incentiveContract.reward();
        uint256 protocolFeePercentage = boostCore.protocolFee();

        uint256 expectedFee = (claimAmount * protocolFeePercentage) / boostCore.FEE_DENOMINATOR();

        // Mint an ERC721 token to the claimant
        uint256 tokenId = 1;
        mockERC721.mint{value: 0.1 ether}(address(this));

        // Record initial balances
        uint256 initialFeeReceiverBalance = mockERC20.balanceOf(feeReceiver);

        // Prepare claim data
        bytes memory data = abi.encode(address(this), abi.encode(tokenId));

        // Expect the fee ProtocolFeesCollected event
        vm.expectEmit();
        emit BoostCore.ProtocolFeesCollected(0, 0, expectedFee, feeReceiver);

        // Perform claim
        boostCore.claimIncentive(0, 0, address(0), data);

        // Verify fee transfer
        assertEq(
            mockERC20.balanceOf(feeReceiver),
            initialFeeReceiverBalance + expectedFee,
            "Protocol fee not transferred correctly"
        );
        assertEq(
            mockERC20.balanceOf(address(boostCore)),
            (incentiveContract.limit() - 1) * claimAmount * protocolFeePercentage / boostCore.FEE_DENOMINATOR(),
            "unclaimed funds in boost core"
        );
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
        assertEq(boost.protocolFee, boostCore.protocolFee());
        assertEq(boost.maxParticipants, 10_000);
    }

    /////////////////////////////
    // BoostCore.getBoostCount //
    /////////////////////////////

    function testGetBoostCount() public {
        // Initially, there should be no Boosts
        assertEq(boostCore.getBoostCount(), 0);

        // Create a Boost
        boostCore.createBoost(validCreateCalldata);

        // Now, there should be one Boost
        assertEq(boostCore.getBoostCount(), 1);
    }

    ////////////////////////
    // BoostCore.clawback //
    ////////////////////////
    function testFuzz_SingleClawbackPrecision(uint256 multiple) public {
        // Assume clawbackAmount is between 1 wei and 1 ether for the sake of precision testing
        vm.assume(multiple > 0 && multiple <= 100);
        uint256 clawbackAmount = multiple * 1 ether;

        // Setup: Create a Boost first with the valid calldata
        boostCore.createBoost(validCreateCalldata);
        BoostLib.Boost memory boost = boostCore.getBoost(0);
        uint256 boostId = 0;
        uint256 incentiveId = 0;

        // Ensure the initial balance is sufficient for the clawback
        uint256 initialBalanceIncentive = mockERC20.balanceOf(address(boost.incentives[incentiveId]));
        require(initialBalanceIncentive >= clawbackAmount, "Insufficient initial balance for clawback test");

        // Call clawback
        budget.clawbackFromTarget(address(boostCore), abi.encode(clawbackAmount), boostId, incentiveId);

        // Get the protocol fee that should have been deducted
        uint256 protocolFeeAmount = (clawbackAmount * boostCore.protocolFee()) / boostCore.FEE_DENOMINATOR();

        uint256 finalBalanceIncentive = mockERC20.balanceOf(address(boost.incentives[incentiveId]));

        // Assert the remaining balance matches the expected remaining balance
        assertEq(
            finalBalanceIncentive,
            initialBalanceIncentive - clawbackAmount,
            "Balance after clawback does not match expected"
        );

        // Validate that the protocol fee was sent to the protocolFeeReceiver
        uint256 budgetBalance = mockERC20.balanceOf(address(boost.budget));
        assertEq(
            budgetBalance, protocolFeeAmount + clawbackAmount, "Protocol fee receiver did not receive correct amount"
        );
    }

    function testFuzz_MultipleClawbacks(uint256[] memory multiples) public {
        vm.assume(multiples.length > 0 && multiples.length <= 10); // Assume the array has between 1 and 10 entries

        // Total clawback amount we'll use to ensure the BoostCore has enough balance
        uint256 totalClawbackAmount = 0;

        multiples[0] = bound(multiples[0], 1, 100);
        multiples[0] = multiples[0] * 1 ether;
        totalClawbackAmount += multiples[0];

        // Calculate total clawback amount based on multiples
        uint256 i = 1;
        for (i = 1; (i < multiples.length && totalClawbackAmount < 100 ether); i++) {
            // Assume each multiple is within a valid range to avoid too large values
            multiples[i] = bound(multiples[i], 1, 100 - (totalClawbackAmount / 1 ether));
            multiples[i] = multiples[i] * 1 ether;
            totalClawbackAmount += multiples[i];
        }

        // Setup: Create a Boost first with the valid calldata
        boostCore.createBoost(validCreateCalldata);
        BoostLib.Boost memory boost = boostCore.getBoost(0);
        uint256 boostId = 0;
        uint256 incentiveId = 0;

        // Mint the required ERC20 balance and approve it for the BoostCore contract
        mockERC20.mint(address(boost.incentives[incentiveId]), totalClawbackAmount);
        mockERC20.approve(address(boostCore), totalClawbackAmount);

        // Ensure the initial balance is sufficient for the total clawback amount
        uint256 initialBalanceIncentive = mockERC20.balanceOf(address(boost.incentives[incentiveId]));
        require(initialBalanceIncentive >= totalClawbackAmount, "Insufficient initial balance for clawback test");

        // Initialize cumulative protocol fee tracker and cumulative recipient tracker
        uint256 cumulativeProtocolFee = 0;

        // Execute multiple clawbacks
        uint256 clawbackCount = i;
        for (i = 0; i < clawbackCount; i++) {
            // Call clawback
            budget.clawbackFromTarget(address(boostCore), abi.encode(multiples[i]), boostId, incentiveId);

            // Calculate the protocol fee for this clawback
            uint256 protocolFeeAmount = (multiples[i] * boostCore.protocolFee()) / boostCore.FEE_DENOMINATOR();
            cumulativeProtocolFee += protocolFeeAmount;
        }

        // Calculate the final balances
        uint256 finalBalanceIncentive = mockERC20.balanceOf(address(boost.incentives[incentiveId]));

        // Assert the final balances are as expected
        assertEq(
            finalBalanceIncentive,
            initialBalanceIncentive - totalClawbackAmount,
            "Balance after multiple clawbacks does not match expected"
        );

        // Validate that the total protocol fee was sent to the protocolFeeReceiver
        uint256 budgetBalance = mockERC20.balanceOf(address(boost.budget));
        assertEq(
            budgetBalance,
            cumulativeProtocolFee + totalClawbackAmount,
            "Budget did not receive correct cumulative amount"
        );
    }

    function testClawbackWithZeroAmount() public {
        address recipient = makeAddr("recipient");

        // Setup: Create a Boost first with the valid calldata
        boostCore.createBoost(validCreateCalldata);
        BoostLib.Boost memory boost = boostCore.getBoost(0);
        uint256 boostId = 0;
        uint256 incentiveId = 0;

        // Mint some tokens to ensure there is balance in the incentive
        mockERC20.mint(address(boost.incentives[incentiveId]), 100 ether);
        mockERC20.approve(address(boostCore), 100 ether);

        // Get initial balances
        uint256 initialBalanceIncentive = mockERC20.balanceOf(address(boost.incentives[incentiveId]));
        uint256 initialBalanceRecipient = mockERC20.balanceOf(recipient);
        uint256 initialProtocolReceiverBalance = mockERC20.balanceOf(boostCore.protocolFeeReceiver());

        // Prepare the clawback payload with zero amount
        //bytes memory clawbackData = abi.encode(AIncentive.ClawbackPayload({target: recipient, data: abi.encode(0)}));

        // Call clawback
        AIncentive.ClawbackPayload memory expectedPayload =
            AIncentive.ClawbackPayload({target: address(budget), data: abi.encode(0)});
        vm.expectRevert(
            abi.encodeWithSelector(BoostError.ClawbackFailed.selector, address(budget), abi.encode(expectedPayload))
        );
        budget.clawbackFromTarget(address(boostCore), abi.encode(0), boostId, incentiveId);

        // Assert that no balances have changed
        uint256 finalBalanceIncentive = mockERC20.balanceOf(address(boost.incentives[incentiveId]));
        uint256 finalBalanceRecipient = mockERC20.balanceOf(recipient);
        uint256 finalProtocolReceiverBalance = mockERC20.balanceOf(boostCore.protocolFeeReceiver());

        assertEq(finalBalanceIncentive, initialBalanceIncentive, "Incentive balance should remain unchanged");
        assertEq(finalBalanceRecipient, initialBalanceRecipient, "Recipient balance should remain unchanged");
        assertEq(
            finalProtocolReceiverBalance,
            initialProtocolReceiverBalance,
            "Protocol fee receiver balance should remain unchanged"
        );
    }

    ///////////////////////////
    // BoostCore.setProtocolFeeReceiver //
    ///////////////////////////

    function testSetProtocolFeeReceiver() public {
        address newReceiver = address(2);
        boostCore.setProtocolFeeReceiver(newReceiver);
        assertEq(boostCore.protocolFeeReceiver(), newReceiver);
    }

    //////////////////////////////
    // BoostCore.setProtocolFee //
    //////////////////////////////

    function testSetProtocolFee() public {
        uint64 newProtocolFee = 700; // 7%
        boostCore.setProtocolFee(newProtocolFee);
        assertEq(boostCore.protocolFee(), newProtocolFee);
    }

    ////////////////////////////////////
    // BoostCore.setProtocolFeeModule //
    ////////////////////////////////////

    function testSetProtocolFeeModule() public {
        // Create a mock protocol fee module
        uint64 mockFee = 500; // 5%
        MockProtocolFeeModule mockModule = new MockProtocolFeeModule(mockFee);

        // Set the protocol fee module
        boostCore.setProtocolFeeModule(address(mockModule));

        // Verify that the protocol fee module is set correctly
        assertEq(boostCore.protocolFeeModule(), address(mockModule), "Protocol fee module not set correctly");
    }

    function testSetProtocolFeeModule_Unauthorized() public {
        // Create a mock protocol fee module
        uint64 mockFee = 500; // 5%
        MockProtocolFeeModule mockModule = new MockProtocolFeeModule(mockFee);

        // Attempt to set the protocol fee module from a non-owner account
        address unauthorizedUser = makeAddr("unauthorizedUser");
        vm.prank(unauthorizedUser);
        vm.expectRevert(BoostError.Unauthorized.selector);
        boostCore.setProtocolFeeModule(address(mockModule));
    }

    ///////////////////////////
    // Test Helper Functions //
    ///////////////////////////

    function _makeValidCreateCalldataWithVariableRewardAmount(
        uint256 incentiveCount,
        uint256 rewardAmount,
        uint16 claimLimit,
        uint64 protocolFee
    ) internal returns (bytes memory createCalldata) {
        createCalldata = LibZip.cdCompress(
            abi.encode(
                BoostLib.CreateBoostPayload({
                    budget: budget,
                    action: action,
                    validator: BoostLib.Target({isBase: true, instance: address(0), parameters: ""}),
                    allowList: _makeDenyList(),
                    incentives: _makeIncentives(incentiveCount, rewardAmount, claimLimit),
                    protocolFee: protocolFee,
                    maxParticipants: 10_000,
                    owner: address(1)
                })
            )
        );
    }

    function _makeERC721MintAction(address target, bytes4 selector, uint256 value)
        internal
        returns (BoostLib.Target memory)
    {
        return BoostLib.Target({
            isBase: true,
            instance: address(new ERC721MintAction()),
            parameters: abi.encode(
                AContractAction.InitPayload({chainId: block.chainid, target: target, selector: selector, value: value})
            )
        });
    }

    function _makeContractAction(address target, bytes4 selector, uint256 value)
        internal
        returns (BoostLib.Target memory)
    {
        return BoostLib.Target({
            isBase: true,
            instance: address(new ContractAction()),
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

    function _makeDenyList() internal returns (BoostLib.Target memory) {
        address[] memory list = new address[](0);
        return BoostLib.Target({
            isBase: true,
            instance: address(new SimpleDenyList()),
            parameters: abi.encode(address(0), list)
        });
    }

    function _makeBudget(address owner_, address[] memory authorized_, uint256[] memory roles_)
        internal
        returns (ABudget _budget)
    {
        _budget = ABudget(payable(address(new ManagedBudget()).clone()));
        _budget.initialize(
            abi.encode(ManagedBudget.InitPayload({owner: owner_, authorized: authorized_, roles: roles_}))
        );
    }

    function _makeIncentives(uint256 count, uint256 rewardAmount, uint16 limit)
        internal
        returns (BoostLib.Target[] memory)
    {
        BoostLib.Target[] memory incentives = new BoostLib.Target[](count);
        for (uint256 i = 0; i < count; i++) {
            incentives[i] = BoostLib.Target({
                isBase: true,
                instance: address(new ERC20Incentive()),
                parameters: abi.encode(
                    ERC20Incentive.InitPayload({
                        asset: address(mockERC20),
                        strategy: AERC20Incentive.Strategy.POOL,
                        reward: rewardAmount,
                        limit: limit,
                        manager: address(budget)
                    })
                )
            });
        }
        return incentives;
    }
}
