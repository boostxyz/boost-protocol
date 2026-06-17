// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Test} from "lib/forge-std/src/Test.sol";

import {LibClone} from "@solady/utils/LibClone.sol";
import {ERC20} from "@solady/tokens/ERC20.sol";

import {MockERC20} from "contracts/shared/Mocks.sol";
import {TBIForwarder} from "contracts/timebased/TBIForwarder.sol";
import {
    TBIForwarderAdapters,
    IERC4626,
    IAaveV3Pool,
    IComet,
    IStakedToken,
    ICErc20,
    ISyncDepositQueue,
    IUniswapV4PositionManager,
    PoolKey,
    Currency,
    V4MintParams,
    V4ZapParams,
    IMidasDepositVault
} from "contracts/timebased/TBIForwarderAdapters.sol";

/// @notice Minimal ERC-4626 mock that accepts deposits and mints 1:1 shares
contract MockERC4626 is ERC20 {
    address public immutable underlying;

    constructor(address underlying_) {
        underlying = underlying_;
    }

    function name() public pure override returns (string memory) {
        return "Mock Vault Shares";
    }

    function symbol() public pure override returns (string memory) {
        return "mVAULT";
    }

    function asset() external view returns (address) {
        return underlying;
    }

    function deposit(uint256 assets, address receiver) external returns (uint256 shares) {
        ERC20(underlying).transferFrom(msg.sender, address(this), assets);
        shares = assets; // 1:1 for simplicity
        _mint(receiver, shares);
    }
}

/// @notice Minimal Aave v3 pool mock that accepts supply calls and mints aTokens 1:1
contract MockAaveV3Pool {
    MockAToken public immutable aToken;

    constructor(address underlying_) {
        aToken = new MockAToken(underlying_);
    }

    function supply(address supplyAsset, uint256 amount, address onBehalfOf, uint16) external {
        ERC20(supplyAsset).transferFrom(msg.sender, address(aToken), amount);
        aToken.mint(onBehalfOf, amount);
    }
}

contract MockAToken is ERC20 {
    address public immutable underlying;

    constructor(address underlying_) {
        underlying = underlying_;
    }

    function name() public pure override returns (string memory) {
        return "Mock aToken";
    }

    function symbol() public pure override returns (string memory) {
        return "maToken";
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}

/// @notice Minimal Compound v3 Comet mock that accepts supplyTo calls
contract MockComet {
    MockCometReceipt public immutable receipt;

    constructor(address underlying_) {
        receipt = new MockCometReceipt(underlying_);
    }

    function supplyTo(address dst, address supplyAsset, uint256 amount) external {
        ERC20(supplyAsset).transferFrom(msg.sender, address(receipt), amount);
        receipt.mint(dst, amount);
    }
}

contract MockCometReceipt is ERC20 {
    address public immutable underlying;

    constructor(address underlying_) {
        underlying = underlying_;
    }

    function name() public pure override returns (string memory) {
        return "Mock Comet Receipt";
    }

    function symbol() public pure override returns (string memory) {
        return "mCOMET";
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}

/// @notice Minimal Aave staked token mock that pulls tokens and mints staked tokens
contract MockStakedToken is ERC20 {
    address public immutable underlying;

    constructor(address underlying_) {
        underlying = underlying_;
    }

    function name() public pure override returns (string memory) {
        return "Mock Staked Token";
    }

    function symbol() public pure override returns (string memory) {
        return "mSTK";
    }

    function stake(address onBehalfOf, uint256 amount) external {
        ERC20(underlying).transferFrom(msg.sender, address(this), amount);
        _mint(onBehalfOf, amount);
    }
}

/// @notice Minimal Compound v2 cToken mock — mint() sends cTokens to msg.sender (the forwarder)
contract MockCErc20 is ERC20 {
    address public immutable underlying;

    constructor(address underlying_) {
        underlying = underlying_;
    }

    function name() public pure override returns (string memory) {
        return "Mock cToken";
    }

    function symbol() public pure override returns (string memory) {
        return "mcTOKEN";
    }

    function mint(uint256 mintAmount) external returns (uint256) {
        ERC20(underlying).transferFrom(msg.sender, address(this), mintAmount);
        _mint(msg.sender, mintAmount); // cTokens go to caller, not end user
        return 0; // 0 = success in Compound v2
    }
}

/// @notice cToken mock that always fails mint
contract MockCErc20Failing is ERC20 {
    address public immutable underlying;

    constructor(address underlying_) {
        underlying = underlying_;
    }

    function name() public pure override returns (string memory) {
        return "Mock cToken Failing";
    }

    function symbol() public pure override returns (string memory) {
        return "mcFAIL";
    }

    function mint(uint256) external pure returns (uint256) {
        return 1; // Non-zero = failure in Compound v2
    }
}

/// @notice Minimal Permit2 AllowanceTransfer mock. Tracks per-(owner, token, spender) allowance
/// state and lets the registered spender pull tokens via standard ERC20 transferFrom under the
/// hood. Stores approves with the expiration we set so the forwarder's `currentExpiration` check
/// behaves identically to real Permit2.
contract MockPermit2 {
    struct PackedAllowance {
        uint160 amount;
        uint48 expiration;
        uint48 nonce;
    }

    mapping(address => mapping(address => mapping(address => PackedAllowance))) public allowances;

    function approve(address token, address spender, uint160 amount, uint48 expiration) external {
        allowances[msg.sender][token][spender] = PackedAllowance({amount: amount, expiration: expiration, nonce: 0});
    }

    function allowance(address user, address token, address spender)
        external
        view
        returns (uint160 amount, uint48 expiration, uint48 nonce)
    {
        PackedAllowance memory a = allowances[user][token][spender];
        return (a.amount, a.expiration, a.nonce);
    }

    /// @notice Pulls `amount` of `token` from `from` to `to`, consuming allowance from `from` to `msg.sender`.
    function transferFrom(address from, address to, uint160 amount, address token) external {
        PackedAllowance storage a = allowances[from][token][msg.sender];
        require(a.amount >= amount, "Permit2: insufficient allowance");
        require(a.expiration > block.timestamp, "Permit2: expired");
        if (a.amount != type(uint160).max) {
            a.amount -= amount;
        }
        ERC20(token).transferFrom(from, to, amount);
    }
}

/// @notice Minimal V4 PositionManager mock. Decodes the unlockData, asserts the actions match
/// MINT_POSITION + SETTLE_PAIR (+ SWEEP for native pools), and pulls each ERC20 currency via
/// Permit2 transferFrom. A native currency0 is settled from `msg.value` and its unspent remainder
/// is returned to the SWEEP recipient. The "spent" amounts are configurable so tests can exercise
/// the refund path; they default to `amountMax` (no leftover) until `setSpend` is called.
contract MockV4PositionManager {
    MockPermit2 public immutable permit2;
    uint128 public spend0;
    uint128 public spend1;
    bool public spendConfigured;

    // Captured for assertions
    address public lastOwner;
    bytes public lastHookData;
    uint256 public lastLiquidity;
    int24 public lastTickLower;
    int24 public lastTickUpper;

    constructor(address permit2_) {
        permit2 = MockPermit2(permit2_);
    }

    function setSpend(uint128 spend0_, uint128 spend1_) external {
        spend0 = spend0_;
        spend1 = spend1_;
        spendConfigured = true;
    }

    function modifyLiquidities(bytes calldata unlockData, uint256 deadline) external payable {
        require(block.timestamp <= deadline, "V4: deadline passed");

        (bytes memory actions, bytes[] memory params) = abi.decode(unlockData, (bytes, bytes[]));
        require(actions.length == 2 || actions.length == 3, "V4: expected 2 or 3 actions");
        require(uint8(actions[0]) == 0x02, "V4: action 0 must be MINT_POSITION");
        require(uint8(actions[1]) == 0x0d, "V4: action 1 must be SETTLE_PAIR");
        bool hasSweep = actions.length == 3;
        if (hasSweep) require(uint8(actions[2]) == 0x14, "V4: action 2 must be SWEEP");

        (PoolKey memory poolKey, uint128 amount0Max, uint128 amount1Max) = _decodeMint(params[0]);
        _decodeAndCheckSettle(params[1], poolKey);

        uint128 take0 = spendConfigured ? spend0 : amount0Max;
        uint128 take1 = spendConfigured ? spend1 : amount1Max;
        require(take0 <= amount0Max && take1 <= amount1Max, "V4: spend exceeds max");

        address c0 = Currency.unwrap(poolKey.currency0);
        if (c0 == address(0)) {
            // Native currency0: settled from msg.value, unspent ETH returned via SWEEP.
            require(hasSweep, "V4: native currency0 requires SWEEP");
            require(msg.value == amount0Max, "V4: msg.value must equal amount0Max");
            (address sweepCurrency, address sweepRecipient) = abi.decode(params[2], (address, address));
            require(sweepCurrency == address(0), "V4: sweep currency must be native");
            uint256 refund0 = uint256(amount0Max) - take0;
            if (refund0 > 0) {
                (bool ok,) = sweepRecipient.call{value: refund0}("");
                require(ok, "V4: native refund failed");
            }
        } else {
            require(msg.value == 0, "V4: unexpected native value");
            permit2.transferFrom(msg.sender, address(this), take0, c0);
        }
        permit2.transferFrom(msg.sender, address(this), take1, Currency.unwrap(poolKey.currency1));
    }

    function _decodeMint(bytes memory data)
        internal
        returns (PoolKey memory poolKey, uint128 amount0Max, uint128 amount1Max)
    {
        int24 tickLower;
        int24 tickUpper;
        uint256 liquidity;
        address owner;
        bytes memory hookData;
        (poolKey, tickLower, tickUpper, liquidity, amount0Max, amount1Max, owner, hookData) =
            abi.decode(data, (PoolKey, int24, int24, uint256, uint128, uint128, address, bytes));

        lastOwner = owner;
        lastHookData = hookData;
        lastLiquidity = liquidity;
        lastTickLower = tickLower;
        lastTickUpper = tickUpper;
    }

    function _decodeAndCheckSettle(bytes memory data, PoolKey memory poolKey) internal pure {
        (Currency c0, Currency c1) = abi.decode(data, (Currency, Currency));
        require(Currency.unwrap(c0) == Currency.unwrap(poolKey.currency0), "V4: settle currency0 mismatch");
        require(Currency.unwrap(c1) == Currency.unwrap(poolKey.currency1), "V4: settle currency1 mismatch");
    }
}

/// @notice Minimal aggregator-router mock for the zap path. `swap` pulls `amountIn` of `tokenIn`
/// from the caller (the forwarder) — via `transferFrom` for an ERC20 or `msg.value` for native —
/// and sends a fixed `amountOut` of `tokenOut` to `recipient`. The router must be pre-funded with
/// the output token (or ETH). Native is signaled by `address(0)`, matching what the forwarder
/// forwards (the frontend maps Kyber's sentinel to/from `address(0)` at the request boundary).
contract MockKyberRouter {
    function swap(address tokenIn, uint256 amountIn, address tokenOut, uint256 amountOut, address recipient)
        external
        payable
    {
        if (tokenIn == address(0)) {
            require(msg.value == amountIn, "router: bad native value");
        } else {
            require(msg.value == 0, "router: unexpected native value");
            ERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);
        }
        if (tokenOut == address(0)) {
            (bool ok,) = recipient.call{value: amountOut}("");
            require(ok, "router: native out failed");
        } else {
            ERC20(tokenOut).transfer(recipient, amountOut);
        }
    }
}

/// @notice Router mock that always reverts, to verify the forwarder bubbles the swap revert reason.
contract MockRevertingRouter {
    function swap(address, uint256, address, uint256, address) external payable {
        revert("router: swap failed");
    }
}

/// @notice Router mock that re-enters the forwarder during the swap, to verify `nonReentrant`
/// blocks reentrancy while transient zap balances are held.
contract MockReentrantRouter {
    TBIForwarder public immutable forwarder;

    constructor(address forwarder_) {
        forwarder = TBIForwarder(payable(forwarder_));
    }

    function swap(address, uint256, address, uint256, address) external payable {
        V4MintParams memory p;
        p.receiver = address(0xBEEF);
        forwarder.depositUniswapV4LP(IUniswapV4PositionManager(address(0)), p);
    }
}

/// @notice Minimal Mellow share token (e.g. Lido earnETH). In Mellow v2 the vault's ShareManager
/// and the ERC-20 share token are the same contract; `mint` is what the queue calls on deposit.
contract MockMellowShareToken is ERC20 {
    function name() public pure override returns (string memory) {
        return "Mock Lido Earn ETH";
    }

    function symbol() public pure override returns (string memory) {
        return "mEarnETH";
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}

/// @notice Minimal Mellow vault exposing the ShareManager (the share token) the queue mints.
contract MockMellowVault {
    address public shareManager;

    constructor(address shareManager_) {
        shareManager = shareManager_;
    }
}

/// @notice Minimal Mellow SyncDepositQueue. Mirrors the real queue: it pulls the ERC-20 asset from
/// the caller (the forwarder) — or accepts native ETH via msg.value — and mints share tokens to the
/// *caller*, never a receiver. A nonzero `feeBps` mints a fee slice to `feeRecipient` (not the
/// caller), so the net shares the forwarder receives differ from `assets` and a naive 1:1 rate.
contract MockSyncDepositQueue {
    address constant NATIVE = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;

    address public asset;
    address public vault;
    uint256 public immutable rateBps;
    uint256 public immutable feeBps;
    address public immutable feeRecipient;
    MockMellowShareToken public immutable share;

    constructor(address asset_, uint256 rateBps_, uint256 feeBps_, address feeRecipient_) {
        share = new MockMellowShareToken();
        vault = address(new MockMellowVault(address(share)));
        asset = asset_;
        rateBps = rateBps_;
        feeBps = feeBps_;
        feeRecipient = feeRecipient_;
    }

    function deposit(uint224 assets, address, bytes32[] calldata) external payable {
        if (asset == NATIVE) {
            require(msg.value == assets, "bad msg.value");
        } else {
            ERC20(asset).transferFrom(msg.sender, address(this), assets);
        }
        uint256 totalShares = uint256(assets) * rateBps / 10_000;
        uint256 feeShares = totalShares * feeBps / 10_000;
        if (feeShares > 0) share.mint(feeRecipient, feeShares);
        share.mint(msg.sender, totalShares - feeShares);
    }
}

/// @notice Minimal Midas mToken — the minted share token, a separate contract from the vault
contract MockMToken is ERC20 {
    address public minter;

    constructor() {
        minter = msg.sender;
    }

    function name() public pure override returns (string memory) {
        return "Mock mToken";
    }

    function symbol() public pure override returns (string memory) {
        return "mTKN";
    }

    function mint(address to, uint256 amount) external {
        require(msg.sender == minter, "not minter");
        _mint(to, amount);
    }
}

/// @notice Minimal Midas DepositVault mock. Mirrors the real vault's two key quirks:
///   1. `amountToken` is a base-18 figure used to mint the mToken, but the native tokenIn pulled
///      from msg.sender is a *different* (rate-converted) amount — modeled here as `nativePull`.
///   2. The vault and the minted share token are distinct addresses.
contract MockMidasVault {
    address public immutable tokenIn;
    MockMToken public immutable mToken;

    // Native tokenIn amount the vault actually pulls (configurable; distinct from base-18 amountToken).
    uint256 public nativePull;

    // Records the last call so tests can assert pass-through of the deposit args.
    uint256 public lastAmountToken;
    uint256 public lastMinReceiveAmount;
    bytes32 public lastReferrerId;
    address public lastRecipient;

    constructor(address tokenIn_) {
        tokenIn = tokenIn_;
        mToken = new MockMToken();
    }

    function setNativePull(uint256 nativePull_) external {
        nativePull = nativePull_;
    }

    function depositInstant(
        address tokenIn_,
        uint256 amountToken,
        uint256 minReceiveAmount,
        bytes32 referrerId,
        address recipient
    ) external {
        require(tokenIn_ == tokenIn, "wrong tokenIn");
        // Pulls the native amount (NOT amountToken), as the real vault does after rate conversion.
        ERC20(tokenIn_).transferFrom(msg.sender, address(this), nativePull);
        lastAmountToken = amountToken;
        lastMinReceiveAmount = minReceiveAmount;
        lastReferrerId = referrerId;
        lastRecipient = recipient;
        mToken.mint(recipient, amountToken); // mints in base-18 terms
    }
}

contract TBIForwarderTest is Test {
    TBIForwarder forwarder;
    MockERC20 token;
    MockERC20 token1;
    MockERC4626 vault;
    MockAaveV3Pool aavePool;
    MockComet comet;
    MockStakedToken stakedToken;
    MockCErc20 cToken;
    MockMidasVault midasVault;
    MockV4PositionManager v4PositionManager;
    MockKyberRouter kyberRouter;

    address constant USER = address(0xCAFE);
    address constant RECEIVER = address(0xB0B);
    address constant LIFI_EXECUTOR = address(0xF1F1);
    address constant ATTACKER = address(0xDEAD);
    address constant PERMIT2_ADDR = 0x000000000022D473030F116dDEE9F6B43aC78BA3;
    address constant FEE_RECIPIENT = address(0xFEE);
    address constant MELLOW_NATIVE = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;

    function setUp() public {
        // Deploy mock token and protocols
        token = new MockERC20();
        token1 = new MockERC20();
        vault = new MockERC4626(address(token));
        aavePool = new MockAaveV3Pool(address(token));
        comet = new MockComet(address(token));
        stakedToken = new MockStakedToken(address(token));
        cToken = new MockCErc20(address(token));
        midasVault = new MockMidasVault(address(token));

        // Etch MockPermit2 at the canonical Permit2 address so the forwarder's hardcoded
        // constant resolves to the mock.
        MockPermit2 permit2Impl = new MockPermit2();
        vm.etch(PERMIT2_ADDR, address(permit2Impl).code);
        v4PositionManager = new MockV4PositionManager(PERMIT2_ADDR);

        // Deploy forwarder via UUPS proxy
        TBIForwarder impl = new TBIForwarder();
        address proxy = LibClone.deployERC1967(address(impl));
        forwarder = TBIForwarder(payable(proxy));
        forwarder.initialize(address(this));

        // Zap swap router, whitelisted by the test (which is the owner).
        kyberRouter = new MockKyberRouter();
        forwarder.setSwapRouterAllowed(address(kyberRouter), true);

        // Fund user
        _fundAndApprove(USER, 100 ether);
    }

    function _fundAndApprove(address account, uint256 amount) internal {
        token.mint(account, amount);
        vm.prank(account);
        token.approve(address(forwarder), type(uint256).max);
    }

    // --- ERC4626 ---

    function test_DepositERC4626_Success() public {
        uint256 amount = 10 ether;

        vm.expectEmit(true, true, true, true);
        emit TBIForwarderAdapters.Deposit(USER, address(vault), address(token), amount);

        vm.prank(USER);
        forwarder.depositERC4626(IERC4626(address(vault)), amount, USER);

        // User received vault shares
        assertEq(vault.balanceOf(USER), amount);
        // Forwarder holds nothing
        assertEq(token.balanceOf(address(forwarder)), 0);
        // User's token balance decreased
        assertEq(token.balanceOf(USER), 90 ether);
    }

    function test_DepositERC4626_WithReceiver_Success() public {
        uint256 amount = 10 ether;
        _fundAndApprove(LIFI_EXECUTOR, 100 ether);

        vm.expectEmit(true, true, true, true);
        emit TBIForwarderAdapters.Deposit(RECEIVER, address(vault), address(token), amount);

        vm.prank(LIFI_EXECUTOR);
        forwarder.depositERC4626(IERC4626(address(vault)), amount, RECEIVER);

        // Receiver received vault shares, while caller only paid underlying
        assertEq(vault.balanceOf(RECEIVER), amount);
        assertEq(vault.balanceOf(LIFI_EXECUTOR), 0);
        // Forwarder holds nothing
        assertEq(token.balanceOf(address(forwarder)), 0);
        // Li.Fi caller's token balance decreased
        assertEq(token.balanceOf(LIFI_EXECUTOR), 90 ether);
    }

    function test_DepositERC4626_WithReceiver_RevertZeroReceiver() public {
        _fundAndApprove(LIFI_EXECUTOR, 100 ether);

        vm.prank(LIFI_EXECUTOR);
        vm.expectRevert(TBIForwarderAdapters.ZeroReceiver.selector);
        forwarder.depositERC4626(IERC4626(address(vault)), 1 ether, address(0));

        // Reverts before funds move
        assertEq(token.balanceOf(LIFI_EXECUTOR), 100 ether);
        assertEq(token.balanceOf(address(forwarder)), 0);
    }

    function test_DepositERC4626_RevertInsufficientBalance() public {
        vm.prank(USER);
        vm.expectRevert(); // SafeTransferLib reverts on insufficient balance
        forwarder.depositERC4626(IERC4626(address(vault)), 200 ether, USER);
    }

    function test_DepositERC4626_RevertNoApproval() public {
        address noApprovalUser = address(0xBEEF);
        token.mint(noApprovalUser, 10 ether);
        // User has tokens but hasn't approved forwarder

        vm.prank(noApprovalUser);
        vm.expectRevert(); // SafeTransferLib reverts on insufficient allowance
        forwarder.depositERC4626(IERC4626(address(vault)), 1 ether, noApprovalUser);
    }

    // --- Aave V3 ---

    function test_DepositAaveV3_Success() public {
        uint256 amount = 5 ether;

        vm.expectEmit(true, true, true, true);
        emit TBIForwarderAdapters.Deposit(USER, address(aavePool), address(token), amount);

        vm.prank(USER);
        forwarder.depositAaveV3(IAaveV3Pool(address(aavePool)), address(token), amount, USER);

        // User received aTokens
        assertEq(aavePool.aToken().balanceOf(USER), amount);
        // Forwarder holds nothing
        assertEq(token.balanceOf(address(forwarder)), 0);
        // User's token balance decreased
        assertEq(token.balanceOf(USER), 95 ether);
    }

    function test_DepositAaveV3_WithReceiver_Success() public {
        uint256 amount = 5 ether;
        _fundAndApprove(LIFI_EXECUTOR, 100 ether);

        vm.expectEmit(true, true, true, true);
        emit TBIForwarderAdapters.Deposit(RECEIVER, address(aavePool), address(token), amount);

        vm.prank(LIFI_EXECUTOR);
        forwarder.depositAaveV3(IAaveV3Pool(address(aavePool)), address(token), amount, RECEIVER);

        // Receiver received aTokens, while caller only paid underlying
        assertEq(aavePool.aToken().balanceOf(RECEIVER), amount);
        assertEq(aavePool.aToken().balanceOf(LIFI_EXECUTOR), 0);
        // Forwarder holds nothing
        assertEq(token.balanceOf(address(forwarder)), 0);
        // Li.Fi caller's token balance decreased
        assertEq(token.balanceOf(LIFI_EXECUTOR), 95 ether);
    }

    // --- Compound V3 ---

    function test_DepositCompoundV3_Success() public {
        uint256 amount = 8 ether;

        vm.expectEmit(true, true, true, true);
        emit TBIForwarderAdapters.Deposit(USER, address(comet), address(token), amount);

        vm.prank(USER);
        forwarder.depositCompoundV3(IComet(address(comet)), address(token), amount, USER);

        // User received receipt tokens
        assertEq(comet.receipt().balanceOf(USER), amount);
        // Forwarder holds nothing
        assertEq(token.balanceOf(address(forwarder)), 0);
        // User's token balance decreased
        assertEq(token.balanceOf(USER), 92 ether);
    }

    function test_DepositCompoundV3_WithReceiver_Success() public {
        uint256 amount = 8 ether;
        _fundAndApprove(LIFI_EXECUTOR, 100 ether);

        vm.expectEmit(true, true, true, true);
        emit TBIForwarderAdapters.Deposit(RECEIVER, address(comet), address(token), amount);

        vm.prank(LIFI_EXECUTOR);
        forwarder.depositCompoundV3(IComet(address(comet)), address(token), amount, RECEIVER);

        // Receiver received receipt tokens, while caller only paid underlying
        assertEq(comet.receipt().balanceOf(RECEIVER), amount);
        assertEq(comet.receipt().balanceOf(LIFI_EXECUTOR), 0);
        // Forwarder holds nothing
        assertEq(token.balanceOf(address(forwarder)), 0);
        // Li.Fi caller's token balance decreased
        assertEq(token.balanceOf(LIFI_EXECUTOR), 92 ether);
    }

    // --- Aave Staked Token ---

    function test_StakeAaveToken_Success() public {
        uint256 amount = 3 ether;

        vm.expectEmit(true, true, true, true);
        emit TBIForwarderAdapters.Deposit(USER, address(stakedToken), address(token), amount);

        vm.prank(USER);
        forwarder.stakeAaveToken(IStakedToken(address(stakedToken)), address(token), amount, USER);

        // User received staked tokens
        assertEq(stakedToken.balanceOf(USER), amount);
        // Forwarder holds nothing
        assertEq(token.balanceOf(address(forwarder)), 0);
        // User's token balance decreased
        assertEq(token.balanceOf(USER), 97 ether);
    }

    function test_StakeAaveToken_WithReceiver_Success() public {
        uint256 amount = 3 ether;
        _fundAndApprove(LIFI_EXECUTOR, 100 ether);

        vm.expectEmit(true, true, true, true);
        emit TBIForwarderAdapters.Deposit(RECEIVER, address(stakedToken), address(token), amount);

        vm.prank(LIFI_EXECUTOR);
        forwarder.stakeAaveToken(IStakedToken(address(stakedToken)), address(token), amount, RECEIVER);

        // Receiver received staked tokens, while caller only paid underlying
        assertEq(stakedToken.balanceOf(RECEIVER), amount);
        assertEq(stakedToken.balanceOf(LIFI_EXECUTOR), 0);
        // Forwarder holds nothing
        assertEq(token.balanceOf(address(forwarder)), 0);
        // Li.Fi caller's token balance decreased
        assertEq(token.balanceOf(LIFI_EXECUTOR), 97 ether);
    }

    // --- Compound V2 ---

    function test_DepositCompoundV2_Success() public {
        uint256 amount = 6 ether;

        vm.expectEmit(true, true, true, true);
        emit TBIForwarderAdapters.Deposit(USER, address(cToken), address(token), amount);

        vm.prank(USER);
        forwarder.depositCompoundV2(ICErc20(address(cToken)), amount, USER);

        // User received cTokens (1:1 in mock)
        assertEq(cToken.balanceOf(USER), amount);
        // Forwarder holds no cTokens or underlying
        assertEq(cToken.balanceOf(address(forwarder)), 0);
        assertEq(token.balanceOf(address(forwarder)), 0);
        // User's token balance decreased
        assertEq(token.balanceOf(USER), 94 ether);
    }

    function test_DepositCompoundV2_WithReceiver_Success() public {
        uint256 amount = 6 ether;
        _fundAndApprove(LIFI_EXECUTOR, 100 ether);

        vm.expectEmit(true, true, true, true);
        emit TBIForwarderAdapters.Deposit(RECEIVER, address(cToken), address(token), amount);

        vm.prank(LIFI_EXECUTOR);
        forwarder.depositCompoundV2(ICErc20(address(cToken)), amount, RECEIVER);

        // Receiver received cTokens, while caller only paid underlying
        assertEq(cToken.balanceOf(RECEIVER), amount);
        assertEq(cToken.balanceOf(LIFI_EXECUTOR), 0);
        // Forwarder holds no cTokens or underlying
        assertEq(cToken.balanceOf(address(forwarder)), 0);
        assertEq(token.balanceOf(address(forwarder)), 0);
        // Li.Fi caller's token balance decreased
        assertEq(token.balanceOf(LIFI_EXECUTOR), 94 ether);
    }

    function test_DepositCompoundV2_RevertMintFailed() public {
        MockCErc20Failing failingCToken = new MockCErc20Failing(address(token));

        vm.prank(USER);
        vm.expectRevert(abi.encodeWithSelector(TBIForwarderAdapters.MintFailed.selector, 1));
        forwarder.depositCompoundV2(ICErc20(address(failingCToken)), 1 ether, USER);
    }

    // --- Midas ---

    function test_DepositMidas_Success() public {
        uint256 amount = 10 ether; // native upper bound pulled from the caller
        uint256 amountToken = 1 ether; // base-18 figure forwarded to the vault
        uint256 vaultPull = 6 ether; // native the vault actually consumes (< amount)
        uint256 minReceive = 5 ether;
        bytes32 referrerId = keccak256("boost");

        midasVault.setNativePull(vaultPull);
        MockMToken mToken = midasVault.mToken();

        // Emitted amount is the NET tokenIn consumed (gross pull minus refund); target == mToken; user == receiver
        vm.expectEmit(true, true, true, true);
        emit TBIForwarderAdapters.Deposit(RECEIVER, address(mToken), address(token), vaultPull);

        vm.prank(USER);
        forwarder.depositMidas(
            address(midasVault), address(token), address(mToken), amount, amountToken, minReceive, referrerId, RECEIVER
        );

        // mToken minted straight to the receiver in base-18 terms
        assertEq(mToken.balanceOf(RECEIVER), amountToken);
        // tokenIn pulled from the caller; the 4-ether overage was refunded to the receiver
        assertEq(token.balanceOf(USER), 90 ether);
        assertEq(token.balanceOf(RECEIVER), amount - vaultPull);
        // Forwarder holds no leftover tokenIn or mToken
        assertEq(token.balanceOf(address(forwarder)), 0);
        assertEq(mToken.balanceOf(address(forwarder)), 0);
        // Approval reset to 0
        assertEq(token.allowance(address(forwarder), address(midasVault)), 0);
        // base-18 amount, slippage floor and referrer id passed straight through
        assertEq(midasVault.lastAmountToken(), amountToken);
        assertEq(midasVault.lastMinReceiveAmount(), minReceive);
        assertEq(midasVault.lastReferrerId(), referrerId);
        assertEq(midasVault.lastRecipient(), RECEIVER);
    }

    function test_DepositMidas_RevertZeroReceiver() public {
        midasVault.setNativePull(1 ether);
        MockMToken mToken = midasVault.mToken();
        vm.prank(USER);
        vm.expectRevert(TBIForwarderAdapters.ZeroReceiver.selector);
        forwarder.depositMidas(
            address(midasVault), address(token), address(mToken), 1 ether, 1 ether, 0, bytes32(0), address(0)
        );
    }

    function test_DepositMidas_RevertInsufficientBalance() public {
        midasVault.setNativePull(1 ether);
        MockMToken mToken = midasVault.mToken();
        vm.prank(USER);
        vm.expectRevert(); // SafeTransferLib reverts on insufficient balance
        forwarder.depositMidas(
            address(midasVault), address(token), address(mToken), 200 ether, 1 ether, 0, bytes32(0), RECEIVER
        );
    }

    function test_DepositMidas_RevertNoApproval() public {
        address noApprovalUser = address(0xBEEF);
        token.mint(noApprovalUser, 10 ether);
        midasVault.setNativePull(1 ether);
        MockMToken mToken = midasVault.mToken();

        vm.prank(noApprovalUser);
        vm.expectRevert(); // SafeTransferLib reverts on insufficient allowance
        forwarder.depositMidas(
            address(midasVault), address(token), address(mToken), 1 ether, 1 ether, 0, bytes32(0), RECEIVER
        );
    }

    // --- Lido Earn (Mellow v2 SyncDepositQueue) ---

    function test_DepositLidoEarn_ERC20_Success() public {
        uint256 amount = 8 ether;
        MockSyncDepositQueue queue = new MockSyncDepositQueue(address(token), 10_000, 0, FEE_RECIPIENT);
        MockMellowShareToken share = queue.share();

        vm.expectEmit(true, true, true, true);
        emit TBIForwarderAdapters.Deposit(USER, address(share), address(token), amount);

        vm.prank(USER);
        forwarder.depositLidoEarn(ISyncDepositQueue(address(queue)), amount, USER);

        // User received share tokens (1:1 in mock); forwarder retains nothing.
        assertEq(share.balanceOf(USER), amount);
        assertEq(share.balanceOf(address(forwarder)), 0);
        assertEq(token.balanceOf(address(forwarder)), 0);
        assertEq(token.balanceOf(USER), 92 ether);
    }

    function test_DepositLidoEarn_WithReceiver_Success() public {
        uint256 amount = 8 ether;
        _fundAndApprove(LIFI_EXECUTOR, 100 ether);
        MockSyncDepositQueue queue = new MockSyncDepositQueue(address(token), 10_000, 0, FEE_RECIPIENT);
        MockMellowShareToken share = queue.share();

        vm.expectEmit(true, true, true, true);
        emit TBIForwarderAdapters.Deposit(RECEIVER, address(share), address(token), amount);

        vm.prank(LIFI_EXECUTOR);
        forwarder.depositLidoEarn(ISyncDepositQueue(address(queue)), amount, RECEIVER);

        // Receiver received the shares; the caller only paid the underlying.
        assertEq(share.balanceOf(RECEIVER), amount);
        assertEq(share.balanceOf(LIFI_EXECUTOR), 0);
        assertEq(share.balanceOf(address(forwarder)), 0);
        assertEq(token.balanceOf(address(forwarder)), 0);
        assertEq(token.balanceOf(LIFI_EXECUTOR), 92 ether);
    }

    function test_DepositLidoEarn_ForwardsNetSharesAfterFee() public {
        // Share rate 1.5x with a 10% deposit fee: the queue mints fee shares to the fee recipient and
        // the remainder to the forwarder. The forwarder must forward exactly what it received —
        // proving it measures the share balance delta, not `amount`.
        uint256 amount = 10 ether;
        MockSyncDepositQueue queue = new MockSyncDepositQueue(address(token), 15_000, 1_000, FEE_RECIPIENT);
        MockMellowShareToken share = queue.share();

        uint256 totalShares = amount * 15_000 / 10_000; // 15 ether
        uint256 feeShares = totalShares * 1_000 / 10_000; // 1.5 ether
        uint256 netShares = totalShares - feeShares; // 13.5 ether

        vm.prank(USER);
        forwarder.depositLidoEarn(ISyncDepositQueue(address(queue)), amount, RECEIVER);

        assertEq(share.balanceOf(RECEIVER), netShares);
        assertEq(share.balanceOf(FEE_RECIPIENT), feeShares);
        assertEq(share.balanceOf(address(forwarder)), 0);
    }

    function test_DepositLidoEarn_Native_Success() public {
        uint256 amount = 5 ether;
        MockSyncDepositQueue queue = new MockSyncDepositQueue(MELLOW_NATIVE, 10_000, 0, FEE_RECIPIENT);
        MockMellowShareToken share = queue.share();
        vm.deal(address(this), amount);

        vm.expectEmit(true, true, true, true);
        emit TBIForwarderAdapters.Deposit(RECEIVER, address(share), MELLOW_NATIVE, amount);

        forwarder.depositLidoEarn{value: amount}(ISyncDepositQueue(address(queue)), amount, RECEIVER);

        // Shares credited to the receiver; ETH forwarded through to the queue, none stuck.
        assertEq(share.balanceOf(RECEIVER), amount);
        assertEq(share.balanceOf(address(forwarder)), 0);
        assertEq(address(forwarder).balance, 0);
        assertEq(address(queue).balance, amount);
    }

    function test_DepositLidoEarn_Native_RevertValueMismatch() public {
        uint256 amount = 5 ether;
        MockSyncDepositQueue queue = new MockSyncDepositQueue(MELLOW_NATIVE, 10_000, 0, FEE_RECIPIENT);
        vm.deal(address(this), amount);

        vm.expectRevert(TBIForwarderAdapters.IncorrectNativeValue.selector);
        forwarder.depositLidoEarn{value: amount - 1}(ISyncDepositQueue(address(queue)), amount, RECEIVER);
    }

    function test_DepositLidoEarn_ERC20_RevertWithValue() public {
        uint256 amount = 5 ether;
        MockSyncDepositQueue queue = new MockSyncDepositQueue(address(token), 10_000, 0, FEE_RECIPIENT);
        vm.deal(address(this), 1);

        // Stray ETH on an ERC-20 deposit is rejected.
        vm.expectRevert(TBIForwarderAdapters.IncorrectNativeValue.selector);
        forwarder.depositLidoEarn{value: 1}(ISyncDepositQueue(address(queue)), amount, USER);
    }

    function test_DepositLidoEarn_RevertZeroReceiver() public {
        MockSyncDepositQueue queue = new MockSyncDepositQueue(address(token), 10_000, 0, FEE_RECIPIENT);

        vm.prank(USER);
        vm.expectRevert(TBIForwarderAdapters.ZeroReceiver.selector);
        forwarder.depositLidoEarn(ISyncDepositQueue(address(queue)), 1 ether, address(0));
    }

    // --- Upgrade ---

    function test_Upgrade_Success() public {
        TBIForwarder newImpl = new TBIForwarder();
        forwarder.upgradeToAndCall(address(newImpl), "");

        // Forwarder still works after upgrade — deposit succeeds
        vm.prank(USER);
        forwarder.depositERC4626(IERC4626(address(vault)), 1 ether, USER);
    }

    function test_Upgrade_RevertNotOwner() public {
        TBIForwarder newImpl = new TBIForwarder();

        vm.prank(ATTACKER);
        vm.expectRevert(abi.encodeWithSignature("Unauthorized()"));
        forwarder.upgradeToAndCall(address(newImpl), "");
    }

    // --- Initialization ---

    function test_Initialize_CannotReinitialize() public {
        vm.expectRevert(); // Initializable reverts on re-init
        forwarder.initialize(address(this));
    }

    // --- Uniswap V4 LP ---

    function _fundToken1AndApprove(address account, uint256 amount) internal {
        token1.mint(account, amount);
        vm.prank(account);
        token1.approve(address(forwarder), type(uint256).max);
    }

    function _v4PoolKey() internal view returns (PoolKey memory) {
        return PoolKey({
            currency0: Currency.wrap(address(token)),
            currency1: Currency.wrap(address(token1)),
            fee: 3000,
            tickSpacing: 60,
            hooks: address(0xBEEF) // Stand-in for a Kyber FairFlow-style hook
        });
    }

    /// @dev Canonical V4 PoolId for `_v4PoolKey()` — must match what the adapter emits.
    function _v4PoolId() internal view returns (bytes32) {
        return keccak256(abi.encode(_v4PoolKey()));
    }

    function _v4Params(uint128 amount0Max, uint128 amount1Max, address receiver)
        internal
        view
        returns (V4MintParams memory)
    {
        return V4MintParams({
            poolKey: _v4PoolKey(),
            tickLower: -600,
            tickUpper: 600,
            liquidity: 1_000_000,
            amount0Max: amount0Max,
            amount1Max: amount1Max,
            hookData: "",
            receiver: receiver,
            deadline: block.timestamp + 1 hours
        });
    }

    function test_DepositUniswapV4LP_Success() public {
        _fundToken1AndApprove(USER, 100 ether);
        uint128 amount0Max = 10 ether;
        uint128 amount1Max = 20 ether;

        // No spend cap → the PM pulls the full max, so consumed == max.
        vm.expectEmit(true, true, true, true);
        emit TBIForwarderAdapters.UniswapV4LPDeposit(
            USER, address(v4PositionManager), _v4PoolId(), 1_000_000, amount0Max, amount1Max
        );

        vm.prank(USER);
        forwarder.depositUniswapV4LP(
            IUniswapV4PositionManager(address(v4PositionManager)), _v4Params(amount0Max, amount1Max, USER)
        );

        // PositionManager pulled the full amounts (no spend cap configured).
        assertEq(token.balanceOf(address(v4PositionManager)), amount0Max);
        assertEq(token1.balanceOf(address(v4PositionManager)), amount1Max);
        // Forwarder holds nothing.
        assertEq(token.balanceOf(address(forwarder)), 0);
        assertEq(token1.balanceOf(address(forwarder)), 0);
        // User's balances decreased by the full max.
        assertEq(token.balanceOf(USER), 100 ether - amount0Max);
        assertEq(token1.balanceOf(USER), 100 ether - amount1Max);
        // PositionManager recorded the owner as the receiver.
        assertEq(v4PositionManager.lastOwner(), USER);
        assertEq(v4PositionManager.lastLiquidity(), 1_000_000);
    }

    function test_DepositUniswapV4LP_WithReceiver_Success() public {
        _fundAndApprove(LIFI_EXECUTOR, 100 ether);
        _fundToken1AndApprove(LIFI_EXECUTOR, 100 ether);

        V4MintParams memory params = _v4Params(5 ether, 7 ether, RECEIVER);
        params.hookData = hex"deadbeef";

        vm.expectEmit(true, true, true, true);
        emit TBIForwarderAdapters.UniswapV4LPDeposit(
            RECEIVER, address(v4PositionManager), _v4PoolId(), 1_000_000, 5 ether, 7 ether
        );

        vm.prank(LIFI_EXECUTOR);
        forwarder.depositUniswapV4LP(IUniswapV4PositionManager(address(v4PositionManager)), params);

        assertEq(v4PositionManager.lastOwner(), RECEIVER);
        assertEq(v4PositionManager.lastHookData(), hex"deadbeef");
        // LiFi caller paid, RECEIVER did not.
        assertEq(token.balanceOf(LIFI_EXECUTOR), 95 ether);
        assertEq(token.balanceOf(RECEIVER), 0);
        assertEq(token1.balanceOf(LIFI_EXECUTOR), 93 ether);
        assertEq(token1.balanceOf(RECEIVER), 0);
    }

    function test_DepositUniswapV4LP_RefundsUnspentDust() public {
        _fundToken1AndApprove(USER, 100 ether);
        uint128 amount0Max = 10 ether;
        uint128 amount1Max = 20 ether;

        // V4 only spends 6 ether of token0 and 12 ether of token1 — the rest must go back to RECEIVER.
        v4PositionManager.setSpend(6 ether, 12 ether);

        // The event reports the amounts actually consumed (6/12), not the committed max (10/20).
        vm.expectEmit(true, true, true, true);
        emit TBIForwarderAdapters.UniswapV4LPDeposit(
            RECEIVER, address(v4PositionManager), _v4PoolId(), 1_000_000, 6 ether, 12 ether
        );

        vm.prank(USER);
        forwarder.depositUniswapV4LP(
            IUniswapV4PositionManager(address(v4PositionManager)), _v4Params(amount0Max, amount1Max, RECEIVER)
        );

        // RECEIVER got the unspent dust.
        assertEq(token.balanceOf(RECEIVER), 4 ether);
        assertEq(token1.balanceOf(RECEIVER), 8 ether);
        // Forwarder holds nothing.
        assertEq(token.balanceOf(address(forwarder)), 0);
        assertEq(token1.balanceOf(address(forwarder)), 0);
        // V4 PM holds the spent amounts.
        assertEq(token.balanceOf(address(v4PositionManager)), 6 ether);
        assertEq(token1.balanceOf(address(v4PositionManager)), 12 ether);
        // USER paid the full max upfront.
        assertEq(token.balanceOf(USER), 100 ether - amount0Max);
        assertEq(token1.balanceOf(USER), 100 ether - amount1Max);
    }

    function test_DepositUniswapV4LP_Permit2AllowanceReused() public {
        _fundToken1AndApprove(USER, 100 ether);

        vm.prank(USER);
        forwarder.depositUniswapV4LP(
            IUniswapV4PositionManager(address(v4PositionManager)), _v4Params(1 ether, 2 ether, USER)
        );

        // After the first call, Permit2's allowance from forwarder→PM is max for each token.
        (uint160 amt0,,) =
            MockPermit2(PERMIT2_ADDR).allowance(address(forwarder), address(token), address(v4PositionManager));
        (uint160 amt1,,) =
            MockPermit2(PERMIT2_ADDR).allowance(address(forwarder), address(token1), address(v4PositionManager));
        assertEq(amt0, type(uint160).max);
        assertEq(amt1, type(uint160).max);

        // A second deposit with the same path doesn't reset or reduce the allowance
        // (mock's max-amount branch leaves allowance untouched on transferFrom).
        vm.prank(USER);
        forwarder.depositUniswapV4LP(
            IUniswapV4PositionManager(address(v4PositionManager)), _v4Params(1 ether, 2 ether, USER)
        );

        (uint160 amt0After,,) =
            MockPermit2(PERMIT2_ADDR).allowance(address(forwarder), address(token), address(v4PositionManager));
        assertEq(amt0After, type(uint160).max);
    }

    function test_DepositUniswapV4LP_RevertZeroReceiver() public {
        _fundToken1AndApprove(USER, 100 ether);

        vm.prank(USER);
        vm.expectRevert(TBIForwarderAdapters.ZeroReceiver.selector);
        forwarder.depositUniswapV4LP(
            IUniswapV4PositionManager(address(v4PositionManager)), _v4Params(1 ether, 2 ether, address(0))
        );

        // Reverts before any funds move.
        assertEq(token.balanceOf(USER), 100 ether);
        assertEq(token1.balanceOf(USER), 100 ether);
    }

    function test_DepositUniswapV4LP_RevertNativeCurrency1() public {
        _fundToken1AndApprove(USER, 100 ether);
        // Native is only valid as currency0; currency1 == address(0) is rejected.
        V4MintParams memory params = _v4Params(1 ether, 2 ether, USER);
        params.poolKey.currency1 = Currency.wrap(address(0));

        vm.prank(USER);
        vm.expectRevert(TBIForwarderAdapters.NativeCurrencyUnsupported.selector);
        forwarder.depositUniswapV4LP(IUniswapV4PositionManager(address(v4PositionManager)), params);
    }

    function _v4NativePoolKey() internal view returns (PoolKey memory) {
        PoolKey memory pk = _v4PoolKey();
        pk.currency0 = Currency.wrap(address(0)); // native ETH
        return pk;
    }

    function test_DepositUniswapV4LP_NativeCurrency0_Success() public {
        _fundToken1AndApprove(USER, 100 ether);
        vm.deal(USER, 100 ether);
        uint128 amount0Max = 10 ether; // native ETH (currency0)
        uint128 amount1Max = 20 ether; // token1 (currency1)

        PoolKey memory pk = _v4NativePoolKey();
        V4MintParams memory params = _v4Params(amount0Max, amount1Max, USER);
        params.poolKey = pk;

        // No spend cap → consumes the full max; native consumed is reported as amount0Max.
        vm.expectEmit(true, true, true, true);
        emit TBIForwarderAdapters.UniswapV4LPDeposit(
            USER, address(v4PositionManager), keccak256(abi.encode(pk)), 1_000_000, amount0Max, amount1Max
        );

        vm.prank(USER);
        forwarder.depositUniswapV4LP{value: amount0Max}(IUniswapV4PositionManager(address(v4PositionManager)), params);

        // PM holds the settled native + token1; forwarder holds nothing.
        assertEq(address(v4PositionManager).balance, amount0Max);
        assertEq(token1.balanceOf(address(v4PositionManager)), amount1Max);
        assertEq(address(forwarder).balance, 0);
        assertEq(token1.balanceOf(address(forwarder)), 0);
        // USER paid amount0Max in ETH and amount1Max in token1.
        assertEq(USER.balance, 100 ether - amount0Max);
        assertEq(token1.balanceOf(USER), 100 ether - amount1Max);
    }

    function test_DepositUniswapV4LP_NativeCurrency0_RefundsUnspent() public {
        _fundToken1AndApprove(USER, 100 ether);
        vm.deal(USER, 100 ether);
        uint128 amount0Max = 10 ether;
        uint128 amount1Max = 20 ether;
        // V4 spends only 6 ETH / 12 token1 — the rest goes back to RECEIVER (ETH via SWEEP).
        v4PositionManager.setSpend(6 ether, 12 ether);

        PoolKey memory pk = _v4NativePoolKey();
        V4MintParams memory params = _v4Params(amount0Max, amount1Max, RECEIVER);
        params.poolKey = pk;

        vm.prank(USER);
        forwarder.depositUniswapV4LP{value: amount0Max}(IUniswapV4PositionManager(address(v4PositionManager)), params);

        // RECEIVER got the unspent native (4 ETH) via SWEEP and unspent token1 (8) via the forwarder.
        assertEq(RECEIVER.balance, 4 ether);
        assertEq(token1.balanceOf(RECEIVER), 8 ether);
        // PM kept the spent amounts; forwarder holds nothing.
        assertEq(address(v4PositionManager).balance, 6 ether);
        assertEq(token1.balanceOf(address(v4PositionManager)), 12 ether);
        assertEq(address(forwarder).balance, 0);
        assertEq(token1.balanceOf(address(forwarder)), 0);
    }

    function test_DepositUniswapV4LP_RevertNativeWrongValue() public {
        _fundToken1AndApprove(USER, 100 ether);
        vm.deal(USER, 100 ether);
        PoolKey memory pk = _v4NativePoolKey();
        V4MintParams memory params = _v4Params(10 ether, 2 ether, USER);
        params.poolKey = pk;

        vm.prank(USER);
        vm.expectRevert(TBIForwarderAdapters.IncorrectNativeValue.selector);
        forwarder.depositUniswapV4LP{value: 9 ether}( // != amount0Max (10 ether)
            IUniswapV4PositionManager(address(v4PositionManager)), params
        );
    }

    function test_DepositUniswapV4LP_RevertUnexpectedValueOnErc20Pool() public {
        _fundToken1AndApprove(USER, 100 ether);
        vm.deal(USER, 1 ether);

        vm.prank(USER);
        vm.expectRevert(TBIForwarderAdapters.IncorrectNativeValue.selector);
        forwarder.depositUniswapV4LP{value: 1}(
            IUniswapV4PositionManager(address(v4PositionManager)), _v4Params(1 ether, 2 ether, USER)
        );
    }

    function test_DepositUniswapV4LP_RevertDeadlinePassed() public {
        _fundToken1AndApprove(USER, 100 ether);

        vm.warp(1_000_000);
        V4MintParams memory params = _v4Params(1 ether, 2 ether, USER);
        params.deadline = 1; // deadline in the past

        vm.prank(USER);
        vm.expectRevert(); // MockV4PositionManager reverts on deadline
        forwarder.depositUniswapV4LP(IUniswapV4PositionManager(address(v4PositionManager)), params);
    }

    // --- Uniswap V4 LP zap (swap + deposit in one tx) ---

    function _swapCalldata(address tokenIn, uint256 amountIn, address tokenOut, uint256 amountOut, address recipient)
        internal
        pure
        returns (bytes memory)
    {
        return abi.encodeCall(MockKyberRouter.swap, (tokenIn, amountIn, tokenOut, amountOut, recipient));
    }

    function test_ZapErc20Input_Success() public {
        // Deposit token0; swap part of it into token1, then mint. Router returns 8 token1 for 4 token0.
        uint128 amount0Max = 10 ether; // token0 kept for the LP
        uint128 amount1Max = 8 ether; // token1 produced by the swap
        uint256 swapAmountIn = 4 ether;
        token1.mint(address(kyberRouter), 8 ether);

        V4ZapParams memory z = V4ZapParams({
            swapRouter: address(kyberRouter),
            swapInputToken: address(token),
            swapAmountIn: swapAmountIn,
            swapCalldata: _swapCalldata(address(token), swapAmountIn, address(token1), 8 ether, address(forwarder)),
            mint: _v4Params(amount0Max, amount1Max, USER)
        });

        vm.expectEmit(true, true, true, true);
        emit TBIForwarderAdapters.UniswapV4LPDeposit(
            USER, address(v4PositionManager), _v4PoolId(), 1_000_000, amount0Max, amount1Max
        );

        vm.prank(USER);
        forwarder.depositUniswapV4LPWithSwap(IUniswapV4PositionManager(address(v4PositionManager)), z);

        // PM holds the minted amounts; forwarder is left empty.
        assertEq(token.balanceOf(address(v4PositionManager)), amount0Max);
        assertEq(token1.balanceOf(address(v4PositionManager)), amount1Max);
        assertEq(token.balanceOf(address(forwarder)), 0);
        assertEq(token1.balanceOf(address(forwarder)), 0);
        // USER paid amount0Max + swapAmountIn of token0, nothing in token1.
        assertEq(token.balanceOf(USER), 100 ether - amount0Max - swapAmountIn);
        // Router consumed the swap input and gave up its token1.
        assertEq(token.balanceOf(address(kyberRouter)), swapAmountIn);
        assertEq(token1.balanceOf(address(kyberRouter)), 0);
        // Approval to the router was reset to zero.
        assertEq(token.allowance(address(forwarder), address(kyberRouter)), 0);
    }

    function test_ZapErc20Input_RefundsDustAndSwapSurplus() public {
        // Positive swap slippage (9 > 8 floor) plus a partial mint exercises both refund sources.
        uint128 amount0Max = 10 ether;
        uint128 amount1Max = 8 ether;
        uint256 swapAmountIn = 4 ether;
        token1.mint(address(kyberRouter), 9 ether); // returns 9, one above the floor

        v4PositionManager.setSpend(7 ether, 8 ether); // mint pulls 7 token0, 8 token1

        V4ZapParams memory z = V4ZapParams({
            swapRouter: address(kyberRouter),
            swapInputToken: address(token),
            swapAmountIn: swapAmountIn,
            swapCalldata: _swapCalldata(address(token), swapAmountIn, address(token1), 9 ether, address(forwarder)),
            mint: _v4Params(amount0Max, amount1Max, RECEIVER)
        });

        vm.expectEmit(true, true, true, true);
        emit TBIForwarderAdapters.UniswapV4LPDeposit(
            RECEIVER, address(v4PositionManager), _v4PoolId(), 1_000_000, 7 ether, 8 ether
        );

        vm.prank(USER);
        forwarder.depositUniswapV4LPWithSwap(IUniswapV4PositionManager(address(v4PositionManager)), z);

        // RECEIVER gets the unspent token0 (10-7) and the swap surplus + unspent token1 (9-8).
        assertEq(token.balanceOf(RECEIVER), 3 ether);
        assertEq(token1.balanceOf(RECEIVER), 1 ether);
        assertEq(token.balanceOf(address(forwarder)), 0);
        assertEq(token1.balanceOf(address(forwarder)), 0);
        assertEq(token.balanceOf(address(v4PositionManager)), 7 ether);
        assertEq(token1.balanceOf(address(v4PositionManager)), 8 ether);
    }

    function test_ZapNativeInput_Success() public {
        // Deposit native ETH; swap part of it into token1, then mint.
        vm.deal(USER, 100 ether);
        uint128 amount0Max = 10 ether; // native kept for the LP
        uint128 amount1Max = 8 ether; // token1 produced by the swap
        uint256 swapAmountIn = 4 ether;
        token1.mint(address(kyberRouter), 8 ether);

        PoolKey memory pk = _v4NativePoolKey();
        V4MintParams memory mint = _v4Params(amount0Max, amount1Max, USER);
        mint.poolKey = pk;

        V4ZapParams memory z = V4ZapParams({
            swapRouter: address(kyberRouter),
            swapInputToken: address(0), // native input
            swapAmountIn: swapAmountIn,
            swapCalldata: _swapCalldata(address(0), swapAmountIn, address(token1), 8 ether, address(forwarder)),
            mint: mint
        });

        vm.expectEmit(true, true, true, true);
        emit TBIForwarderAdapters.UniswapV4LPDeposit(
            USER, address(v4PositionManager), keccak256(abi.encode(pk)), 1_000_000, amount0Max, amount1Max
        );

        vm.prank(USER);
        forwarder.depositUniswapV4LPWithSwap{value: amount0Max + swapAmountIn}(
            IUniswapV4PositionManager(address(v4PositionManager)), z
        );

        assertEq(address(v4PositionManager).balance, amount0Max);
        assertEq(token1.balanceOf(address(v4PositionManager)), amount1Max);
        assertEq(address(forwarder).balance, 0);
        assertEq(token1.balanceOf(address(forwarder)), 0);
        // USER paid amount0Max + swapAmountIn in ETH, no token1.
        assertEq(USER.balance, 100 ether - amount0Max - swapAmountIn);
        assertEq(address(kyberRouter).balance, swapAmountIn);
    }

    function test_ZapNativeOutput_RefundsNativeSurplus() public {
        // Deposit token1; swap part into native ETH (the swap returns 11, one above amount0Max).
        _fundToken1AndApprove(USER, 100 ether);
        uint128 amount0Max = 10 ether; // native produced by the swap
        uint128 amount1Max = 8 ether; // token1 kept for the LP
        uint256 swapAmountIn = 6 ether;
        vm.deal(address(kyberRouter), 11 ether);

        PoolKey memory pk = _v4NativePoolKey();
        V4MintParams memory mint = _v4Params(amount0Max, amount1Max, RECEIVER);
        mint.poolKey = pk;

        V4ZapParams memory z = V4ZapParams({
            swapRouter: address(kyberRouter),
            swapInputToken: address(token1), // ERC20 input
            swapAmountIn: swapAmountIn,
            swapCalldata: _swapCalldata(address(token1), swapAmountIn, address(0), 11 ether, address(forwarder)),
            mint: mint
        });

        vm.expectEmit(true, true, true, true);
        emit TBIForwarderAdapters.UniswapV4LPDeposit(
            RECEIVER, address(v4PositionManager), keccak256(abi.encode(pk)), 1_000_000, amount0Max, amount1Max
        );

        vm.prank(USER);
        forwarder.depositUniswapV4LPWithSwap(IUniswapV4PositionManager(address(v4PositionManager)), z);

        assertEq(address(v4PositionManager).balance, amount0Max);
        assertEq(token1.balanceOf(address(v4PositionManager)), amount1Max);
        // RECEIVER gets the 1 ETH positive-slippage surplus the forwarder kept after the mint.
        assertEq(RECEIVER.balance, 1 ether);
        assertEq(address(forwarder).balance, 0);
        assertEq(token1.balanceOf(address(forwarder)), 0);
        // USER paid amount1Max + swapAmountIn of token1.
        assertEq(token1.balanceOf(USER), 100 ether - amount1Max - swapAmountIn);
    }

    function test_Zap_RevertRouterNotWhitelisted() public {
        MockKyberRouter rogue = new MockKyberRouter();
        V4ZapParams memory z = V4ZapParams({
            swapRouter: address(rogue),
            swapInputToken: address(token),
            swapAmountIn: 4 ether,
            swapCalldata: _swapCalldata(address(token), 4 ether, address(token1), 8 ether, address(forwarder)),
            mint: _v4Params(10 ether, 8 ether, USER)
        });

        vm.prank(USER);
        vm.expectRevert(abi.encodeWithSelector(TBIForwarderAdapters.SwapRouterNotWhitelisted.selector, address(rogue)));
        forwarder.depositUniswapV4LPWithSwap(IUniswapV4PositionManager(address(v4PositionManager)), z);
    }

    function test_Zap_RevertEmptySwap() public {
        V4ZapParams memory z = V4ZapParams({
            swapRouter: address(kyberRouter),
            swapInputToken: address(token),
            swapAmountIn: 0,
            swapCalldata: _swapCalldata(address(token), 0, address(token1), 0, address(forwarder)),
            mint: _v4Params(10 ether, 8 ether, USER)
        });

        vm.prank(USER);
        vm.expectRevert(TBIForwarderAdapters.EmptySwap.selector);
        forwarder.depositUniswapV4LPWithSwap(IUniswapV4PositionManager(address(v4PositionManager)), z);
    }

    function test_Zap_RevertSwapInputMismatch() public {
        MockERC20 stranger = new MockERC20();
        V4ZapParams memory z = V4ZapParams({
            swapRouter: address(kyberRouter),
            swapInputToken: address(stranger), // neither pool currency
            swapAmountIn: 4 ether,
            swapCalldata: _swapCalldata(address(stranger), 4 ether, address(token1), 8 ether, address(forwarder)),
            mint: _v4Params(10 ether, 8 ether, USER)
        });

        vm.prank(USER);
        vm.expectRevert(TBIForwarderAdapters.SwapInputMismatch.selector);
        forwarder.depositUniswapV4LPWithSwap(IUniswapV4PositionManager(address(v4PositionManager)), z);
    }

    function test_Zap_RevertWrongNativeValue() public {
        vm.deal(USER, 100 ether);
        PoolKey memory pk = _v4NativePoolKey();
        V4MintParams memory mint = _v4Params(10 ether, 8 ether, USER);
        mint.poolKey = pk;
        V4ZapParams memory z = V4ZapParams({
            swapRouter: address(kyberRouter),
            swapInputToken: address(0),
            swapAmountIn: 4 ether,
            swapCalldata: _swapCalldata(address(0), 4 ether, address(token1), 8 ether, address(forwarder)),
            mint: mint
        });

        vm.prank(USER);
        vm.expectRevert(TBIForwarderAdapters.IncorrectNativeValue.selector);
        // Should be amount0Max (10) + swapAmountIn (4) = 14, not 13.
        forwarder.depositUniswapV4LPWithSwap{value: 13 ether}(IUniswapV4PositionManager(address(v4PositionManager)), z);
    }

    function test_Zap_BubblesSwapRevert() public {
        MockRevertingRouter rogue = new MockRevertingRouter();
        forwarder.setSwapRouterAllowed(address(rogue), true);
        V4ZapParams memory z = V4ZapParams({
            swapRouter: address(rogue),
            swapInputToken: address(token),
            swapAmountIn: 4 ether,
            swapCalldata: _swapCalldata(address(token), 4 ether, address(token1), 8 ether, address(forwarder)),
            mint: _v4Params(10 ether, 8 ether, USER)
        });

        vm.prank(USER);
        vm.expectRevert(bytes("router: swap failed"));
        forwarder.depositUniswapV4LPWithSwap(IUniswapV4PositionManager(address(v4PositionManager)), z);
    }

    function test_Zap_RevertOnReentrancy() public {
        MockReentrantRouter rogue = new MockReentrantRouter(address(forwarder));
        forwarder.setSwapRouterAllowed(address(rogue), true);
        V4ZapParams memory z = V4ZapParams({
            swapRouter: address(rogue),
            swapInputToken: address(token),
            swapAmountIn: 4 ether,
            swapCalldata: _swapCalldata(address(token), 4 ether, address(token1), 8 ether, address(forwarder)),
            mint: _v4Params(10 ether, 8 ether, USER)
        });

        vm.prank(USER);
        vm.expectRevert(abi.encodeWithSignature("Reentrancy()"));
        forwarder.depositUniswapV4LPWithSwap(IUniswapV4PositionManager(address(v4PositionManager)), z);
    }

    function test_SetSwapRouterAllowed_OnlyOwner() public {
        MockKyberRouter another = new MockKyberRouter();

        vm.prank(ATTACKER);
        vm.expectRevert(abi.encodeWithSignature("Unauthorized()"));
        forwarder.setSwapRouterAllowed(address(another), true);

        // Owner can toggle, and the view reflects state.
        assertFalse(forwarder.isSwapRouterAllowed(address(another)));
        forwarder.setSwapRouterAllowed(address(another), true);
        assertTrue(forwarder.isSwapRouterAllowed(address(another)));
        forwarder.setSwapRouterAllowed(address(another), false);
        assertFalse(forwarder.isSwapRouterAllowed(address(another)));
    }
}
