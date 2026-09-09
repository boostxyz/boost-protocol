// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {SafeTransferLib} from "@solady/utils/SafeTransferLib.sol";
import {ReentrancyGuard} from "@solady/utils/ReentrancyGuard.sol";

import {V4LiquidityMath} from "contracts/timebased/V4LiquidityMath.sol";

interface IERC4626 {
    function asset() external view returns (address);
    function deposit(uint256 assets, address receiver) external returns (uint256 shares);
}

interface IAaveV3Pool {
    function supply(address asset, uint256 amount, address onBehalfOf, uint16 referralCode) external;
}

/// @notice Aave v4 GiverPositionManager — the governance-registered position manager that supplies
/// into a Spoke on behalf of a user. Aave v4's `Spoke.supply(onBehalfOf)` is restricted to the
/// user's approved position managers (`onlyPositionManager`), so the forwarder cannot supply for a
/// user directly; the Giver pulls the underlying from msg.sender and routes the supply instead.
interface IGiverPositionManager {
    function supplyOnBehalfOf(address spoke, uint256 reserveId, uint256 amount, address onBehalfOf) external;
}

/// @notice Minimal view onto an Aave v4 Spoke's governance registry of position managers, used to
/// authenticate a caller-supplied Giver before trusting it with funds and the indexer signal.
interface IAaveV4Spoke {
    function isPositionManagerActive(address positionManager) external view returns (bool);
}

interface IComet {
    function supplyTo(address dst, address asset, uint256 amount) external;
}

interface IStakedToken {
    function stake(address onBehalfOf, uint256 amount) external;
}

interface ICErc20 {
    function mint(uint256 mintAmount) external returns (uint256);
    function balanceOf(address owner) external view returns (uint256);
    function transfer(address dst, uint256 amount) external returns (bool);
    function underlying() external view returns (address);
}

/// @notice Shared deposit surface across the Midas mToken family. Every Midas product exposes this
/// 5-arg recipient overload of `depositInstant`. `amountToken` is denominated in base-18; the vault
/// pulls a rate-converted amount in the input token's native decimals from msg.sender.
interface IMidasDepositVault {
    function depositInstant(
        address tokenIn,
        uint256 amountToken,
        uint256 minReceiveAmount,
        bytes32 referrerId,
        address recipient
    ) external;
}

/// @notice Mellow Flexible Vaults v2 per-asset deposit queue (used by Lido Earn). `asset()` is the
/// accepted token — an ERC-20 or the EIP-7528 native-ETH sentinel — and `vault()` resolves the core
/// vault. `deposit` mints share tokens to msg.sender; there is no receiver argument.
interface ISyncDepositQueue {
    function asset() external view returns (address);
    function vault() external view returns (address);
    function deposit(uint224 assets, address referral, bytes32[] calldata merkleProof) external payable;
}

/// @notice Minimal view onto a Mellow vault's ShareModule, used to resolve the share token a
/// `SyncDepositQueue` mints (the contract the reward indexer tracks).
interface IMellowShareModule {
    function shareManager() external view returns (address);
}

/// @notice Currency identifier used by Uniswap V4. Mirrors `type Currency is address;` in v4-core
/// so callers can pass `address` values directly. Native ETH is signaled by `address(0)`, valid only
/// as currency0 and funded via `msg.value` (see `depositUniswapV4LP`).
type Currency is address;

/// @notice Pool key for Uniswap V4. The `hooks` field selects the V4 hook (e.g. Kyber FairFlow)
/// — same adapter mints into vanilla and any-hook pools alike, since hooks live inside the canonical
/// PoolManager addressing scheme.
struct PoolKey {
    Currency currency0;
    Currency currency1;
    uint24 fee;
    int24 tickSpacing;
    address hooks;
}

/// @notice Minimal PoolManager surface: `extsload` exposes raw storage so pool state (slot0) can
/// be read without a StateLibrary dependency. See `_verifyKyberZapMint` for the slot derivation.
interface IUniswapV4PoolManager {
    function extsload(bytes32 slot) external view returns (bytes32);
}

/// @notice Hand-rolled v4-periphery PositionManager surface. Beyond `modifyLiquidities` (the mint
/// entry point), the view functions are the canonical-state reads `depositKyberZapV4` uses to
/// verify a zap-minted position: the ERC-721 surface (`nextTokenId`, `ownerOf`) plus position
/// introspection. `getPoolAndPositionInfo`'s second return is v4-periphery's packed `PositionInfo`
/// (a uint256 user-defined value type upstream): bits 8-31 are `tickLower`, bits 32-55 `tickUpper`.
interface IUniswapV4PositionManager {
    function modifyLiquidities(bytes calldata unlockData, uint256 deadline) external payable;
    function nextTokenId() external view returns (uint256);
    function ownerOf(uint256 tokenId) external view returns (address);
    function getPositionLiquidity(uint256 tokenId) external view returns (uint128);
    function getPoolAndPositionInfo(uint256 tokenId) external view returns (PoolKey memory poolKey, uint256 info);
    function poolManager() external view returns (IUniswapV4PoolManager);
}

/// @notice Bundle of V4 mint parameters passed to `depositUniswapV4LP`. Grouped into a struct
/// so the function fits within Solidity's 16-local stack limit without `via_ir`.
struct V4MintParams {
    PoolKey poolKey;
    int24 tickLower;
    int24 tickUpper;
    uint256 liquidity;
    uint128 amount0Max;
    uint128 amount1Max;
    bytes hookData;
    address receiver;
    uint256 deadline;
}

/// @notice Bundle of swap-then-mint parameters passed to `depositUniswapV4LPWithSwap`. The single
/// `swapInputToken` (one of the pool currencies) is partly swapped into the other currency via a
/// whitelisted aggregator router, then both sides are minted as V4 liquidity in the same call.
/// @dev `swapCalldata` is the aggregator's build output and must route the swap output back to this
/// forwarder; the forwarder measures its own balance delta rather than trusting the quote.
struct V4ZapParams {
    address swapRouter;
    address swapInputToken;
    uint256 swapAmountIn;
    bytes swapCalldata;
    V4MintParams mint;
}

/// @notice Minimal Permit2 allowance-transfer surface used to grant V4 PositionManager
/// the right to pull tokens from this forwarder. Distinct from the IPermit2 in `contracts/shared/`
/// which only exposes the signature-transfer flow.
interface IAllowanceTransfer {
    function approve(address token, address spender, uint160 amount, uint48 expiration) external;
    function allowance(address user, address token, address spender)
        external
        view
        returns (uint160 amount, uint48 expiration, uint48 nonce);
}

/// @notice Beefy CLM (CowCentrated Liquidity Manager) vault — the `cowToken`, an ERC-20 over an
/// actively managed concentrated-liquidity position. `wants()` is the pool's `(token0, token1)`.
/// `deposit` accepts any ratio: it pulls only what the strategy's current balance ratio requires
/// (at most `amount0`/`amount1`), prices the pulled amounts into shares, and mints them to
/// msg.sender — there is no receiver argument. Reverts inside the strategy when the pool is not calm.
interface IBeefyVaultConcLiq {
    function wants() external view returns (address token0, address token1);
    function deposit(uint256 amount0, uint256 amount1, uint256 minShares) external;
}

/// @notice Beefy reward pool — the `rCow` token that stakes a CLM's cowToken 1:1 and streams
/// incentives to stakers. `stake` pulls `stakedToken()` from msg.sender and mints an equal amount
/// of rCow to msg.sender; there is no `stakeFor`, so the forwarder stakes as itself and forwards
/// the receipt.
interface IBeefyRewardPool {
    function stakedToken() external view returns (address);
    function stake(uint256 amount) external;
}

/// @notice One aggregator swap leg of a Beefy CLM zap: `amountIn` of the input token is swapped
/// into one pool side via `swapCalldata` (the aggregator's build output, which must route the
/// output back to this forwarder). `amountIn == 0` skips the leg.
struct BeefySwapLeg {
    uint256 amountIn;
    bytes swapCalldata;
}

/// @notice Bundle of zap-then-deposit parameters passed to `depositBeefyCLM`. The user funds a
/// single `inputToken` (any ERC-20, or native ETH as `address(0)` via `msg.value`); up to two
/// aggregator legs turn it into the CLM's two pool sides, the forwarder deposits both sides into
/// the CLM, stakes the minted cowToken into `rewardPool`, and forwards the rCow to `receiver`.
/// @dev `swap0` targets `wants().token0`, `swap1` targets `wants().token1`. When `inputToken` is
/// itself a pool side, the leg toward that side must be empty and the un-swapped remainder is
/// deposited directly; when it is neither side both legs together must consume exactly `amountIn`.
struct BeefyClmParams {
    address clm;
    address rewardPool;
    address inputToken;
    uint256 amountIn;
    address swapRouter;
    BeefySwapLeg swap0;
    BeefySwapLeg swap1;
    uint256 minShares;
    address receiver;
}

interface IERC20Minimal {
    function allowance(address owner, address spender) external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
}

/// @title TBIForwarderAdapters
/// @notice Protocol-specific deposit adapters for the TBIForwarder.
/// Each adapter is a typed function that constrains the interaction to a single known code path.
/// Funds are always pulled from msg.sender. Receiver-aware adapters can credit receipt tokens to a
/// supplied receiver for router/executor flows.
/// @dev New adapters are added here and picked up by TBIForwarder via inheritance on upgrade.
abstract contract TBIForwarderAdapters is ReentrancyGuard {
    using SafeTransferLib for address;

    /// @notice Emitted on every routed deposit
    event Deposit(address indexed user, address indexed target, address indexed asset, uint256 amount);

    /// @notice Emitted once per Uniswap V4 LP mint routed through this forwarder. Distinct from the
    /// generic `Deposit` so the off-chain indexer can match a single, unambiguous log per V4 mint and
    /// gate rewards on `(user, positionManager, poolId)`. `poolId == keccak256(abi.encode(poolKey))`
    /// (the canonical V4 PoolId). `amount0`/`amount1` are the amounts actually consumed by the mint
    /// (committed max minus refund), not the committed max; `depositKyberZapV4` instead derives them
    /// from the minted position's canonical state (price, ticks, liquidity), accurate to ≤1 wei.
    event UniswapV4LPDeposit(
        address indexed user,
        address indexed positionManager,
        bytes32 indexed poolId,
        uint128 liquidity,
        uint256 amount0,
        uint256 amount1
    );

    /// @notice Emitted once per Aave v4 (Spoke/Ledger) supply routed through this forwarder.
    /// Distinct from the generic `Deposit` so the off-chain indexer gets one unambiguous log per
    /// routed supply: `ledger` is the Spoke and `marketKey` its reserve id (in event data, not
    /// indexed — the indexer filters by `(user, ledger)` and reads the key from data). `amount` is
    /// in underlying units; shares are deliberately omitted because the same-transaction Spoke
    /// `Supply` log feeds the backend's share mirror through its normal pipeline.
    event LedgerDeposit(address indexed user, address indexed ledger, uint256 marketKey, uint256 amount);

    /// @notice Thrown when a Compound V2 cToken mint fails
    error MintFailed(uint256 errorCode);

    /// @notice Thrown when a receiver-aware adapter is called with the zero address
    error ZeroReceiver();

    /// @notice Thrown when a Uniswap V4 LP deposit uses native ETH for currency1. Native is only
    /// valid as currency0 (V4 sorts currencies ascending and address(0) is the smallest).
    error NativeCurrencyUnsupported();

    /// @notice Thrown when the native ETH sent does not exactly fund the native pool side
    /// (`msg.value` must equal `amount0Max` for native-currency0 pools, and 0 otherwise).
    error IncorrectNativeValue();

    /// @notice Thrown when a zap names a swap router that the owner has not whitelisted. The
    /// whitelist is the trust boundary for the otherwise-arbitrary external call in the zap.
    error SwapRouterNotWhitelisted(address router);

    /// @notice Thrown when a zap's swap input does not fit the pair it targets. For the V4 zap the
    /// input must be `currency0` or `currency1`. For the Beefy CLM zap the legs must partition the
    /// input: together they may not exceed `amountIn`, a leg may not swap a pool side into itself,
    /// and an input that is neither pool side must be swapped in full (no remainder to strand).
    error SwapInputMismatch();

    /// @notice Thrown when a zap is called with no swap to perform (zero input or empty calldata).
    /// Use `depositUniswapV4LP` for the swap-free path.
    error EmptySwap();

    /// @notice Thrown when a Kyber zap did not mint exactly one new position — the PositionManager's
    /// `nextTokenId` must advance by exactly 1 across the zap call. New-position zaps only; this
    /// matches the widget, which always mints rather than increasing existing positions.
    error PositionMintCountMismatch();

    /// @notice Thrown when the position minted by a Kyber zap is not owned by `receiver`.
    error PositionOwnerMismatch();

    /// @notice Thrown when the position minted by a Kyber zap belongs to a different pool than the
    /// campaign pool the caller committed to (`expectedPoolId`).
    error PoolIdMismatch();

    /// @notice Thrown when a Lido Earn deposit amount exceeds the SyncDepositQueue's uint224 range.
    error AmountExceedsUint224();

    /// @notice Thrown when an Aave v4 deposit names a Giver the Spoke's governance has not
    /// registered as an active position manager. The registry check is the trust boundary that
    /// keeps `LedgerDeposit` honest: the emitted `ledger` (the Spoke) is not the contract being
    /// called (the Giver), so an unauthenticated Giver could pocket the pulled funds and let the
    /// forwarder emit an opt-in signal for a supply that never reached the Spoke.
    error GiverNotActivePositionManager(address giver);

    /// @notice Thrown when a Beefy CLM deposit names a reward pool whose `stakedToken()` is not
    /// the CLM being deposited into. The reward pool is the emitted `target` (the token the reward
    /// indexer tracks), so it is bound to the CLM on-chain rather than trusted from calldata.
    error RewardPoolMismatch();

    /// @notice Canonical Permit2 address (same on every chain)
    address internal constant PERMIT2 = 0x000000000022D473030F116dDEE9F6B43aC78BA3;

    /// @notice Uniswap V4 action selectors used by `depositUniswapV4LP`.
    /// See https://github.com/Uniswap/v4-periphery/blob/main/src/libraries/Actions.sol
    uint8 internal constant ACTION_MINT_POSITION = 0x02;
    uint8 internal constant ACTION_SETTLE_PAIR = 0x0d;
    uint8 internal constant ACTION_SWEEP = 0x14;

    /// @notice Native-ETH sentinel used by Mellow's TransferLibrary (EIP-7528) as a queue `asset()`.
    address internal constant MELLOW_NATIVE_ASSET = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;

    /// @notice Storage index of the pools mapping in the V4 PoolManager (v4-core StateLibrary's
    /// POOLS_SLOT). `pools[poolId]` lives at `keccak256(abi.encodePacked(poolId, POOLS_SLOT))`,
    /// whose first slot is slot0 with `sqrtPriceX96` in the low 160 bits.
    bytes32 internal constant V4_POOLS_SLOT = bytes32(uint256(6));

    /// @notice Deposit into an ERC-4626 vault on behalf of receiver
    /// @param vault The ERC-4626 vault to deposit into
    /// @param assets The amount of underlying assets to deposit
    /// @param receiver The account receiving vault shares
    function depositERC4626(IERC4626 vault, uint256 assets, address receiver) external {
        _requireReceiver(receiver);
        address asset = vault.asset();
        asset.safeTransferFrom(msg.sender, address(this), assets);
        asset.safeApproveWithRetry(address(vault), assets);
        vault.deposit(assets, receiver);
        asset.safeApprove(address(vault), 0);

        emit Deposit(receiver, address(vault), asset, assets);
    }

    /// @notice Supply into an Aave v3 pool on behalf of receiver
    /// @param pool The Aave v3 pool contract
    /// @param asset The underlying asset to supply
    /// @param amount The amount to supply
    /// @param receiver The account receiving aTokens
    function depositAaveV3(IAaveV3Pool pool, address asset, uint256 amount, address receiver) external {
        _requireReceiver(receiver);
        asset.safeTransferFrom(msg.sender, address(this), amount);
        asset.safeApproveWithRetry(address(pool), amount);
        pool.supply(asset, amount, receiver, 0);
        asset.safeApprove(address(pool), 0);

        emit Deposit(receiver, address(pool), asset, amount);
    }

    /// @notice Supply into an Aave v4 Spoke on behalf of receiver, routed through the
    /// governance-registered GiverPositionManager (the Spoke's `supply(onBehalfOf)` only accepts
    /// the user's approved position managers, so the forwarder cannot supply for a user directly).
    /// @dev Requires `receiver` to have approved the Giver as a position manager on the Spoke
    /// (`setUserPositionManager(giver, true)`, bundled by the frontend flow); without it the
    /// Spoke's revert surfaces unchanged. A mismatched `asset`/`reserveId` pairing reverts inside
    /// the Giver's pull/supply, so no funds path exists for a wrong asset.
    ///
    /// Unlike the other adapters, the contract called (the Giver) is not the contract emitted
    /// (the Spoke), so the Giver cannot be trusted implicitly: it is authenticated against the
    /// Spoke's own governance registry (`isPositionManagerActive`) before any funds move. A forged
    /// `spoke` can vouch for a forged giver, but then the emitted `ledger` is that forged address,
    /// which the indexer ignores — it only follows canonical Spokes. Emits `LedgerDeposit` (not
    /// the generic `Deposit`) as the single indexer signal.
    /// @param giver The Aave v4 GiverPositionManager
    /// @param spoke The Aave v4 Spoke holding the reserve — emitted as the `ledger`
    /// @param reserveId The Spoke's reserve id for `asset` — emitted as the `marketKey`
    /// @param asset The reserve's underlying asset to supply
    /// @param amount The amount of `asset` to supply
    /// @param receiver The account credited with the supplied position
    function depositAaveV4(
        IGiverPositionManager giver,
        address spoke,
        uint256 reserveId,
        address asset,
        uint256 amount,
        address receiver
    ) external {
        _requireReceiver(receiver);
        if (!IAaveV4Spoke(spoke).isPositionManagerActive(address(giver))) {
            revert GiverNotActivePositionManager(address(giver));
        }
        asset.safeTransferFrom(msg.sender, address(this), amount);
        asset.safeApproveWithRetry(address(giver), amount);
        giver.supplyOnBehalfOf(spoke, reserveId, amount, receiver);
        asset.safeApprove(address(giver), 0);

        emit LedgerDeposit(receiver, spoke, reserveId, amount);
    }

    /// @notice Supply into a Compound v3 Comet on behalf of receiver
    /// @param comet The Comet contract
    /// @param asset The underlying asset to supply
    /// @param amount The amount to supply
    /// @param receiver The account receiving the supplied balance
    function depositCompoundV3(IComet comet, address asset, uint256 amount, address receiver) external {
        _requireReceiver(receiver);
        asset.safeTransferFrom(msg.sender, address(this), amount);
        asset.safeApproveWithRetry(address(comet), amount);
        comet.supplyTo(receiver, asset, amount);
        asset.safeApprove(address(comet), 0);

        emit Deposit(receiver, address(comet), asset, amount);
    }

    /// @notice Stake into an Aave-style staked token on behalf of receiver
    /// @param stakedToken The staked token contract
    /// @param asset The underlying asset to stake
    /// @param amount The amount to stake
    /// @param receiver The account receiving staked tokens
    function stakeAaveToken(IStakedToken stakedToken, address asset, uint256 amount, address receiver) external {
        _requireReceiver(receiver);
        asset.safeTransferFrom(msg.sender, address(this), amount);
        asset.safeApproveWithRetry(address(stakedToken), amount);
        stakedToken.stake(receiver, amount);
        asset.safeApprove(address(stakedToken), 0);

        emit Deposit(receiver, address(stakedToken), asset, amount);
    }

    /// @notice Deposit into a Compound v2 / Moonwell cToken on behalf of receiver
    /// @dev cToken.mint() sends cTokens to the caller (forwarder), so we transfer them to receiver after.
    /// Only supports cTokens that implement underlying() (ERC-20 markets). cETH is not supported.
    /// @param cToken The cToken contract
    /// @param amount The amount of underlying to deposit
    /// @param receiver The account receiving cTokens
    function depositCompoundV2(ICErc20 cToken, uint256 amount, address receiver) external {
        _requireReceiver(receiver);
        address asset = cToken.underlying();
        asset.safeTransferFrom(msg.sender, address(this), amount);
        asset.safeApproveWithRetry(address(cToken), amount);

        uint256 cTokenBalBefore = cToken.balanceOf(address(this));
        uint256 err = cToken.mint(amount);
        if (err != 0) revert MintFailed(err);
        uint256 cTokenReceived = cToken.balanceOf(address(this)) - cTokenBalBefore;

        address(cToken).safeTransfer(receiver, cTokenReceived);
        asset.safeApprove(address(cToken), 0);

        emit Deposit(receiver, address(cToken), asset, amount);
    }

    /// @notice Deposit into a Midas DepositVault, minting the vault's mToken to `receiver`.
    /// @dev Generic across the Midas mToken family — every product shares the 5-arg `depositInstant`
    /// recipient overload, so this one adapter covers all vaults. All protocol-specific values are
    /// parameters; nothing is hardcoded.
    /// @dev Midas denominates `depositInstant`'s amount in base-18 (`amountToken`) but pulls a
    /// rate-converted amount in the token's *native* decimals from msg.sender — two different scales.
    /// So the adapter takes both: it pulls/approves `amount` (native) and forwards `amountToken`
    /// (base-18) untouched. The vault consumes only what its oracle math requires; any unspent
    /// `tokenIn` is refunded to `receiver` (mirrors the V4 refund pattern), making `amount` an upper
    /// bound the caller is willing to spend. The mToken — not the vault — is emitted as `target`
    /// (the indexer keys on the minted share token), and is a separate parameter because the vault
    /// and share token are distinct contracts. The emitted `amount` is the net `tokenIn` consumed.
    /// @param vault The Midas DepositVault — the `depositInstant` target
    /// @param tokenIn The input token the vault accepts
    /// @param mToken The minted share token — emitted as the Deposit `target`
    /// @param amount The amount of `tokenIn` (native decimals) to pull and approve — an upper bound
    /// @param amountToken The base-18 deposit amount passed straight through to `depositInstant`
    /// @param minReceiveAmount Slippage floor for minted shares — passed straight through from the caller
    /// @param referrerId Midas referrer id — passed straight through from the caller
    /// @param receiver The account receiving the minted mToken
    function depositMidas(
        address vault,
        address tokenIn,
        address mToken,
        uint256 amount,
        uint256 amountToken,
        uint256 minReceiveAmount,
        bytes32 referrerId,
        address receiver
    ) external nonReentrant {
        _requireReceiver(receiver);
        uint256 balanceBefore = IERC20Minimal(tokenIn).balanceOf(address(this));

        tokenIn.safeTransferFrom(msg.sender, address(this), amount);
        tokenIn.safeApproveWithRetry(vault, amount);
        IMidasDepositVault(vault).depositInstant(tokenIn, amountToken, minReceiveAmount, referrerId, receiver);
        tokenIn.safeApprove(vault, 0);

        // Refund whatever the vault did not consume so the stateless forwarder holds nothing.
        uint256 consumed = _refundUnspent(tokenIn, receiver, balanceBefore, amount);

        emit Deposit(receiver, mToken, tokenIn, consumed);
    }

    /// @notice Deposit into a Lido Earn (Mellow v2) vault via its per-asset SyncDepositQueue,
    /// crediting the vault share token to `receiver`.
    /// @dev The SyncDepositQueue mints shares to msg.sender (this forwarder) and exposes no receiver
    /// argument, so the minted shares are measured by balance delta and forwarded to `receiver`
    /// (mirrors `depositCompoundV2`). The accepted asset is `queue.asset()`: an ERC-20 (e.g. WETH,
    /// wstETH) pulled from msg.sender, or native ETH — signaled by Mellow's EIP-7528 sentinel —
    /// funded via msg.value. The share token is resolved from the queue's vault so callers cannot
    /// misdirect it. Emits `Deposit` with the share token as `target`, the contract the indexer tracks.
    /// @param queue The per-asset Mellow SyncDepositQueue
    /// @param amount The amount of `queue.asset()` to deposit
    /// @param receiver The account receiving Lido Earn share tokens
    function depositLidoEarn(ISyncDepositQueue queue, uint256 amount, address receiver) external payable nonReentrant {
        _requireReceiver(receiver);
        if (amount > type(uint224).max) revert AmountExceedsUint224();

        address asset = queue.asset();
        address shareToken = IMellowShareModule(queue.vault()).shareManager();
        uint256 sharesBefore = IERC20Minimal(shareToken).balanceOf(address(this));

        if (asset == MELLOW_NATIVE_ASSET) {
            if (msg.value != amount) revert IncorrectNativeValue();
            queue.deposit{value: amount}(uint224(amount), address(0), new bytes32[](0));
        } else {
            if (msg.value != 0) revert IncorrectNativeValue();
            asset.safeTransferFrom(msg.sender, address(this), amount);
            asset.safeApproveWithRetry(address(queue), amount);
            queue.deposit(uint224(amount), address(0), new bytes32[](0));
            asset.safeApprove(address(queue), 0);
        }

        uint256 sharesReceived = IERC20Minimal(shareToken).balanceOf(address(this)) - sharesBefore;
        shareToken.safeTransfer(receiver, sharesReceived);

        emit Deposit(receiver, shareToken, asset, amount);
    }

    /// @notice Mint a Uniswap V4 LP position on behalf of receiver.
    /// @dev Same adapter works for vanilla V4 pools and any V4 hook (e.g. Kyber FairFlow) —
    /// the hook is selected by `poolKey.hooks`. Funds are pulled from `msg.sender` up to
    /// `amount{0,1}Max`; V4 spends only what's needed for `liquidity` at current price, and
    /// any unspent token0/token1 is refunded to `receiver` after the call. Emits a single
    /// `UniswapV4LPDeposit` whose `amount0`/`amount1` are the amounts actually consumed
    /// (committed max minus refund).
    ///
    /// Native ETH is supported only as currency0 (V4 sorts currencies ascending, so address(0)
    /// is always currency0). The caller funds the native side with `msg.value == amount0Max`;
    /// the forwarder forwards it to `modifyLiquidities`, and an appended `SWEEP` action returns
    /// any unspent ETH from the PositionManager directly to `receiver`. The ERC20 side is still
    /// pulled via `transferFrom` and refunded by this contract. `currency1 == address(0)` is
    /// rejected — it cannot occur for a valid sorted V4 pool.
    ///
    /// Permit2 allowances (token → Permit2 and Permit2 → PositionManager) are lazily
    /// initialized to `type(uint160).max` with `type(uint48).max` expiration on first use,
    /// then reused. PositionManager pulls the ERC20 side from this contract via Permit2 during
    /// `SETTLE_PAIR`.
    ///
    /// @param positionManager The Uniswap V4 PositionManager (chain-specific canonical address)
    /// @param p               Bundled mint parameters (poolKey, ticks, liquidity, caps, hookData, receiver, deadline)
    function depositUniswapV4LP(IUniswapV4PositionManager positionManager, V4MintParams calldata p)
        external
        payable
        nonReentrant
    {
        _requireReceiver(p.receiver);

        address token0 = Currency.unwrap(p.poolKey.currency0);
        address token1 = Currency.unwrap(p.poolKey.currency1);
        if (token1 == address(0)) revert NativeCurrencyUnsupported();
        bool token0Native = token0 == address(0);

        // The native side (if any) is funded by `msg.value`; reject stray ETH on ERC20-only pools.
        uint256 nativeValue = token0Native ? p.amount0Max : 0;
        if (msg.value != nativeValue) revert IncorrectNativeValue();

        // Pull + Permit2-arm each ERC20 side. The native side is settled from `msg.value`, not
        // pulled, and its refund is handled by the SWEEP action rather than this contract.
        uint256 balance0Before;
        if (!token0Native) {
            balance0Before = IERC20Minimal(token0).balanceOf(address(this));
            token0.safeTransferFrom(msg.sender, address(this), p.amount0Max);
            _ensurePermit2Allowance(token0, address(positionManager), p.amount0Max);
        }
        uint256 balance1Before = IERC20Minimal(token1).balanceOf(address(this));
        token1.safeTransferFrom(msg.sender, address(this), p.amount1Max);
        _ensurePermit2Allowance(token1, address(positionManager), p.amount1Max);

        positionManager.modifyLiquidities{value: nativeValue}(_encodeV4MintUnlockData(p, token0Native), p.deadline);

        // Refund unspent funds to receiver and capture the amounts consumed for the event. For the
        // native side V4's SWEEP refunds unspent ETH straight to `receiver`, so the forwarder never
        // holds it and can't net it out — we report the committed `amount0Max` (the indexer
        // attributes the position via the mint NFT, not these amounts). Extracted into a helper to
        // keep this function within Solidity's stack-local limit without via_ir.
        uint256 consumed0 =
            token0Native ? p.amount0Max : _refundUnspent(token0, p.receiver, balance0Before, p.amount0Max);
        uint256 consumed1 = _refundUnspent(token1, p.receiver, balance1Before, p.amount1Max);

        // `liquidity` is stored as uint256 for the V4 action encoding but is a uint128 quantity
        // on-chain; V4 would have reverted in `modifyLiquidities` above if it exceeded uint128.
        emit UniswapV4LPDeposit(
            p.receiver,
            address(positionManager),
            keccak256(abi.encode(p.poolKey)),
            uint128(p.liquidity),
            consumed0,
            consumed1
        );
    }

    /// @notice Swap one pool currency into the pair, then mint a Uniswap V4 LP position — all in one
    /// transaction. The user funds a single token (`swapInputToken`, which must be `currency0` or
    /// `currency1`); the forwarder swaps `swapAmountIn` of it into the other currency through a
    /// whitelisted aggregator router, then mints `mint.liquidity` and refunds any dust to `receiver`.
    /// @dev The swap is an arbitrary call into `swapRouter` with caller-supplied `swapCalldata`; the
    /// only trust boundary is the owner-managed whitelist (`setSwapRouterAllowed`). The router pulls
    /// at most the scoped approval (`swapAmountIn` of the input) which this call resets to zero
    /// afterward, and the swap output must land back in this forwarder or the mint underflows and
    /// reverts — so a malformed swap can only fail the caller's own transaction. `nonReentrant`
    /// blocks the router (or a pool hook) re-entering while transient balances are held.
    ///
    /// Native ETH is supported on either side (always `currency0`): as the input the caller sends
    /// `msg.value == amount0Max + swapAmountIn`; as the swap output the forwarder receives it from
    /// the router via `receive()`. Either way the mint forwards `amount0Max` as `msg.value`, the
    /// appended SWEEP returns the position's unspent ETH to `receiver`, and this forwarder refunds
    /// any positive-slippage native surplus it still holds.
    /// @param positionManager The Uniswap V4 PositionManager (chain-specific canonical address)
    /// @param z               Bundled swap + mint parameters
    function depositUniswapV4LPWithSwap(IUniswapV4PositionManager positionManager, V4ZapParams calldata z)
        external
        payable
        nonReentrant
    {
        _requireReceiver(z.mint.receiver);
        if (!_isSwapRouterAllowed(z.swapRouter)) revert SwapRouterNotWhitelisted(z.swapRouter);
        if (z.swapAmountIn == 0 || z.swapCalldata.length == 0) revert EmptySwap();

        address token0 = Currency.unwrap(z.mint.poolKey.currency0);
        address token1 = Currency.unwrap(z.mint.poolKey.currency1);
        if (token1 == address(0)) revert NativeCurrencyUnsupported();

        bool inputIsToken0 = z.swapInputToken == token0;
        if (!inputIsToken0 && z.swapInputToken != token1) revert SwapInputMismatch();
        bool token0Native = token0 == address(0);
        bool inputNative = z.swapInputToken == address(0);

        // Native input funds both the kept and swapped portions via msg.value; otherwise the native
        // side (if any) is produced by the swap and the caller sends no ETH.
        uint256 inputCap = inputIsToken0 ? z.mint.amount0Max : z.mint.amount1Max;
        if (msg.value != (inputNative ? inputCap + z.swapAmountIn : 0)) revert IncorrectNativeValue();

        // Snapshot pre-existing balances so refunds only ever return this call's own surplus.
        uint256 base0 =
            token0Native ? address(this).balance - msg.value : IERC20Minimal(token0).balanceOf(address(this));
        uint256 base1 = IERC20Minimal(token1).balanceOf(address(this));

        if (!inputNative) z.swapInputToken.safeTransferFrom(msg.sender, address(this), inputCap + z.swapAmountIn);
        _executeSwap(z.swapRouter, z.swapInputToken, z.swapAmountIn, z.swapCalldata, inputNative);

        _zapMintAndSettle(positionManager, z, token0, token1, token0Native, base0, base1);
    }

    /// @notice Deposit any single token into a Uniswap V4 LP position through Kyber's Zap-as-a-Service:
    /// the forwarder relays ZaaS build calldata to the whitelisted zap router (which swaps, mints via
    /// the canonical PositionManager, and refunds leftovers to the recipient), then verifies the mint
    /// from canonical state and emits a trustworthy `UniswapV4LPDeposit`.
    /// @dev `zapCalldata` is untrusted — the caller could encode anything the whitelisted router
    /// accepts — so nothing in it is believed. The anti-spoof mechanism is reading the result out of
    /// the PositionManager itself: exactly one new position must exist (`nextTokenId` +1), owned by
    /// `receiver`, in the pool whose `keccak256(abi.encode(poolKey))` equals `expectedPoolId`. Event
    /// amounts are derived from `(slot0.sqrtPriceX96, tickLower, tickUpper, liquidity)` via the
    /// standard liquidity formulas, matching settled amounts to ≤1 wei — equal-or-better fidelity
    /// than the native V4 path above, which reports the committed `amount0Max` for the native side.
    ///
    /// The zap router is trusted exactly like the swap routers in `depositUniswapV4LPWithSwap`
    /// (owner-approved arbitrary-call target), so the same ERC-7201 whitelist gates it. The router
    /// is scoped-approved for `amountIn` (reset afterward; ZaaS pulls exactly `amountIn`); native
    /// input (`tokenIn == address(0)`) is funded via `msg.value` instead. ZaaS refunds unconsumed
    /// input to the recipient itself, so the post-call dust sweep to `receiver` is defensive and
    /// normally a no-op. New-position zaps only — increasing an existing position reverts.
    /// @param positionManager The Uniswap V4 PositionManager (chain-specific canonical address)
    /// @param zapRouter The Kyber zap router from the ZaaS build response — must be whitelisted
    /// @param tokenIn The input token pulled from msg.sender; address(0) = native ETH via msg.value
    /// @param amountIn The exact amount of `tokenIn` the zap consumes
    /// @param zapCalldata ZaaS build output (built with sender = this forwarder, recipient = receiver)
    /// @param expectedPoolId The canonical V4 PoolId the position must land in (the campaign pool)
    /// @param receiver The account that must own the minted position NFT
    function depositKyberZapV4(
        IUniswapV4PositionManager positionManager,
        address zapRouter,
        address tokenIn,
        uint256 amountIn,
        bytes calldata zapCalldata,
        bytes32 expectedPoolId,
        address receiver
    ) external payable nonReentrant {
        _requireReceiver(receiver);
        if (!_isSwapRouterAllowed(zapRouter)) revert SwapRouterNotWhitelisted(zapRouter);
        if (amountIn == 0 || zapCalldata.length == 0) revert EmptySwap();

        bool nativeIn = tokenIn == address(0);
        if (msg.value != (nativeIn ? amountIn : 0)) revert IncorrectNativeValue();

        uint256 tokenIdBefore = positionManager.nextTokenId();
        // Pre-call snapshots so the dust sweep only ever returns this call's own surplus.
        uint256 nativeBase = address(this).balance - msg.value;
        uint256 tokenBase = nativeIn ? 0 : IERC20Minimal(tokenIn).balanceOf(address(this));

        if (!nativeIn) tokenIn.safeTransferFrom(msg.sender, address(this), amountIn);
        _executeSwap(zapRouter, tokenIn, amountIn, zapCalldata, nativeIn);

        (uint128 liquidity, uint256 amount0, uint256 amount1) =
            _verifyKyberZapMint(positionManager, tokenIdBefore, expectedPoolId, receiver);
        _sweepKyberZapDust(tokenIn, receiver, nativeIn, tokenBase, nativeBase);

        emit UniswapV4LPDeposit(receiver, address(positionManager), expectedPoolId, liquidity, amount0, amount1);
    }

    /// @dev Verifies the zap minted exactly one new position to `receiver` in the expected pool,
    /// reading only canonical PositionManager/PoolManager state, and derives the token amounts the
    /// position holds. The minted tokenId is the pre-call `nextTokenId` (the PositionManager assigns
    /// `nextTokenId` then increments). `sqrtPriceX96` is the low 160 bits of the pool's slot0, read
    /// via `extsload` at the StateLibrary slot layout; ticks are unpacked from `PositionInfo`.
    function _verifyKyberZapMint(
        IUniswapV4PositionManager positionManager,
        uint256 tokenId,
        bytes32 expectedPoolId,
        address receiver
    ) internal view returns (uint128 liquidity, uint256 amount0, uint256 amount1) {
        if (positionManager.nextTokenId() != tokenId + 1) revert PositionMintCountMismatch();
        if (positionManager.ownerOf(tokenId) != receiver) revert PositionOwnerMismatch();

        (PoolKey memory poolKey, uint256 info) = positionManager.getPoolAndPositionInfo(tokenId);
        if (keccak256(abi.encode(poolKey)) != expectedPoolId) revert PoolIdMismatch();

        liquidity = positionManager.getPositionLiquidity(tokenId);
        uint160 sqrtPriceX96 = uint160(
            uint256(positionManager.poolManager().extsload(keccak256(abi.encodePacked(expectedPoolId, V4_POOLS_SLOT))))
        );
        (amount0, amount1) = V4LiquidityMath.getAmountsForLiquidity(
            sqrtPriceX96,
            V4LiquidityMath.getSqrtPriceAtTick(int24(uint24(info >> 8))),
            V4LiquidityMath.getSqrtPriceAtTick(int24(uint24(info >> 32))),
            liquidity
        );
    }

    /// @dev Sweeps any `tokenIn` and native balance above the pre-call snapshots to `receiver`.
    /// Defensive only: ZaaS refunds leftovers to the recipient itself, so this normally no-ops.
    function _sweepKyberZapDust(address tokenIn, address receiver, bool nativeIn, uint256 tokenBase, uint256 nativeBase)
        internal
    {
        if (!nativeIn) {
            uint256 tokenBalance = IERC20Minimal(tokenIn).balanceOf(address(this));
            if (tokenBalance > tokenBase) tokenIn.safeTransfer(receiver, tokenBalance - tokenBase);
        }
        uint256 nativeBalance = address(this).balance;
        if (nativeBalance > nativeBase) receiver.safeTransferETH(nativeBalance - nativeBase);
    }

    /// @dev Approves the whitelisted router for exactly `amountIn` (or forwards native via value),
    /// relays the aggregator calldata, then resets the approval. Bubbles the router's revert reason.
    function _executeSwap(address router, address inputToken, uint256 amountIn, bytes calldata data, bool inputNative)
        internal
    {
        bool ok;
        bytes memory ret;
        if (inputNative) {
            (ok, ret) = router.call{value: amountIn}(data);
        } else {
            inputToken.safeApproveWithRetry(router, amountIn);
            (ok, ret) = router.call(data);
            inputToken.safeApprove(router, 0);
        }
        if (!ok) {
            assembly ("memory-safe") {
                revert(add(ret, 0x20), mload(ret))
            }
        }
    }

    /// @dev Arms Permit2 for the ERC20 sides, mints, then refunds dust to `receiver`. Consumed amounts
    /// are measured by balance delta across the mint; for the native side the committed `amount0Max`
    /// is reported (SWEEP refunds its unspent portion directly to `receiver`). Extracted to keep the
    /// entry point within Solidity's stack-local limit without via_ir.
    function _zapMintAndSettle(
        IUniswapV4PositionManager positionManager,
        V4ZapParams calldata z,
        address token0,
        address token1,
        bool token0Native,
        uint256 base0,
        uint256 base1
    ) internal {
        if (!token0Native) _ensurePermit2Allowance(token0, address(positionManager), z.mint.amount0Max);
        _ensurePermit2Allowance(token1, address(positionManager), z.mint.amount1Max);

        uint256 nativeValue = token0Native ? z.mint.amount0Max : 0;
        uint256 preMint0 = token0Native ? 0 : IERC20Minimal(token0).balanceOf(address(this));
        uint256 preMint1 = IERC20Minimal(token1).balanceOf(address(this));

        positionManager.modifyLiquidities{value: nativeValue}(
            _encodeV4MintUnlockData(z.mint, token0Native), z.mint.deadline
        );

        uint256 consumed0;
        if (token0Native) {
            uint256 surplus = address(this).balance - base0;
            if (surplus > 0) z.mint.receiver.safeTransferETH(surplus);
            consumed0 = z.mint.amount0Max;
        } else {
            consumed0 = _settleErc20(token0, z.mint.receiver, base0, preMint0);
        }
        uint256 consumed1 = _settleErc20(token1, z.mint.receiver, base1, preMint1);

        emit UniswapV4LPDeposit(
            z.mint.receiver,
            address(positionManager),
            keccak256(abi.encode(z.mint.poolKey)),
            uint128(z.mint.liquidity),
            consumed0,
            consumed1
        );
    }

    /// @dev Refunds the forwarder's surplus of `token` above `base` to `receiver` and returns the
    /// amount the PositionManager pulled (`preMint - postMint`). Unlike `_refundUnspent`, this works
    /// when the held balance exceeds the committed cap (positive swap slippage).
    function _settleErc20(address token, address receiver, uint256 base, uint256 preMint)
        internal
        returns (uint256 consumed)
    {
        uint256 post = IERC20Minimal(token).balanceOf(address(this));
        consumed = preMint - post;
        uint256 refund = post - base;
        if (refund > 0) token.safeTransfer(receiver, refund);
    }

    /// @notice ERC-7201 namespaced storage for the zap router whitelist, kept off the sequential
    /// layout so it never collides with the proxy's `__gap`.
    /// @custom:storage-location erc7201:tbi.forwarder.zap
    struct ZapStorage {
        mapping(address => bool) allowedSwapRouters;
    }

    /// @dev keccak256(abi.encode(uint256(keccak256("tbi.forwarder.zap")) - 1)) & ~bytes32(uint256(0xff))
    bytes32 private constant ZAP_STORAGE_SLOT = 0xff8e10bcea20fdc8f8095ddd3c03e5ab94a38448f444743733263aecf77d1f00;

    function _zapStorage() private pure returns (ZapStorage storage $) {
        assembly ("memory-safe") {
            $.slot := ZAP_STORAGE_SLOT
        }
    }

    /// @notice Whether `router` is permitted as a zap swap target.
    function _isSwapRouterAllowed(address router) internal view returns (bool) {
        return _zapStorage().allowedSwapRouters[router];
    }

    /// @dev Unauthenticated whitelist mutator. The owner-gated external wrapper lives in TBIForwarder.
    function _setSwapRouterAllowed(address router, bool allowed) internal {
        _zapStorage().allowedSwapRouters[router] = allowed;
    }

    /// @dev Refunds `amountMax - consumed` of `token` to `receiver` and returns the consumed amount.
    /// `balanceBefore` is the pre-pull snapshot; the surplus still held after the mint is the refund.
    function _refundUnspent(address token, address receiver, uint256 balanceBefore, uint256 amountMax)
        internal
        returns (uint256 consumed)
    {
        uint256 balanceAfter = IERC20Minimal(token).balanceOf(address(this));
        uint256 refund = balanceAfter > balanceBefore ? balanceAfter - balanceBefore : 0;
        if (refund > 0) token.safeTransfer(receiver, refund);
        return amountMax - refund;
    }

    /// @dev Encodes V4 PositionManager.modifyLiquidities unlockData for a MINT_POSITION + SETTLE_PAIR
    /// flow, appending SWEEP for native pools so unspent ETH is returned to `receiver` (V4 settles
    /// only what the liquidity needs and the excess `msg.value` would otherwise be stranded in the
    /// PositionManager). Extracted from `depositUniswapV4LP` to keep that function within stack limits.
    function _encodeV4MintUnlockData(V4MintParams calldata p, bool token0Native) internal pure returns (bytes memory) {
        bytes memory mintParams = abi.encode(
            p.poolKey, p.tickLower, p.tickUpper, p.liquidity, p.amount0Max, p.amount1Max, p.receiver, p.hookData
        );
        bytes memory settleParams = abi.encode(p.poolKey.currency0, p.poolKey.currency1);

        if (!token0Native) {
            bytes memory actions = abi.encodePacked(ACTION_MINT_POSITION, ACTION_SETTLE_PAIR);
            bytes[] memory params = new bytes[](2);
            params[0] = mintParams;
            params[1] = settleParams;
            return abi.encode(actions, params);
        }

        bytes memory nativeActions = abi.encodePacked(ACTION_MINT_POSITION, ACTION_SETTLE_PAIR, ACTION_SWEEP);
        bytes[] memory nativeParams = new bytes[](3);
        nativeParams[0] = mintParams;
        nativeParams[1] = settleParams;
        // SWEEP(currency, recipient): return unspent native ETH to the receiver.
        nativeParams[2] = abi.encode(p.poolKey.currency0, p.receiver);
        return abi.encode(nativeActions, nativeParams);
    }

    /// @dev Lazily ensures token→Permit2 and Permit2→spender allowances are sufficient.
    /// Writes only when the existing allowance is below `minAmount` or has expired, so
    /// repeat deposits skip the ~25k-gas approve SSTORE.
    function _ensurePermit2Allowance(address token, address spender, uint256 minAmount) internal {
        if (IERC20Minimal(token).allowance(address(this), PERMIT2) < minAmount) {
            token.safeApproveWithRetry(PERMIT2, type(uint256).max);
        }
        (uint160 currentAmount, uint48 currentExpiration,) =
            IAllowanceTransfer(PERMIT2).allowance(address(this), token, spender);
        if (currentAmount < minAmount || currentExpiration <= block.timestamp) {
            IAllowanceTransfer(PERMIT2).approve(token, spender, type(uint160).max, type(uint48).max);
        }
    }

    function _requireReceiver(address receiver) internal pure {
        if (receiver == address(0)) revert ZeroReceiver();
    }
}
