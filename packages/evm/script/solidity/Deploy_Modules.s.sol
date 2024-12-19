// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import "./Util.s.sol";

import {LibClone} from "@solady/utils/LibClone.sol";

import {BoostCore} from "contracts/BoostCore.sol";
import {BoostRegistry, ABoostRegistry} from "contracts/BoostRegistry.sol";

import {ManagedBudget} from "contracts/budgets/ManagedBudget.sol";
import {ManagedBudgetWithFees} from "contracts/budgets/ManagedBudgetWithFees.sol";

import {EventAction} from "contracts/actions/EventAction.sol";

import {ERC20Incentive} from "contracts/incentives/ERC20Incentive.sol";
import {ERC20PeggedIncentive} from "contracts/incentives/ERC20PeggedIncentive.sol";
import {ERC20VariableIncentive} from "contracts/incentives/ERC20VariableIncentive.sol";
import {ERC20VariableCriteriaIncentive} from "contracts/incentives/ERC20VariableCriteriaIncentive.sol";
import {ERC20PeggedVariableCriteriaIncentive} from "contracts/incentives/ERC20PeggedVariableCriteriaIncentive.sol";
import {CGDAIncentive} from "contracts/incentives/CGDAIncentive.sol";
import {PointsIncentive} from "contracts/incentives/PointsIncentive.sol";
import {AllowListIncentive} from "contracts/incentives/AllowListIncentive.sol";

import {SimpleAllowList} from "contracts/allowlists/SimpleAllowList.sol";
import {SimpleDenyList} from "contracts/allowlists/SimpleDenyList.sol";

import {SignerValidator} from "contracts/validators/SignerValidator.sol";
import {IntentValidator} from "contracts/validators/IntentValidator.sol";

import {DestinationSettler} from "contracts/intents/DestinationSettler.sol";

/// @notice this script deploys and registers budgets, actions, and incentives
contract ModuleBaseDeployer is ScriptUtils {
    using stdJson for string;

    string BOOST_DEPLOYMENT_SALT;

    string constant deployJsonKey = "deployJsonKey";
    string deployJson;

    function setUp() external {
        BOOST_DEPLOYMENT_SALT = vm.envString("BOOST_DEPLOYMENT_SALT");
    }

    function run() external {
        console.log("deploying address: ", vm.addr(vm.envUint("SIGNER_PRIVATE_KEY")));
        BoostRegistry registry = _getRegistry();
        console.log("Boost Registry: ", address(registry));

        _deployManagedBudget(registry);
        _deployManagedBudgetWithFees(registry);

        _deployEventAction(registry);

        _deployERC20Incentive(registry);
        _deployERC20VariableIncentive(registry);
        _deployERC20VariableCriteriaIncentive(registry);
        _deployERC20PeggedIncentive(registry);
        _deployERC20PeggedVariableCriteriaIncentive(registry);
        _deployCGDAIncentive(registry);
        _deployPointsIncentive(registry);
        _deployAllowListIncentive(registry);
        _deploySignerValidator(registry);
        _deploySimpleAllowList(registry);
        address denyList = _deploySimpleDenyList(registry);
        _deployOpenAllowList(registry, SimpleDenyList(denyList));
        _deployERC20PeggedIncentive(registry);

        _saveJson();
    }

    function _saveJson() internal {
        vm.writeJson(deployJson, _buildJsonDeployPath());
    }

    function _getRegistry() internal returns (BoostRegistry registry) {
        string memory path =
            string(abi.encodePacked(vm.projectRoot(), "/deploys/", vm.toString(block.chainid), ".json"));
        deployJson = vm.readFile(path);
        deployJson = deployJsonKey.serialize(deployJson);
        if (!vm.keyExistsJson(deployJson, ".BoostRegistry")) {
            revert("No registry deployed: run `pnpm deploy:core:local");
        }
        return BoostRegistry(deployJson.readAddress(".BoostRegistry"));
    }

    function _deployManagedBudget(BoostRegistry registry) internal returns (address managedBudget) {
        bytes memory initCode = type(ManagedBudget).creationCode;
        managedBudget = _getCreate2Address(initCode, "");
        console.log("ManagedBudget: ", managedBudget);
        deployJson = deployJsonKey.serialize("ManagedBudget", managedBudget);
        bool newDeploy = _deploy2(initCode, "");
        _registerIfNew(newDeploy, "ManagedBudget", managedBudget, registry, ABoostRegistry.RegistryType.BUDGET);
    }

    function _deployManagedBudgetWithFees(BoostRegistry registry) internal returns (address managedBudget) {
        bytes memory initCode = type(ManagedBudgetWithFees).creationCode;
        managedBudget = _getCreate2Address(initCode, "");
        console.log("ManagedBudgetWithFees: ", managedBudget);
        deployJson = deployJsonKey.serialize("ManagedBudgetWithFees", managedBudget);
        bool newDeploy = _deploy2(initCode, "");
        _registerIfNew(newDeploy, "ManagedBudgetWithFees", managedBudget, registry, ABoostRegistry.RegistryType.BUDGET);
    }

    function _deployEventAction(BoostRegistry registry) internal returns (address eventAction) {
        bytes memory initCode = type(EventAction).creationCode;
        eventAction = _getCreate2Address(initCode, "");
        console.log("EventAction: ", eventAction);
        deployJson = deployJsonKey.serialize("EventAction", eventAction);
        bool newDeploy = _deploy2(initCode, "");
        _registerIfNew(newDeploy, "EventAction", eventAction, registry, ABoostRegistry.RegistryType.ACTION);
    }

    function _deployERC20Incentive(BoostRegistry registry) internal returns (address erc20Incentive) {
        bytes memory initCode = type(ERC20Incentive).creationCode;
        erc20Incentive = _getCreate2Address(initCode, "");
        console.log("ERC20Incentive: ", erc20Incentive);
        deployJson = deployJsonKey.serialize("ERC20Incentive", erc20Incentive);
        bool newDeploy = _deploy2(initCode, "");
        _registerIfNew(newDeploy, "ERC20Incentive_2", erc20Incentive, registry, ABoostRegistry.RegistryType.INCENTIVE);
    }

    function _deployERC20PeggedIncentive(BoostRegistry registry) internal returns (address erc20PeggedIncentive) {
        bytes memory initCode = type(ERC20PeggedIncentive).creationCode;
        erc20PeggedIncentive = _getCreate2Address(initCode, "");
        console.log("ERC20PeggedIncentive: ", erc20PeggedIncentive);
        deployJson = deployJsonKey.serialize("ERC20PeggedIncentive", erc20PeggedIncentive);
        bool newDeploy = _deploy2(initCode, "");
        _registerIfNew(newDeploy, "ERC20PeggedIncentive_2", erc20PeggedIncentive, registry, ABoostRegistry.RegistryType.INCENTIVE);
    }

    function _deployERC20PeggedVariableCriteriaIncentive(BoostRegistry registry) internal returns (address erc20PeggedVariableCriteriaIncentive) {
        bytes memory initCode = type(ERC20PeggedVariableCriteriaIncentive).creationCode;
        erc20PeggedVariableCriteriaIncentive = _getCreate2Address(initCode, "");
        console.log("ERC20PeggedVariableCriteriaIncentive: ", erc20PeggedVariableCriteriaIncentive);
        deployJson = deployJsonKey.serialize("ERC20PeggedVariableCriteriaIncentive", erc20PeggedVariableCriteriaIncentive);
        bool newDeploy = _deploy2(initCode, "");
        _registerIfNew(newDeploy, "ERC20PeggedVariableCriteriaIncentive_2", erc20PeggedVariableCriteriaIncentive, registry, ABoostRegistry.RegistryType.INCENTIVE);
    }

    function _deployERC20VariableIncentive(BoostRegistry registry) internal returns (address erc20VariableIncentive) {
        bytes memory initCode = type(ERC20VariableIncentive).creationCode;
        erc20VariableIncentive = _getCreate2Address(initCode, "");
        console.log("ERC20VariableIncentive: ", erc20VariableIncentive);
        deployJson = deployJsonKey.serialize("ERC20VariableIncentive", erc20VariableIncentive);
        bool newDeploy = _deploy2(initCode, "");
        _registerIfNew(
            newDeploy, "ERC20VariableIncentive_2", erc20VariableIncentive, registry, ABoostRegistry.RegistryType.INCENTIVE
        );
    }

    function _deployERC20VariableCriteriaIncentive(BoostRegistry registry)
        internal
        returns (address erc20VariableCriteriaIncentive)
    {
        bytes memory initCode = type(ERC20VariableCriteriaIncentive).creationCode;
        erc20VariableCriteriaIncentive = _getCreate2Address(initCode, "");
        console.log("ERC20VariableCriteriaIncentive: ", erc20VariableCriteriaIncentive);
        deployJson = deployJsonKey.serialize("ERC20VariableCriteriaIncentive", erc20VariableCriteriaIncentive);
        bool newDeploy = _deploy2(initCode, "");
        _registerIfNew(
            newDeploy,
            "ERC20VariableCriteriaIncentive_2",
            erc20VariableCriteriaIncentive,
            registry,
            ABoostRegistry.RegistryType.INCENTIVE
        );
    }

    function _deployCGDAIncentive(BoostRegistry registry) internal returns (address cgdaIncentive) {
        bytes memory initCode = type(CGDAIncentive).creationCode;
        cgdaIncentive = _getCreate2Address(initCode, "");
        console.log("CGDAIncentive: ", cgdaIncentive);
        deployJson = deployJsonKey.serialize("CGDAIncentive", cgdaIncentive);
        bool newDeploy = _deploy2(initCode, "");
        _registerIfNew(newDeploy, "CGDAIncentive_2", cgdaIncentive, registry, ABoostRegistry.RegistryType.INCENTIVE);
    }

    function _deployPointsIncentive(BoostRegistry registry) internal returns (address pointsIncentive) {
        bytes memory initCode = type(PointsIncentive).creationCode;
        pointsIncentive = _getCreate2Address(initCode, "");
        console.log("PointsIncentive: ", pointsIncentive);
        deployJson = deployJsonKey.serialize("PointsIncentive", pointsIncentive);
        bool newDeploy = _deploy2(initCode, "");
        _registerIfNew(newDeploy, "PointsIncentive_2", pointsIncentive, registry, ABoostRegistry.RegistryType.INCENTIVE);
    }

    function _deployAllowListIncentive(BoostRegistry registry) internal returns (address allowListIncentive) {
        bytes memory initCode = type(AllowListIncentive).creationCode;
        allowListIncentive = _getCreate2Address(initCode, "");
        console.log("AllowListIncentive: ", allowListIncentive);
        deployJson = deployJsonKey.serialize("AllowListIncentive", allowListIncentive);
        bool newDeploy = _deploy2(initCode, "");
        _registerIfNew(
            newDeploy, "AllowListIncentive_2", allowListIncentive, registry, ABoostRegistry.RegistryType.INCENTIVE
        );
    }

    function _deploySignerValidator(BoostRegistry registry) internal returns (address signerValidator) {
        bytes memory initCode = type(SignerValidator).creationCode;
        signerValidator = _getCreate2Address(initCode, "");
        console.log("SignerValidator: ", signerValidator);
        deployJson = deployJsonKey.serialize("SignerValidator", signerValidator);
        bool newDeploy = _deploy2(initCode, "");
        _registerIfNew(newDeploy, "SignerValidator", signerValidator, registry, ABoostRegistry.RegistryType.VALIDATOR);
    }

    function _deploySimpleAllowList(BoostRegistry registry) internal returns (address simpleAllowList) {
        bytes memory initCode = type(SimpleAllowList).creationCode;
        simpleAllowList = _getCreate2Address(initCode, "");
        console.log("SimpleAllowList: ", simpleAllowList);
        deployJson = deployJsonKey.serialize("SimpleAllowList", simpleAllowList);
        bool newDeploy = _deploy2(initCode, "");
        _registerIfNew(newDeploy, "SimpleAllowList", simpleAllowList, registry, ABoostRegistry.RegistryType.ALLOW_LIST);
    }

    function _deployOpenAllowList(BoostRegistry registry, SimpleDenyList baseDenyList)
        internal
        returns (address list)
    {
        list = _getDeterministicCloneAddress(baseDenyList);
        console.log("OpenAllowList: ", list);
        deployJson = deployJsonKey.serialize("OpenAllowList", list);
        bool newDeploy = _clone2(baseDenyList);

        address[] memory users = new address[](0);
        bytes memory data = abi.encode(address(0), users);
        SimpleDenyList(list).initialize(data);

        _registerIfNew(newDeploy, "OpenAllowList", list, registry, ABoostRegistry.RegistryType.ALLOW_LIST);
    }

    function _deploySimpleDenyList(BoostRegistry registry) internal returns (address simpleDenyList) {
        bytes memory initCode = type(SimpleDenyList).creationCode;
        simpleDenyList = _getCreate2Address(initCode, "");
        console.log("SimpleDenyList: ", simpleDenyList);
        deployJson = deployJsonKey.serialize("SimpleDenyList", simpleDenyList);
        bool newDeploy = _deploy2(initCode, "");

        _registerIfNew(newDeploy, "SimpleDenyList", simpleDenyList, registry, ABoostRegistry.RegistryType.ALLOW_LIST);
    }

    function _deployIntentValidator(BoostRegistry registry) internal returns (address intentValidator) {
        // Deploy DestinationSettler since it's an input to IntentValidator
        bytes memory settlerInitCode = type(DestinationSettler).creationCode;
        address settler = _getCreate2Address(settlerInitCode, "");
        console.log("DestinationSettler: ", settler);
        deployJson = deployJsonKey.serialize("DestinationSettler", settler);
        _deploy2(settlerInitCode, "");

        bytes memory initCode = type(IntentValidator).creationCode;
        intentValidator = _getCreate2Address(initCode, "");
        console.log("SimpleDenyList: ", intentValidator);
        deployJson = deployJsonKey.serialize("IntentValidator", intentValidator);
        bool newDeploy = _deploy2(initCode, "");

        _registerIfNew(newDeploy, "IntentValidator", intentValidator, registry, ABoostRegistry.RegistryType.VALIDATOR);
    }
}
