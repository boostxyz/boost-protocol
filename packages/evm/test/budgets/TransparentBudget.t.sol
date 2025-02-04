// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Test, console} from "lib/forge-std/src/Test.sol";

import {IERC1155Receiver} from "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import {LibZip} from "@solady/utils/LibZip.sol";
import {SafeTransferLib} from "@solady/utils/SafeTransferLib.sol";

import {SimpleDenyList} from "contracts/allowlists/SimpleDenyList.sol";
import {BoostCore} from "contracts/BoostCore.sol";
import {BoostRegistry} from "contracts/BoostRegistry.sol";
import {ERC20Incentive} from "contracts/incentives/ERC20Incentive.sol";
import {AERC20Incentive} from "contracts/incentives/AERC20Incentive.sol";
import {BoostLib} from "contracts/shared/BoostLib.sol";
import {MockERC20, MockERC1155, MockERC721, MaliciousFungibleToken} from "contracts/shared/Mocks.sol";
import {ERC721MintAction} from "contracts/actions/ERC721MintAction.sol";
import {AContractAction, ContractAction} from "contracts/actions/ContractAction.sol";
import {BoostError} from "contracts/shared/BoostError.sol";
import {ABudget} from "contracts/budgets/ABudget.sol";
import {ACloneable} from "contracts/shared/ACloneable.sol";
import {ManagedBudget} from "contracts/budgets/ManagedBudget.sol";
import {AManagedBudget} from "contracts/budgets/AManagedBudget.sol";
import {AIncentive} from "contracts/incentives/AIncentive.sol";
import {TransparentBudget} from "contracts/budgets/TransparentBudget.sol";

contract TransparentBudgetTest is Test, IERC1155Receiver {
    MockERC20 mockERC20 = new MockERC20();
    MockERC721 mockERC721 = new MockERC721();
    address boostOwner = makeAddr("boost owner");
    TransparentBudget budget = new TransparentBudget();
    BoostCore boostCore = new BoostCore(new BoostRegistry(), address(1), address(this));

    BoostLib.Target action =
        _makeERC721MintAction(address(mockERC721), MockERC721.mint.selector, mockERC721.mintPrice());

    function setUp() public {
        // We allocate 100 for the boost and 10 for protocol fees
        mockERC20.mint(address(this), 110 ether);
        mockERC20.approve(address(budget), 110 ether);
    }

    function testFuzzBoostCreation(uint256 rewardAmount, uint64 additionalProtocolFee, uint256 incentiveQty) public {
        vm.pauseGasMetering();
        uint16 claimLimit = 1_000;
        additionalProtocolFee = uint64(bound(additionalProtocolFee, 0, 9_000));
        rewardAmount = bound(rewardAmount, 10_000, (type(uint256).max >> 15) / claimLimit);
        incentiveQty = bound(incentiveQty, 1, 8);
        uint64 totalFee = uint64(boostCore.protocolFee()) + additionalProtocolFee;
        uint256 amountToMint =
            (rewardAmount * claimLimit + claimLimit * rewardAmount * totalFee / boostCore.FEE_DENOMINATOR());
        mockERC20.mint(address(this), incentiveQty * amountToMint);
        mockERC20.approve(address(budget), incentiveQty * amountToMint);
        bytes memory transferPayload = abi.encode(
            ABudget.Transfer({
                assetType: ABudget.AssetType.ERC20,
                asset: address(mockERC20),
                target: address(this),
                data: abi.encode(ABudget.FungiblePayload({amount: amountToMint}))
            })
        );
        bytes[] memory allocations = new bytes[](incentiveQty);
        for (uint256 i = 0; i < incentiveQty; i++) {
            allocations[i] = transferPayload;
        }
        bytes memory createBoostPayload = _makeValidCreateCalldataWithVariableRewardAmount(
            incentiveQty, rewardAmount, claimLimit, additionalProtocolFee, address(mockERC20)
        );
        vm.resumeGasMetering();
        budget.createBoost(allocations, boostCore, createBoostPayload);
    }

    function testMaliciousTokenReentrancy() public {
        vm.pauseGasMetering();
        MaliciousFungibleToken token = new MaliciousFungibleToken(110 ether);

        token.approve(address(budget), 110 ether);
        bytes memory transferPayload = abi.encode(
            ABudget.Transfer({
                assetType: ABudget.AssetType.ERC20,
                asset: address(token),
                target: address(this),
                data: abi.encode(ABudget.FungiblePayload({amount: 110 ether}))
            })
        );

        // reenter into the Budget and attempt a disbursal after the deposit
        // TODO: find a way to capture the inner insufficient balance revert error
        token.setDisburseData(transferPayload);
        token.setVictim(address(budget));

        bytes[] memory allocations = new bytes[](1);
        allocations[0] = transferPayload;
        bytes memory createBoostPayload =
            _makeValidCreateCalldataWithVariableRewardAmount(1, 10 ether, 10, 0, address(token));
        vm.resumeGasMetering();
        vm.expectRevert(SafeTransferLib.TransferFromFailed.selector);
        budget.createBoost(allocations, boostCore, createBoostPayload);
    }

    function testBasicBoostCreation() public {
        vm.pauseGasMetering();
        bytes memory transferPayload = abi.encode(
            ABudget.Transfer({
                assetType: ABudget.AssetType.ERC20,
                asset: address(mockERC20),
                target: address(this),
                data: abi.encode(ABudget.FungiblePayload({amount: 110 ether}))
            })
        );
        bytes[] memory allocations = new bytes[](1);
        allocations[0] = transferPayload;
        bytes memory createBoostPayload =
            _makeValidCreateCalldataWithVariableRewardAmount(1, 10 ether, 10, 0, address(mockERC20));
        vm.resumeGasMetering();
        budget.createBoost(allocations, boostCore, createBoostPayload);
    }

    function testUnauthorizedClawbackFromTarget() public {
        address unauthorized = makeAddr("unauthorized");
        vm.pauseGasMetering();
        bytes memory transferPayload = abi.encode(
            ABudget.Transfer({
                assetType: ABudget.AssetType.ERC20,
                asset: address(mockERC20),
                target: address(this),
                data: abi.encode(ABudget.FungiblePayload({amount: 110 ether}))
            })
        );
        bytes[] memory allocations = new bytes[](1);
        allocations[0] = transferPayload;
        bytes memory createBoostPayload =
            _makeValidCreateCalldataWithVariableRewardAmount(1, 10 ether, 10, 0, address(mockERC20));
        vm.assertEq(mockERC20.balanceOf(address(this)), 110 ether);
        budget.createBoost(allocations, boostCore, createBoostPayload);
        vm.assertEq(mockERC20.balanceOf(address(this)), 0);

        hoax(unauthorized);
        vm.resumeGasMetering();
        vm.expectRevert(BoostError.Unauthorized.selector);
        budget.clawbackFromTarget(address(boostCore), abi.encode(100 ether), 0, 0);
    }

    function testClawbackFromTarget() public {
        vm.pauseGasMetering();
        bytes memory transferPayload = abi.encode(
            ABudget.Transfer({
                assetType: ABudget.AssetType.ERC20,
                asset: address(mockERC20),
                target: address(this),
                data: abi.encode(ABudget.FungiblePayload({amount: 110 ether}))
            })
        );
        bytes[] memory allocations = new bytes[](1);
        allocations[0] = transferPayload;
        bytes memory createBoostPayload =
            _makeValidCreateCalldataWithVariableRewardAmount(1, 10 ether, 10, 0, address(mockERC20));
        vm.assertEq(mockERC20.balanceOf(address(this)), 110 ether);
        budget.createBoost(allocations, boostCore, createBoostPayload);
        vm.assertEq(mockERC20.balanceOf(address(this)), 0);

        hoax(boostOwner);
        vm.resumeGasMetering();
        budget.clawbackFromTarget(address(boostCore), abi.encode(100 ether), 0, 0);
        // owner receives fees and incentive amount
        vm.assertEq(mockERC20.balanceOf(boostOwner), 110 ether);
    }

    ///////////////////////////
    // Test Helper Functions //
    ///////////////////////////

    function _makeFungibleTransfer(ABudget.AssetType assetType, address asset, address target, uint256 value)
        internal
        pure
        returns (bytes memory)
    {
        ABudget.Transfer memory transfer;
        transfer.assetType = assetType;
        transfer.asset = asset;
        transfer.target = target;
        if (assetType == ABudget.AssetType.ETH || assetType == ABudget.AssetType.ERC20) {
            transfer.data = abi.encode(ABudget.FungiblePayload({amount: value}));
        } else if (assetType == ABudget.AssetType.ERC1155) {
            // we're not actually handling this case yet, so hardcoded token ID of 1 is fine
            transfer.data = abi.encode(ABudget.ERC1155Payload({tokenId: 1, amount: value, data: ""}));
        }

        return abi.encode(transfer);
    }

    function _makeERC1155Transfer(address asset, address target, uint256 tokenId, uint256 value, bytes memory data)
        internal
        pure
        returns (bytes memory)
    {
        ABudget.Transfer memory transfer;
        transfer.assetType = ABudget.AssetType.ERC1155;
        transfer.asset = asset;
        transfer.target = target;
        transfer.data = abi.encode(ABudget.ERC1155Payload({tokenId: tokenId, amount: value, data: data}));

        return abi.encode(transfer);
    }

    function onERC1155Received(address, address, uint256, uint256, bytes calldata)
        external
        pure
        override
        returns (bytes4)
    {
        return IERC1155Receiver.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(address, address, uint256[] calldata, uint256[] calldata, bytes calldata)
        external
        pure
        override
        returns (bytes4)
    {
        return IERC1155Receiver.onERC1155BatchReceived.selector;
    }

    function supportsInterface(bytes4 interfaceId) external pure returns (bool) {
        return interfaceId == type(IERC1155Receiver).interfaceId;
    }

    function _makeValidCreateCalldataWithVariableRewardAmount(
        uint256 incentiveCount,
        uint256 rewardAmount,
        uint16 claimLimit,
        uint64 protocolFee,
        address token
    ) internal returns (bytes memory createCalldata) {
        createCalldata = LibZip.cdCompress(
            abi.encode(
                BoostLib.CreateBoostPayload({
                    budget: budget,
                    action: action,
                    validator: BoostLib.Target({isBase: true, instance: address(0), parameters: ""}),
                    allowList: _makeDenyList(),
                    incentives: _makeIncentives(incentiveCount, rewardAmount, claimLimit, token),
                    protocolFee: protocolFee,
                    maxParticipants: 10_000,
                    owner: boostOwner
                })
            )
        );
    }

    function _makeDenyList() internal returns (BoostLib.Target memory) {
        address[] memory list = new address[](0);
        return BoostLib.Target({
            isBase: true,
            instance: address(new SimpleDenyList()),
            parameters: abi.encode(address(0), list)
        });
    }

    function _makeBudget() internal returns (ABudget _budget) {
        _budget = new TransparentBudget();
    }

    function _makeIncentives(uint256 count, uint256 rewardAmount, uint16 limit, address token)
        internal
        returns (BoostLib.Target[] memory)
    {
        BoostLib.Target[] memory incentives = new BoostLib.Target[](count);
        for (uint256 i = 0; i < count; i++) {
            incentives[i] = BoostLib.Target({
                isBase: true,
                instance: address(new ERC20Incentive()),
                parameters: abi.encode(
                    ERC20Incentive.InitPayload({
                        asset: token,
                        strategy: AERC20Incentive.Strategy.POOL,
                        reward: rewardAmount,
                        limit: limit,
                        manager: address(budget)
                    })
                )
            });
        }
        return incentives;
    }

    function _makeERC721MintAction(address target, bytes4 selector, uint256 value)
        internal
        returns (BoostLib.Target memory)
    {
        return BoostLib.Target({
            isBase: true,
            instance: address(new ERC721MintAction()),
            parameters: abi.encode(
                AContractAction.InitPayload({chainId: block.chainid, target: target, selector: selector, value: value})
            )
        });
    }
}
