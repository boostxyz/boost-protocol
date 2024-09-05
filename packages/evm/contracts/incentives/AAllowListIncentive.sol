// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {BoostError} from "contracts/shared/BoostError.sol";
import {Cloneable} from "contracts/shared/Cloneable.sol";

import {SimpleAllowList} from "contracts/allowlists/SimpleAllowList.sol";
import {Incentive} from "contracts/incentives/Incentive.sol";

/// @title SimpleAllowList Incentive
/// @notice An incentive implementation that grants the claimer a slot on an {SimpleAllowList}
/// @dev In order for any claim to be successful:
///     - The claimer must not already be on the allow list; and
///     - The maximum number of claims must not have been reached; and
///     - This contract must be authorized to modify the allow list
abstract contract AAllowListIncentive is Incentive {
    /// @notice The SimpleAllowList contract
    SimpleAllowList public allowList;

    /// @notice The maximum number of claims that can be made (one per address)
    uint256 public limit;

    /// @inheritdoc Incentive
    /// @notice Claim a slot on the {SimpleAllowList}
    /// @param claimTarget the entity receiving the payout
    function claim(address claimTarget, bytes calldata) external virtual override onlyOwner returns (bool) {
        if (claims++ >= limit || claimed[claimTarget]) revert NotClaimable();
        claimed[claimTarget] = true;

        (address[] memory users, bool[] memory allowed) = _makeAllowListPayload(claimTarget);

        allowList.setAllowed(users, allowed);
        return true;
    }

    /// @inheritdoc Incentive
    /// @dev Not a valid operation for this type of incentive
    function clawback(bytes calldata) external pure override returns (bool) {
        revert BoostError.NotImplemented();
    }

    /// @inheritdoc Incentive
    function isClaimable(address claimTarget, bytes calldata) external view virtual override returns (bool) {
        return claims < limit && !claimed[claimTarget] && !allowList.isAllowed(claimTarget, "");
    }

    /// @inheritdoc Incentive
    /// @dev No preflight approval is required for this incentive (no tokens are handled)
    function preflight(bytes calldata) external pure override returns (bytes memory) {
        return new bytes(0);
    }

    /// @notice Create the payload for the SimpleAllowList
    /// @param target_ The target address to add to the allow list
    /// @return A tuple of users and allowed statuses
    function _makeAllowListPayload(address target_) internal pure returns (address[] memory, bool[] memory) {
        address[] memory users = new address[](1);
        bool[] memory allowed = new bool[](1);
        users[0] = target_;
        allowed[0] = true;
        return (users, allowed);
    }

    /// @inheritdoc Cloneable
    function getComponentInterface() public pure virtual override(Cloneable) returns (bytes4) {
        return type(AAllowListIncentive).interfaceId;
    }

    /// @inheritdoc Cloneable
    function supportsInterface(bytes4 interfaceId) public view virtual override(Incentive) returns (bool) {
        return interfaceId == type(AAllowListIncentive).interfaceId || super.supportsInterface(interfaceId);
    }
}
