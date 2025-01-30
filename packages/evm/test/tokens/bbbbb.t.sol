// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Test, console} from "lib/forge-std/src/Test.sol";
import {MockERC20} from "contracts/shared/Mocks.sol";
import {bbbbb} from "contracts/tokens/bbbbb.sol";
import {IERC20} from "@solady/tokens/IERC20.sol";

contract BBBBBTest is Test {
    bbbbb token;
    MockERC20 rewardToken;
    address[] authorized;
    uint256[] roles;

    event DistributionCreated(uint256 indexed distId, IERC20 indexed token, uint256 amount);
    event Claimed(uint256 indexed distId, address indexed user, uint256 amount);
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    ////////////////////////////////
    // bbbbb Initial State //
    ////////////////////////////////

    function setUp() public {
        authorized = new address[](2);
        roles = new uint256[](2);

        address manager = makeAddr("manager");
        address admin = makeAddr("admin");

        authorized[0] = manager;
        authorized[1] = admin;
        roles[0] = 1; // MANAGER_ROLE
        roles[1] = 2; // ADMIN_ROLE

        token = new bbbbb("Test Token", "TEST", 18, 1000 ether, authorized, roles);
        rewardToken = new MockERC20();
    }

    ////////////////////////////////
    // bbbbb.name //
    ////////////////////////////////

    /// @notice Test name getter returns correct value
    function test_Name() public {
        assertEq(token.name(), "Test Token", "Wrong token name");
    }

    ////////////////////////////////
    // bbbbb.symbol //
    ////////////////////////////////

    /// @notice Test symbol getter returns correct value
    function test_Symbol() public {
        assertEq(token.symbol(), "TEST", "Wrong token symbol");
    }

    ////////////////////////////////
    // bbbbb.decimals //
    ////////////////////////////////

    /// @notice Test decimals getter returns correct value
    function test_Decimals() public {
        assertEq(token.decimals(), 18, "Wrong token decimals");
    }

    ////////////////////////////////
    // bbbbb.totalSupply //
    ////////////////////////////////

    /// @notice Test totalSupply getter returns correct value
    function test_TotalSupply() public {
        assertEq(token.totalSupply(), 1000 ether, "Wrong total supply");
    }

    ////////////////////////////////
    // bbbbb.balanceOf //
    ////////////////////////////////

    /// @notice Test balanceOf getter returns correct value
    function test_BalanceOf() public {
        address user = makeAddr("user");
        uint256 amount = 100 ether;

        token.transfer(user, amount);
        assertEq(token.balanceOf(user), amount, "Wrong balance");
    }

    ////////////////////////////////
    // bbbbb.allowance //
    ////////////////////////////////

    /// @notice Test allowance getter returns correct value
    function test_Allowance() public {
        address owner = makeAddr("owner");
        address spender = makeAddr("spender");
        uint256 amount = 100 ether;

        token.transfer(owner, amount);
        vm.prank(owner);
        token.approve(spender, amount);

        assertEq(token.allowance(owner, spender), amount, "Wrong allowance");
    }

    ////////////////////////////////
    // bbbbb.transfer //
    ////////////////////////////////

    /// @notice Test basic transfer functionality
    function test_TransferBasic() public {
        address user = makeAddr("user");
        uint256 amount = 100 ether;

        uint256 initialBalance = token.balanceOf(address(this));
        uint256 initialUserBalance = token.balanceOf(user);

        vm.expectEmit(true, true, true, true);
        emit Transfer(address(this), user, amount);
        token.transfer(user, amount);

        assertEq(token.balanceOf(address(this)), initialBalance - amount, "Wrong sender balance");
        assertEq(token.balanceOf(user), initialUserBalance + amount, "Wrong recipient balance");
    }

    /// @notice Test transfer reverts with zero address recipient
    function test_TransferRevert_ZeroAddress() public {
        vm.expectRevert("Zero address not allowed");
        token.transfer(address(0), 100 ether);
    }

    /// @notice Test transfer reverts with insufficient balance
    function test_TransferRevert_InsufficientBalance() public {
        address user = makeAddr("user");
        vm.prank(user);
        vm.expectRevert("Insufficient balance");
        token.transfer(address(this), 1 ether);
    }

    ////////////////////////////////
    // bbbbb.transferFrom //
    ////////////////////////////////

    /// @notice Test transferFrom with max allowance doesn't decrease allowance
    function test_TransferFromMaxAllowance() public {
        address owner = makeAddr("owner");
        address spender = makeAddr("spender");

        // Setup
        token.transfer(owner, 100 ether);
        vm.prank(owner);
        token.approve(spender, type(uint256).max);

        // Transfer should not decrease max allowance
        vm.prank(spender);
        token.transferFrom(owner, address(this), 50 ether);

        assertEq(token.allowance(owner, spender), type(uint256).max, "Max allowance should not decrease");
    }

    ////////////////////////////////
    // bbbbb.approve //
    ////////////////////////////////

    /// @notice Test approve functionality
    function test_Approve() public {
        address owner = makeAddr("owner");
        address spender = makeAddr("spender");
        uint256 amount = 100 ether;

        vm.prank(owner);
        token.approve(spender, amount);

        assertEq(token.allowance(owner, spender), amount, "Wrong allowance");
    }

    ////////////////////////////////
    // bbbbb.balanceOfAt //
    ////////////////////////////////

    /// @notice Test balanceOfAt returns correct historical balance
    function test_BalanceOfAt() public {
        address user = makeAddr("user");
        uint256 amount = 100 ether;

        // Transfer and record block
        token.transfer(user, amount);
        uint256 snapshotBlock = block.number;

        // Make another transfer to change balance
        vm.prank(user);
        token.transfer(address(this), 50 ether);

        // Check historical balance
        assertEq(token.balanceOfAt(user, snapshotBlock), amount, "Wrong historical balance");
    }

    ////////////////////////////////
    // bbbbb.totalSupplyAt //
    ////////////////////////////////

    /// @notice Test totalSupplyAt returns correct historical supply
    function test_TotalSupplyAt() public {
        uint256 initialSupply = token.totalSupply();
        uint256 snapshotBlock = block.number;

        // Check historical supply
        assertEq(token.totalSupplyAt(snapshotBlock), initialSupply, "Wrong historical supply");
    }

    ////////////////////////////////
    // bbbbb.distribute //
    ////////////////////////////////

    /// @notice Test basic distribution with valid parameters
    function test_DistributeBasic() public {
        address distributor = makeAddr("distributor");

        // Mint reward tokens and approve
        rewardToken.mint(distributor, 100 ether);
        vm.prank(distributor);
        rewardToken.approve(address(token), 100 ether);

        // Initial balances
        uint256 initialBalance = rewardToken.balanceOf(distributor);
        uint256 initialContractBalance = rewardToken.balanceOf(address(token));

        // Distribute tokens
        vm.prank(distributor);
        vm.expectEmit(true, true, true, true);
        emit DistributionCreated(0, IERC20(address(rewardToken)), 100 ether);
        token.distribute(IERC20(address(rewardToken)), 100 ether);

        // Check balances after distribution
        assertEq(rewardToken.balanceOf(distributor), initialBalance - 100 ether, "Distributor balance incorrect");
        assertEq(
            rewardToken.balanceOf(address(token)), initialContractBalance + 100 ether, "Contract balance incorrect"
        );

        // Check distribution data
        (IERC20 distToken, uint256 blockNumber, uint256 amount, bool active) = token.distributions(0);
        assertEq(address(distToken), address(rewardToken), "Wrong distribution token");
        assertEq(blockNumber, block.number, "Wrong block number");
        assertEq(amount, 100 ether, "Wrong distribution amount");
        assertTrue(active, "Distribution should be active");
    }

    /// @notice Test distribution reverts when total supply is zero
    function test_DistributeRevert_NoSupply() public {
        address distributor = makeAddr("distributor");

        // Create new token with 0 supply
        bbbbb zeroSupplyToken = new bbbbb("Zero Supply", "ZERO", 18, 0, authorized, roles);

        rewardToken.mint(distributor, 100 ether);
        vm.prank(distributor);
        rewardToken.approve(address(zeroSupplyToken), 100 ether);

        vm.prank(distributor);
        vm.expectRevert("No supply, can't distribute");
        zeroSupplyToken.distribute(IERC20(address(rewardToken)), 100 ether);
    }

    /// @notice Test distribution reverts when amount is zero
    function test_DistributeRevert_NothingToDistribute() public {
        address distributor = makeAddr("distributor");

        vm.prank(distributor);
        rewardToken.approve(address(token), 0);

        vm.prank(distributor);
        vm.expectRevert("Nothing to distribute");
        token.distribute(IERC20(address(rewardToken)), 0);
    }

    /// @notice Test distribution reverts with insufficient token allowance
    function test_DistributeRevert_AllowanceExceeded() public {
        address distributor = makeAddr("distributor");

        rewardToken.mint(distributor, 100 ether);
        vm.prank(distributor);
        rewardToken.approve(address(token), 50 ether);

        vm.prank(distributor);
        vm.expectRevert();
        token.distribute(IERC20(address(rewardToken)), 100 ether);
    }

    /// @notice Test distribution with fuzzed amount values
    function testFuzz_Distribute(uint256 amount) public {
        address distributor = makeAddr("distributor");

        // Bound amount to reasonable values
        amount = bound(amount, 1, 1000000 ether);

        rewardToken.mint(distributor, amount);
        vm.prank(distributor);
        rewardToken.approve(address(token), amount);

        vm.prank(distributor);
        vm.expectEmit(true, true, true, true);
        emit DistributionCreated(0, IERC20(address(rewardToken)), amount);
        token.distribute(IERC20(address(rewardToken)), amount);

        (,, uint256 distAmount,) = token.distributions(0);
        assertEq(distAmount, amount, "Distribution amount mismatch");
        assertEq(rewardToken.balanceOf(address(token)), amount, "Token balance mismatch");
    }

    /// @notice Test batch distributions with fuzzed parameters
    function testFuzz_DistributeBatch(uint8 numDistributions, uint256 baseAmount) public {
        address distributor = makeAddr("distributor");

        // Bound inputs to reasonable values
        numDistributions = uint8(bound(numDistributions, 1, 10));
        baseAmount = bound(baseAmount, 1 ether, 100 ether);

        for (uint8 i = 0; i < numDistributions; i++) {
            uint256 amount = baseAmount * (i + 1);
            rewardToken.mint(distributor, amount);
            vm.prank(distributor);
            rewardToken.approve(address(token), amount);

            vm.prank(distributor);
            vm.expectEmit(true, true, true, true);
            emit DistributionCreated(i, IERC20(address(rewardToken)), amount);
            token.distribute(IERC20(address(rewardToken)), amount);

            (,, uint256 distAmount,) = token.distributions(i);
            assertEq(distAmount, amount, "Distribution amount mismatch");
        }

        assertEq(token.distributions().length, numDistributions, "Wrong number of distributions");
    }

    /// @notice Test distributions across different balance snapshots
    function testFuzz_DistributeAcrossSnapshots(
        uint256[] calldata amounts,
        address[] calldata recipients,
        uint256[] calldata transfers
    ) public {
        address distributor = makeAddr("distributor");

        // Bound array lengths
        vm.assume(amounts.length > 0 && amounts.length <= 10);
        vm.assume(recipients.length == amounts.length);
        vm.assume(transfers.length == amounts.length);

        uint256 totalDistributed = 0;

        // Create distributions with transfers between each one
        for (uint256 i = 0; i < amounts.length; i++) {
            // Bound the distribution amount
            uint256 amount = bound(amounts[i], 1 ether, 1000 ether);
            totalDistributed += amount;

            // Do some transfers to create new snapshots
            address recipient = recipients[i] == address(0) ? makeAddr("recipient") : recipients[i];
            uint256 transferAmount = bound(transfers[i], 1 ether, 10 ether);

            if (token.balanceOf(distributor) >= transferAmount) {
                vm.prank(distributor);
                token.transfer(recipient, transferAmount);
            }

            // Create distribution
            rewardToken.mint(distributor, amount);
            vm.prank(distributor);
            rewardToken.approve(address(token), amount);

            vm.prank(distributor);
            token.distribute(IERC20(address(rewardToken)), amount);

            // Verify distribution
            (,, uint256 distAmount, bool active) = token.distributions(i);
            assertEq(distAmount, amount, "Distribution amount mismatch");
            assertTrue(active, "Distribution should be active");
        }

        assertEq(rewardToken.balanceOf(address(token)), totalDistributed, "Total distributed amount mismatch");
    }

    ////////////////////////////////
    // bbbbb.claim //
    ////////////////////////////////

    /// @notice Test basic claim functionality
    function test_ClaimBasic() public {
        address distributor = makeAddr("distributor");
        address claimer = makeAddr("claimer");

        // Setup initial token distribution
        token.transfer(claimer, 500 ether); // 50% of supply to claimer

        // Create distribution
        rewardToken.mint(distributor, 100 ether);
        vm.prank(distributor);
        rewardToken.approve(address(token), 100 ether);
        vm.prank(distributor);
        token.distribute(IERC20(address(rewardToken)), 100 ether);

        // Claim
        vm.prank(claimer);
        vm.expectEmit(true, true, true, true);
        emit Claimed(0, claimer, 50 ether); // Should get 50% of distribution
        token.claim(0);

        assertEq(rewardToken.balanceOf(claimer), 50 ether, "Incorrect claim amount");
    }

    /// @notice Test claim reverts for inactive distribution
    function test_ClaimRevert_InactiveDistribution() public {
        address distributor = makeAddr("distributor");
        address claimer = makeAddr("claimer");

        // Setup distribution that doesn't exist
        vm.prank(claimer);
        vm.expectRevert("Distribution inactive");
        token.claim(0);
    }

    /// @notice Test claim reverts when already claimed
    function test_ClaimRevert_AlreadyClaimed() public {
        address distributor = makeAddr("distributor");
        address claimer = makeAddr("claimer");

        // Setup initial token distribution
        token.transfer(claimer, 500 ether);

        // Create distribution
        rewardToken.mint(distributor, 100 ether);
        vm.prank(distributor);
        rewardToken.approve(address(token), 100 ether);
        vm.prank(distributor);
        token.distribute(IERC20(address(rewardToken)), 100 ether);

        // First claim
        vm.prank(claimer);
        token.claim(0);

        // Second claim should fail
        vm.prank(claimer);
        vm.expectRevert("Already claimed");
        token.claim(0);
    }

    /// @notice Test claim with zero balance at snapshot
    function test_ClaimWithZeroBalance() public {
        address distributor = makeAddr("distributor");
        address claimer = makeAddr("claimer");

        // Create distribution before claimer has any tokens
        rewardToken.mint(distributor, 100 ether);
        vm.prank(distributor);
        rewardToken.approve(address(token), 100 ether);
        vm.prank(distributor);
        token.distribute(IERC20(address(rewardToken)), 100 ether);

        // Transfer tokens to claimer after snapshot
        token.transfer(claimer, 500 ether);

        // Claim should result in 0 tokens
        vm.prank(claimer);
        vm.expectEmit(true, true, true, true);
        emit Claimed(0, claimer, 0);
        token.claim(0);

        assertEq(rewardToken.balanceOf(claimer), 0, "Should receive 0 tokens");
    }

    /// @notice Test claims across multiple distributions with fuzzed amounts
    function testFuzz_ClaimMultipleDistributions(uint256[] calldata amounts, uint8 userCount) public {
        // Bound inputs
        vm.assume(amounts.length > 0 && amounts.length <= 5);
        userCount = uint8(bound(userCount, 1, 5));

        address distributor = makeAddr("distributor");
        address[] memory users = new address[](userCount);
        uint256 sharePerUser = 1000 ether / userCount;

        // Setup users with equal shares
        for (uint8 i = 0; i < userCount; i++) {
            users[i] = makeAddr(string.concat("user", vm.toString(i)));
            token.transfer(users[i], sharePerUser);
        }

        // Create multiple distributions
        for (uint256 i = 0; i < amounts.length; i++) {
            uint256 amount = bound(amounts[i], 1 ether, 1000 ether);
            rewardToken.mint(distributor, amount);
            vm.prank(distributor);
            rewardToken.approve(address(token), amount);
            vm.prank(distributor);
            token.distribute(IERC20(address(rewardToken)), amount);
        }

        // Each user claims from each distribution
        for (uint256 distId = 0; distId < amounts.length; distId++) {
            for (uint8 userIdx = 0; userIdx < userCount; userIdx++) {
                vm.prank(users[userIdx]);
                token.claim(distId);

                // Verify claim amount
                uint256 expectedShare = (amounts[distId] * sharePerUser) / token.totalSupply();
                assertApproxEqRel(
                    rewardToken.balanceOf(users[userIdx]),
                    expectedShare * (distId + 1),
                    0.01e18, // 1% tolerance for rounding
                    "Incorrect cumulative claim amount"
                );
            }
        }
    }

    /// @notice Test claims with changing balances between distributions
    function testFuzz_ClaimWithChangingBalances(uint256[] calldata amounts, uint256[] calldata transfers) public {
        // Bound inputs
        vm.assume(amounts.length > 0 && amounts.length <= 5);
        vm.assume(transfers.length == amounts.length);

        address distributor = makeAddr("distributor");
        address user1 = makeAddr("user1");
        address user2 = makeAddr("user2");

        // Initial setup
        token.transfer(user1, 500 ether);
        token.transfer(user2, 500 ether);

        for (uint256 i = 0; i < amounts.length; i++) {
            // Transfer between users to change balances
            uint256 transferAmount = bound(transfers[i], 1 ether, 100 ether);
            if (token.balanceOf(user1) >= transferAmount) {
                vm.prank(user1);
                token.transfer(user2, transferAmount);
            }

            // Create distribution
            uint256 amount = bound(amounts[i], 1 ether, 1000 ether);
            rewardToken.mint(distributor, amount);
            vm.prank(distributor);
            rewardToken.approve(address(token), amount);
            vm.prank(distributor);
            token.distribute(IERC20(address(rewardToken)), amount);

            // Users claim
            uint256 user1BalanceAtSnapshot = token.balanceOfAt(user1, block.number - 1);
            uint256 totalSupplyAtSnapshot = token.totalSupplyAt(block.number - 1);

            vm.prank(user1);
            token.claim(i);

            uint256 expectedClaim = (amount * user1BalanceAtSnapshot) / totalSupplyAtSnapshot;
            assertApproxEqRel(
                rewardToken.balanceOf(user1), expectedClaim, 0.01e18, "Incorrect claim amount for changing balances"
            );
        }
    }

    ////////////////////////////////
    // bbbbb.accountForTokens //
    ////////////////////////////////

    /// @notice Test basic accounting of unaccounted tokens
    function test_AccountForTokensBasic() public {
        address distributor = makeAddr("distributor");

        // Send tokens directly to contract without distribution
        rewardToken.mint(address(token), 100 ether);

        // Account for tokens
        vm.expectEmit(true, true, true, true);
        emit DistributionCreated(0, IERC20(address(rewardToken)), 100 ether);
        uint256 distId = token.accountForTokens(IERC20(address(rewardToken)));

        // Verify distribution was created correctly
        (IERC20 distToken, uint256 blockNumber, uint256 amount, bool active) = token.distributions(distId);
        assertEq(address(distToken), address(rewardToken), "Wrong distribution token");
        assertEq(blockNumber, block.number, "Wrong block number");
        assertEq(amount, 100 ether, "Wrong distribution amount");
        assertTrue(active, "Distribution should be active");
    }

    /// @notice Test accounting reverts when no unaccounted tokens exist
    function test_AccountForTokensRevert_NoUnaccountedTokens() public {
        // Create normal distribution first
        address distributor = makeAddr("distributor");
        rewardToken.mint(distributor, 100 ether);
        vm.prank(distributor);
        rewardToken.approve(address(token), 100 ether);
        vm.prank(distributor);
        token.distribute(IERC20(address(rewardToken)), 100 ether);

        // Try to account for tokens when all are accounted for
        vm.expectRevert("No unaccounted tokens");
        token.accountForTokens(IERC20(address(rewardToken)));
    }

    /// @notice Test accounting with zero total supply
    function test_AccountForTokensRevert_NoSupply() public {
        // Create new token with 0 supply
        bbbbb zeroSupplyToken = new bbbbb("Zero Supply", "ZERO", 18, 0, authorized, roles);

        // Send tokens directly to contract
        rewardToken.mint(address(zeroSupplyToken), 100 ether);

        vm.expectRevert("No supply, can't distribute");
        zeroSupplyToken.accountForTokens(IERC20(address(rewardToken)));
    }

    /// @notice Test accounting with multiple distributions
    function test_AccountForTokensWithExistingDistributions() public {
        address distributor = makeAddr("distributor");

        // Create normal distribution first
        rewardToken.mint(distributor, 100 ether);
        vm.prank(distributor);
        rewardToken.approve(address(token), 100 ether);
        vm.prank(distributor);
        token.distribute(IERC20(address(rewardToken)), 100 ether);

        // Send additional tokens directly to contract
        rewardToken.mint(address(token), 50 ether);

        // Account for new tokens
        uint256 distId = token.accountForTokens(IERC20(address(rewardToken)));

        // Verify new distribution
        (,, uint256 amount,) = token.distributions(distId);
        assertEq(amount, 50 ether, "Wrong unaccounted amount");
        assertEq(distId, 1, "Wrong distribution ID");
    }

    ////////////////////////////////
    // bbbbb.distributions //
    ////////////////////////////////

    /// @notice Test distributions array getter
    function test_Distributions() public {
        address distributor = makeAddr("distributor");

        // Create distribution
        rewardToken.mint(distributor, 100 ether);
        vm.prank(distributor);
        rewardToken.approve(address(token), 100 ether);
        vm.prank(distributor);
        token.distribute(IERC20(address(rewardToken)), 100 ether);

        // Check distributions array
        (IERC20 distToken, uint256 blockNumber, uint256 amount, bool active) = token.distributions(0);
        assertEq(address(distToken), address(rewardToken), "Wrong distribution token");
        assertEq(amount, 100 ether, "Wrong distribution amount");
        assertTrue(active, "Distribution should be active");
    }

    ////////////////////////////////
    // bbbbb.hasClaimed //
    ////////////////////////////////

    /// @notice Test hasClaimed getter
    function test_HasClaimed() public {
        address distributor = makeAddr("distributor");
        address claimer = makeAddr("claimer");

        // Setup distribution
        token.transfer(claimer, 500 ether);
        rewardToken.mint(distributor, 100 ether);
        vm.prank(distributor);
        rewardToken.approve(address(token), 100 ether);
        vm.prank(distributor);
        token.distribute(IERC20(address(rewardToken)), 100 ether);

        // Check before claim
        assertFalse(token.hasClaimed(0, claimer), "Should not be claimed initially");

        // Claim and check after
        vm.prank(claimer);
        token.claim(0);
        assertTrue(token.hasClaimed(0, claimer), "Should be claimed after claiming");
    }

    ////////////////////////////////
    // bbbbb Snapshot Internals //
    ////////////////////////////////

    /// @notice Test snapshot search with empty snapshots
    function test_SearchSnapshotsEmpty() public {
        address newToken = makeAddr("newToken");
        uint256 balance = token.balanceOfAt(newToken, block.number);
        assertEq(balance, 0, "Empty snapshots should return 0");
    }

    /// @notice Test snapshot search with block after latest snapshot
    function test_SearchSnapshotsAfterLatest() public {
        address user = makeAddr("user");
        uint256 amount = 100 ether;

        // Create snapshot
        token.transfer(user, amount);
        uint256 snapshotBlock = block.number;

        // Check future block
        vm.roll(block.number + 100);
        uint256 balance = token.balanceOfAt(user, block.number);
        assertEq(balance, amount, "Should return latest snapshot value");
    }

    /// @notice Test snapshot search with exact block match
    function test_SearchSnapshotsExactBlock() public {
        address user = makeAddr("user");
        uint256 amount = 100 ether;

        // Create snapshot
        token.transfer(user, amount);
        uint256 snapshotBlock = block.number;

        // Check exact block
        uint256 balance = token.balanceOfAt(user, snapshotBlock);
        assertEq(balance, amount, "Should return exact block snapshot");
    }

    /// @notice Test multiple balance updates in same block
    function test_MultipleUpdatesInBlock() public {
        address user = makeAddr("user");

        // Multiple transfers in same block
        token.transfer(user, 100 ether);
        vm.prank(user);
        token.transfer(address(this), 50 ether);
        token.transfer(user, 75 ether);

        // Only last update should be recorded
        uint256 balance = token.balanceOfAt(user, block.number);
        assertEq(balance, 125 ether, "Should record only last update in block");
    }

    /// @notice Test first snapshot creation
    function test_FirstSnapshot() public {
        address newToken = makeAddr("newToken");
        token.transfer(newToken, 100 ether);

        uint256 balance = token.balanceOfAt(newToken, block.number);
        assertEq(balance, 100 ether, "First snapshot should be recorded");
    }

    /// @notice Test total supply snapshots with multiple updates
    function test_TotalSupplySnapshots() public {
        // Record initial snapshot block
        uint256 initialBlock = block.number;
        uint256 initialSupply = token.totalSupply();

        // Move to new block and check historical supply
        vm.roll(block.number + 1);
        assertEq(token.totalSupplyAt(initialBlock), initialSupply, "Historical total supply incorrect");
    }

    ////////////////////////////////
    // bbbbb Snapshot Search //
    ////////////////////////////////

    /// @notice Test binary search with single snapshot
    function test_SearchSnapshotsSingle() public {
        address user = makeAddr("user");

        // Create single snapshot
        token.transfer(user, 100 ether);

        // Test blocks before and at snapshot
        assertEq(token.balanceOfAt(user, block.number - 1), 0, "Wrong balance before snapshot");
        assertEq(token.balanceOfAt(user, block.number), 100 ether, "Wrong balance at snapshot");
    }

    /// @notice Test binary search with consecutive blocks
    function test_SearchSnapshotsConsecutive() public {
        address user = makeAddr("user");

        // Create snapshots in consecutive blocks
        token.transfer(user, 100 ether);
        vm.roll(block.number + 1);
        token.transfer(user, 200 ether);

        assertEq(token.balanceOfAt(user, block.number - 1), 200 ether, "Wrong balance for first block");
        assertEq(token.balanceOfAt(user, block.number), 200 ether, "Wrong balance for second block");
    }

    ////////////////////////////////
    // bbbbb.claim Edge Cases //
    ////////////////////////////////

    /// @notice Test claim with exact total supply division
    function test_ClaimExactDivision() public {
        address distributor = makeAddr("distributor");
        address user1 = makeAddr("user1");
        address user2 = makeAddr("user2");

        // Setup exact 50-50 split
        token.transfer(user1, 500 ether);
        token.transfer(user2, 500 ether);

        // Create distribution with even number
        rewardToken.mint(distributor, 100 ether);
        vm.prank(distributor);
        rewardToken.approve(address(token), 100 ether);
        vm.prank(distributor);
        token.distribute(IERC20(address(rewardToken)), 100 ether);

        // Both users claim
        vm.prank(user1);
        vm.expectEmit(true, true, true, true);
        emit Claimed(0, user1, 50 ether);
        token.claim(0);

        vm.prank(user2);
        vm.expectEmit(true, true, true, true);
        emit Claimed(0, user2, 50 ether);
        token.claim(0);

        assertEq(rewardToken.balanceOf(user1), 50 ether, "Wrong user1 claim");
        assertEq(rewardToken.balanceOf(user2), 50 ether, "Wrong user2 claim");
    }

    ////////////////////////////////
    // bbbbb Snapshot Edge Cases //
    ////////////////////////////////

    /// @notice Test snapshot search with binary search edge cases
    function test_SearchSnapshotsEdgeCases() public {
        address user = makeAddr("user");

        // Create multiple snapshots
        for (uint256 i = 0; i < 3; i++) {
            token.transfer(user, 100 ether);
            vm.roll(block.number + 1);
            vm.prank(user);
            token.transfer(address(this), 50 ether);
            vm.roll(block.number + 1);
        }

        // Test searching for block between snapshots
        uint256 balance = token.balanceOfAt(user, block.number - 2);
        assertEq(balance, 50 ether, "Wrong balance for mid-point search");
    }

    /// @notice Test total supply snapshots in same block
    function test_TotalSupplySnapshotsSameBlock() public {
        uint256 initialSupply = token.totalSupply();
        uint256 snapshotBlock = block.number;

        // Multiple snapshots in same block should only keep last value
        token.mint(address(this), 100 ether);
        token.burn(address(this), 50 ether);

        assertEq(
            token.totalSupplyAt(snapshotBlock),
            initialSupply + 50 ether,
            "Should record only final total supply in block"
        );
    }
}
