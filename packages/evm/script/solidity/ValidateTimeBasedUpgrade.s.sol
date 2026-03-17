// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {Upgrades} from "openzeppelin-foundry-upgrades/Upgrades.sol";
import {Options} from "openzeppelin-foundry-upgrades/Options.sol";

/**
 * @title ValidateTimeBasedUpgrade
 * @notice Validate TimeBasedIncentiveManager upgrade safety against the V2 archive
 * @dev Run: forge script script/solidity/ValidateTimeBasedUpgrade.s.sol
 *
 * Only validates the Manager (UUPS proxy). The Campaign is a plain contract
 * used as a clone template — not upgradeable, no proxy, no storage layout concerns.
 */
contract ValidateTimeBasedUpgrade is Script {
    function run() public {
        console.log("====================================");
        console.log("Validating TimeBased upgrade safety");
        console.log("====================================\n");

        Options memory opts;

        // Skip known safe warnings from Solady contracts
        // These are false positives - Solady's patterns are secure but different from OZ
        opts.unsafeAllow = "constructor,state-variable-immutable";

        // Validate V2.1 against V2 storage layout
        opts.referenceContract = "TimeBasedIncentiveManagerV2.sol:TimeBasedIncentiveManagerV2";

        console.log("Validating TimeBasedIncentiveManager upgrade from V2...");
        Upgrades.validateUpgrade("TimeBasedIncentiveManager.sol:TimeBasedIncentiveManager", opts);
        console.log("[OK] TimeBasedIncentiveManager upgrade is safe!\n");

        console.log("Validation complete - safe to upgrade!");
    }
}
