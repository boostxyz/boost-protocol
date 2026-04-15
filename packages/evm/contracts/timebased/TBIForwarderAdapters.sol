// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {SafeTransferLib} from "@solady/utils/SafeTransferLib.sol";

interface IERC4626 {
    function asset() external view returns (address);
    function deposit(uint256 assets, address receiver) external returns (uint256 shares);
}

interface IAaveV3Pool {
    function supply(address asset, uint256 amount, address onBehalfOf, uint16 referralCode) external;
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

/// @title TBIForwarderAdapters
/// @notice Protocol-specific deposit adapters for the TBIForwarder.
/// Each adapter is a typed function that constrains the interaction to a single known code path.
/// msg.sender is hardcoded as the receiver in every adapter — this is the security invariant.
/// @dev New adapters are added here and picked up by TBIForwarder via inheritance on upgrade.
abstract contract TBIForwarderAdapters {
    using SafeTransferLib for address;

    /// @notice Emitted on every routed deposit
    event Deposit(address indexed user, address indexed target, address indexed asset, uint256 amount);

    /// @notice Thrown when a Compound V2 cToken mint fails
    error MintFailed(uint256 errorCode);

    /// @notice Deposit into an ERC-4626 vault on behalf of msg.sender
    /// @param vault The ERC-4626 vault to deposit into
    /// @param assets The amount of underlying assets to deposit
    function depositERC4626(IERC4626 vault, uint256 assets) external {
        address asset = vault.asset();
        asset.safeTransferFrom(msg.sender, address(this), assets);
        asset.safeApproveWithRetry(address(vault), assets);
        vault.deposit(assets, msg.sender);
        asset.safeApprove(address(vault), 0);

        emit Deposit(msg.sender, address(vault), asset, assets);
    }

    /// @notice Supply into an Aave v3 pool on behalf of msg.sender
    /// @param pool The Aave v3 pool contract
    /// @param asset The underlying asset to supply
    /// @param amount The amount to supply
    function depositAaveV3(IAaveV3Pool pool, address asset, uint256 amount) external {
        asset.safeTransferFrom(msg.sender, address(this), amount);
        asset.safeApproveWithRetry(address(pool), amount);
        pool.supply(asset, amount, msg.sender, 0);
        asset.safeApprove(address(pool), 0);

        emit Deposit(msg.sender, address(pool), asset, amount);
    }

    /// @notice Supply into a Compound v3 Comet on behalf of msg.sender
    /// @param comet The Comet contract
    /// @param asset The underlying asset to supply
    /// @param amount The amount to supply
    function depositCompoundV3(IComet comet, address asset, uint256 amount) external {
        asset.safeTransferFrom(msg.sender, address(this), amount);
        asset.safeApproveWithRetry(address(comet), amount);
        comet.supplyTo(msg.sender, asset, amount);
        asset.safeApprove(address(comet), 0);

        emit Deposit(msg.sender, address(comet), asset, amount);
    }

    /// @notice Stake into an Aave-style staked token on behalf of msg.sender
    /// @param stakedToken The staked token contract
    /// @param asset The underlying asset to stake
    /// @param amount The amount to stake
    function stakeAaveToken(IStakedToken stakedToken, address asset, uint256 amount) external {
        asset.safeTransferFrom(msg.sender, address(this), amount);
        asset.safeApproveWithRetry(address(stakedToken), amount);
        stakedToken.stake(msg.sender, amount);
        asset.safeApprove(address(stakedToken), 0);

        emit Deposit(msg.sender, address(stakedToken), asset, amount);
    }

    /// @notice Deposit into a Compound v2 / Moonwell cToken on behalf of msg.sender
    /// @dev cToken.mint() sends cTokens to the caller (forwarder), so we transfer them to msg.sender after.
    /// Only supports cTokens that implement underlying() (ERC-20 markets). cETH is not supported.
    /// @param cToken The cToken contract
    /// @param amount The amount of underlying to deposit
    function depositCompoundV2(ICErc20 cToken, uint256 amount) external {
        address asset = cToken.underlying();
        asset.safeTransferFrom(msg.sender, address(this), amount);
        asset.safeApproveWithRetry(address(cToken), amount);

        uint256 cTokenBalBefore = cToken.balanceOf(address(this));
        uint256 err = cToken.mint(amount);
        if (err != 0) revert MintFailed(err);
        uint256 cTokenReceived = cToken.balanceOf(address(this)) - cTokenBalBefore;

        address(cToken).safeTransfer(msg.sender, cTokenReceived);
        asset.safeApprove(address(cToken), 0);

        emit Deposit(msg.sender, address(cToken), asset, amount);
    }
}
