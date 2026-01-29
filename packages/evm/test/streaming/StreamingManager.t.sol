// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Test, Vm} from "lib/forge-std/src/Test.sol";

import {LibClone} from "@solady/utils/LibClone.sol";
import {SafeTransferLib} from "@solady/utils/SafeTransferLib.sol";

import {MockERC20} from "contracts/shared/Mocks.sol";
import {ABudget} from "contracts/budgets/ABudget.sol";
import {ManagedBudget} from "contracts/budgets/ManagedBudget.sol";
import {StreamingManager} from "contracts/streaming/StreamingManager.sol";
import {StreamingCampaign} from "contracts/streaming/StreamingCampaign.sol";

contract StreamingManagerTest is Test {
    MockERC20 rewardToken;
    ManagedBudget budget;
    StreamingManager manager;
    StreamingCampaign campaignImpl;

    address constant PROTOCOL_FEE_RECEIVER = address(0xFEE);
    address constant CREATOR = address(0xCAFE);
    uint64 constant PROTOCOL_FEE = 1000; // 10%

    function setUp() public {
        // Deploy mock ERC20 reward token
        rewardToken = new MockERC20();

        // Deploy StreamingCampaign implementation
        campaignImpl = new StreamingCampaign();

        // Deploy StreamingManager
        manager = new StreamingManager(address(campaignImpl), PROTOCOL_FEE, PROTOCOL_FEE_RECEIVER);

        // Deploy and initialize ManagedBudget
        budget = ManagedBudget(payable(LibClone.clone(address(new ManagedBudget()))));

        // Set up authorized addresses: owner (this), CREATOR, and manager
        address[] memory authorized = new address[](2);
        authorized[0] = CREATOR;
        authorized[1] = address(manager);
        uint256[] memory roles = new uint256[](2);
        roles[0] = budget.MANAGER_ROLE();
        roles[1] = budget.MANAGER_ROLE();

        budget.initialize(
            abi.encode(ManagedBudget.InitPayload({owner: address(this), authorized: authorized, roles: roles}))
        );

        // Fund the budget with tokens
        rewardToken.mint(address(this), 100 ether);
        rewardToken.approve(address(budget), 100 ether);
        budget.allocate(_makeERC20Allocation(address(rewardToken), 100 ether));
    }

    ////////////////////////////////
    // StreamingManager.createCampaign - Success cases
    ////////////////////////////////

    function test_CreateCampaign_Success() public {
        uint256 totalAmount = 10 ether;
        uint64 startTime = uint64(block.timestamp + 1 hours);
        uint64 endTime = uint64(block.timestamp + 30 days);
        bytes32 configHash = keccak256("test-config");

        vm.prank(CREATOR);
        uint256 campaignId =
            manager.createCampaign(budget, configHash, address(rewardToken), totalAmount, startTime, endTime);

        assertEq(campaignId, 1, "Campaign ID should be 1");

        address campaignAddr = manager.getCampaign(campaignId);
        assertTrue(campaignAddr != address(0), "Campaign address should not be zero");

        StreamingCampaign campaign = StreamingCampaign(campaignAddr);
        assertEq(campaign.streamingManager(), address(manager), "Manager should be set");
        assertEq(campaign.budget(), address(budget), "Budget should be set");
        assertEq(campaign.creator(), CREATOR, "Creator should be set");
        assertEq(campaign.configHash(), configHash, "Config hash should be set");
        assertEq(campaign.rewardToken(), address(rewardToken), "Reward token should be set");
        assertEq(campaign.startTime(), startTime, "Start time should be set");
        assertEq(campaign.endTime(), endTime, "End time should be set");
    }

    function test_CreateCampaign_FeeCalculation() public {
        uint256 totalAmount = 10 ether;
        uint64 startTime = uint64(block.timestamp + 1 hours);
        uint64 endTime = uint64(block.timestamp + 30 days);
        bytes32 configHash = keccak256("test-config");

        // Expected: 10% fee = 1 ether, net = 9 ether
        uint256 expectedFee = (totalAmount * PROTOCOL_FEE) / 10000;
        uint256 expectedNet = totalAmount - expectedFee;

        uint256 feeReceiverBalanceBefore = rewardToken.balanceOf(PROTOCOL_FEE_RECEIVER);

        vm.prank(CREATOR);
        uint256 campaignId =
            manager.createCampaign(budget, configHash, address(rewardToken), totalAmount, startTime, endTime);

        address campaignAddr = manager.getCampaign(campaignId);

        // Check fee was sent to fee receiver
        assertEq(
            rewardToken.balanceOf(PROTOCOL_FEE_RECEIVER),
            feeReceiverBalanceBefore + expectedFee,
            "Fee should be sent to fee receiver"
        );

        // Check campaign received net amount
        assertEq(rewardToken.balanceOf(campaignAddr), expectedNet, "Campaign should receive net amount");

        // Check totalRewards in campaign
        StreamingCampaign campaign = StreamingCampaign(campaignAddr);
        assertEq(campaign.totalRewards(), expectedNet, "totalRewards should equal net amount");
    }

    function test_CreateCampaign_ZeroFee() public {
        // Deploy manager with 0% fee
        StreamingManager zeroFeeManager = new StreamingManager(address(campaignImpl), 0, PROTOCOL_FEE_RECEIVER);

        // Authorize manager on budget
        address[] memory accounts = new address[](1);
        accounts[0] = address(zeroFeeManager);
        bool[] memory authorized = new bool[](1);
        authorized[0] = true;
        budget.setAuthorized(accounts, authorized);

        uint256 totalAmount = 10 ether;
        uint64 startTime = uint64(block.timestamp + 1 hours);
        uint64 endTime = uint64(block.timestamp + 30 days);
        bytes32 configHash = keccak256("test-config");

        uint256 feeReceiverBalanceBefore = rewardToken.balanceOf(PROTOCOL_FEE_RECEIVER);

        vm.prank(CREATOR);
        uint256 campaignId =
            zeroFeeManager.createCampaign(budget, configHash, address(rewardToken), totalAmount, startTime, endTime);

        address campaignAddr = zeroFeeManager.getCampaign(campaignId);

        // No fee should be taken
        assertEq(
            rewardToken.balanceOf(PROTOCOL_FEE_RECEIVER), feeReceiverBalanceBefore, "No fee should be taken with 0% fee"
        );

        // Campaign should receive full amount
        assertEq(rewardToken.balanceOf(campaignAddr), totalAmount, "Campaign should receive full amount");
    }

    function test_CreateCampaign_EmitsCampaignCreated() public {
        uint256 totalAmount = 10 ether;
        uint64 startTime = uint64(block.timestamp + 1 hours);
        uint64 endTime = uint64(block.timestamp + 30 days);
        bytes32 configHash = keccak256("test-config");
        uint256 expectedNet = totalAmount - (totalAmount * PROTOCOL_FEE) / 10000;

        vm.prank(CREATOR);
        vm.expectEmit(true, true, true, false);
        // We can't predict the campaign address, so we use false for non-indexed data check
        emit StreamingManager.CampaignCreated(
            1, // campaignId
            configHash,
            address(0), // campaign address unknown
            CREATOR,
            address(rewardToken),
            expectedNet,
            startTime,
            endTime
        );
        manager.createCampaign(budget, configHash, address(rewardToken), totalAmount, startTime, endTime);
    }

    function test_CreateCampaign_MultipleCampaigns() public {
        uint64 startTime = uint64(block.timestamp + 1 hours);
        uint64 endTime = uint64(block.timestamp + 30 days);

        vm.startPrank(CREATOR);

        uint256 id1 =
            manager.createCampaign(budget, keccak256("config-1"), address(rewardToken), 5 ether, startTime, endTime);

        uint256 id2 =
            manager.createCampaign(budget, keccak256("config-2"), address(rewardToken), 5 ether, startTime, endTime);

        vm.stopPrank();

        assertEq(id1, 1, "First campaign ID should be 1");
        assertEq(id2, 2, "Second campaign ID should be 2");
        assertTrue(manager.getCampaign(1) != manager.getCampaign(2), "Campaigns should be different addresses");
    }

    function test_CreateCampaign_MaxFee() public {
        // Deploy manager with 100% fee
        StreamingManager maxFeeManager = new StreamingManager(address(campaignImpl), 10000, PROTOCOL_FEE_RECEIVER);

        // Authorize manager on budget
        address[] memory accounts = new address[](1);
        accounts[0] = address(maxFeeManager);
        bool[] memory authorized = new bool[](1);
        authorized[0] = true;
        budget.setAuthorized(accounts, authorized);

        uint256 totalAmount = 10 ether;
        uint64 startTime = uint64(block.timestamp + 1 hours);
        uint64 endTime = uint64(block.timestamp + 30 days);
        bytes32 configHash = keccak256("test-config");

        uint256 feeReceiverBalanceBefore = rewardToken.balanceOf(PROTOCOL_FEE_RECEIVER);

        vm.prank(CREATOR);
        uint256 campaignId =
            maxFeeManager.createCampaign(budget, configHash, address(rewardToken), totalAmount, startTime, endTime);

        address campaignAddr = maxFeeManager.getCampaign(campaignId);
        StreamingCampaign campaign = StreamingCampaign(campaignAddr);

        // Fee receiver gets 100% of tokens
        assertEq(
            rewardToken.balanceOf(PROTOCOL_FEE_RECEIVER),
            feeReceiverBalanceBefore + totalAmount,
            "Fee receiver should get all tokens"
        );

        // Campaign gets 0 tokens
        assertEq(rewardToken.balanceOf(campaignAddr), 0, "Campaign should receive no tokens");

        // Campaign still initializes with totalRewards = 0
        assertEq(campaign.totalRewards(), 0, "totalRewards should be 0");
        assertEq(campaign.streamingManager(), address(maxFeeManager), "Manager should be set");
        assertEq(campaign.creator(), CREATOR, "Creator should be set");
    }

    ////////////////////////////////
    // StreamingManager.createCampaign - Revert cases
    ////////////////////////////////

    function test_CreateCampaign_RevertUnauthorized() public {
        address unauthorized = address(0xBAD);
        uint64 startTime = uint64(block.timestamp + 1 hours);
        uint64 endTime = uint64(block.timestamp + 30 days);

        vm.prank(unauthorized);
        vm.expectRevert(StreamingManager.NotAuthorizedOnBudget.selector);
        manager.createCampaign(budget, keccak256("test"), address(rewardToken), 10 ether, startTime, endTime);
    }

    function test_CreateCampaign_RevertStartTimeInPast() public {
        uint64 startTime = uint64(block.timestamp - 1); // In the past
        uint64 endTime = uint64(block.timestamp + 30 days);

        vm.prank(CREATOR);
        vm.expectRevert(StreamingManager.StartTimeInPast.selector);
        manager.createCampaign(budget, keccak256("test"), address(rewardToken), 10 ether, startTime, endTime);
    }

    function test_CreateCampaign_RevertEndBeforeStart() public {
        uint64 startTime = uint64(block.timestamp + 1 hours);
        uint64 endTime = startTime; // Same as start, not after

        vm.prank(CREATOR);
        vm.expectRevert(StreamingManager.EndTimeBeforeStart.selector);
        manager.createCampaign(budget, keccak256("test"), address(rewardToken), 10 ether, startTime, endTime);
    }

    function test_CreateCampaign_RevertZeroAmount() public {
        uint64 startTime = uint64(block.timestamp + 1 hours);
        uint64 endTime = uint64(block.timestamp + 30 days);

        vm.prank(CREATOR);
        vm.expectRevert(StreamingManager.ZeroAmount.selector);
        manager.createCampaign(budget, keccak256("test"), address(rewardToken), 0, startTime, endTime);
    }

    function test_CreateCampaign_RevertInvalidRewardToken() public {
        uint64 startTime = uint64(block.timestamp + 1 hours);
        uint64 endTime = uint64(block.timestamp + 30 days);

        vm.prank(CREATOR);
        vm.expectRevert(StreamingManager.InvalidRewardToken.selector);
        manager.createCampaign(budget, keccak256("test"), address(0), 10 ether, startTime, endTime);
    }

    function test_CreateCampaign_RevertInsufficientFunds() public {
        uint64 startTime = uint64(block.timestamp + 1 hours);
        uint64 endTime = uint64(block.timestamp + 30 days);

        // Budget has 100 ether. Requesting 1000 ether:
        // - Fee (10%) = 100 ether -> succeeds, budget now has 0
        // - Net rewards = 900 ether -> fails with InsufficientFunds
        vm.prank(CREATOR);
        vm.expectRevert(
            abi.encodeWithSelector(
                ABudget.InsufficientFunds.selector, address(rewardToken), uint256(0), uint256(900 ether)
            )
        );
        manager.createCampaign(budget, keccak256("test"), address(rewardToken), 1000 ether, startTime, endTime);
    }

    function test_CreateCampaign_RevertDisburseFailed() public {
        uint64 startTime = uint64(block.timestamp + 1 hours);
        uint64 endTime = uint64(block.timestamp + 30 days);

        // Mock budget.disburse to return false (covers defensive code path)
        vm.mockCall(address(budget), abi.encodeWithSelector(ABudget.disburse.selector), abi.encode(false));

        vm.prank(CREATOR);
        vm.expectRevert(StreamingManager.DisburseFailed.selector);
        manager.createCampaign(budget, keccak256("test"), address(rewardToken), 10 ether, startTime, endTime);

        vm.clearMockedCalls();
    }

    ////////////////////////////////
    // StreamingCampaign.initialize - Revert cases
    ////////////////////////////////

    function test_CampaignInitialize_RevertDoubleInit() public {
        // Create a campaign first
        uint64 startTime = uint64(block.timestamp + 1 hours);
        uint64 endTime = uint64(block.timestamp + 30 days);

        vm.prank(CREATOR);
        uint256 campaignId =
            manager.createCampaign(budget, keccak256("test"), address(rewardToken), 10 ether, startTime, endTime);

        address campaignAddr = manager.getCampaign(campaignId);
        StreamingCampaign campaign = StreamingCampaign(campaignAddr);

        // Try to initialize again
        vm.expectRevert(); // Initializable: already initialized
        campaign.initialize(
            address(manager),
            address(budget),
            CREATOR,
            keccak256("test"),
            address(rewardToken),
            9 ether,
            startTime,
            endTime
        );
    }

    function test_CampaignImpl_RevertInitialize() public {
        // Try to initialize the implementation contract directly
        vm.expectRevert(); // Initializable: already initialized
        campaignImpl.initialize(
            address(manager),
            address(budget),
            CREATOR,
            keccak256("test"),
            address(rewardToken),
            10 ether,
            uint64(block.timestamp + 1 hours),
            uint64(block.timestamp + 30 days)
        );
    }

    function test_CampaignInitialize_RevertNotStreamingManager() public {
        // Manually clone the campaign implementation
        address clone = LibClone.clone(address(campaignImpl));

        // Try to initialize from a non-manager address
        vm.expectRevert(StreamingCampaign.OnlyStreamingManager.selector);
        StreamingCampaign(clone).initialize(
            address(manager),
            address(budget),
            CREATOR,
            keccak256("test"),
            address(rewardToken),
            10 ether,
            uint64(block.timestamp + 1 hours),
            uint64(block.timestamp + 30 days)
        );
    }

    function test_CampaignInitialize_MerkleRootIsZero() public {
        // Create a campaign
        uint64 startTime = uint64(block.timestamp + 1 hours);
        uint64 endTime = uint64(block.timestamp + 30 days);

        vm.prank(CREATOR);
        uint256 campaignId =
            manager.createCampaign(budget, keccak256("test"), address(rewardToken), 10 ether, startTime, endTime);

        StreamingCampaign campaign = StreamingCampaign(manager.getCampaign(campaignId));

        // Merkle root should be zero (not set yet)
        assertEq(campaign.merkleRoot(), bytes32(0), "Merkle root should be zero after initialization");
    }

    function test_CampaignInitialize_EmitsCampaignInitializedEvent() public {
        uint256 totalAmount = 10 ether;
        uint64 startTime = uint64(block.timestamp + 1 hours);
        uint64 endTime = uint64(block.timestamp + 30 days);
        bytes32 configHash = keccak256("test-config");
        // We expect the CampaignInitialized event from StreamingCampaign
        // Since we can't predict the campaign address, we check the event is emitted
        vm.prank(CREATOR);
        vm.recordLogs();
        manager.createCampaign(budget, configHash, address(rewardToken), totalAmount, startTime, endTime);

        // Check that CampaignInitialized event was emitted
        Vm.Log[] memory logs = vm.getRecordedLogs();
        bool foundEvent = false;
        bytes32 eventSig =
            keccak256("CampaignInitialized(address,address,address,bytes32,address,uint256,uint64,uint64)");

        for (uint256 i = 0; i < logs.length; i++) {
            if (logs[i].topics[0] == eventSig) {
                foundEvent = true;
                // Verify indexed params
                assertEq(logs[i].topics[1], bytes32(uint256(uint160(address(manager)))), "Manager should be indexed");
                assertEq(logs[i].topics[2], bytes32(uint256(uint160(address(budget)))), "Budget should be indexed");
                assertEq(logs[i].topics[3], bytes32(uint256(uint160(CREATOR))), "Creator should be indexed");
                break;
            }
        }
        assertTrue(foundEvent, "CampaignInitialized event should be emitted");
    }

    ////////////////////////////////
    // Constructor tests
    ////////////////////////////////

    function test_Constructor_SetsProtocolFee() public view {
        assertEq(manager.protocolFee(), PROTOCOL_FEE, "Protocol fee should be set");
    }

    function test_Constructor_SetsProtocolFeeReceiver() public view {
        assertEq(manager.protocolFeeReceiver(), PROTOCOL_FEE_RECEIVER, "Fee receiver should be set");
    }

    function test_Constructor_SetsOwner() public view {
        assertEq(manager.owner(), address(this), "Owner should be deployer");
    }

    function test_Constructor_RevertZeroFeeReceiver() public {
        vm.expectRevert(StreamingManager.ZeroFeeReceiver.selector);
        new StreamingManager(address(campaignImpl), PROTOCOL_FEE, address(0));
    }

    function test_Constructor_RevertInvalidImplementation() public {
        vm.expectRevert(StreamingManager.InvalidImplementation.selector);
        new StreamingManager(address(0), PROTOCOL_FEE, PROTOCOL_FEE_RECEIVER);
    }

    function test_Constructor_RevertProtocolFeeTooHigh() public {
        vm.expectRevert(StreamingManager.ProtocolFeeTooHigh.selector);
        new StreamingManager(address(campaignImpl), 10001, PROTOCOL_FEE_RECEIVER); // >100%
    }

    function test_Constructor_MaxProtocolFee() public {
        // 100% fee (10000 bps) should be allowed
        StreamingManager maxFeeManager = new StreamingManager(address(campaignImpl), 10000, PROTOCOL_FEE_RECEIVER);
        assertEq(maxFeeManager.protocolFee(), 10000, "100% fee should be valid");
    }

    ////////////////////////////////
    // setProtocolFee tests
    ////////////////////////////////

    function test_SetProtocolFee_Success() public {
        uint64 newFee = 500; // 5%

        vm.expectEmit(true, true, true, true);
        emit StreamingManager.ProtocolFeeUpdated(PROTOCOL_FEE, newFee);
        manager.setProtocolFee(newFee);

        assertEq(manager.protocolFee(), newFee, "Protocol fee should be updated");
    }

    function test_SetProtocolFee_RevertNotOwner() public {
        vm.prank(CREATOR);
        vm.expectRevert(); // Ownable.Unauthorized
        manager.setProtocolFee(500);
    }

    function test_SetProtocolFee_RevertFeeTooHigh() public {
        vm.expectRevert(StreamingManager.ProtocolFeeTooHigh.selector);
        manager.setProtocolFee(10001); // >100%
    }

    function test_SetProtocolFee_MaxFee() public {
        manager.setProtocolFee(10000); // 100%
        assertEq(manager.protocolFee(), 10000, "Max fee should be allowed");
    }

    ////////////////////////////////
    // setProtocolFeeReceiver tests
    ////////////////////////////////

    function test_SetProtocolFeeReceiver_Success() public {
        address newReceiver = address(0xBEEF);

        vm.expectEmit(true, true, true, true);
        emit StreamingManager.ProtocolFeeReceiverUpdated(PROTOCOL_FEE_RECEIVER, newReceiver);
        manager.setProtocolFeeReceiver(newReceiver);

        assertEq(manager.protocolFeeReceiver(), newReceiver, "Fee receiver should be updated");
    }

    function test_SetProtocolFeeReceiver_RevertNotOwner() public {
        vm.prank(CREATOR);
        vm.expectRevert(); // Ownable.Unauthorized
        manager.setProtocolFeeReceiver(address(0xBEEF));
    }

    function test_SetProtocolFeeReceiver_RevertZeroAddress() public {
        vm.expectRevert(StreamingManager.ZeroFeeReceiver.selector);
        manager.setProtocolFeeReceiver(address(0));
    }

    ////////////////////////////////
    // Helper functions
    ////////////////////////////////

    function _makeERC20Allocation(address asset, uint256 amount) internal view returns (bytes memory) {
        return abi.encode(
            ABudget.Transfer({
                assetType: ABudget.AssetType.ERC20,
                asset: asset,
                target: address(this),
                data: abi.encode(ABudget.FungiblePayload({amount: amount}))
            })
        );
    }
}
