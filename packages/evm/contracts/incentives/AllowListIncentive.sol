// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Ownable as AOwnable} from "@solady/auth/Ownable.sol";

import {BoostError} from "contracts/shared/BoostError.sol";
import {ACloneable} from "contracts/shared/ACloneable.sol";

import {SimpleAllowList} from "contracts/allowlists/SimpleAllowList.sol";
import {AAllowListIncentive} from "contracts/incentives/AAllowListIncentive.sol";
import {AIncentive} from "contracts/incentives/AIncentive.sol";

/// @title SimpleAllowList AIncentive
/// @notice An incentive implementation that grants the claimer a slot on an {SimpleAllowList}
/// @dev In order for any claim to be successful:
///     - The claimer must not already be on the allow list; and
///     - The maximum number of claims must not have been reached; and
///     - This contract must be authorized to modify the allow list
contract AllowListIncentive is AOwnable, AAllowListIncentive {
    /// @notice The payload for initializing an AllowListIncentive
    struct InitPayload {
        SimpleAllowList allowList;
        uint256 limit;
    }

    /// @notice Construct a new AllowListIncentive
    /// @dev Because this contract is a base implementation, it should not be initialized through the constructor. Instead, it should be cloned and initialized using the {initialize} function.
    constructor() {
        _disableInitializers();
    }

    /// @notice Initialize the contract with the incentive parameters
    /// @param data_ The packed initialization data `(SimpleAllowList allowList, uint256 limit)`
    function initialize(bytes calldata data_) public override initializer {
        InitPayload memory init_ = abi.decode(data_, (InitPayload));
        _initializeOwner(msg.sender);
        allowList = init_.allowList;
        limit = init_.limit;
    }

    /// @inheritdoc AIncentive
    /// @notice Claim a slot on the {SimpleAllowList}
    /// @param claimTarget the entity receiving the payout
    function claim(address claimTarget, bytes calldata) external virtual override onlyOwner returns (bool) {
        if (claims++ >= limit || claimed[claimTarget]) revert NotClaimable();
        claimed[claimTarget] = true;

        (address[] memory users, bool[] memory allowed) = _makeAllowListPayload(claimTarget);

        allowList.setAllowed(users, allowed);
        return true;
    }

    /// @inheritdoc AIncentive
    /// @dev Not a valid operation for this type of incentive
    function clawback(bytes calldata) external pure override returns (bool) {
        revert BoostError.NotImplemented();
    }

    /// @inheritdoc AIncentive
    function isClaimable(address claimTarget, bytes calldata) external view virtual override returns (bool) {
        return claims < limit && !claimed[claimTarget] && !allowList.isAllowed(claimTarget, "");
    }

    /// @inheritdoc AIncentive
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
}
