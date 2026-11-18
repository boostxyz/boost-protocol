// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Test, Vm} from "forge-std/Test.sol";
import {Upgrades} from "openzeppelin-foundry-upgrades/Upgrades.sol";
import {MockERC20} from "contracts/shared/Mocks.sol";
import {TimeBasedIncentiveManager} from "contracts/timebased/TimeBasedIncentiveManager.sol";
import {TimeBasedIncentiveCampaign} from "contracts/timebased/TimeBasedIncentiveCampaign.sol";
import {OpenEndedIncentiveCampaign} from "contracts/timebased/OpenEndedIncentiveCampaign.sol";
import {ReferralDistributor} from "contracts/timebased/ReferralDistributor.sol";
import {TBIProtocolFeeModule} from "contracts/timebased/TBIProtocolFeeModule.sol";
import {UpgradeTimeBased} from "script/solidity/UpgradeTimeBased.s.sol";

/// @notice Runs UpgradeTimeBased against the untouched V1 Manager proxy on Sepolia: the state a
///         new chain is in after Deploy_TimeBased.s.sol at the V1 commit
contract UpgradeTimeBasedForkTest is Test {
    /// @dev After the V1 deploy (block 12163870) and before any upgrade
    uint256 internal constant FORK_BLOCK = 12_163_900;
    address internal constant MANAGER_PROXY = 0x81d1Bb513197F4e23E9676B4f3aaBC7de89b54D0;
    address internal constant V1_MANAGER_IMPL = 0x6e09a86344f9F510935bbA9f7e9914F7EF198a75;
    address internal constant V1_OWNER = 0xBaDDD20aA8675653086783A0A73b38bF4100B5a1;
    string internal constant SALT_LABEL = "streaming-v1-feb-2-2026";

    TimeBasedIncentiveManager internal manager = TimeBasedIncentiveManager(MANAGER_PROXY);
    address internal feeModuleOwner = makeAddr("feeModuleOwner");
    address internal owner;
    uint256 internal ownerKey;
    UpgradeTimeBased internal script;

    function setUp() public {
        // Needs an archive-capable Sepolia RPC (public nodes only serve recent state). Skipped when
        // unset; CI does not set it.
        string memory rpcUrl = vm.envOr("SEPOLIA_ARCHIVE_RPC_URL", string(""));
        vm.skip(bytes(rpcUrl).length == 0);
        vm.createSelectFork(rpcUrl, FORK_BLOCK);

        vm.setEnv("TIMEBASED_MANAGER_PROXY", vm.toString(MANAGER_PROXY));
        vm.setEnv("BOOST_DEPLOYMENT_SALT", SALT_LABEL);
        vm.setEnv("TBI_FEE_MODULE_OWNER", vm.toString(feeModuleOwner));

        // The script broadcasts owner calls with DEPLOYER_PRIVATE_KEY, so hand the proxy to a key
        // the test holds
        (owner, ownerKey) = makeAddrAndKey("owner");
        vm.setEnv("DEPLOYER_PRIVATE_KEY", vm.toString(ownerKey));
        vm.prank(V1_OWNER);
        manager.transferOwnership(owner);

        script = new UpgradeTimeBased();
    }

    function test_Fork_UpgradesV1ProxyAndConfiguresEverything() public {
        assertEq(Upgrades.getImplementationAddress(MANAGER_PROXY), V1_MANAGER_IMPL);
        address operator = manager.operator();
        uint64 protocolFee = manager.protocolFee();
        address protocolFeeReceiver = manager.protocolFeeReceiver();

        script.run();

        assertEq(
            Upgrades.getImplementationAddress(MANAGER_PROXY), _predict(type(TimeBasedIncentiveManager).creationCode, "")
        );
        assertEq(manager.campaignImplementation(), _predict(type(TimeBasedIncentiveCampaign).creationCode, ""));
        assertEq(manager.openEndedCampaignImplementation(), _predict(type(OpenEndedIncentiveCampaign).creationCode, ""));
        assertEq(manager.referralDistributorImplementation(), _predict(type(ReferralDistributor).creationCode, ""));
        assertEq(manager.referralClaimWindowDuration(), 60 days);
        address feeModule = _predict(type(TBIProtocolFeeModule).creationCode, abi.encode(MANAGER_PROXY, feeModuleOwner));
        assertEq(manager.protocolFeeModule(), feeModule);
        assertEq(TBIProtocolFeeModule(feeModule).owner(), feeModuleOwner);

        assertEq(manager.owner(), owner);
        assertEq(manager.operator(), operator);
        assertEq(manager.protocolFee(), protocolFee);
        assertEq(manager.protocolFeeReceiver(), protocolFeeReceiver);
    }

    function test_Fork_ReferralPoolCampaignWorksAfterUpgrade() public {
        script.run();

        MockERC20 rewardToken = new MockERC20();
        MockERC20 poolToken = new MockERC20();
        address creator = makeAddr("creator");
        rewardToken.mint(creator, 1000 ether);
        poolToken.mint(creator, 100 ether);

        TimeBasedIncentiveManager.ReferralPoolParams[] memory pools =
            new TimeBasedIncentiveManager.ReferralPoolParams[](1);
        pools[0] = TimeBasedIncentiveManager.ReferralPoolParams({token: address(poolToken), amount: 100 ether});
        uint64 start = uint64(block.timestamp + 1 hours);

        vm.startPrank(creator);
        rewardToken.approve(MANAGER_PROXY, 1000 ether);
        poolToken.approve(MANAGER_PROXY, 100 ether);
        uint256 campaignId = manager.createCampaignDirect(
            keccak256("config"), address(rewardToken), 1000 ether, start, start + 7 days, pools
        );
        vm.stopPrank();

        address distributor = manager.getReferralDistributor(campaignId, 0);
        assertTrue(distributor != address(0), "no distributor for pool 0");
        assertEq(poolToken.balanceOf(distributor), 100 ether);
    }

    function test_Fork_RerunChangesNothing() public {
        script.run();

        vm.recordLogs();
        script.run();
        Vm.Log[] memory logs = vm.getRecordedLogs();
        for (uint256 i; i < logs.length; i++) {
            assertTrue(logs[i].emitter != MANAGER_PROXY, "rerun touched the Manager");
            assertTrue(logs[i].emitter != CREATE2_FACTORY, "rerun deployed a contract");
        }
    }

    function test_Fork_RerunKeepsAConfiguredClaimWindow() public {
        script.run();
        vm.prank(owner);
        manager.setReferralClaimWindowDuration(30 days);

        script.run();

        assertEq(manager.referralClaimWindowDuration(), 30 days);
    }

    function test_Fork_RevertWhen_KeyIsNotOwner() public {
        vm.prank(owner);
        manager.transferOwnership(makeAddr("otherOwner"));

        vm.expectRevert(
            bytes(
                "DEPLOYER_PRIVATE_KEY is not the Manager owner; timelock-owned chains use the DeployImpl_TBI* scripts"
            )
        );
        script.run();
    }

    function _predict(bytes memory creationCode, bytes memory args) internal pure returns (address) {
        bytes32 salt = keccak256(bytes(SALT_LABEL));
        return vm.computeCreate2Address(salt, keccak256(abi.encodePacked(creationCode, args)), CREATE2_FACTORY);
    }
}
