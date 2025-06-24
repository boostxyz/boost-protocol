// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import "./Util.s.sol";

import {LibClone} from "@solady/utils/LibClone.sol";

import {BoostCore} from "contracts/BoostCore.sol";
import {BoostRegistry, ABoostRegistry} from "contracts/BoostRegistry.sol";

import {ManagedBudget} from "contracts/budgets/ManagedBudget.sol";
import {ManagedBudgetWithFeesV2} from "contracts/budgets/ManagedBudgetWithFeesV2.sol";
import {TransparentBudget} from "contracts/budgets/TransparentBudget.sol";

import {EventAction} from "contracts/actions/EventAction.sol";

import {ERC20Incentive} from "contracts/incentives/ERC20Incentive.sol";
import {ERC20PeggedIncentive} from "contracts/incentives/ERC20PeggedIncentive.sol";
import {ERC20VariableIncentive} from "contracts/incentives/ERC20VariableIncentive.sol";
import {ERC20VariableCriteriaIncentive} from "contracts/incentives/ERC20VariableCriteriaIncentive.sol";
import {ERC20VariableCriteriaIncentiveV2} from "contracts/incentives/ERC20VariableCriteriaIncentiveV2.sol";
import {ERC20PeggedVariableCriteriaIncentive} from "contracts/incentives/ERC20PeggedVariableCriteriaIncentive.sol";
import {ERC20PeggedVariableCriteriaIncentiveV2} from "contracts/incentives/ERC20PeggedVariableCriteriaIncentiveV2.sol";
import {CGDAIncentive} from "contracts/incentives/CGDAIncentive.sol";
import {PointsIncentive} from "contracts/incentives/PointsIncentive.sol";
import {AllowListIncentive} from "contracts/incentives/AllowListIncentive.sol";

import {SimpleAllowList} from "contracts/allowlists/SimpleAllowList.sol";
import {SimpleDenyList} from "contracts/allowlists/SimpleDenyList.sol";

import {SignerValidator} from "contracts/validators/SignerValidator.sol";
import {LimitedSignerValidator} from "contracts/validators/LimitedSignerValidator.sol";
import {PayableLimitedSignerValidator} from "contracts/validators/PayableLimitedSignerValidator.sol";

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
        console.log(
            "deploying address: ",
            vm.addr(vm.envUint("SIGNER_PRIVATE_KEY"))
        );
        BoostRegistry registry = _getRegistry();
        console.log("Boost Registry: ", address(registry));

        _deployManagedBudget(registry);
        _deployManagedBudgetWithFees(registry);
        _deployTransparentBudget(registry);

        _deployEventAction(registry);

        _deployERC20Incentive(registry);
        _deployERC20VariableIncentive(registry);
        _deployERC20VariableCriteriaIncentive(registry);
        _deployERC20VariableCriteriaIncentiveV2(registry);
        _deployERC20PeggedIncentive(registry);
        _deployERC20PeggedVariableCriteriaIncentive(registry);
        _deployERC20PeggedVariableCriteriaIncentiveV2(registry);
        _deployCGDAIncentive(registry);
        _deployPointsIncentive(registry);
        _deployAllowListIncentive(registry);
        _deploySignerValidator(registry);
        _deployLimitedSignerValidator(registry);
        _deployPayableLimitedSignerValidator(registry);
        _deploySimpleAllowList(registry);
        address denyList = _deploySimpleDenyList(registry);
        _deployOpenAllowList(registry, SimpleDenyList(denyList));

        _saveJson();
    }

    function _saveJson() internal {
        vm.writeJson(deployJson, _buildJsonDeployPath());
    }

    function _getRegistry() internal returns (BoostRegistry registry) {
        string memory path = string(
            abi.encodePacked(
                vm.projectRoot(),
                "/deploys/",
                vm.toString(block.chainid),
                ".json"
            )
        );
        deployJson = vm.readFile(path);
        deployJson = deployJsonKey.serialize(deployJson);
        if (!vm.keyExistsJson(deployJson, ".BoostRegistry")) {
            revert("No registry deployed: run `pnpm deploy:core:local");
        }
        return BoostRegistry(deployJson.readAddress(".BoostRegistry"));
    }

    function _deployManagedBudget(
        BoostRegistry registry
    ) internal returns (address managedBudget) {
        bytes memory initCode = type(ManagedBudget).creationCode;
        managedBudget = _getCreate2Address(initCode, "");
        console.log("ManagedBudget: ", managedBudget);
        deployJson = deployJsonKey.serialize("ManagedBudget", managedBudget);
        bool newDeploy = _deploy2(initCode, "");
        _registerIfNew(
            newDeploy,
            string(abi.encodePacked("ManagedBudget", managedBudget)),
            managedBudget,
            registry,
            ABoostRegistry.RegistryType.BUDGET
        );
    }

    function _deployManagedBudgetWithFees(
        BoostRegistry registry
    ) internal returns (address managedBudget) {
        bytes memory initCode = type(ManagedBudgetWithFeesV2).creationCode;
        managedBudget = _getCreate2Address(initCode, "");
        console.log("ManagedBudgetWithFees: ", managedBudget);
        deployJson = deployJsonKey.serialize(
            "ManagedBudgetWithFees",
            managedBudget
        );
        bool newDeploy = _deploy2(initCode, "");
        _registerIfNew(
            newDeploy,
            string(abi.encodePacked("ManagedBudgetWithFees", managedBudget)),
            managedBudget,
            registry,
            ABoostRegistry.RegistryType.BUDGET
        );
    }

    function _deployTransparentBudget(
        BoostRegistry registry
    ) internal returns (address transparentBudget) {
        bytes memory initCode = type(TransparentBudget).creationCode;
        transparentBudget = _getCreate2Address(initCode, "");
        console.log("TransparentBudget: ", transparentBudget);
        deployJson = deployJsonKey.serialize(
            "TransparentBudget",
            transparentBudget
        );
        bool newDeploy = _deploy2(initCode, "");
        _registerIfNew(
            newDeploy,
            string(abi.encodePacked("TransparentBudget", transparentBudget)),
            transparentBudget,
            registry,
            ABoostRegistry.RegistryType.BUDGET
        );
    }

    function _deployEventAction(
        BoostRegistry registry
    ) internal returns (address eventAction) {
        bytes memory initCode = type(EventAction).creationCode;
        eventAction = _getCreate2Address(initCode, "");
        console.log("EventAction: ", eventAction);
        deployJson = deployJsonKey.serialize("EventAction", eventAction);
        bool newDeploy = _deploy2(initCode, "");
        _registerIfNew(
            newDeploy,
            string(abi.encodePacked("EventAction", eventAction)),
            eventAction,
            registry,
            ABoostRegistry.RegistryType.ACTION
        );
    }

    function _deployERC20Incentive(
        BoostRegistry registry
    ) internal returns (address erc20Incentive) {
        bytes memory initCode = type(ERC20Incentive).creationCode;
        erc20Incentive = _getCreate2Address(initCode, "");
        console.log("ERC20Incentive: ", erc20Incentive);
        deployJson = deployJsonKey.serialize("ERC20Incentive", erc20Incentive);
        bool newDeploy = _deploy2(initCode, "");
        _registerIfNew(
            newDeploy,
            string(abi.encodePacked("ERC20Incentive", erc20Incentive)),
            erc20Incentive,
            registry,
            ABoostRegistry.RegistryType.INCENTIVE
        );
    }

    function _deployERC20PeggedIncentive(
        BoostRegistry registry
    ) internal returns (address erc20PeggedIncentive) {
        bytes memory initCode = type(ERC20PeggedIncentive).creationCode;
        erc20PeggedIncentive = _getCreate2Address(initCode, "");
        console.log("ERC20PeggedIncentive: ", erc20PeggedIncentive);
        deployJson = deployJsonKey.serialize(
            "ERC20PeggedIncentive",
            erc20PeggedIncentive
        );
        bool newDeploy = _deploy2(initCode, "");
        _registerIfNew(
            newDeploy,
            string(
                abi.encodePacked("ERC20PeggedIncentive", erc20PeggedIncentive)
            ),
            erc20PeggedIncentive,
            registry,
            ABoostRegistry.RegistryType.INCENTIVE
        );
    }

    function _deployERC20PeggedVariableCriteriaIncentive(
        BoostRegistry registry
    ) internal returns (address erc20PeggedVariableCriteriaIncentive) {
        bytes memory initCode = type(ERC20PeggedVariableCriteriaIncentive)
            .creationCode;
        erc20PeggedVariableCriteriaIncentive = _getCreate2Address(initCode, "");
        console.log(
            "ERC20PeggedVariableCriteriaIncentive: ",
            erc20PeggedVariableCriteriaIncentive
        );
        deployJson = deployJsonKey.serialize(
            "ERC20PeggedVariableCriteriaIncentive",
            erc20PeggedVariableCriteriaIncentive
        );
        bool newDeploy = _deploy2(initCode, "");
        _registerIfNew(
            newDeploy,
            string(
                abi.encodePacked(
                    "ERC20PeggedVariableCriteriaIncentive",
                    erc20PeggedVariableCriteriaIncentive
                )
            ),
            erc20PeggedVariableCriteriaIncentive,
            registry,
            ABoostRegistry.RegistryType.INCENTIVE
        );
    }

    function _deployERC20PeggedVariableCriteriaIncentiveV2(
        BoostRegistry registry
    ) internal returns (address erc20PeggedVariableCriteriaIncentiveV2) {
        bytes memory initCode = type(ERC20PeggedVariableCriteriaIncentiveV2)
            .creationCode;
        erc20PeggedVariableCriteriaIncentiveV2 = _getCreate2Address(
            initCode,
            ""
        );
        console.log(
            "ERC20PeggedVariableCriteriaIncentiveV2: ",
            erc20PeggedVariableCriteriaIncentiveV2
        );
        deployJson = deployJsonKey.serialize(
            "ERC20PeggedVariableCriteriaIncentiveV2",
            erc20PeggedVariableCriteriaIncentiveV2
        );
        bool newDeploy = _deploy2(initCode, "");
        _registerIfNew(
            newDeploy,
            string(
                abi.encodePacked(
                    "ERC20PeggedVariableCriteriaIncentiveV2",
                    erc20PeggedVariableCriteriaIncentiveV2
                )
            ),
            erc20PeggedVariableCriteriaIncentiveV2,
            registry,
            ABoostRegistry.RegistryType.INCENTIVE
        );
    }

    function _deployERC20VariableIncentive(
        BoostRegistry registry
    ) internal returns (address erc20VariableIncentive) {
        bytes memory initCode = type(ERC20VariableIncentive).creationCode;
        erc20VariableIncentive = _getCreate2Address(initCode, "");
        console.log("ERC20VariableIncentive: ", erc20VariableIncentive);
        deployJson = deployJsonKey.serialize(
            "ERC20VariableIncentive",
            erc20VariableIncentive
        );
        bool newDeploy = _deploy2(initCode, "");
        _registerIfNew(
            newDeploy,
            string(
                abi.encodePacked(
                    "ERC20VariableIncentive",
                    erc20VariableIncentive
                )
            ),
            erc20VariableIncentive,
            registry,
            ABoostRegistry.RegistryType.INCENTIVE
        );
    }

    function _deployERC20VariableCriteriaIncentive(
        BoostRegistry registry
    ) internal returns (address erc20VariableCriteriaIncentive) {
        bytes memory initCode = type(ERC20VariableCriteriaIncentive)
            .creationCode;
        erc20VariableCriteriaIncentive = _getCreate2Address(initCode, "");
        console.log(
            "ERC20VariableCriteriaIncentive: ",
            erc20VariableCriteriaIncentive
        );
        deployJson = deployJsonKey.serialize(
            "ERC20VariableCriteriaIncentive",
            erc20VariableCriteriaIncentive
        );
        bool newDeploy = _deploy2(initCode, "");
        _registerIfNew(
            newDeploy,
            string(
                abi.encodePacked(
                    "ERC20VariableCriteriaIncentive",
                    erc20VariableCriteriaIncentive
                )
            ),
            erc20VariableCriteriaIncentive,
            registry,
            ABoostRegistry.RegistryType.INCENTIVE
        );
    }

    function _deployERC20VariableCriteriaIncentiveV2(
        BoostRegistry registry
    ) internal returns (address erc20VariableCriteriaIncentiveV2) {
        bytes memory initCode = type(ERC20VariableCriteriaIncentiveV2)
            .creationCode;
        erc20VariableCriteriaIncentiveV2 = _getCreate2Address(initCode, "");
        console.log(
            "ERC20VariableCriteriaIncentiveV2: ",
            erc20VariableCriteriaIncentiveV2
        );
        deployJson = deployJsonKey.serialize(
            "ERC20VariableCriteriaIncentiveV2",
            erc20VariableCriteriaIncentiveV2
        );
        bool newDeploy = _deploy2(initCode, "");
        _registerIfNew(
            newDeploy,
            string(
                abi.encodePacked(
                    "ERC20VariableCriteriaIncentiveV2",
                    erc20VariableCriteriaIncentiveV2
                )
            ),
            erc20VariableCriteriaIncentiveV2,
            registry,
            ABoostRegistry.RegistryType.INCENTIVE
        );
    }

    function _deployCGDAIncentive(
        BoostRegistry registry
    ) internal returns (address cgdaIncentive) {
        bytes memory initCode = type(CGDAIncentive).creationCode;
        cgdaIncentive = _getCreate2Address(initCode, "");
        console.log("CGDAIncentive: ", cgdaIncentive);
        deployJson = deployJsonKey.serialize("CGDAIncentive", cgdaIncentive);
        bool newDeploy = _deploy2(initCode, "");
        _registerIfNew(
            newDeploy,
            string(abi.encodePacked("CGDAIncentive", cgdaIncentive)),
            cgdaIncentive,
            registry,
            ABoostRegistry.RegistryType.INCENTIVE
        );
    }

    function _deployPointsIncentive(
        BoostRegistry registry
    ) internal returns (address pointsIncentive) {
        bytes memory initCode = type(PointsIncentive).creationCode;
        pointsIncentive = _getCreate2Address(initCode, "");
        console.log("PointsIncentive: ", pointsIncentive);
        deployJson = deployJsonKey.serialize(
            "PointsIncentive",
            pointsIncentive
        );
        bool newDeploy = _deploy2(initCode, "");
        _registerIfNew(
            newDeploy,
            string(abi.encodePacked("PointsIncentive", pointsIncentive)),
            pointsIncentive,
            registry,
            ABoostRegistry.RegistryType.INCENTIVE
        );
    }

    function _deployAllowListIncentive(
        BoostRegistry registry
    ) internal returns (address allowListIncentive) {
        bytes memory initCode = type(AllowListIncentive).creationCode;
        allowListIncentive = _getCreate2Address(initCode, "");
        console.log("AllowListIncentive: ", allowListIncentive);
        deployJson = deployJsonKey.serialize(
            "AllowListIncentive",
            allowListIncentive
        );
        bool newDeploy = _deploy2(initCode, "");
        _registerIfNew(
            newDeploy,
            string(abi.encodePacked("AllowListIncentive", allowListIncentive)),
            allowListIncentive,
            registry,
            ABoostRegistry.RegistryType.INCENTIVE
        );
    }

    function _deploySignerValidator(
        BoostRegistry registry
    ) internal returns (address signerValidator) {
        bytes memory initCode = type(SignerValidator).creationCode;
        signerValidator = _getCreate2Address(initCode, "");
        console.log("SignerValidator: ", signerValidator);
        deployJson = deployJsonKey.serialize(
            "SignerValidator",
            signerValidator
        );
        bool newDeploy = _deploy2(initCode, "");
        _registerIfNew(
            newDeploy,
            string(abi.encodePacked("SignerValidator", signerValidator)),
            signerValidator,
            registry,
            ABoostRegistry.RegistryType.VALIDATOR
        );
    }

    function _deployLimitedSignerValidator(
        BoostRegistry registry
    ) internal returns (address limitedSignerValidator) {
        bytes memory initCode = type(LimitedSignerValidator).creationCode;
        limitedSignerValidator = _getCreate2Address(initCode, "");
        console.log("LimitedSignerValidator: ", limitedSignerValidator);
        deployJson = deployJsonKey.serialize(
            "LimitedSignerValidator",
            limitedSignerValidator
        );
        bool newDeploy = _deploy2(initCode, "");
        _registerIfNew(
            newDeploy,
            string(
                abi.encodePacked(
                    "LimitedSignerValidator",
                    limitedSignerValidator
                )
            ),
            limitedSignerValidator,
            registry,
            ABoostRegistry.RegistryType.VALIDATOR
        );
    }

    function _deployPayableLimitedSignerValidator(
        BoostRegistry registry
    ) internal returns (address payableLimitedSignerValidator) {
        // Use the deployer as the owner of the base implementation
        address baseOwner = vm.addr(vm.envUint("SIGNER_PRIVATE_KEY"));
        bytes memory initCode = abi.encodePacked(
            type(PayableLimitedSignerValidator).creationCode,
            abi.encode(baseOwner)
        );
        payableLimitedSignerValidator = _getCreate2Address(initCode, "");
        console.log("PayableLimitedSignerValidator: ", payableLimitedSignerValidator);
        deployJson = deployJsonKey.serialize(
            "PayableLimitedSignerValidator",
            payableLimitedSignerValidator
        );
        bool newDeploy = _deploy2(initCode, "");
        _registerIfNew(
            newDeploy,
            string(
                abi.encodePacked(
                    "PayableLimitedSignerValidator",
                    payableLimitedSignerValidator
                )
            ),
            payableLimitedSignerValidator,
            registry,
            ABoostRegistry.RegistryType.VALIDATOR
        );
    }

    function _deploySimpleAllowList(
        BoostRegistry registry
    ) internal returns (address simpleAllowList) {
        bytes memory initCode = type(SimpleAllowList).creationCode;
        simpleAllowList = _getCreate2Address(initCode, "");
        console.log("SimpleAllowList: ", simpleAllowList);
        deployJson = deployJsonKey.serialize(
            "SimpleAllowList",
            simpleAllowList
        );
        bool newDeploy = _deploy2(initCode, "");
        _registerIfNew(
            newDeploy,
            string(abi.encodePacked("SimpleAllowList", simpleAllowList)),
            simpleAllowList,
            registry,
            ABoostRegistry.RegistryType.ALLOW_LIST
        );
    }

    function _deployOpenAllowList(
        BoostRegistry registry,
        SimpleDenyList baseDenyList
    ) internal returns (address list) {
        list = _getDeterministicCloneAddress(baseDenyList);
        console.log("OpenAllowList: ", list);
        deployJson = deployJsonKey.serialize("OpenAllowList", list);
        bool newDeploy = _clone2(baseDenyList);

        address[] memory users = new address[](0);
        bytes memory data = abi.encode(address(0), users);
        SimpleDenyList(list).initialize(data);

        _registerIfNew(
            newDeploy,
            string(abi.encodePacked("OpenAllowList", list)),
            list,
            registry,
            ABoostRegistry.RegistryType.ALLOW_LIST
        );
    }

    function _deploySimpleDenyList(
        BoostRegistry registry
    ) internal returns (address simpleDenyList) {
        bytes memory initCode = type(SimpleDenyList).creationCode;
        simpleDenyList = _getCreate2Address(initCode, "");
        console.log("SimpleDenyList: ", simpleDenyList);
        deployJson = deployJsonKey.serialize("SimpleDenyList", simpleDenyList);
        bool newDeploy = _deploy2(initCode, "");

        _registerIfNew(
            newDeploy,
            string(abi.encodePacked("SimpleDenyList", simpleDenyList)),
            simpleDenyList,
            registry,
            ABoostRegistry.RegistryType.ALLOW_LIST
        );
    }
}
