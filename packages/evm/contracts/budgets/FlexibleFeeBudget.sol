// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {ManagedBudget} from "./ManagedBudget.sol";

import {SafeTransferLib} from "@solady/utils/SafeTransferLib.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @title ManagedBudget with Flexible Fee Management
/// @notice Extends ManagedBudget to support flexible fee structures
contract FlexibleFeeBudget is ManagedBudget {
    using SafeTransferLib for address;

    /// @dev The management fee percentage (in basis points, i.e., 100 = 1%)
    uint256 public managementFee;

    /// @dev Mapping of BoostIDs to their respective managers' addresses
    mapping(uint256 => address) public managers;

    /// @dev Total amount of funds reserved for management fees
    uint256 public reservedFunds;

    /// @dev Emitted when the management fee is set or updated
    event ManagementFeeSet(uint256 newFee);
    
    /// @dev Emitted when management fee is paid
    event ManagementFeePaid(uint256 indexed boostId, address indexed manager, uint256 amount);

    /// @notice Override available to account for reserved fees
    function available(address asset_) public view virtual override returns (uint256) {
        uint256 totalBalance = asset_ == address(0) ? address(this).balance : IERC20(asset_).balanceOf(address(this));
        return totalBalance > reservedFunds ? totalBalance - reservedFunds : 0;
    }

    /// @notice Sets the management fee percentage
    /// @dev Only the owner can call this function. The fee is in basis points (100 = 1%)
    /// @param fee_ The new management fee percentage in basis points
    function setManagementFee(uint256 fee_) external onlyOwner {
        require(fee_ <= 10000, "Fee cannot exceed 100%");
        managementFee = fee_;
        emit ManagementFeeSet(fee_);
    }
}
