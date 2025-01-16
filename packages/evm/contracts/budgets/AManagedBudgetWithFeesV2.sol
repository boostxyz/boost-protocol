// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {AManagedBudgetWithFees} from "contracts/budgets/AManagedBudgetWithFees.sol";
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

/// @title Managed Budget with Fees Version 2
/// @notice This contract inherits from AManagedBudgetWithFees and can be extended with additional functionality
abstract contract AManagedBudgetWithFeesV2 is AManagedBudgetWithFees {
    /// @dev allowlisted core instances
    mapping(BoostCore => bool) public coreAllowed;

    /// @dev Emitted when BoostCore changes
    event BoostCoreUpdated(address boostCore);

    /// @inheritdoc ACloneable
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(AManagedBudgetWithFees)
        returns (bool)
    {
        return interfaceId == type(AManagedBudgetWithFees).interfaceId || super.supportsInterface(interfaceId);
    }

    /// @notice Pays the management fee for a specific boost and incentive
    /// @param core BoostCore Address to the boost is located on
    /// @param boostId The ID of the boost for which the management fee is being paid
    /// @param incentiveId The ID of the incentive within the boost
    /// @dev The function checks the type of incentive and ensures that the claims have reached the limit
    /// or the balance is zero before transferring the management fee to the boost owner
    /// @dev Supports management fee payouts for {@link AERC20Incentive} and {@link AERC20VariableIncentive} deployments
    function payManagementFee(BoostCore core, uint256 boostId, uint256 incentiveId) external virtual;

    /// @notice Claws back assets from a target and pays the management fee for a specific boost and incentive
    /// @param target The address of the target from which assets are being clawed back
    /// @param data_ The packed data for the clawback request
    /// @param core BoostCore Address to the boost is located on
    /// @param boostId The ID of the boost
    /// @param incentiveId The ID of the incentive within the boost for which the management fee is being paid
    /// @return amount The amount of assets clawed back
    /// @return asset The address of the asset clawed back
    /// @dev This function first claws back assets from the target and then pays
    /// the management fee for the specified boost and incentive
    function clawbackFromTargetAndPayFee(
        address target,
        bytes calldata data_,
        BoostCore core,
        uint256 boostId,
        uint256 incentiveId
    ) external virtual returns (uint256 amount, address asset);

    /// @notice sets the current BoostCore instance
    /// @param core the address of the new BoostCore instance to default to
    /// @dev older boost core instances can be accessed via the override functions with the `core` param
    function setCore(address core) external virtual;

    /// @inheritdoc ACloneable
    function getComponentInterface() public pure virtual override returns (bytes4) {
        return type(AManagedBudgetWithFeesV2).interfaceId;
    }
}
