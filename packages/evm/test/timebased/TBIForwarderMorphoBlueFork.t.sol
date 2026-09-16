// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Test, Vm} from "lib/forge-std/src/Test.sol";

import {ERC20} from "@solady/tokens/ERC20.sol";

import {TBIForwarder} from "contracts/timebased/TBIForwarder.sol";
import {MorphoMarketParams} from "contracts/timebased/TBIForwarderAdapters.sol";

/// @notice Surface of the Morpho Blue singleton the fork test drives: the canonical-state reads
/// used to resolve the live market's parameters and verify the supplied position. Signatures from
/// morpho-org/morpho-blue `IMorphoStaticTyping` (the `Id` user-defined type is a bytes32).
interface IMorphoBlueViews {
    function idToMarketParams(bytes32 id)
        external
        view
        returns (address loanToken, address collateralToken, address oracle, address irm, uint256 lltv);
    function position(bytes32 id, address user)
        external
        view
        returns (uint256 supplyShares, uint128 borrowShares, uint128 collateral);
    function market(bytes32 id)
        external
        view
        returns (
            uint128 totalSupplyAssets,
            uint128 totalSupplyShares,
            uint128 totalBorrowAssets,
            uint128 totalBorrowShares,
            uint128 lastUpdate,
            uint128 fee
        );
}

/// @notice Robinhood Chain fork test supplying into the live USDe/USDG Morpho Blue market through
/// the deployed TBIForwarder proxy (upgraded in-fork to this tree's implementation), directly on
/// the Robinhood Morpho singleton (a non-canonical deployment; see the market facts below).
///
/// No captured-calldata fixture, so no block pin: the test forks latest and resolves the market's
/// full parameters (notably the oracle) from singleton state at runtime, asserting they hash back
/// to the known market id before supplying.
contract TBIForwarderMorphoBlueForkTest is Test {
    /// @dev Deployed TBIForwarder proxy on Robinhood Chain (deploys/4663.json).
    address internal constant FORWARDER = 0x7A33Bcf7588190e3123235db746339045207Bb93;

    /// @dev Morpho Blue singleton on Robinhood Chain (not the canonical 0xBBBB…FFCb address).
    address internal constant MORPHO = 0x9D53d5E3bd5E8d4Cbfa6DB1ca238AEA02E651010;

    /// @dev The USDe-collateral / USDG-loan market.
    bytes32 internal constant MARKET_ID = 0xc845da65a020ddca5f132efa8fea79676d8edfdea504226a4c01e7a9e34cddd6;
    address internal constant USDG = 0x5fc5360D0400a0Fd4f2af552ADD042D716F1d168;
    address internal constant USDE = 0x5d3a1Ff2b6BAb83b63cd9AD0787074081a52ef34;
    address internal constant IRM = 0x2BD3d5965B26B51814AC95127B2b80dD6CcC0fa1;
    uint256 internal constant LLTV = 915000000000000000;

    address internal constant USER = 0x1111111111111111111111111111111111111111;

    /// @dev keccak256("LedgerDeposit(address,address,uint256,uint256)")
    bytes32 internal constant LEDGER_DEPOSIT_TOPIC = keccak256("LedgerDeposit(address,address,uint256,uint256)");

    function test_Fork_DepositMorphoBlue_EndToEnd() public {
        // Requires a Robinhood Chain RPC; skipped when unset so the suite passes without one
        // (CI provisions only VITE_SEPOLIA_RPC_URL).
        string memory rpcUrl = vm.envOr("VITE_ROBINHOOD_RPC_URL", string(""));
        vm.skip(bytes(rpcUrl).length == 0);
        vm.createSelectFork(rpcUrl);

        // Upgrade the deployed proxy to this tree's implementation.
        TBIForwarder forwarder = TBIForwarder(payable(FORWARDER));
        TBIForwarder implementation = new TBIForwarder();
        vm.prank(forwarder.owner());
        forwarder.upgradeToAndCall(address(implementation), "");

        // Resolve the live market params (the oracle is read from chain, not hardcoded) and pin
        // them to the known id: the adapter's emitted marketKey is keccak256(abi.encode(params)),
        // so this is also the check that our struct layout reproduces Morpho's MarketParamsLib.id.
        MorphoMarketParams memory params = _liveMarketParams();
        assertEq(keccak256(abi.encode(params)), MARKET_ID, "params must hash to the market id");

        uint256 amount = 10 ** ERC20(USDG).decimals(); // one whole USDG
        deal(USDG, USER, amount);
        vm.prank(USER);
        ERC20(USDG).approve(FORWARDER, amount);

        IMorphoBlueViews morpho = IMorphoBlueViews(MORPHO);
        (uint256 sharesBefore,,) = morpho.position(MARKET_ID, USER);
        (uint128 totalSupplyAssetsBefore,,,,,) = morpho.market(MARKET_ID);
        assertEq(sharesBefore, 0, "fresh user");

        vm.recordLogs();
        vm.prank(USER);
        forwarder.depositMorphoBlue(MORPHO, params, amount, USER);

        // The supply position landed on the user as book-entry shares, and the market's supplied
        // assets grew by at least the deposit (more if interest accrued in the same call).
        (uint256 sharesAfter,,) = morpho.position(MARKET_ID, USER);
        (uint128 totalSupplyAssetsAfter,,,,,) = morpho.market(MARKET_ID);
        assertGt(sharesAfter, 0, "supply shares credited");
        assertGe(totalSupplyAssetsAfter, totalSupplyAssetsBefore + amount, "market supply grew");
        assertEq(ERC20(USDG).balanceOf(USER), 0, "input fully consumed");

        // The stateless forwarder retains nothing and its singleton approval is reset.
        assertEq(ERC20(USDG).balanceOf(FORWARDER), 0, "no asset left in forwarder");
        assertEq(ERC20(USDG).allowance(FORWARDER, MORPHO), 0, "singleton approval reset");

        _assertLedgerDepositEmitted(amount);
    }

    /// @dev Reads the market's parameters from the singleton and cross-checks the fields we know
    /// against the BD-sourced chain facts, so a wrong market id fails loudly here rather than as
    /// an opaque `supply` revert.
    function _liveMarketParams() internal view returns (MorphoMarketParams memory params) {
        (address loanToken, address collateralToken, address oracle, address irm, uint256 lltv) =
            IMorphoBlueViews(MORPHO).idToMarketParams(MARKET_ID);
        assertEq(loanToken, USDG, "market loan token");
        assertEq(collateralToken, USDE, "market collateral token");
        assertEq(irm, IRM, "market irm");
        assertEq(lltv, LLTV, "market lltv");
        assertTrue(oracle != address(0), "market oracle");
        params = MorphoMarketParams({
            loanToken: loanToken, collateralToken: collateralToken, oracle: oracle, irm: irm, lltv: lltv
        });
    }

    /// @dev Asserts the forwarder emitted exactly one log: a LedgerDeposit with the singleton as
    /// `ledger`, the market id as `marketKey` (uint256-widened, in data, not indexed), and
    /// loan-token units.
    function _assertLedgerDepositEmitted(uint256 amount) internal {
        Vm.Log[] memory logs = vm.getRecordedLogs();
        uint256 forwarderLogs;
        for (uint256 i = 0; i < logs.length; i++) {
            if (logs[i].emitter != FORWARDER) continue;
            forwarderLogs++;
            assertEq(logs[i].topics[0], LEDGER_DEPOSIT_TOPIC, "unexpected forwarder event");
            assertEq(address(uint160(uint256(logs[i].topics[1]))), USER, "event user");
            assertEq(address(uint160(uint256(logs[i].topics[2]))), MORPHO, "event ledger");
            (uint256 marketKey, uint256 eventAmount) = abi.decode(logs[i].data, (uint256, uint256));
            assertEq(marketKey, uint256(MARKET_ID), "event marketKey");
            assertEq(eventAmount, amount, "event amount");
        }
        assertEq(forwarderLogs, 1, "forwarder must emit exactly one log");
    }
}
