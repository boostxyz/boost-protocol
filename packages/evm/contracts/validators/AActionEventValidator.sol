// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {SignatureCheckerLib} from "@solady/utils/SignatureCheckerLib.sol";
import {IERC1271} from "@openzeppelin/contracts/interfaces/IERC1271.sol";

import {Cloneable} from "contracts/shared/Cloneable.sol";
import {BoostError} from "contracts/shared/BoostError.sol";
import {BoostError} from "contracts/shared/BoostError.sol";

import {SignerValidator} from "contracts/validators/SignerValidator.sol";
import {ASignerValidator} from "contracts/validators/ASignerValidator.sol";
import {Validator} from "contracts/validators/Validator.sol";


contract AActionEventValidator is SignerValidator {
    ActionEvent internal actionEvent;

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

    function getActionEvent() public view returns (ActionEvent memory) {
        return actionEvent;
    }

    /// @inheritdoc Cloneable
    function getComponentInterface() public pure virtual override(Validator) returns (bytes4) {
        return type(AActionEventValidator).interfaceId;
    }

    /// @inheritdoc Cloneable
    function supportsInterface(bytes4 interfaceId) public view virtual override(ASignerValidator, Validator) returns (bool) {
        return interfaceId == type(AActionEventValidator).interfaceId || super.supportsInterface(interfaceId);
    }
}
