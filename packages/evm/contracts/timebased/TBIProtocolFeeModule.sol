// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Ownable} from "@solady/auth/Ownable.sol";

import {ITBIProtocolFeeModule} from "contracts/timebased/ITBIProtocolFeeModule.sol";

/// @title TBIProtocolFeeModule
/// @notice Per-account protocol fee overrides for TimeBasedIncentiveManager
/// @dev A flat mapping of account (campaign creator or budget) to protocol fee in basis
///      points. Resolution looks up the creator first, then the budget; an account with no
///      override gets the Manager's standard fee. The module owner (team Safe) sets fees
///      without a timelock delay. The Manager's owner is also honored as owner, so if the
///      module owner's key leaks the Manager owner can transfer module ownership away
///      from it. Not upgradeable: a new kind of policy is a new module the Manager owner
///      points at.
contract TBIProtocolFeeModule is ITBIProtocolFeeModule, Ownable {
    /// @notice A per-account fee override
    /// @param set Whether an override exists; distinguishes a 0% override from no override
    /// @param feeBps Protocol fee in basis points
    struct FeeOverride {
        bool set;
        uint64 feeBps;
    }

    /// @notice Sentinel meaning "no override, apply the Manager's standard fee"
    uint64 public constant STANDARD_FEE = type(uint64).max;

    /// @notice Maximum fee an override may define (100%)
    uint64 public constant MAX_FEE_BPS = 10_000;

    /// @notice Maximum number of accounts in a single batch
    uint256 public constant MAX_BATCH_SIZE = 100;

    /// @notice The Manager whose owner may also administer this module
    address public immutable MANAGER;

    /// @notice Fee override by account (creator or budget)
    mapping(address => FeeOverride) public feeOverrides;

    /// @notice Emitted when an account's fee override is set or changed
    event FeeOverrideSet(address indexed account, uint64 feeBps);

    /// @notice Emitted when an account's fee override is removed
    event FeeOverrideCleared(address indexed account);

    /// @notice Error when the manager address has no code
    error InvalidManager();

    /// @notice Error when a fee exceeds MAX_FEE_BPS
    error FeeTooHigh();

    /// @notice Error when batch arrays are empty or have mismatched lengths
    error InvalidBatch();

    /// @notice Error when a batch exceeds MAX_BATCH_SIZE
    error BatchTooLarge();

    /// @param manager_ The TimeBasedIncentiveManager proxy whose owner may also administer this module
    /// @param owner_ The module owner (team Safe)
    constructor(address manager_, address owner_) {
        if (manager_.code.length == 0) revert InvalidManager();
        MANAGER = manager_;
        _initializeOwner(owner_);
    }

    /// @dev Both the module owner and the Manager's current owner pass every onlyOwner
    ///      check, including transferOwnership, so the Manager owner can recover the
    ///      module from a leaked module owner key
    function _checkOwner() internal view override {
        if (msg.sender != owner() && msg.sender != Ownable(MANAGER).owner()) revert Unauthorized();
    }

    /// @notice Set an account's protocol fee override
    /// @param account The creator or budget address
    /// @param feeBps Protocol fee in basis points
    function setFee(address account, uint64 feeBps) external onlyOwner {
        _setFee(account, feeBps);
    }

    /// @notice Set protocol fee overrides for many accounts in one call
    /// @param accounts The creator or budget addresses
    /// @param feeBps The fee in basis points for each account, same length as accounts
    function setFees(address[] calldata accounts, uint64[] calldata feeBps) external onlyOwner {
        if (accounts.length == 0 || accounts.length != feeBps.length) revert InvalidBatch();
        if (accounts.length > MAX_BATCH_SIZE) revert BatchTooLarge();
        for (uint256 i = 0; i < accounts.length; i++) {
            _setFee(accounts[i], feeBps[i]);
        }
    }

    /// @notice Remove an account's protocol fee override; the standard fee applies again
    /// @param account The creator or budget address
    function clearFee(address account) external onlyOwner {
        delete feeOverrides[account];
        emit FeeOverrideCleared(account);
    }

    /// @inheritdoc ITBIProtocolFeeModule
    function quoteProtocolFee(FeeContext calldata ctx) external view returns (uint64) {
        FeeOverride memory o = feeOverrides[ctx.creator];
        if (o.set) return o.feeBps;
        if (ctx.budget == address(0)) return STANDARD_FEE;

        o = feeOverrides[ctx.budget];
        if (o.set) return o.feeBps;
        return STANDARD_FEE;
    }

    function _setFee(address account, uint64 feeBps) internal {
        if (feeBps > MAX_FEE_BPS) revert FeeTooHigh();
        feeOverrides[account] = FeeOverride({set: true, feeBps: feeBps});
        emit FeeOverrideSet(account, feeBps);
    }
}
