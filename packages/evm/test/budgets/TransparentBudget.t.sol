// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Test, console} from "lib/forge-std/src/Test.sol";

import {IERC1155Receiver} from "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
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
import {IPermit2} from "contracts/shared/IPermit2.sol";

contract TransparentBudgetTest is Test, IERC1155Receiver {
    MockERC20 mockERC20 = new MockERC20();
    MockERC721 mockERC721 = new MockERC721();
    address boostOwner = makeAddr("boost owner");
    TransparentBudget budget = new TransparentBudget();
    BoostRegistry registry = new BoostRegistry();
    BoostCore boostCore;
    bytes32 constant TOKEN_PERMISSIONS_TYPEHASH = keccak256("TokenPermissions(address token,uint256 amount)");
    bytes32 constant PERMIT_TRANSFER_FROM_TYPEHASH = keccak256(
        "PermitTransferFrom(TokenPermissions permitted,address spender,uint256 nonce,uint256 deadline)TokenPermissions(address token,uint256 amount)"
    );
    bytes32 constant PERMIT_BATCH_TRANSFER_FROM_TYPEHASH = keccak256(
        "PermitBatchTransferFrom(TokenPermissions[] permitted,address spender,uint256 nonce,uint256 deadline)TokenPermissions(address token,uint256 amount)"
    );

    BoostLib.Target action =
        _makeERC721MintAction(address(mockERC721), MockERC721.mint.selector, mockERC721.mintPrice());

    uint256 sepoliaFork;
    string SEPOLIA_RPC_URL = vm.envString("VITE_SEPOLIA_RPC_URL");

    function setUp() public {
        // Deploy implementation
        BoostCore implementation = new BoostCore();

        // Deploy proxy with implementation and initialization data
        bytes memory initData = abi.encodeCall(
            BoostCore.initialize,
            (
                registry,
                address(1), // protocolFeeReceiver
                address(this) // owner
            )
        );

        ERC1967Proxy proxy = new ERC1967Proxy(address(implementation), initData);
        boostCore = BoostCore(address(proxy));

        // We allocate 100 for the boost and 10 for protocol fees
        mockERC20.mint(address(this), 110 ether);
        mockERC20.approve(address(budget), 110 ether);
    }

    function testPermit2BoostCreation() public {
        (address permit2Creator, uint256 permit2CreatorKey) = makeAddrAndKey("permit2 boost creator");
        uint256 amount = 110 ether;
        sepoliaFork = vm.createSelectFork(SEPOLIA_RPC_URL, 2356288);
        BoostRegistry testRegistry = new BoostRegistry();
        // Deploy test implementation
        BoostCore testImplementation = new BoostCore();

        // Deploy test proxy with implementation and initialization data
        bytes memory testInitData = abi.encodeCall(
            BoostCore.initialize,
            (
                testRegistry,
                address(1), // protocolFeeReceiver
                address(this) // owner
            )
        );

        ERC1967Proxy testProxy = new ERC1967Proxy(address(testImplementation), testInitData);
        boostCore = BoostCore(address(testProxy));
        mockERC721 = new MockERC721();
        action = _makeERC721MintAction(address(mockERC721), MockERC721.mint.selector, mockERC721.mintPrice());
        mockERC20 = new MockERC20();
        budget = new TransparentBudget();
        mockERC20.mint(address(permit2Creator), amount);
        hoax(permit2Creator);
        mockERC20.approve(address(budget.PERMIT2()), type(uint256).max);
        IPermit2.TokenPermissions[] memory permitted = new IPermit2.TokenPermissions[](1);
        permitted[0] = IPermit2.TokenPermissions({token: IERC20(address(mockERC20)), amount: amount});
        IPermit2.PermitBatchTransferFrom memory permit =
            IPermit2.PermitBatchTransferFrom({permitted: permitted, nonce: vm.randomUint(), deadline: block.timestamp});

        bytes memory sig = _signPermit(permit, address(budget), permit2CreatorKey, budget.PERMIT2());

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
        hoax(permit2Creator);
        vm.resumeGasMetering();
        budget.createBoostWithPermit2(allocations, boostCore, createBoostPayload, sig, permit.nonce, permit.deadline);
    }

    function testFuzzBoostCreation(uint256 rewardAmount, uint64 additionalProtocolFee, uint256 incentiveQty) public {
        vm.pauseGasMetering();
        uint16 claimLimit = 1_000;
        additionalProtocolFee = uint64(bound(additionalProtocolFee, 0, 9_000));
        rewardAmount = bound(rewardAmount, 10_000, (type(uint256).max >> 15) / claimLimit);
        incentiveQty = bound(incentiveQty, 1, 8);
        uint64 totalFee = uint64(boostCore.protocolFee()) + additionalProtocolFee;
        uint256 amountToMint =
            (rewardAmount * claimLimit + (claimLimit * rewardAmount * totalFee) / boostCore.FEE_DENOMINATOR());
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

    ////////////////////////////////////
    // TransparentBudget.getComponentInterface //
    ////////////////////////////////////

    function testGetComponentInterface() public view {
        // Ensure the contract supports the ABudget interface
        console.logBytes4(budget.getComponentInterface());
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

    // Generate a signature for a batch permit message.
    function _signPermit(
        IPermit2.PermitBatchTransferFrom memory permit,
        address spender,
        uint256 signerKey,
        IPermit2 permit2Instance
    ) internal view returns (bytes memory sig) {
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(signerKey, _getEIP712Hash(permit, spender, permit2Instance));
        return abi.encodePacked(r, s, v);
    }

    // Compute the EIP712 hash of the batch permit object.
    // Normally this would be implemented off-chain.

    function _getEIP712Hash(IPermit2.PermitBatchTransferFrom memory permit, address spender, IPermit2 permit2Instance)
        internal
        view
        returns (bytes32 h)
    {
        bytes32 permittedHash;
        {
            uint256 n = permit.permitted.length;
            bytes32[] memory contentHashes = new bytes32[](n);
            for (uint256 i; i < n; ++i) {
                contentHashes[i] = keccak256(
                    abi.encode(TOKEN_PERMISSIONS_TYPEHASH, permit.permitted[i].token, permit.permitted[i].amount)
                );
            }
            permittedHash = keccak256(abi.encodePacked(contentHashes));
        }
        return keccak256(
            abi.encodePacked(
                "\x19\x01",
                permit2Instance.DOMAIN_SEPARATOR(),
                keccak256(
                    abi.encode(
                        PERMIT_BATCH_TRANSFER_FROM_TYPEHASH, permittedHash, spender, permit.nonce, permit.deadline
                    )
                )
            )
        );
    }
}
