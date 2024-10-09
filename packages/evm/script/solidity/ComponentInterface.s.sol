// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import "./Util.s.sol";

import {LibString} from "@solady/utils/LibString.sol";

import {ACloneable} from "contracts/shared/ACloneable.sol";

import {ABudget} from "contracts/budgets/ABudget.sol";
import {AManagedBudget} from "contracts/budgets/AManagedBudget.sol";
import {AVestingBudget} from "contracts/budgets/AVestingBudget.sol";

import {ASignerValidator} from "contracts/validators/ASignerValidator.sol";

import {AEventAction} from "contracts/actions/EventAction.sol";

import {AAllowListIncentive} from "contracts/incentives/AllowListIncentive.sol";
import {ACGDAIncentive} from "contracts/incentives/CGDAIncentive.sol";
import {AERC20Incentive} from "contracts/incentives/ERC20Incentive.sol";
import {AIncentive} from "contracts/incentives/AIncentive.sol";
import {AERC20VariableIncentive} from "contracts/incentives/ERC20VariableIncentive.sol";
import {APointsIncentive} from "contracts/incentives/PointsIncentive.sol";

import {ASimpleAllowList} from "contracts/allowlists/SimpleAllowList.sol";
import {ASimpleDenyList} from "contracts/allowlists/SimpleDenyList.sol";

contract LogComponentInterface is ScriptUtils {
    using stdJson for string;
    using LibString for uint256;

    string constant componentJsonKey = "componentJsonKey";
    string componentJson;

    function run() public {
        _getInterfaceAEventAction();
        _getInterfaceAERC20Incentive();
        _getInterfaceACloneable();
        _getInterfaceABudget();
        _getInterfaceAManagedBudget();
        _getInterfaceAVestingBudget();
        _getInterfaceASignerValidator();
        _getInterfaceAAllowListIncentive();
        _getInterfaceACGDAIncentive();
        _getInterfaceAIncentive();
        _getInterfaceAERC20VariableIncentive();
        _getInterfaceAPointsIncentive();
        _getInterfaceASimpleAllowList();
        _getInterfaceASimpleDenyList();

        _saveJson();
    }

    function _buildJsonDeployPath() internal view override returns (string memory) {
        return string(abi.encodePacked(vm.projectRoot(), "/deploys/componentInterfaces.json"));
    }

    function _saveJson() internal {
        vm.writeJson(componentJson, _buildJsonDeployPath());
    }

    function _getInterfaceAManagedBudget() internal {
        string memory interfaceId = uint256(uint32(type(AManagedBudget).interfaceId)).toHexString(4);
        componentJson = componentJsonKey.serialize("AManagedBudget", interfaceId);
    }

    function _getInterfaceAEventAction() internal {
        string memory interfaceId = uint256(uint32(type(AEventAction).interfaceId)).toHexString(4);
        componentJson = componentJsonKey.serialize("AEventAction", interfaceId);
    }

    function _getInterfaceAERC20Incentive() internal {
        string memory interfaceId = uint256(uint32(type(AERC20Incentive).interfaceId)).toHexString(4);
        componentJson = componentJsonKey.serialize("AERC20Incentive", interfaceId);
    }

    function _getInterfaceACloneable() internal {
        string memory interfaceId = uint256(uint32(type(ACloneable).interfaceId)).toHexString(4);
        componentJson = componentJsonKey.serialize("ACloneable", interfaceId);
    }

    function _getInterfaceABudget() internal {
        string memory interfaceId = uint256(uint32(type(ABudget).interfaceId)).toHexString(4);
        componentJson = componentJsonKey.serialize("ABudget", interfaceId);
    }

    function _getInterfaceAVestingBudget() internal {
        string memory interfaceId = uint256(uint32(type(AVestingBudget).interfaceId)).toHexString(4);
        componentJson = componentJsonKey.serialize("AVestingBudget", interfaceId);
    }

    function _getInterfaceASignerValidator() internal {
        string memory interfaceId = uint256(uint32(type(ASignerValidator).interfaceId)).toHexString(4);
        componentJson = componentJsonKey.serialize("ASignerValidator", interfaceId);
    }

    function _getInterfaceAAllowListIncentive() internal {
        string memory interfaceId = uint256(uint32(type(AAllowListIncentive).interfaceId)).toHexString(4);
        componentJson = componentJsonKey.serialize("AAllowListIncentive", interfaceId);
    }

    function _getInterfaceACGDAIncentive() internal {
        string memory interfaceId = uint256(uint32(type(ACGDAIncentive).interfaceId)).toHexString(4);
        componentJson = componentJsonKey.serialize("ACGDAIncentive", interfaceId);
    }

    function _getInterfaceAIncentive() internal {
        string memory interfaceId = uint256(uint32(type(AIncentive).interfaceId)).toHexString(4);
        componentJson = componentJsonKey.serialize("AIncentive", interfaceId);
    }

    function _getInterfaceAERC20VariableIncentive() internal {
        string memory interfaceId = uint256(uint32(type(AERC20VariableIncentive).interfaceId)).toHexString(4);
        componentJson = componentJsonKey.serialize("AERC20VariableIncentive", interfaceId);
    }

    function _getInterfaceAPointsIncentive() internal {
        string memory interfaceId = uint256(uint32(type(APointsIncentive).interfaceId)).toHexString(4);
        componentJson = componentJsonKey.serialize("APointsIncentive", interfaceId);
    }

    function _getInterfaceASimpleAllowList() internal {
        string memory interfaceId = uint256(uint32(type(ASimpleAllowList).interfaceId)).toHexString(4);
        componentJson = componentJsonKey.serialize("ASimpleAllowList", interfaceId);
    }

    function _getInterfaceASimpleDenyList() internal {
        string memory interfaceId = uint256(uint32(type(ASimpleDenyList).interfaceId)).toHexString(4);
        componentJson = componentJsonKey.serialize("ASimpleDenyList", interfaceId);
    }
}
