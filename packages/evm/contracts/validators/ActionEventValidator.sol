// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {SignatureCheckerLib} from "@solady/utils/SignatureCheckerLib.sol";
import {IERC1271} from "@openzeppelin/contracts/interfaces/IERC1271.sol";
import {BoostError} from "contracts/shared/BoostError.sol";
import {Validator} from "contracts/validators/Validator.sol";
import {SignerValidator} from "contracts/validators/Validator.sol";

// Define Enums
enum FilterType {
    EQUAL,
    NOT_EQUAL,
    GREATER_THAN,
    LESS_THAN
}

enum PrimitiveType {
    UINT,
    ADDRESS,
    BYTES,
    STRING
}

// Define Structs
struct Criteria {
    FilterType filterType;
    PrimitiveType fieldType;
    bytes filterData;
}

struct ActionEvent {
    bytes4 eventSignature;
    uint8 actionType;
    Criteria[4] actionParameters;
}

contract ActionEventValidator is SignerValidator {
    ActionEvent private actionEvent;

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

    function getActionEvent() public view returns (ActionEvent memory) {
        return actionEvent;
    }
}
