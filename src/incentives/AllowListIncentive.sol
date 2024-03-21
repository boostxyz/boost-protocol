// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {LibZip} from "lib/solady/src/utils/LibZip.sol";

import {BoostError} from "src/shared/BoostError.sol";

import {SimpleAllowList} from "src/allowlists/SimpleAllowList.sol";
import {Incentive} from "src/incentives/Incentive.sol";

/// @title SimpleAllowList Incentive
/// @notice An incentive implementation that grants the claimer a slot on an {SimpleAllowList}
/// @dev In order for any claim to be successful:
///     - The claimer must not already be on the allow list; and
///     - The maximum number of claims must not have been reached; and
///     - This contract must be authorized to modify the allow list
contract AllowListIncentive is Incentive {
    using LibZip for bytes;

    /// @notice The payload for initializing an AllowListIncentive
    struct InitPayload {
        SimpleAllowList allowList;
        uint256 limit;
    }

    /// @notice The SimpleAllowList contract
    SimpleAllowList public allowList;

    /// @notice The maximum number of claims that can be made (one per address)
    uint256 public limit;

    /// @notice Construct a new AllowListIncentive
    /// @dev Because this contract is a base implementation, it should not be initialized through the constructor. Instead, it should be cloned and initialized using the {initialize} function.
    constructor() {
        _disableInitializers();
    }

    /// @notice Initialize the contract with the incentive parameters
    /// @param data_ The compressed initialization data `(SimpleAllowList allowList, uint256 limit)`
    function initialize(bytes calldata data_) public override initializer {
        InitPayload memory init_ = abi.decode(data_.cdDecompress(), (InitPayload));
        _initializeOwner(msg.sender);
        allowList = init_.allowList;
        limit = init_.limit;
    }

    /// @inheritdoc Incentive
    /// @notice Claim a slot on the {SimpleAllowList}
    /// @param data_ The claim data
    function claim(bytes calldata data_) external virtual override onlyOwner returns (bool) {
        ClaimPayload memory claim_ = abi.decode(data_.cdDecompress(), (ClaimPayload));
        if (claims++ >= limit || claimed[claim_.target]) revert NotClaimable();
        claimed[claim_.target] = true;

        (address[] memory users, bool[] memory allowed) = _makeAllowListPayload(claim_.target);

        allowList.setAllowed(users, allowed);
        return true;
    }

    /// @inheritdoc Incentive
    /// @dev Not a valid operation for this type of incentive
    function reclaim(bytes calldata) external pure override returns (bool) {
        revert BoostError.NotImplemented();
    }

    /// @inheritdoc Incentive
    function isClaimable(bytes calldata data_) external view virtual override returns (bool) {
        ClaimPayload memory claim_ = abi.decode(data_.cdDecompress(), (ClaimPayload));
        return claims < limit && !claimed[claim_.target] && !allowList.isAllowed(claim_.target, "");
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
}
