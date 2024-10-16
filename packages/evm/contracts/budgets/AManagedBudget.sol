// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {IERC1155Receiver} from "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import {IERC1155} from "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";

import {OwnableRoles} from "@solady/auth/OwnableRoles.sol";

import {ABudget} from "contracts/budgets/ABudget.sol";
import {ACloneable} from "contracts/shared/ACloneable.sol";
import {AIncentive} from "contracts/incentives/AIncentive.sol";
import {IClaw} from "contracts/shared/IClaw.sol";

/// @title Abstract Managed ABudget
/// @notice A minimal budget implementation that simply holds and distributes tokens (ERC20-like and native)
/// @dev This type of budget supports ETH, ERC20, and ERC1155 assets only
abstract contract AManagedBudget is ABudget, IERC1155Receiver {
    /// @notice Get the total amount of ERC1155 assets allocated to the budget, including any that have been distributed
    /// @param asset_ The address of the asset
    /// @param tokenId_ The ID of the token
    /// @return The total amount of assets
    function total(address asset_, uint256 tokenId_) external view virtual returns (uint256);

    /// @notice Get the amount of ERC1155 assets available for distribution from the budget
    /// @param asset_ The address of the asset
    /// @param tokenId_ The ID of the token
    /// @return The amount of assets available
    function available(address asset_, uint256 tokenId_) public view virtual returns (uint256);

    /// @notice Get the amount of ERC1155 assets that have been distributed from the budget
    /// @param asset_ The address of the asset
    /// @param tokenId_ The ID of the token
    /// @return The amount of assets distributed
    function distributed(address asset_, uint256 tokenId_) external view virtual returns (uint256);

    // Optionally override the function if needed
    function clawbackFromTarget(address target, bytes calldata data_, uint256 boostId, uint256 incentiveId)
        external
        virtual
        override
        onlyAuthorized
        returns (uint256, address)
    {
        AIncentive.ClawbackPayload memory payload = AIncentive.ClawbackPayload({target: address(this), data: data_});

        return IClaw(target).clawback(abi.encode(payload), boostId, incentiveId);
    }

    /// @inheritdoc ACloneable
    function supportsInterface(bytes4 interfaceId) public view virtual override(ABudget, IERC165) returns (bool) {
        return interfaceId == type(AManagedBudget).interfaceId || interfaceId == type(IERC1155Receiver).interfaceId
            || interfaceId == type(IERC165).interfaceId || ABudget.supportsInterface(interfaceId);
    }

    /// @inheritdoc ACloneable
    function getComponentInterface() public pure virtual override returns (bytes4) {
        return type(AManagedBudget).interfaceId;
    }
}
