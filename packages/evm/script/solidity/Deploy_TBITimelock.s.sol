// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import "./Util.s.sol";
import {VmSafe} from "forge-std/Vm.sol";
import {TimelockController} from "@openzeppelin/contracts/governance/TimelockController.sol";

/**
 * @title DeployTBITimelock
 * @notice Deploys the TimelockController that owns the TBI Manager (48h) or TBIForwarder (24h).
 * @dev CREATE2: same (BOOST_DEPLOYMENT_SALT, delay, safe) => same address on every chain.
 *      Executor is hardcoded open — parameterizing it would change the CREATE2 address per
 *      chain. Roles: Safe = proposer + canceller; no admin (self-administered).
 *
 * Env:
 *   BOOST_DEPLOYMENT_SALT  — CREATE2 salt (same as other deploys)
 *   TIMELOCK_MIN_DELAY     — 172800 (48h, Manager) or 86400 (24h, Forwarder)
 *   TIMELOCK_PROPOSER_SAFE — team Safe
 *   TARGET_CONTRACT        — optional; enforces delay/target match and prints the Solady
 *                            two-step handover payloads (schedule → execute → current owner
 *                            calls completeOwnershipHandover within 48h of execution)
 */
contract DeployTBITimelock is ScriptUtils {
    uint256 internal constant MANAGER_DELAY = 48 hours;
    uint256 internal constant FORWARDER_DELAY = 24 hours;

    function run() public {
        uint256 minDelay = vm.envUint("TIMELOCK_MIN_DELAY");
        address safe = vm.envAddress("TIMELOCK_PROPOSER_SAFE");

        require(
            minDelay == MANAGER_DELAY || minDelay == FORWARDER_DELAY, "delay must be 48h (Manager) or 24h (Forwarder)"
        );
        require(safe.code.length > 0, "proposer safe has no code on this chain");

        address[] memory proposers = new address[](1);
        proposers[0] = safe;
        address[] memory executors = new address[](1); // executors[0] == address(0) => open execution

        // admin = address(0): no external admin ever exists
        bytes memory args = abi.encode(minDelay, proposers, executors, address(0));
        bytes memory initCode = type(TimelockController).creationCode;

        address timelock = _getCreate2Address(initCode, args);
        _deploy2(initCode, args);

        TimelockController tl = TimelockController(payable(timelock));
        require(tl.getMinDelay() == minDelay, "minDelay mismatch");
        require(tl.hasRole(tl.PROPOSER_ROLE(), safe), "safe not proposer");
        require(tl.hasRole(tl.CANCELLER_ROLE(), safe), "safe not canceller");
        require(tl.hasRole(tl.EXECUTOR_ROLE(), address(0)), "executor not open");
        require(tl.hasRole(tl.DEFAULT_ADMIN_ROLE(), timelock), "timelock not self-admin");
        require(!tl.hasRole(tl.DEFAULT_ADMIN_ROLE(), safe), "safe must not be admin");
        require(!tl.hasRole(tl.DEFAULT_ADMIN_ROLE(), CREATE2_FACTORY), "factory must not be admin");

        console.log("Timelock:           ", timelock);
        console.log("  minDelay (s):     ", minDelay);
        console.log("  proposer/canceller:", safe);

        // Guard BEFORE the JSON write: a guard revert must not leave a phantom record behind.
        address target = vm.envOr("TARGET_CONTRACT", address(0));
        if (target != address(0)) {
            _requireDelayMatchesTarget(target, minDelay);
        }

        if (vm.isContext(VmSafe.ForgeContext.ScriptBroadcast)) {
            _ensureDeploymentsFileExists();
            string memory key = minDelay == MANAGER_DELAY ? ".TBIManagerTimelock" : ".TBIForwarderTimelock";
            vm.writeJson(vm.toString(timelock), _buildJsonDeployPath(), key);
        }

        if (target != address(0)) {
            _printHandoverPayloads(tl, target, minDelay);
        }
    }

    /// @dev Refuse a delay/target mismatch (e.g. Manager handed to the 24h timelock via stale
    ///      env vars). Manager is fingerprinted via two v1 getters; the Forwarder by exclusion —
    ///      its distinctive getters vary across deployed versions.
    function _requireDelayMatchesTarget(address target, uint256 minDelay) internal view {
        require(target.code.length > 0, "target has no code on this chain");
        (bool ownerOk, bytes32 ownerWord) = _staticWord(target, abi.encodeWithSignature("owner()"));
        require(ownerOk, "target is not Ownable");
        // A UUPS implementation exposes the same getters as its proxy but has owner() == 0.
        require(ownerWord != bytes32(0), "target owner is zero - implementation address instead of proxy?");

        bool isManager = _respondsWithWord(target, abi.encodeWithSignature("operator()"))
            && _respondsWithWord(target, abi.encodeWithSignature("campaignImplementation()"));

        if (isManager) {
            require(minDelay == MANAGER_DELAY, "Manager requires the 48h timelock");
        } else {
            require(minDelay == FORWARDER_DELAY, "Forwarder (non-Manager) requires the 24h timelock");
        }
    }

    function _respondsWithWord(address target, bytes memory callData) internal view returns (bool) {
        (bool ok,) = _staticWord(target, callData);
        return ok;
    }

    function _staticWord(address target, bytes memory callData) internal view returns (bool, bytes32) {
        (bool ok, bytes memory ret) = target.staticcall(callData);
        if (!ok || ret.length != 32) return (false, bytes32(0));
        return (true, abi.decode(ret, (bytes32)));
    }

    function _ensureDeploymentsFileExists() internal {
        string memory path = _buildJsonDeployPath();
        try vm.readFile(path) returns (string memory) {}
        catch {
            vm.writeJson("{}", path);
        }
    }

    /// @dev Prints paste-ready handover payloads. The salt embeds a nonce: executed ceremonies
    ///      are walked past (retry after a missed Solady completion window); an in-flight one
    ///      prints its remaining execute step instead of a duplicate schedule.
    function _printHandoverPayloads(TimelockController tl, address target, uint256 minDelay) internal view {
        // Disambiguate target-side state first — a Done timelock op alone can mean three things.
        (, bytes32 ownerWord) = _staticWord(target, abi.encodeWithSignature("owner()"));
        if (address(uint160(uint256(ownerWord))) == address(tl)) {
            console.log("\nHandover already complete: target owner is the timelock. Nothing to do.");
            return;
        }
        (bool expOk, bytes32 expWord) =
            _staticWord(target, abi.encodeWithSignature("ownershipHandoverExpiresAt(address)", address(tl)));
        if (expOk && uint256(expWord) > block.timestamp) {
            console.log("\nHandover request is LIVE until (unix):", uint256(expWord));
            console.log("only remaining step - owner: cast send", target);
            console.log("  'completeOwnershipHandover(address)'", address(tl));
            return;
        }

        bytes memory data = abi.encodeWithSignature("requestOwnershipHandover()");
        bytes32 predecessor = bytes32(0);

        bytes32 salt;
        bytes32 opId;
        uint256 nonce;
        while (true) {
            salt = keccak256(abi.encodePacked("tbi-ownership-handover", target, nonce));
            opId = tl.hashOperation(target, 0, data, predecessor, salt);
            if (!tl.isOperation(opId)) break;

            if (tl.isOperationPending(opId)) {
                console.log("\nHandover already queued. operation id:", vm.toString(opId));
                console.log("executable at (unix):", tl.getTimestamp(opId));
                console.log("execute(...) calldata:");
                console.logBytes(abi.encodeWithSelector(tl.execute.selector, target, 0, data, predecessor, salt));
                console.log("then owner: cast send", target);
                console.log("  'completeOwnershipHandover(address)'", address(tl));
                return;
            }

            nonce++; // executed ceremony — advance to a fresh salt
            require(nonce < 32, "too many prior handover ceremonies");
        }

        console.log("\nHandover for", target, "(salt nonce", nonce);
        console.log("operation id:", vm.toString(opId));
        console.log("\n1) Safe queues on", address(tl), "- schedule(...) calldata:");
        console.logBytes(abi.encodeWithSelector(tl.schedule.selector, target, 0, data, predecessor, salt, minDelay));
        console.log("\n2) after minDelay, anyone executes - execute(...) calldata:");
        console.logBytes(abi.encodeWithSelector(tl.execute.selector, target, 0, data, predecessor, salt));
        console.log("\n3) owner completes within 48h of step 2:");
        console.log("   cast send", target);
        console.log("   'completeOwnershipHandover(address)'", address(tl));
        console.log("\n4) verify owner(): cast call", target, "'owner()(address)' ==", address(tl));
    }
}
