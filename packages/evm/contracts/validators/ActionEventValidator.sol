// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {AActionEventValidator} from "contracts/validators/AActionEventValidator.sol";

contract ActionEventValidator is AActionEventValidator {
    event ActionEventInitialized(bytes4 indexed eventSignature, uint8 actionType, Criteria[4] actionParameters);

    /// @notice Initialize the contract with the list of authorized signers and the ActionEvent
    /// @param data_ The compressed data containing the list of authorized signers and the ActionEvent
    /// @dev The first address in the list will be the initial owner of the contract
    function initialize(bytes calldata data_) public virtual override initializer {
        (address[] memory signers_, ActionEvent memory actionEvent_) = abi.decode(data_, (address[], ActionEvent));

        _initializeOwner(signers_[0]);
        for (uint256 i = 0; i < signers_.length; i++) {
            signers[signers_[i]] = true;
        }

        require(actionEvent_.eventSignature != bytes4(0), "Invalid event signature");
        require(bytes(actionTypeMapping[actionEvent_.actionType]).length != 0, "Invalid action type");

        actionEvent = actionEvent_;

        emit ActionEventInitialized(actionEvent.eventSignature, actionEvent.actionType, actionEvent.actionParameters);
    }
}
