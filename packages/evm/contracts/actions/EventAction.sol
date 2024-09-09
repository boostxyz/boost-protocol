// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {ERC721} from "@solady/tokens/ERC721.sol";

import {ACloneable} from "contracts/shared/ACloneable.sol";
import {BoostError} from "contracts/shared/BoostError.sol";

import {AEventAction} from "contracts/actions/AEventAction.sol";

contract EventAction is AEventAction {
    /// @notice The payload for initializing an EventAction
    /// @param actionClaimant The payload describing how claimants are identified
    /// @param actionEventOne The first event criteria to validate with
    /// @param actionEventTwo The second event criteria to validate with
    /// @param actionEventThree The third event criteria to validate with
    /// @param actionEventFour The fourth event criteria to validate with
    struct InitPayload {
        ActionClaimant actionClaimant;
        ActionEvent actionEventOne;
        ActionEvent actionEventTwo;
        ActionEvent actionEventThree;
        ActionEvent actionEventFour;
    }

    constructor() {
        _disableInitializers();
    }

    /// @inheritdoc ACloneable
    /// @notice Initialize the contract with the owner and the required data
    function initialize(bytes calldata data_) public virtual override initializer {
        _initialize(abi.decode(data_, (InitPayload)));
    }

    function _initialize(InitPayload memory init_) internal virtual onlyInitializing {
        actionClaimant = init_.actionClaimant;
        actionEvents.push(init_.actionEventOne);
        actionEvents.push(init_.actionEventTwo);
        actionEvents.push(init_.actionEventThree);
        actionEvents.push(init_.actionEventFour);
    }

    /// @notice Prepare the action for execution and return the expected payload
    /// @return bytes_ The encoded payload to be sent to the target contract
    /// @dev Note that the mint value is NOT included in the prepared payload but must be sent with the call
    function prepare(bytes calldata) public view virtual override returns (bytes memory) {
        // Since this action is marshalled off-chain we don't need to prepare the payload
        revert BoostError.NotImplemented();
    }

    function execute(bytes calldata) external payable virtual override returns (bool, bytes memory) {
        // Since this action is marshalled off-chain we don't need to execute the payload
        revert BoostError.NotImplemented();
    }

    function getActionEventsCount() public view virtual override returns (uint256) {
        return actionEvents.length;
    }

    function getActionEvent(uint256 index) public view virtual override returns (ActionEvent memory) {
        return actionEvents[index];
    }

    function getActionEvents() public view virtual override returns (ActionEvent[] memory) {
        return actionEvents;
    }

    function getActionClaimant() public view virtual override returns (ActionClaimant memory) {
        return actionClaimant;
    }
}
