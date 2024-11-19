// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {IERC1155Receiver} from "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import {IERC1155} from "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";

import {OwnableRoles} from "@solady/auth/OwnableRoles.sol";

import {ABudget} from "contracts/budgets/ABudget.sol";
import {AManagedBudget} from "contracts/budgets/AManagedBudget.sol";
import {ACloneable} from "contracts/shared/ACloneable.sol";
import {AIncentive} from "contracts/incentives/AIncentive.sol";
import {BoostCore} from "contracts/BoostCore.sol";
import {IClaw} from "contracts/shared/IClaw.sol";

/// @title Abstract Managed ABudget
/// @notice A minimal budget implementation that simply holds and distributes tokens (ERC20-like and native)
/// @dev This type of budget supports ETH, ERC20, and ERC1155 assets only
abstract contract AManagedBudgetWithFees is AManagedBudget {
    /// @dev the core contract used to get boost creator info
    BoostCore internal core;

    /// @dev The management fee percentage (in basis points, i.e., 100 = 1%)
    uint256 public managementFee;

    /// @dev Mapping of incentive addresses to their respective amounts
    mapping(address => uint256) public incentiveFees;

    /// @dev Total amount of funds reserved for management fees
    mapping(address => uint256) public reservedFunds;

    /// @dev Emitted when the management fee is set or updated
    event ManagementFeeSet(uint256 newFee);

    /// @dev Emitted when management fee is paid
    event ManagementFeePaid(
        uint256 indexed questId, uint256 indexed incentiveId, address indexed manager, uint256 amount
    );

    /// @inheritdoc ACloneable
    function supportsInterface(bytes4 interfaceId) public view virtual override(AManagedBudget) returns (bool) {
        return interfaceId == type(AManagedBudgetWithFees).interfaceId || super.supportsInterface(interfaceId);
    }

    /// @inheritdoc ACloneable
    function getComponentInterface() public pure virtual override returns (bytes4) {
        return type(AManagedBudgetWithFees).interfaceId;
    }
}
