// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import "./Util.s.sol";
import {TimeBasedIncentiveCampaign} from "contracts/timebased/TimeBasedIncentiveCampaign.sol";

/**
 * @title DeployCampaignBase
 * @notice Deploy the TimeBasedIncentiveCampaign base contract via CREATE2 — and
 *         nothing else. The Manager's setCampaignImplementation is executed
 *         separately through the TBIManagerTimelock (48h) on chains where
 *         ownership has been handed over.
 * @dev Permissionless: any funded sender works; the resulting address depends
 *      only on BOOST_DEPLOYMENT_SALT and the creation code, so it is identical
 *      on every chain. Idempotent: skips the deploy if the base already exists.
 *
 * Required env:
 *   BOOST_DEPLOYMENT_SALT — CREATE2 salt (same as all prior deploys)
 */
contract DeployCampaignBase is ScriptUtils {
    function run() public {
        bytes memory initCode = type(TimeBasedIncentiveCampaign).creationCode;
        address predicted = _getCreate2Address(initCode, "");

        console.log("========================================");
        console.log("Campaign Base Deploy (deploy-only)");
        console.log("========================================");
        console.log("Sender:            ", msg.sender);
        console.log("Predicted address: ", predicted);

        if (predicted.code.length > 0) {
            console.log("[SKIP] Base already deployed on this chain");
            return;
        }

        if (_deploy2(initCode, "")) {
            console.log("[OK] Deployed campaign base");
        }

        require(predicted.code.length > 0, "Deploy failed - no code at predicted address");
        require(
            TimeBasedIncentiveCampaign(predicted).LEAF_VERSION() == 2,
            "Deployed base does not report LEAF_VERSION 2"
        );
        console.log("[OK] LEAF_VERSION() == 2");
    }
}
