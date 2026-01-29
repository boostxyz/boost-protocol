// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Test, Vm} from "lib/forge-std/src/Test.sol";

import {LibClone} from "@solady/utils/LibClone.sol";
import {MerkleProofLib} from "@solady/utils/MerkleProofLib.sol";
import {SafeTransferLib} from "@solady/utils/SafeTransferLib.sol";

import {MockERC20} from "contracts/shared/Mocks.sol";
import {ABudget} from "contracts/budgets/ABudget.sol";
import {ManagedBudget} from "contracts/budgets/ManagedBudget.sol";
import {StreamingManager} from "contracts/streaming/StreamingManager.sol";
import {StreamingCampaign} from "contracts/streaming/StreamingCampaign.sol";

contract StreamingManagerTest is Test {
    MockERC20 rewardToken;
    ManagedBudget budget;
    StreamingManager managerImpl;
    StreamingManager manager;
    StreamingCampaign campaignImpl;

    address constant PROTOCOL_FEE_RECEIVER = address(0xFEE);
    address constant CREATOR = address(0xCAFE);
    address constant CLAIMER = address(0xC1A1);
    address constant CLAIMER2 = address(0xC1A2);
    uint64 constant PROTOCOL_FEE = 1000; // 10%

    function setUp() public {
        // Deploy mock ERC20 reward token
        rewardToken = new MockERC20();

        // Deploy StreamingCampaign implementation
        campaignImpl = new StreamingCampaign();

        // Deploy StreamingManager implementation and proxy
        managerImpl = new StreamingManager();
        address proxy = LibClone.deployERC1967(address(managerImpl));
        manager = StreamingManager(proxy);
        manager.initialize(address(this), address(campaignImpl), PROTOCOL_FEE, PROTOCOL_FEE_RECEIVER);

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
        StreamingManager zeroFeeImpl = new StreamingManager();
        address zeroFeeProxy = LibClone.deployERC1967(address(zeroFeeImpl));
        StreamingManager zeroFeeManager = StreamingManager(zeroFeeProxy);
        zeroFeeManager.initialize(address(this), address(campaignImpl), 0, PROTOCOL_FEE_RECEIVER);

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
        StreamingManager maxFeeImpl = new StreamingManager();
        address maxFeeProxy = LibClone.deployERC1967(address(maxFeeImpl));
        StreamingManager maxFeeManager = StreamingManager(maxFeeProxy);
        maxFeeManager.initialize(address(this), address(campaignImpl), 10000, PROTOCOL_FEE_RECEIVER);

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
    // Initialize tests
    ////////////////////////////////

    function test_Initialize_SetsProtocolFee() public view {
        assertEq(manager.protocolFee(), PROTOCOL_FEE, "Protocol fee should be set");
    }

    function test_Initialize_SetsProtocolFeeReceiver() public view {
        assertEq(manager.protocolFeeReceiver(), PROTOCOL_FEE_RECEIVER, "Fee receiver should be set");
    }

    function test_Initialize_SetsOwner() public view {
        assertEq(manager.owner(), address(this), "Owner should be deployer");
    }

    function test_Initialize_SetsCampaignImplementation() public view {
        assertEq(manager.campaignImplementation(), address(campaignImpl), "Campaign implementation should be set");
    }

    function test_Initialize_RevertZeroFeeReceiver() public {
        StreamingManager impl = new StreamingManager();
        address proxy = LibClone.deployERC1967(address(impl));
        vm.expectRevert(StreamingManager.ZeroFeeReceiver.selector);
        StreamingManager(proxy).initialize(address(this), address(campaignImpl), PROTOCOL_FEE, address(0));
    }

    function test_Initialize_RevertInvalidImplementation() public {
        StreamingManager impl = new StreamingManager();
        address proxy = LibClone.deployERC1967(address(impl));
        vm.expectRevert(StreamingManager.InvalidImplementation.selector);
        StreamingManager(proxy).initialize(address(this), address(0), PROTOCOL_FEE, PROTOCOL_FEE_RECEIVER);
    }

    function test_Initialize_RevertProtocolFeeTooHigh() public {
        StreamingManager impl = new StreamingManager();
        address proxy = LibClone.deployERC1967(address(impl));
        vm.expectRevert(StreamingManager.ProtocolFeeTooHigh.selector);
        StreamingManager(proxy).initialize(address(this), address(campaignImpl), 10001, PROTOCOL_FEE_RECEIVER);
    }

    function test_Initialize_MaxProtocolFee() public {
        // 100% fee (10000 bps) should be allowed
        StreamingManager impl = new StreamingManager();
        address proxy = LibClone.deployERC1967(address(impl));
        StreamingManager maxFeeManager = StreamingManager(proxy);
        maxFeeManager.initialize(address(this), address(campaignImpl), 10000, PROTOCOL_FEE_RECEIVER);
        assertEq(maxFeeManager.protocolFee(), 10000, "100% fee should be valid");
    }

    function test_Initialize_RevertDoubleInit() public {
        vm.expectRevert(); // Initializable: InvalidInitialization
        manager.initialize(address(this), address(campaignImpl), PROTOCOL_FEE, PROTOCOL_FEE_RECEIVER);
    }

    function test_Initialize_RevertImplementationDirectly() public {
        vm.expectRevert(); // Initializable: InvalidInitialization
        managerImpl.initialize(address(this), address(campaignImpl), PROTOCOL_FEE, PROTOCOL_FEE_RECEIVER);
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
    // setCampaignImplementation tests
    ////////////////////////////////

    function test_SetCampaignImplementation_Success() public {
        StreamingCampaign newImpl = new StreamingCampaign();

        vm.expectEmit(true, true, true, true);
        emit StreamingManager.CampaignImplementationUpdated(address(campaignImpl), address(newImpl));
        manager.setCampaignImplementation(address(newImpl));

        assertEq(manager.campaignImplementation(), address(newImpl), "Implementation should be updated");
    }

    function test_SetCampaignImplementation_RevertNotOwner() public {
        StreamingCampaign newImpl = new StreamingCampaign();

        vm.prank(CREATOR);
        vm.expectRevert(); // Ownable.Unauthorized
        manager.setCampaignImplementation(address(newImpl));
    }

    function test_SetCampaignImplementation_RevertZeroAddress() public {
        vm.expectRevert(StreamingManager.InvalidImplementation.selector);
        manager.setCampaignImplementation(address(0));
    }

    function test_SetCampaignImplementation_NewCampaignsUseNewImpl() public {
        // Create a new campaign implementation
        StreamingCampaign newImpl = new StreamingCampaign();
        manager.setCampaignImplementation(address(newImpl));

        // Create a campaign - should use the new implementation
        uint64 startTime = uint64(block.timestamp + 1 hours);
        uint64 endTime = uint64(block.timestamp + 30 days);

        vm.prank(CREATOR);
        uint256 campaignId =
            manager.createCampaign(budget, keccak256("test"), address(rewardToken), 5 ether, startTime, endTime);

        address campaignAddr = manager.getCampaign(campaignId);
        assertTrue(campaignAddr != address(0), "Campaign should be created");
    }

    ////////////////////////////////
    // setOperator tests
    ////////////////////////////////

    function test_SetOperator_Success() public {
        address newOperator = address(0x0BE8);

        vm.expectEmit(true, true, true, true);
        emit StreamingManager.OperatorUpdated(address(0), newOperator);
        manager.setOperator(newOperator);

        assertEq(manager.operator(), newOperator, "Operator should be updated");
    }

    function test_SetOperator_RevertNotOwner() public {
        vm.prank(CREATOR);
        vm.expectRevert(); // Ownable.Unauthorized
        manager.setOperator(address(0x0BE8));
    }

    function test_SetOperator_AllowsZeroAddress() public {
        // First set an operator
        manager.setOperator(address(0x0BE8));
        assertEq(manager.operator(), address(0x0BE8), "Operator should be set");

        // Then disable by setting to zero
        vm.expectEmit(true, true, true, true);
        emit StreamingManager.OperatorUpdated(address(0x0BE8), address(0));
        manager.setOperator(address(0));

        assertEq(manager.operator(), address(0), "Operator should be zero (disabled)");
    }

    ////////////////////////////////
    // updateRoot tests
    ////////////////////////////////

    function test_UpdateRoot_SuccessAsOwner() public {
        // Create a campaign first
        uint64 startTime = uint64(block.timestamp + 1 hours);
        uint64 endTime = uint64(block.timestamp + 30 days);

        vm.prank(CREATOR);
        uint256 campaignId =
            manager.createCampaign(budget, keccak256("test"), address(rewardToken), 10 ether, startTime, endTime);

        bytes32 newRoot = keccak256("merkle-root-1");

        vm.expectEmit(true, true, true, true);
        emit StreamingManager.RootUpdated(campaignId, bytes32(0), newRoot);
        manager.updateRoot(campaignId, newRoot);

        StreamingCampaign campaign = StreamingCampaign(manager.getCampaign(campaignId));
        assertEq(campaign.merkleRoot(), newRoot, "Merkle root should be updated");
    }

    function test_UpdateRoot_SuccessAsOperator() public {
        address operatorAddr = address(0x0BE8);
        manager.setOperator(operatorAddr);

        // Create a campaign
        uint64 startTime = uint64(block.timestamp + 1 hours);
        uint64 endTime = uint64(block.timestamp + 30 days);

        vm.prank(CREATOR);
        uint256 campaignId =
            manager.createCampaign(budget, keccak256("test"), address(rewardToken), 10 ether, startTime, endTime);

        bytes32 newRoot = keccak256("merkle-root-1");

        vm.prank(operatorAddr);
        vm.expectEmit(true, true, true, true);
        emit StreamingManager.RootUpdated(campaignId, bytes32(0), newRoot);
        manager.updateRoot(campaignId, newRoot);

        StreamingCampaign campaign = StreamingCampaign(manager.getCampaign(campaignId));
        assertEq(campaign.merkleRoot(), newRoot, "Merkle root should be updated by operator");
    }

    function test_UpdateRoot_MultipleUpdates() public {
        // Create a campaign
        uint64 startTime = uint64(block.timestamp + 1 hours);
        uint64 endTime = uint64(block.timestamp + 30 days);

        vm.prank(CREATOR);
        uint256 campaignId =
            manager.createCampaign(budget, keccak256("test"), address(rewardToken), 10 ether, startTime, endTime);

        bytes32 root1 = keccak256("merkle-root-1");
        bytes32 root2 = keccak256("merkle-root-2");

        // First update
        manager.updateRoot(campaignId, root1);

        StreamingCampaign campaign = StreamingCampaign(manager.getCampaign(campaignId));
        assertEq(campaign.merkleRoot(), root1, "First root should be set");

        // Second update - should emit with old root
        vm.expectEmit(true, true, true, true);
        emit StreamingManager.RootUpdated(campaignId, root1, root2);
        manager.updateRoot(campaignId, root2);

        assertEq(campaign.merkleRoot(), root2, "Second root should be set");
    }

    function test_UpdateRoot_RevertNotAuthorized() public {
        // Create a campaign
        uint64 startTime = uint64(block.timestamp + 1 hours);
        uint64 endTime = uint64(block.timestamp + 30 days);

        vm.prank(CREATOR);
        uint256 campaignId =
            manager.createCampaign(budget, keccak256("test"), address(rewardToken), 10 ether, startTime, endTime);

        // Try to update as random address (not owner, not operator)
        vm.prank(address(0xBAD));
        vm.expectRevert(StreamingManager.NotAuthorized.selector);
        manager.updateRoot(campaignId, keccak256("bad-root"));
    }

    function test_UpdateRoot_RevertWhenOperatorNotSet() public {
        // Ensure operator is not set (default is zero)
        assertEq(manager.operator(), address(0), "Operator should be zero by default");

        // Create a campaign
        uint64 startTime = uint64(block.timestamp + 1 hours);
        uint64 endTime = uint64(block.timestamp + 30 days);

        vm.prank(CREATOR);
        uint256 campaignId =
            manager.createCampaign(budget, keccak256("test"), address(rewardToken), 10 ether, startTime, endTime);

        // Creator cannot update root (not owner, operator not set)
        vm.prank(CREATOR);
        vm.expectRevert(StreamingManager.NotAuthorized.selector);
        manager.updateRoot(campaignId, keccak256("bad-root"));

        // But owner still can
        manager.updateRoot(campaignId, keccak256("good-root"));
        StreamingCampaign campaign = StreamingCampaign(manager.getCampaign(campaignId));
        assertEq(campaign.merkleRoot(), keccak256("good-root"), "Owner should still be able to update");
    }

    function test_UpdateRoot_RevertInvalidCampaign() public {
        // Try to update root for non-existent campaign
        vm.expectRevert(StreamingManager.InvalidCampaign.selector);
        manager.updateRoot(999, keccak256("root"));
    }

    ////////////////////////////////
    // StreamingCampaign.setMerkleRoot tests
    ////////////////////////////////

    function test_CampaignSetMerkleRoot_RevertNotStreamingManager() public {
        // Create a campaign
        uint64 startTime = uint64(block.timestamp + 1 hours);
        uint64 endTime = uint64(block.timestamp + 30 days);

        vm.prank(CREATOR);
        uint256 campaignId =
            manager.createCampaign(budget, keccak256("test"), address(rewardToken), 10 ether, startTime, endTime);

        StreamingCampaign campaign = StreamingCampaign(manager.getCampaign(campaignId));

        // Try to call setMerkleRoot directly (not through manager)
        vm.prank(address(this)); // Even owner of manager can't call directly
        vm.expectRevert(StreamingCampaign.OnlyStreamingManager.selector);
        campaign.setMerkleRoot(keccak256("bad-root"));
    }

    function test_CampaignSetMerkleRoot_EmitsMerkleRootUpdated() public {
        // Create a campaign
        uint64 startTime = uint64(block.timestamp + 1 hours);
        uint64 endTime = uint64(block.timestamp + 30 days);

        vm.prank(CREATOR);
        uint256 campaignId =
            manager.createCampaign(budget, keccak256("test"), address(rewardToken), 10 ether, startTime, endTime);

        bytes32 newRoot = keccak256("merkle-root-1");

        // Update root through manager and check campaign emits event
        vm.recordLogs();
        manager.updateRoot(campaignId, newRoot);

        Vm.Log[] memory logs = vm.getRecordedLogs();
        bool foundCampaignEvent = false;
        bytes32 eventSig = keccak256("MerkleRootUpdated(bytes32,bytes32)");

        for (uint256 i = 0; i < logs.length; i++) {
            if (logs[i].topics[0] == eventSig) {
                foundCampaignEvent = true;
                // Decode the event data
                (bytes32 oldRoot, bytes32 emittedNewRoot) = abi.decode(logs[i].data, (bytes32, bytes32));
                assertEq(oldRoot, bytes32(0), "Old root should be zero");
                assertEq(emittedNewRoot, newRoot, "New root should match");
                break;
            }
        }
        assertTrue(foundCampaignEvent, "MerkleRootUpdated event should be emitted from campaign");
    }

    ////////////////////////////////
    // UUPS Upgrade tests
    ////////////////////////////////

    function test_UpgradeToAndCall_Success() public {
        // Deploy a new implementation
        StreamingManager newImpl = new StreamingManager();

        // Upgrade to new implementation
        manager.upgradeToAndCall(address(newImpl), "");

        // Verify state is preserved
        assertEq(manager.protocolFee(), PROTOCOL_FEE, "Protocol fee should be preserved");
        assertEq(manager.protocolFeeReceiver(), PROTOCOL_FEE_RECEIVER, "Fee receiver should be preserved");
        assertEq(manager.campaignImplementation(), address(campaignImpl), "Campaign impl should be preserved");
        assertEq(manager.owner(), address(this), "Owner should be preserved");
    }

    function test_UpgradeToAndCall_RevertNotOwner() public {
        StreamingManager newImpl = new StreamingManager();

        vm.prank(CREATOR);
        vm.expectRevert(); // Ownable.Unauthorized
        manager.upgradeToAndCall(address(newImpl), "");
    }

    function test_UpgradeToAndCall_PreservesState() public {
        // Create a campaign before upgrade
        uint64 startTime = uint64(block.timestamp + 1 hours);
        uint64 endTime = uint64(block.timestamp + 30 days);

        vm.prank(CREATOR);
        uint256 campaignId =
            manager.createCampaign(budget, keccak256("test"), address(rewardToken), 5 ether, startTime, endTime);

        address campaignAddr = manager.getCampaign(campaignId);
        uint256 campaignCountBefore = manager.campaignCount();

        // Deploy and upgrade to new implementation
        StreamingManager newImpl = new StreamingManager();
        manager.upgradeToAndCall(address(newImpl), "");

        // Verify state is preserved
        assertEq(manager.campaignCount(), campaignCountBefore, "Campaign count should be preserved");
        assertEq(manager.getCampaign(campaignId), campaignAddr, "Campaign mapping should be preserved");
    }

    function test_ProxiableUUID() public view {
        // Verify the proxiable UUID matches the ERC1967 implementation slot
        // Note: proxiableUUID() has notDelegated modifier, so call on implementation not proxy
        bytes32 expectedSlot = 0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc;
        assertEq(managerImpl.proxiableUUID(), expectedSlot, "Proxiable UUID should match ERC1967 slot");
    }

    ////////////////////////////////
    // Claim tests
    ////////////////////////////////

    function test_Claim_Success() public {
        // Create a campaign
        (uint256 campaignId, StreamingCampaign campaign) = _createCampaignWithRoot();
        uint256 claimAmount = 1 ether;

        // Build merkle tree with single leaf
        bytes32 leaf = _makeLeaf(CLAIMER, address(rewardToken), claimAmount);
        bytes32 root = leaf; // Single leaf tree, root = leaf
        bytes32[] memory proof = new bytes32[](0);

        // Set merkle root
        manager.updateRoot(campaignId, root);

        uint256 claimerBalanceBefore = rewardToken.balanceOf(CLAIMER);
        uint256 campaignBalanceBefore = rewardToken.balanceOf(address(campaign));

        // Claim
        manager.claim(campaignId, CLAIMER, claimAmount, proof);

        // Verify balances
        assertEq(rewardToken.balanceOf(CLAIMER), claimerBalanceBefore + claimAmount, "Claimer should receive tokens");
        assertEq(
            rewardToken.balanceOf(address(campaign)),
            campaignBalanceBefore - claimAmount,
            "Campaign balance should decrease"
        );
        assertEq(campaign.claimed(CLAIMER), claimAmount, "Claimed amount should be recorded");
    }

    function test_Claim_EmitsEvents() public {
        // Create a campaign
        (uint256 campaignId,) = _createCampaignWithRoot();
        uint256 claimAmount = 1 ether;

        // Build merkle tree with single leaf
        bytes32 leaf = _makeLeaf(CLAIMER, address(rewardToken), claimAmount);
        bytes32 root = leaf;
        bytes32[] memory proof = new bytes32[](0);

        // Set merkle root
        manager.updateRoot(campaignId, root);

        // Record logs and claim
        vm.recordLogs();
        manager.claim(campaignId, CLAIMER, claimAmount, proof);

        Vm.Log[] memory logs = vm.getRecordedLogs();

        // Check for StreamingCampaign.Claimed event
        bytes32 campaignClaimedSig = keccak256("Claimed(address,uint256,uint256)");
        bool foundCampaignClaimed = false;
        for (uint256 i = 0; i < logs.length; i++) {
            if (logs[i].topics[0] == campaignClaimedSig) {
                foundCampaignClaimed = true;
                assertEq(logs[i].topics[1], bytes32(uint256(uint160(CLAIMER))), "User should be indexed");
                (uint256 amount, uint256 cumulativeAmount) = abi.decode(logs[i].data, (uint256, uint256));
                assertEq(amount, claimAmount, "Amount should match");
                assertEq(cumulativeAmount, claimAmount, "Cumulative amount should match");
                break;
            }
        }
        assertTrue(foundCampaignClaimed, "Campaign Claimed event should be emitted");

        // Check for StreamingManager.Claimed event
        bytes32 managerClaimedSig = keccak256("Claimed(uint256,address,uint256,uint256)");
        bool foundManagerClaimed = false;
        for (uint256 i = 0; i < logs.length; i++) {
            if (logs[i].topics[0] == managerClaimedSig) {
                foundManagerClaimed = true;
                assertEq(logs[i].topics[1], bytes32(campaignId), "Campaign ID should be indexed");
                assertEq(logs[i].topics[2], bytes32(uint256(uint160(CLAIMER))), "User should be indexed");
                (uint256 amount, uint256 cumulativeAmount) = abi.decode(logs[i].data, (uint256, uint256));
                assertEq(amount, claimAmount, "Amount should match");
                assertEq(cumulativeAmount, claimAmount, "Cumulative amount should match");
                break;
            }
        }
        assertTrue(foundManagerClaimed, "Manager Claimed event should be emitted");
    }

    function test_Claim_RevertInvalidProof() public {
        // Create a campaign
        (uint256 campaignId,) = _createCampaignWithRoot();
        uint256 claimAmount = 1 ether;

        // Build merkle tree with single leaf for a different user
        bytes32 leaf = _makeLeaf(address(0xDEAD), address(rewardToken), claimAmount);
        bytes32 root = leaf;
        bytes32[] memory proof = new bytes32[](0);

        // Set merkle root
        manager.updateRoot(campaignId, root);

        // Try to claim with wrong user
        vm.expectRevert(StreamingCampaign.InvalidProof.selector);
        manager.claim(campaignId, CLAIMER, claimAmount, proof);
    }

    function test_Claim_RevertNothingToClaim() public {
        // Create a campaign
        (uint256 campaignId,) = _createCampaignWithRoot();
        uint256 claimAmount = 1 ether;

        // Build merkle tree with single leaf
        bytes32 leaf = _makeLeaf(CLAIMER, address(rewardToken), claimAmount);
        bytes32 root = leaf;
        bytes32[] memory proof = new bytes32[](0);

        // Set merkle root
        manager.updateRoot(campaignId, root);

        // Claim first time
        manager.claim(campaignId, CLAIMER, claimAmount, proof);

        // Try to claim again with same cumulative amount
        vm.expectRevert(StreamingCampaign.NothingToClaim.selector);
        manager.claim(campaignId, CLAIMER, claimAmount, proof);
    }

    function test_Claim_RevertInvalidCampaign() public {
        bytes32[] memory proof = new bytes32[](0);

        // Try to claim from non-existent campaign
        vm.expectRevert(StreamingManager.InvalidCampaign.selector);
        manager.claim(999, CLAIMER, 1 ether, proof);
    }

    function test_Claim_PartialClaims() public {
        // Create a campaign
        (uint256 campaignId, StreamingCampaign campaign) = _createCampaignWithRoot();

        // First claim: cumulative = 1 ether
        uint256 firstCumulative = 1 ether;
        bytes32 firstLeaf = _makeLeaf(CLAIMER, address(rewardToken), firstCumulative);
        bytes32 firstRoot = firstLeaf;
        bytes32[] memory proof = new bytes32[](0);

        manager.updateRoot(campaignId, firstRoot);
        manager.claim(campaignId, CLAIMER, firstCumulative, proof);

        assertEq(campaign.claimed(CLAIMER), firstCumulative, "First claim should be recorded");
        assertEq(rewardToken.balanceOf(CLAIMER), firstCumulative, "Should have received first amount");

        // Second claim: cumulative = 3 ether (additional 2 ether)
        uint256 secondCumulative = 3 ether;
        bytes32 secondLeaf = _makeLeaf(CLAIMER, address(rewardToken), secondCumulative);
        bytes32 secondRoot = secondLeaf;

        manager.updateRoot(campaignId, secondRoot);
        manager.claim(campaignId, CLAIMER, secondCumulative, proof);

        assertEq(campaign.claimed(CLAIMER), secondCumulative, "Second claim should be recorded");
        assertEq(rewardToken.balanceOf(CLAIMER), secondCumulative, "Should have received cumulative amount");

        // Third claim: cumulative = 5 ether (additional 2 ether)
        uint256 thirdCumulative = 5 ether;
        bytes32 thirdLeaf = _makeLeaf(CLAIMER, address(rewardToken), thirdCumulative);
        bytes32 thirdRoot = thirdLeaf;

        manager.updateRoot(campaignId, thirdRoot);
        manager.claim(campaignId, CLAIMER, thirdCumulative, proof);

        assertEq(campaign.claimed(CLAIMER), thirdCumulative, "Third claim should be recorded");
        assertEq(rewardToken.balanceOf(CLAIMER), thirdCumulative, "Should have received cumulative amount");
    }

    function test_Claim_AnyoneCanClaimForUser() public {
        // Create a campaign
        (uint256 campaignId, StreamingCampaign campaign) = _createCampaignWithRoot();
        uint256 claimAmount = 1 ether;

        // Build merkle tree with single leaf
        bytes32 leaf = _makeLeaf(CLAIMER, address(rewardToken), claimAmount);
        bytes32 root = leaf;
        bytes32[] memory proof = new bytes32[](0);

        // Set merkle root
        manager.updateRoot(campaignId, root);

        // Random address submits claim for CLAIMER
        address randomCaller = address(0xBAD);
        vm.prank(randomCaller);
        manager.claim(campaignId, CLAIMER, claimAmount, proof);

        // CLAIMER should receive tokens (not the caller)
        assertEq(rewardToken.balanceOf(CLAIMER), claimAmount, "CLAIMER should receive tokens");
        assertEq(rewardToken.balanceOf(randomCaller), 0, "Caller should not receive tokens");
        assertEq(campaign.claimed(CLAIMER), claimAmount, "Claimed amount should be recorded for CLAIMER");
    }

    function test_CampaignProcessClaim_RevertNotStreamingManager() public {
        // Create a campaign
        (uint256 campaignId, StreamingCampaign campaign) = _createCampaignWithRoot();
        uint256 claimAmount = 1 ether;

        // Build merkle tree with single leaf
        bytes32 leaf = _makeLeaf(CLAIMER, address(rewardToken), claimAmount);
        bytes32 root = leaf;
        bytes32[] memory proof = new bytes32[](0);

        // Set merkle root
        manager.updateRoot(campaignId, root);

        // Try to call processClaim directly
        vm.expectRevert(StreamingCampaign.OnlyStreamingManager.selector);
        campaign.processClaim(CLAIMER, claimAmount, proof);
    }

    function test_Claim_WithMultipleLeafMerkleTree() public {
        // Create a campaign
        (uint256 campaignId, StreamingCampaign campaign) = _createCampaignWithRoot();

        // Create two leaves for two users
        uint256 claimer1Amount = 1 ether;
        uint256 claimer2Amount = 2 ether;

        bytes32 leaf1 = _makeLeaf(CLAIMER, address(rewardToken), claimer1Amount);
        bytes32 leaf2 = _makeLeaf(CLAIMER2, address(rewardToken), claimer2Amount);

        // Build simple 2-leaf merkle tree
        // Sort leaves for consistent tree structure
        bytes32 left;
        bytes32 right;
        if (uint256(leaf1) < uint256(leaf2)) {
            left = leaf1;
            right = leaf2;
        } else {
            left = leaf2;
            right = leaf1;
        }
        bytes32 root = keccak256(abi.encodePacked(left, right));

        // Set merkle root
        manager.updateRoot(campaignId, root);

        // Create proofs - sibling is the proof
        bytes32[] memory proof1 = new bytes32[](1);
        proof1[0] = leaf2;

        bytes32[] memory proof2 = new bytes32[](1);
        proof2[0] = leaf1;

        // Both users claim
        manager.claim(campaignId, CLAIMER, claimer1Amount, proof1);
        manager.claim(campaignId, CLAIMER2, claimer2Amount, proof2);

        // Verify
        assertEq(rewardToken.balanceOf(CLAIMER), claimer1Amount, "CLAIMER should receive correct amount");
        assertEq(rewardToken.balanceOf(CLAIMER2), claimer2Amount, "CLAIMER2 should receive correct amount");
        assertEq(campaign.claimed(CLAIMER), claimer1Amount, "CLAIMER claim recorded");
        assertEq(campaign.claimed(CLAIMER2), claimer2Amount, "CLAIMER2 claim recorded");
    }

    function test_Claim_RevertWrongAmount() public {
        // Create a campaign
        (uint256 campaignId,) = _createCampaignWithRoot();
        uint256 correctAmount = 1 ether;
        uint256 wrongAmount = 2 ether;

        // Build merkle tree with correct amount
        bytes32 leaf = _makeLeaf(CLAIMER, address(rewardToken), correctAmount);
        bytes32 root = leaf;
        bytes32[] memory proof = new bytes32[](0);

        // Set merkle root
        manager.updateRoot(campaignId, root);

        // Try to claim with wrong amount
        vm.expectRevert(StreamingCampaign.InvalidProof.selector);
        manager.claim(campaignId, CLAIMER, wrongAmount, proof);
    }

    function test_Claim_RevertZeroMerkleRoot() public {
        // Create a campaign (merkle root is zero by default)
        (uint256 campaignId,) = _createCampaignWithRoot();
        uint256 claimAmount = 1 ether;

        // Don't set merkle root - leave it as bytes32(0)
        bytes32[] memory proof = new bytes32[](0);

        // Try to claim with zero merkle root
        vm.expectRevert(StreamingCampaign.InvalidProof.selector);
        manager.claim(campaignId, CLAIMER, claimAmount, proof);
    }

    function test_Claim_RevertOldProofAfterNewClaim() public {
        // Create a campaign
        (uint256 campaignId, StreamingCampaign campaign) = _createCampaignWithRoot();

        // First: claim with cumulative amount of 2 ether
        uint256 firstCumulative = 2 ether;
        bytes32 firstLeaf = _makeLeaf(CLAIMER, address(rewardToken), firstCumulative);
        bytes32 firstRoot = firstLeaf;
        bytes32[] memory proof = new bytes32[](0);

        manager.updateRoot(campaignId, firstRoot);
        manager.claim(campaignId, CLAIMER, firstCumulative, proof);

        assertEq(campaign.claimed(CLAIMER), firstCumulative, "Should have claimed 2 ether");

        // Second: try to use an old proof with lower cumulative (1 ether)
        // This simulates someone trying to use a stale/old proof
        uint256 oldCumulative = 1 ether;
        bytes32 oldLeaf = _makeLeaf(CLAIMER, address(rewardToken), oldCumulative);
        bytes32 oldRoot = oldLeaf;

        manager.updateRoot(campaignId, oldRoot);

        // Should revert because oldCumulative (1 ether) <= alreadyClaimed (2 ether)
        vm.expectRevert(StreamingCampaign.NothingToClaim.selector);
        manager.claim(campaignId, CLAIMER, oldCumulative, proof);
    }

    function test_Claim_RevertDoubleClaimSameBlock() public {
        // Create a campaign
        (uint256 campaignId,) = _createCampaignWithRoot();
        uint256 claimAmount = 1 ether;

        // Build merkle tree
        bytes32 leaf = _makeLeaf(CLAIMER, address(rewardToken), claimAmount);
        bytes32 root = leaf;
        bytes32[] memory proof = new bytes32[](0);

        manager.updateRoot(campaignId, root);

        // First claim succeeds
        manager.claim(campaignId, CLAIMER, claimAmount, proof);

        // Second claim in same block with same proof reverts
        vm.expectRevert(StreamingCampaign.NothingToClaim.selector);
        manager.claim(campaignId, CLAIMER, claimAmount, proof);
    }

    function test_Claim_CannotClaimMoreThanAccumulated() public {
        // Create a campaign
        (uint256 campaignId, StreamingCampaign campaign) = _createCampaignWithRoot();

        // The merkle tree only has 1 ether for this user
        uint256 actualAmount = 1 ether;
        bytes32 leaf = _makeLeaf(CLAIMER, address(rewardToken), actualAmount);
        bytes32 root = leaf;
        bytes32[] memory proof = new bytes32[](0);

        manager.updateRoot(campaignId, root);

        // Claim the actual amount
        manager.claim(campaignId, CLAIMER, actualAmount, proof);
        assertEq(campaign.claimed(CLAIMER), actualAmount, "Should have claimed actual amount");
        assertEq(rewardToken.balanceOf(CLAIMER), actualAmount, "Should have received actual amount");

        // Try to claim more by providing a higher cumulative amount
        // This should fail because the proof won't verify
        uint256 inflatedAmount = 10 ether;
        vm.expectRevert(StreamingCampaign.InvalidProof.selector);
        manager.claim(campaignId, CLAIMER, inflatedAmount, proof);

        // Balance should remain unchanged
        assertEq(rewardToken.balanceOf(CLAIMER), actualAmount, "Balance should not change");
    }

    function test_Claim_RevertWhenCampaignBalanceInsufficient() public {
        // Create a campaign with 9 ether (after 10% fee on 10 ether)
        (uint256 campaignId, StreamingCampaign campaign) = _createCampaignWithRoot();
        uint256 campaignBalance = rewardToken.balanceOf(address(campaign));
        assertEq(campaignBalance, 9 ether, "Campaign should have 9 ether after fee");

        // Create a proof for more than the campaign balance
        uint256 excessiveAmount = 20 ether;
        bytes32 leaf = _makeLeaf(CLAIMER, address(rewardToken), excessiveAmount);
        bytes32 root = leaf;
        bytes32[] memory proof = new bytes32[](0);

        manager.updateRoot(campaignId, root);

        // Claim should revert due to insufficient balance in campaign
        // SafeTransferLib will revert with TransferFailed
        vm.expectRevert();
        manager.claim(campaignId, CLAIMER, excessiveAmount, proof);
    }

    function test_Claim_CrossCampaignProofReuseFails() public {
        // Create first campaign
        uint64 startTime = uint64(block.timestamp + 1 hours);
        uint64 endTime = uint64(block.timestamp + 30 days);

        vm.prank(CREATOR);
        uint256 campaignId1 =
            manager.createCampaign(budget, keccak256("campaign-1"), address(rewardToken), 10 ether, startTime, endTime);

        vm.prank(CREATOR);
        uint256 campaignId2 =
            manager.createCampaign(budget, keccak256("campaign-2"), address(rewardToken), 10 ether, startTime, endTime);

        uint256 claimAmount = 1 ether;

        // Set up valid proof for campaign 1
        bytes32 leaf = _makeLeaf(CLAIMER, address(rewardToken), claimAmount);
        bytes32 root = leaf;
        bytes32[] memory proof = new bytes32[](0);

        // Only set root on campaign 1
        manager.updateRoot(campaignId1, root);

        // Claim works on campaign 1
        manager.claim(campaignId1, CLAIMER, claimAmount, proof);
        assertEq(rewardToken.balanceOf(CLAIMER), claimAmount, "Should receive from campaign 1");

        // Same proof fails on campaign 2 (different merkle root)
        vm.expectRevert(StreamingCampaign.InvalidProof.selector);
        manager.claim(campaignId2, CLAIMER, claimAmount, proof);

        // Even if we set the same root on campaign 2, the user can claim again
        // (each campaign tracks claims independently)
        manager.updateRoot(campaignId2, root);
        manager.claim(campaignId2, CLAIMER, claimAmount, proof);
        assertEq(rewardToken.balanceOf(CLAIMER), claimAmount * 2, "Should receive from both campaigns");
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

    /// @notice Helper to create a campaign and return its ID and contract
    function _createCampaignWithRoot() internal returns (uint256 campaignId, StreamingCampaign campaign) {
        uint64 startTime = uint64(block.timestamp + 1 hours);
        uint64 endTime = uint64(block.timestamp + 30 days);

        vm.prank(CREATOR);
        campaignId =
            manager.createCampaign(budget, keccak256("test"), address(rewardToken), 10 ether, startTime, endTime);

        campaign = StreamingCampaign(manager.getCampaign(campaignId));
    }

    /// @notice Helper to create a double-hashed merkle leaf
    function _makeLeaf(address user, address token, uint256 cumulativeAmount) internal pure returns (bytes32) {
        return keccak256(bytes.concat(keccak256(abi.encode(user, token, cumulativeAmount))));
    }
}
