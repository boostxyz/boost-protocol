// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Test, Vm} from "lib/forge-std/src/Test.sol";

import {ERC20} from "@solady/tokens/ERC20.sol";

import {TBIForwarder} from "contracts/timebased/TBIForwarder.sol";
import {IERC7540} from "contracts/timebased/TBIForwarderAdapters.sol";

/// @notice Lagoon vault views the fork test verifies against. `pendingDepositRequest` with
/// `requestId == 0` resolves to the controller's latest request (Lagoon v0.6.0 `ERC7540`).
interface ILagoonVaultViews {
    function pendingDepositRequest(uint256 requestId, address controller) external view returns (uint256);
}

/// @notice Mainnet fork test requesting a deposit into a live Lagoon (ERC-7540, v0.6.0) USDC vault
/// through the deployed TBIForwarder proxy (upgraded in-fork to this tree's implementation).
///
/// No captured-calldata fixture, so no block pin: the test forks latest. The request lands in the
/// vault's current open epoch with the user as controller and the forwarder as owner/sender.
contract TBIForwarderLagoonForkTest is Test {
    /// @dev Deployed TBIForwarder proxy on mainnet (deploys/1.json).
    address internal constant FORWARDER = 0x7A33Bcf7588190e3123235db746339045207Bb93;

    /// @dev Lagoon v0.6.0 vault (asset USDC), blacklist access mode.
    address internal constant VAULT = 0x7f35dEa44a192764aa50d50e5f0eCE1d5a8b0e45;

    /// @dev The vault's pending silo — Lagoon keeps it in private storage (no getter); it is the
    /// recipient of the USDC in the vault's live `requestDeposit` transactions.
    address internal constant PENDING_SILO = 0x951679dF4DAC42b66F94A5bC778825652afc2518;

    address internal constant USDC = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;

    /// @dev Boost multisig — the fixed referral the adapter passes to `requestDeposit`.
    address internal constant BOOST_REFERRAL = 0xA0fd474fB1697cB9EDc27dD79e0d5E9B74D26a87;

    address internal constant USER = 0x1111111111111111111111111111111111111111;

    bytes32 internal constant DEPOSIT_TOPIC = keccak256("Deposit(address,address,address,uint256)");
    bytes32 internal constant DEPOSIT_REQUEST_TOPIC =
        keccak256("DepositRequest(address,address,uint256,address,uint256)");
    bytes32 internal constant REFERRAL_TOPIC = keccak256("Referral(address,address,uint256,uint256)");

    function test_Fork_DepositERC7540_Lagoon_EndToEnd() public {
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

        assertEq(IERC7540(VAULT).asset(), USDC, "vault asset");

        uint256 amount = 10 ** ERC20(USDC).decimals(); // one whole USDC
        deal(USDC, USER, amount);
        vm.prank(USER);
        ERC20(USDC).approve(FORWARDER, amount);

        uint256 siloBefore = ERC20(USDC).balanceOf(PENDING_SILO);

        vm.recordLogs();
        vm.prank(USER);
        forwarder.depositERC7540(IERC7540(VAULT), amount, USER);

        // The request is pending for the user as controller, and the assets sit in the silo.
        assertEq(ILagoonVaultViews(VAULT).pendingDepositRequest(0, USER), amount, "pending request");
        assertEq(ERC20(USDC).balanceOf(PENDING_SILO) - siloBefore, amount, "silo received assets");
        assertEq(ERC20(USDC).balanceOf(USER), 0, "input fully consumed");

        // The stateless forwarder retains nothing and its vault approval is reset.
        assertEq(ERC20(USDC).balanceOf(FORWARDER), 0, "no asset left in forwarder");
        assertEq(ERC20(USDC).allowance(FORWARDER, VAULT), 0, "vault approval reset");

        _assertLogs(amount);
    }

    /// @dev Asserts the vault emitted `DepositRequest` (controller = user, owner = sender =
    /// forwarder) and `Referral` (referral = Boost multisig) for the same request id, and that the
    /// forwarder emitted exactly one log — the generic `Deposit`.
    function _assertLogs(uint256 amount) internal {
        Vm.Log[] memory logs = vm.getRecordedLogs();
        uint256 forwarderLogs;
        uint256 depositRequests;
        uint256 referrals;
        bytes32 requestId;
        for (uint256 i = 0; i < logs.length; i++) {
            Vm.Log memory log = logs[i];
            if (log.emitter == FORWARDER) {
                forwarderLogs++;
                assertEq(log.topics[0], DEPOSIT_TOPIC, "unexpected forwarder event");
                assertEq(address(uint160(uint256(log.topics[1]))), USER, "event user");
                assertEq(address(uint160(uint256(log.topics[2]))), VAULT, "event target");
                assertEq(address(uint160(uint256(log.topics[3]))), USDC, "event asset");
                assertEq(abi.decode(log.data, (uint256)), amount, "event amount");
            } else if (log.emitter == VAULT && log.topics[0] == DEPOSIT_REQUEST_TOPIC) {
                depositRequests++;
                assertEq(address(uint160(uint256(log.topics[1]))), USER, "request controller");
                assertEq(address(uint160(uint256(log.topics[2]))), FORWARDER, "request owner");
                requestId = log.topics[3];
                (address sender, uint256 assets) = abi.decode(log.data, (address, uint256));
                assertEq(sender, FORWARDER, "request sender");
                assertEq(assets, amount, "request assets");
            } else if (log.emitter == VAULT && log.topics[0] == REFERRAL_TOPIC) {
                referrals++;
                assertEq(address(uint160(uint256(log.topics[1]))), BOOST_REFERRAL, "referral");
                assertEq(address(uint160(uint256(log.topics[2]))), FORWARDER, "referral owner");
                assertEq(log.topics[3], requestId, "referral request id");
                assertEq(abi.decode(log.data, (uint256)), amount, "referral assets");
            }
        }
        assertEq(forwarderLogs, 1, "forwarder must emit exactly one log");
        assertEq(depositRequests, 1, "one DepositRequest");
        assertEq(referrals, 1, "one Referral");
    }
}
