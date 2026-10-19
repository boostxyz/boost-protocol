// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Test, Vm} from "lib/forge-std/src/Test.sol";

import {ERC20} from "@solady/tokens/ERC20.sol";

import {TBIForwarder} from "contracts/timebased/TBIForwarder.sol";
import {IStakedStrat} from "contracts/timebased/TBIForwarderAdapters.sol";

/// @notice Read surface of ETH Strategy's StakedStrat beyond what the adapter calls.
interface IStakedStratViews {
    function staked(address user) external view returns (uint256);
    function rewardToken() external view returns (address);
    function periodFinish() external view returns (uint256);
    function rewardsPerShare() external view returns (uint256);
    function rewardDebt(address user) external view returns (uint256);
    function syncRewards() external;
}

/// @notice Mainnet fork test staking EARN into the live sEARN StakedStrat through the deployed
/// TBIForwarder proxy (upgraded in-fork to this tree's implementation). Exercises the real
/// contract's reward accounting, which the unit-test mock does not model: the migrate's
/// rewardDebt arithmetic, the recipient's pending-reward payout, and stray stake held by the
/// forwarder.
///
/// No captured-calldata fixture, so no block pin: the test forks latest.
contract TBIForwarderStakedStratForkTest is Test {
    /// @dev Deployed TBIForwarder proxy on Ethereum mainnet (deploys/1.json).
    address internal constant FORWARDER = 0x7A33Bcf7588190e3123235db746339045207Bb93;

    /// @dev sEARN — ETH Strategy's StakedStrat for EARN, paying USDS.
    address internal constant SEARN = 0x2B5ab0a6CAb343edeeF46A2e90F23460bc852938;
    address internal constant EARN = 0x106E54F413180953C5D251bcc3d82122b9c63dAf;
    address internal constant USDS = 0xdC035D45d973E3EC169d2276DDab16f1e407384F;

    address internal constant USER = 0x1111111111111111111111111111111111111111;
    address internal constant GRIEFER = 0x2222222222222222222222222222222222222222;

    bytes32 internal constant DEPOSIT_TOPIC = keccak256("Deposit(address,address,address,uint256)");
    bytes32 internal constant TRANSFER_TOPIC = keccak256("Transfer(address,address,uint256)");

    TBIForwarder internal forwarder;

    function setUp() public {
        // Requires a mainnet RPC; skipped when unset so the suite passes without one
        // (CI provisions only VITE_SEPOLIA_RPC_URL).
        string memory rpcUrl = vm.envOr("VITE_MAINNET_RPC_URL", string(""));
        vm.skip(bytes(rpcUrl).length == 0);
        vm.createSelectFork(rpcUrl);

        // Upgrade the deployed proxy to this tree's implementation.
        forwarder = TBIForwarder(payable(FORWARDER));
        TBIForwarder implementation = new TBIForwarder();
        vm.prank(forwarder.owner());
        forwarder.upgradeToAndCall(address(implementation), "");

        assertEq(IStakedStrat(SEARN).stratToken(), EARN, "stratToken");
        assertEq(IStakedStratViews(SEARN).rewardToken(), USDS, "rewardToken");
    }

    function test_Fork_StakeStakedStrat_EndToEnd() public {
        uint256 amount = 10 ether;
        _fund(USER, amount);

        vm.recordLogs();
        vm.prank(USER);
        forwarder.stakeStakedStrat(IStakedStrat(SEARN), amount, USER);
        Vm.Log[] memory logs = vm.getRecordedLogs();

        // The user holds the stake; the stateless forwarder retains nothing.
        assertEq(ERC20(SEARN).balanceOf(USER), amount, "sEARN credited");
        assertEq(IStakedStratViews(SEARN).staked(USER), amount, "stake credited");
        assertEq(ERC20(SEARN).balanceOf(FORWARDER), 0, "no sEARN left in forwarder");
        assertEq(IStakedStratViews(SEARN).staked(FORWARDER), 0, "no stake left in forwarder");
        assertEq(ERC20(EARN).balanceOf(FORWARDER), 0, "no EARN left in forwarder");
        assertEq(ERC20(EARN).allowance(FORWARDER, SEARN), 0, "approval reset");
        assertEq(ERC20(EARN).balanceOf(USER), 0, "input fully consumed");

        _assertDepositEmitted(logs, amount);
        // The backend credits a forwarded receipt (forwarder -> user Transfer), not a mint.
        _assertForwardedTransfer(logs, amount);
    }

    function test_Fork_StakeStakedStrat_TopUpPaysRewardsToUserNotForwarder() public {
        uint256 amount = 10 ether;
        _fund(USER, 2 * amount);

        vm.prank(USER);
        forwarder.stakeStakedStrat(IStakedStrat(SEARN), amount, USER);

        vm.warp(block.timestamp + 1 days);
        uint256 usdsBefore = ERC20(USDS).balanceOf(USER);
        uint256 forwarderUsdsBefore = ERC20(USDS).balanceOf(FORWARDER);

        // Topping up an existing stake: migrateStake pays the user's pending rewards to them.
        vm.prank(USER);
        forwarder.stakeStakedStrat(IStakedStrat(SEARN), amount, USER);

        assertEq(IStakedStratViews(SEARN).staked(USER), 2 * amount, "stake topped up");
        assertEq(IStakedStratViews(SEARN).staked(FORWARDER), 0, "no stake left in forwarder");
        assertEq(ERC20(USDS).balanceOf(FORWARDER), forwarderUsdsBefore, "forwarder earns no rewards");
        if (IStakedStratViews(SEARN).periodFinish() > block.timestamp) {
            assertGt(ERC20(USDS).balanceOf(USER), usdsBefore, "pending rewards paid to user");
        }
    }

    function test_Fork_StakeStakedStrat_WithStrayStakeInForwarder() public {
        // Stake migrated into the forwarder by a third party, left to accrue rewards, must not
        // block later deposits; the full migrate sweeps it (and its rewards) to the depositor.
        uint256 stray = 7 ether;
        _fund(GRIEFER, stray);
        vm.startPrank(GRIEFER);
        ERC20(EARN).approve(SEARN, stray);
        IStakedStrat(SEARN).stake(stray);
        IStakedStrat(SEARN).migrateStake(FORWARDER, stray);
        vm.stopPrank();

        vm.warp(block.timestamp + 3 days);

        uint256 amount = 10 ether;
        _fund(USER, amount);
        vm.prank(USER);
        forwarder.stakeStakedStrat(IStakedStrat(SEARN), amount, USER);

        assertEq(IStakedStratViews(SEARN).staked(USER), amount + stray, "stray stake swept to user");
        assertEq(IStakedStratViews(SEARN).staked(FORWARDER), 0, "no stake left in forwarder");
        assertEq(ERC20(EARN).balanceOf(FORWARDER), 0, "no EARN left in forwarder");
    }

    function test_Fork_StakeStakedStrat_DustDonationBelowOneRewardPerShare() public {
        // A fresh StakedStrat: live sEARN's runtime code (immutables stratToken/rewardToken baked
        // in) at a new address with empty storage, so rewardsPerShare starts at 0. Live sEARN is
        // already past 1e18, where the rounding below cannot underflow; a young deployment is not.
        address fresh = address(0x5EA2);
        vm.etch(fresh, SEARN.code);

        // A base staker and a USDS stream that leaves rewardsPerShare ~0.6e18 after 28 days.
        address baseStaker = address(0xBA5E);
        deal(EARN, baseStaker, 1000 ether);
        vm.startPrank(baseStaker);
        ERC20(EARN).approve(fresh, 1000 ether);
        IStakedStrat(fresh).stake(1000 ether);
        vm.stopPrank();
        deal(USDS, fresh, 600 ether);
        IStakedStratViews(fresh).syncRewards();

        // Griefer parks 1 wei of stake in the forwarder before rewards accrue.
        deal(EARN, GRIEFER, 1);
        vm.startPrank(GRIEFER);
        ERC20(EARN).approve(fresh, 1);
        IStakedStrat(fresh).stake(1);
        IStakedStrat(fresh).migrateStake(FORWARDER, 0);
        vm.stopPrank();

        vm.warp(block.timestamp + 28 days);
        IStakedStratViews(fresh).syncRewards();
        uint256 rps = IStakedStratViews(fresh).rewardsPerShare();
        assertLt(rps, 1e18, "rewardsPerShare below 1e18");

        // Pick a deposit whose stake rounds the forwarder's pending reward up to 1 wei: a partial
        // migrate then moves 0 of it and StakedStrat's debt update underflows.
        uint256 dust = IStakedStratViews(fresh).staked(FORWARDER);
        uint256 debt = IStakedStratViews(fresh).rewardDebt(FORWARDER);
        uint256 amount;
        for (uint256 a = 10 ether; a < 10 ether + 100; a++) {
            if ((a + dust) * rps / 1e18 > debt + a * rps / 1e18) {
                amount = a;
                break;
            }
        }
        assertGt(amount, 0, "found a rounding-hit amount");

        deal(EARN, USER, amount);
        vm.startPrank(USER);
        ERC20(EARN).approve(FORWARDER, amount);
        forwarder.stakeStakedStrat(IStakedStrat(fresh), amount, USER);
        vm.stopPrank();

        // The whole forwarder stake moves, so nothing is left to underflow against.
        assertEq(IStakedStratViews(fresh).staked(USER), amount + dust, "user gets deposit + swept dust");
        assertEq(IStakedStratViews(fresh).staked(FORWARDER), 0, "no stake left in forwarder");
    }

    function _fund(address account, uint256 amount) internal {
        deal(EARN, account, amount);
        vm.prank(account);
        ERC20(EARN).approve(FORWARDER, type(uint256).max);
    }

    /// @dev Asserts the forwarder emitted exactly one log: the generic Deposit naming sEARN as
    /// `target` and EARN as `asset`.
    function _assertDepositEmitted(Vm.Log[] memory logs, uint256 amount) internal pure {
        uint256 forwarderLogs;
        for (uint256 i = 0; i < logs.length; i++) {
            if (logs[i].emitter != FORWARDER) continue;
            forwarderLogs++;
            assertEq(logs[i].topics[0], DEPOSIT_TOPIC, "unexpected forwarder event");
            assertEq(address(uint160(uint256(logs[i].topics[1]))), USER, "event user");
            assertEq(address(uint160(uint256(logs[i].topics[2]))), SEARN, "event target");
            assertEq(address(uint160(uint256(logs[i].topics[3]))), EARN, "event asset");
            assertEq(abi.decode(logs[i].data, (uint256)), amount, "event amount");
        }
        assertEq(forwarderLogs, 1, "forwarder must emit exactly one log");
    }

    /// @dev Asserts sEARN emitted exactly one Transfer to the user, from the forwarder.
    function _assertForwardedTransfer(Vm.Log[] memory logs, uint256 amount) internal pure {
        uint256 toUser;
        for (uint256 i = 0; i < logs.length; i++) {
            if (logs[i].emitter != SEARN || logs[i].topics[0] != TRANSFER_TOPIC) continue;
            if (address(uint160(uint256(logs[i].topics[2]))) != USER) continue;
            toUser++;
            assertEq(address(uint160(uint256(logs[i].topics[1]))), FORWARDER, "transfer from forwarder");
            assertEq(abi.decode(logs[i].data, (uint256)), amount, "transfer amount");
        }
        assertEq(toUser, 1, "exactly one sEARN transfer to user");
    }
}
