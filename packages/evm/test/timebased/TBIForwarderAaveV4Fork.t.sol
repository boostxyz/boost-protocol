// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Test, Vm} from "lib/forge-std/src/Test.sol";

import {ERC20} from "@solady/tokens/ERC20.sol";

import {TBIForwarder} from "contracts/timebased/TBIForwarder.sol";
import {IGiverPositionManager} from "contracts/timebased/TBIForwarderAdapters.sol";

/// @notice Surface of the Aave v4 Spoke the fork test drives: the user-side position-manager
/// opt-in the deposit prerequisite hinges on, plus the canonical-state reads used to discover a
/// live reserve and verify the supplied position. Signatures from aave/aave-v4 `ISpoke`.
interface IAaveV4Spoke {
    function setUserPositionManager(address positionManager, bool approve) external;
    function isPositionManagerActive(address positionManager) external view returns (bool);
    function getReserveCount() external view returns (uint256);
    function getUserSuppliedAssets(uint256 reserveId, address user) external view returns (uint256);
}

/// @notice Mainnet fork test supplying into the live Aave v4 Main Spoke through the deployed
/// TBIForwarder proxy (upgraded in-fork to this tree's implementation), routed via the
/// governance-registered GiverPositionManager.
///
/// Unlike the Kyber zap fork test there is no captured-calldata fixture, so no block pin: the test
/// forks latest and discovers a live reserve (USDC preferred, then WETH) from Spoke state at
/// runtime, keeping it valid as reserves are listed or re-ordered.
contract TBIForwarderAaveV4ForkTest is Test {
    /// @dev Deployed TBIForwarder proxy on mainnet (deploys/1.json).
    address internal constant FORWARDER = 0x7A33Bcf7588190e3123235db746339045207Bb93;

    /// @dev Aave v4 GiverPositionManager, governance-registered on the Main Spoke.
    address internal constant GIVER = 0x17A54b8d6D9C68e7fa1C7112AC998EA1BA51d11e;

    /// @dev Aave v4 Main Spoke.
    address internal constant SPOKE = 0x94e7A5dCbE816e498b89aB752661904E2F56c485;

    address internal constant USDC = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;
    address internal constant WETH = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;

    address internal constant USER = 0x1111111111111111111111111111111111111111;

    /// @dev keccak256("LedgerDeposit(address,address,uint256,uint256)")
    bytes32 internal constant LEDGER_DEPOSIT_TOPIC = keccak256("LedgerDeposit(address,address,uint256,uint256)");

    function test_Fork_DepositAaveV4_EndToEnd() public {
        // Requires a mainnet RPC; skipped when unset so the suite passes without one
        // (CI provisions only VITE_SEPOLIA_RPC_URL).
        string memory rpcUrl = vm.envOr("VITE_MAINNET_RPC_URL", string(""));
        vm.skip(bytes(rpcUrl).length == 0);
        vm.createSelectFork(rpcUrl);

        // Upgrade the deployed proxy to this tree's implementation.
        TBIForwarder forwarder = TBIForwarder(payable(FORWARDER));
        TBIForwarder implementation = new TBIForwarder();
        vm.prank(forwarder.owner());
        forwarder.upgradeToAndCall(address(implementation), "");

        // The Giver must be governance-registered on the Spoke or no opt-in can route through it.
        IAaveV4Spoke spoke = IAaveV4Spoke(SPOKE);
        assertTrue(spoke.isPositionManagerActive(GIVER), "Giver not active on Spoke");

        (uint256 reserveId, address asset, uint256 decimals) = _findReserve(spoke);
        uint256 amount = 10 ** decimals; // one whole token

        deal(asset, USER, amount);
        vm.prank(USER);
        ERC20(asset).approve(FORWARDER, amount);

        // Without the user's position-manager opt-in the Spoke rejects the Giver's supply — the
        // prerequisite the frontend bundles (BOOST-6713) — and the revert surfaces to the caller.
        vm.prank(USER);
        vm.expectRevert();
        forwarder.depositAaveV4(IGiverPositionManager(GIVER), SPOKE, reserveId, asset, amount, USER);

        vm.prank(USER);
        spoke.setUserPositionManager(GIVER, true);

        vm.recordLogs();
        vm.prank(USER);
        forwarder.depositAaveV4(IGiverPositionManager(GIVER), SPOKE, reserveId, asset, amount, USER);

        // The supplied position landed on the user (supplied-assets view rounds by ≤1 wei).
        assertApproxEqAbs(spoke.getUserSuppliedAssets(reserveId, USER), amount, 1, "supplied position");
        assertEq(ERC20(asset).balanceOf(USER), 0, "input fully consumed");

        // The stateless forwarder retains nothing and its Giver approval is reset.
        assertEq(ERC20(asset).balanceOf(FORWARDER), 0, "no asset left in forwarder");
        assertEq(ERC20(asset).allowance(FORWARDER, GIVER), 0, "Giver approval reset");

        _assertLedgerDepositEmitted(reserveId, amount);
    }

    /// @dev Discovers a live reserve to supply into, preferring USDC then WETH (both `deal`-able
    /// and safely below any supply cap at one whole token). `getReserve(uint256)` returns the
    /// `Reserve` struct whose head word is `underlying` and fourth word is `decimals`; decoding
    /// just those two keeps the test decoupled from the rest of the struct. Reserve ids are
    /// scanned from 0 through `getReserveCount()` inclusive to stay agnostic to id base.
    function _findReserve(IAaveV4Spoke spoke)
        internal
        view
        returns (uint256 reserveId, address asset, uint256 decimals)
    {
        uint256 count = spoke.getReserveCount();
        uint256 wethReserveId = type(uint256).max;
        uint256 wethDecimals;
        for (uint256 i = 0; i <= count; i++) {
            (bool ok, bytes memory data) = address(spoke).staticcall(abi.encodeWithSignature("getReserve(uint256)", i));
            if (!ok || data.length < 128) continue;
            (address underlying,,, uint256 reserveDecimals) = abi.decode(data, (address, address, uint256, uint256));
            if (underlying == USDC) return (i, USDC, reserveDecimals);
            if (underlying == WETH && wethReserveId == type(uint256).max) {
                wethReserveId = i;
                wethDecimals = reserveDecimals;
            }
        }
        require(wethReserveId != type(uint256).max, "no USDC or WETH reserve on Spoke");
        return (wethReserveId, WETH, wethDecimals);
    }

    /// @dev Asserts the forwarder emitted exactly one log: a LedgerDeposit with the Spoke as
    /// `ledger`, the reserve id as `marketKey` (in data, not indexed), and underlying units.
    function _assertLedgerDepositEmitted(uint256 reserveId, uint256 amount) internal {
        Vm.Log[] memory logs = vm.getRecordedLogs();
        uint256 forwarderLogs;
        for (uint256 i = 0; i < logs.length; i++) {
            if (logs[i].emitter != FORWARDER) continue;
            forwarderLogs++;
            assertEq(logs[i].topics[0], LEDGER_DEPOSIT_TOPIC, "unexpected forwarder event");
            assertEq(address(uint160(uint256(logs[i].topics[1]))), USER, "event user");
            assertEq(address(uint160(uint256(logs[i].topics[2]))), SPOKE, "event ledger");
            (uint256 marketKey, uint256 eventAmount) = abi.decode(logs[i].data, (uint256, uint256));
            assertEq(marketKey, reserveId, "event marketKey");
            assertEq(eventAmount, amount, "event amount");
        }
        assertEq(forwarderLogs, 1, "forwarder must emit exactly one log");
    }
}
