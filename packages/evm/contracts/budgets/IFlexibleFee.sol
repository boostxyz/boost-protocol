// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

interface IFlexibleFee {
    /// @dev The management fee percentage (in basis points)
    function managementFee() external view returns (uint256);

    /// @dev Get manager for a specific boost ID
    function managers(uint256 boostId) external view returns (address);

    /// @dev Total amount of funds reserved for management fees
    function reservedFunds() external view returns (uint256);

    /// @dev Emitted when the management fee is set or updated
    event ManagementFeeSet(uint256 newFee);

    /// @dev Emitted when management fee is paid
    event ManagementFeePaid(uint256 indexed boostId, address indexed manager, uint256 amount);
}
