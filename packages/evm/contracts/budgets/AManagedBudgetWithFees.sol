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

    /// @notice Pays the management fee for a specific boost and incentive
    /// @param boostId The ID of the boost for which the management fee is being paid
    /// @param incentiveId The ID of the incentive within the boost
    /// @dev The function checks the type of incentive and ensures that the claims have reached the limit
    /// or the balance is zero before transferring the management fee to the boost owner
    /// @dev Supports management fee payouts for {@link AERC20Incentive} and {@link AERC20VariableIncentive} deployments
    function payManagementFee(uint256 boostId, uint256 incentiveId) external virtual;

    /// @notice Claws back assets from a target and pays the management fee for a specific boost and incentive
    /// @param target The address of the target from which assets are being clawed back
    /// @param data_ The packed data for the clawback request
    /// @param boostId The ID of the boost
    /// @param incentiveId The ID of the incentive within the boost for which the management fee is being paid
    /// @return amount The amount of assets clawed back
    /// @return asset The address of the asset clawed back
    /// @dev This function first claws back assets from the target and then pays
    /// the management fee for the specified boost and incentive
    function clawbackFromTargetAndPayFee(address target, bytes calldata data_, uint256 boostId, uint256 incentiveId)
        external
        virtual
        returns (uint256 amount, address asset);

    /// @inheritdoc ACloneable
    function supportsInterface(bytes4 interfaceId) public view virtual override(AManagedBudget) returns (bool) {
        return interfaceId == type(AManagedBudgetWithFees).interfaceId || super.supportsInterface(interfaceId);
    }

    /// @inheritdoc ACloneable
    function getComponentInterface() public pure virtual override returns (bytes4) {
        return type(AManagedBudgetWithFees).interfaceId;
    }
}
