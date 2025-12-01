// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Test} from "lib/forge-std/src/Test.sol";

import {Initializable} from "@solady/utils/Initializable.sol";
import {MockERC20} from "contracts/shared/Mocks.sol";
import {ManagedBudgetWithFeesV2, ABudget} from "contracts/budgets/ManagedBudgetWithFeesV2.sol";
import {ManagedBudgetWithFeesV2Factory} from "contracts/budgets/ManagedBudgetWithFeesV2Factory.sol";
import {ManagedBudgetWithFees} from "contracts/budgets/ManagedBudgetWithFees.sol";
import {BoostCore} from "contracts/BoostCore.sol";

contract ManagedBudgetWithFeesV2FactoryTest is Test {
    ManagedBudgetWithFeesV2Factory factory;
    ManagedBudgetWithFeesV2 baseAddress;
    MockERC20 mockERC20;

    address owner = makeAddr("owner");
    address coreMock = makeAddr("core");
    address admin = makeAddr("admin");

    address[] authorized;
    uint256[] roles;
    uint256 managementFee = 500; // 5%

    function setUp() public {
        // Deploy base ManagedBudgetWithFeesV2
        baseAddress = new ManagedBudgetWithFeesV2();

        // Deploy factory
        factory = new ManagedBudgetWithFeesV2Factory(address(baseAddress));

        // Deploy mock ERC20
        mockERC20 = new MockERC20();

        // Setup authorized addresses and roles
        authorized = new address[](2);
        authorized[0] = coreMock; // First must be BoostCore
        authorized[1] = admin;

        roles = new uint256[](2);
        roles[0] = 0; // MANAGER_ROLE
        roles[1] = 1 << 1; // ADMIN_ROLE
    }

    //////////////////////////////
    // Factory Deployment Tests //
    //////////////////////////////

    function test_DeployBudget() public {
        uint256 nonce = 1;

        // Predict the address that will be deployed
        address predictedBudget = factory.predictBudgetAddress(owner, nonce);

        // The salt is derived from owner + nonce
        bytes32 expectedSalt = keccak256(abi.encodePacked(owner, nonce));

        vm.expectEmit(true, true, true, true);
        emit ManagedBudgetWithFeesV2Factory.BudgetDeployed(predictedBudget, owner, address(baseAddress), expectedSalt);

        address budget = factory.deployBudget(owner, authorized, roles, managementFee, nonce);

        // Verify budget was deployed
        assertTrue(budget != address(0), "Budget should be deployed");

        // Verify budget is initialized
        ManagedBudgetWithFeesV2 budgetContract = ManagedBudgetWithFeesV2(payable(budget));
        assertEq(budgetContract.owner(), owner, "Owner should match");
        assertEq(budgetContract.managementFee(), managementFee, "Management fee should match");
        assertTrue(budgetContract.isAuthorized(admin), "Admin should be authorized");
    }

    function test_DeployBudget_MultipleDeployments() public {
        uint256 nonce1 = 1;
        uint256 nonce2 = 2;

        address budget1 = factory.deployBudget(owner, authorized, roles, managementFee, nonce1);
        address budget2 = factory.deployBudget(owner, authorized, roles, managementFee, nonce2);

        // Verify different nonces produce different addresses
        assertTrue(budget1 != budget2, "Different nonces should produce different addresses");
    }

    function test_DeployBudget_SameOwnerAndNonceReverts() public {
        uint256 nonce = 1;

        // First deployment should succeed
        factory.deployBudget(owner, authorized, roles, managementFee, nonce);

        // Second deployment with same owner + nonce should revert
        vm.expectRevert();
        factory.deployBudget(owner, authorized, roles, managementFee, nonce);
    }

    function test_DeployBudget_DifferentOwnersCanUseSameNonce() public {
        uint256 nonce = 1;
        address owner2 = makeAddr("owner2");

        address budget1 = factory.deployBudget(owner, authorized, roles, managementFee, nonce);
        address budget2 = factory.deployBudget(owner2, authorized, roles, managementFee, nonce);

        // Different owners with same nonce should produce different addresses
        assertTrue(budget1 != budget2, "Different owners should produce different addresses even with same nonce");
    }

    ///////////////////////////////
    // Address Prediction Tests  //
    ///////////////////////////////

    function test_PredictBudgetAddress() public view {
        uint256 nonce = 1;

        address predicted = factory.predictBudgetAddress(owner, nonce);

        // Verify prediction is not zero address
        assertTrue(predicted != address(0), "Predicted address should not be zero");
    }

    function test_PredictBudgetAddress_MatchesActualDeployment() public {
        uint256 nonce = 1;

        // Predict address
        address predicted = factory.predictBudgetAddress(owner, nonce);

        // Deploy with same owner + nonce
        address actual = factory.deployBudget(owner, authorized, roles, managementFee, nonce);

        // Verify prediction matches actual
        assertEq(predicted, actual, "Predicted address should match actual deployment");
    }

    function test_PredictBudgetAddress_DifferentNonces() public view {
        uint256 nonce1 = 1;
        uint256 nonce2 = 2;

        address predicted1 = factory.predictBudgetAddress(owner, nonce1);
        address predicted2 = factory.predictBudgetAddress(owner, nonce2);

        // Verify different nonces predict different addresses
        assertTrue(predicted1 != predicted2, "Different nonces should predict different addresses");
    }

    function test_PredictBudgetAddress_DifferentOwners() public {
        uint256 nonce = 1;
        address owner2 = makeAddr("owner2");

        address predicted1 = factory.predictBudgetAddress(owner, nonce);
        address predicted2 = factory.predictBudgetAddress(owner2, nonce);

        // Verify different owners predict different addresses even with same nonce
        assertTrue(predicted1 != predicted2, "Different owners should predict different addresses");
    }

    //////////////////////////////
    // Cross-Chain Determinism  //
    //////////////////////////////

    function test_CrossChainDeterminism_SimulatedWithSnapshot() public {
        uint256 nonce = 1;

        // Store the factory address and bytecode for redeployment
        address factoryAddress = address(factory);
        bytes memory factoryCode = factoryAddress.code;

        // Take snapshot and revert to simulate fresh chain
        uint256 snapshot = vm.snapshot();

        // Deploy on "chain 1" (current state)
        address chain1Address = factory.deployBudget(owner, authorized, roles, managementFee, nonce);

        // Revert and redeploy factory at same address (simulating different chain)
        vm.revertTo(snapshot);

        // Redeploy factory at the SAME address using vm.etch to simulate cross-chain deployment
        vm.etch(factoryAddress, factoryCode);
        factory = ManagedBudgetWithFeesV2Factory(factoryAddress);

        // Predict address on "chain 2"
        address chain2Prediction = factory.predictBudgetAddress(owner, nonce);

        // Deploy on "chain 2"
        address chain2Address = factory.deployBudget(owner, authorized, roles, managementFee, nonce);

        // Verify addresses match across "chains"
        assertEq(chain1Address, chain2Address, "Addresses should match across chains");
        assertEq(chain2Prediction, chain2Address, "Prediction should match deployment on chain 2");
    }

    ///////////////////////////
    // Initialization Tests  //
    ///////////////////////////

    function test_DeployedBudgetIsInitialized() public {
        uint256 nonce = 1;

        address budget = factory.deployBudget(owner, authorized, roles, managementFee, nonce);
        ManagedBudgetWithFeesV2 budgetContract = ManagedBudgetWithFeesV2(payable(budget));

        // Verify cannot re-initialize
        vm.expectRevert(Initializable.InvalidInitialization.selector);
        budgetContract.initialize(
            abi.encode(
                ManagedBudgetWithFees.InitPayloadWithFee({
                    owner: owner, authorized: authorized, roles: roles, managementFee: managementFee
                })
            )
        );
    }

    function test_DeployedBudget_CoreIsSet() public {
        uint256 nonce = 1;

        address budget = factory.deployBudget(owner, authorized, roles, managementFee, nonce);
        ManagedBudgetWithFeesV2 budgetContract = ManagedBudgetWithFeesV2(payable(budget));

        // Verify core is set to first authorized address
        assertTrue(budgetContract.coreAllowed(BoostCore(coreMock)), "Core should be allowed");
    }

    function test_DeployedBudget_RolesAreSet() public {
        uint256 nonce = 1;

        address budget = factory.deployBudget(owner, authorized, roles, managementFee, nonce);
        ManagedBudgetWithFeesV2 budgetContract = ManagedBudgetWithFeesV2(payable(budget));

        // Verify roles are set
        assertTrue(budgetContract.isAuthorized(coreMock), "Core should be authorized");
        assertTrue(budgetContract.isAuthorized(admin), "Admin should be authorized");
    }

    //////////////////////////////
    // Edge Cases & Validation  //
    //////////////////////////////

    function test_DeployBudget_RevertsWithNoAuthorized() public {
        uint256 nonce = 1;
        address[] memory emptyAuth = new address[](0);
        uint256[] memory emptyRoles = new uint256[](0);

        vm.expectRevert("Must have at least one authorized address");
        factory.deployBudget(owner, emptyAuth, emptyRoles, managementFee, nonce);
    }

    function test_DeployBudget_RevertsWithMismatchedArrays() public {
        uint256 nonce = 1;
        uint256[] memory shortRoles = new uint256[](1);
        shortRoles[0] = 0;

        vm.expectRevert("Authorized and roles length mismatch");
        factory.deployBudget(owner, authorized, shortRoles, managementFee, nonce);
    }

    function test_DeployBudget_RevertsWithExcessiveFee() public {
        uint256 nonce = 1;
        uint256 excessiveFee = 10001; // > 100%

        vm.expectRevert("Fee cannot exceed 100%");
        factory.deployBudget(owner, authorized, roles, excessiveFee, nonce);
    }

    function test_DeployBudget_MaxFee() public {
        uint256 nonce = 1;
        uint256 maxFee = 10000; // 100%

        address budget = factory.deployBudget(owner, authorized, roles, maxFee, nonce);
        ManagedBudgetWithFeesV2 budgetContract = ManagedBudgetWithFeesV2(payable(budget));

        assertEq(budgetContract.managementFee(), maxFee, "Max fee should be set");
    }

    function test_DeployBudget_ZeroFee() public {
        uint256 nonce = 2;
        uint256 zeroFee = 0;

        address budget = factory.deployBudget(owner, authorized, roles, zeroFee, nonce);
        ManagedBudgetWithFeesV2 budgetContract = ManagedBudgetWithFeesV2(payable(budget));

        assertEq(budgetContract.managementFee(), zeroFee, "Zero fee should be set");
    }

    ////////////////////////////
    // Functional Tests       //
    ////////////////////////////

    function test_DeployedBudget_CanAllocate() public {
        uint256 nonce = 1;

        address budget = factory.deployBudget(owner, authorized, roles, managementFee, nonce);
        ManagedBudgetWithFeesV2 budgetContract = ManagedBudgetWithFeesV2(payable(budget));

        // Mint tokens and approve budget
        mockERC20.mint(address(this), 100 ether);
        mockERC20.approve(budget, 100 ether);

        // Allocate tokens to budget
        bytes memory data = _makeFungibleTransfer(ABudget.AssetType.ERC20, address(mockERC20), address(this), 100 ether);
        bool success = budgetContract.allocate(data);

        assertTrue(success, "Allocation should succeed");
        assertEq(mockERC20.balanceOf(budget), 100 ether, "Budget should receive tokens");
    }

    function test_DeployedBudget_OnlyOwnerCanDisburse() public {
        uint256 nonce = 1;

        address budget = factory.deployBudget(owner, authorized, roles, managementFee, nonce);
        ManagedBudgetWithFeesV2 budgetContract = ManagedBudgetWithFeesV2(payable(budget));

        // Mint and allocate tokens
        mockERC20.mint(address(this), 100 ether);
        mockERC20.approve(budget, 100 ether);

        // Try to disburse as unauthorized user (should fail)
        address unauthorized = makeAddr("unauthorized");
        bytes memory disburseData =
            _makeFungibleTransfer(ABudget.AssetType.ERC20, address(mockERC20), unauthorized, 100 ether);

        vm.prank(unauthorized);
        vm.expectRevert();
        budgetContract.disburse(disburseData);
    }

    ///////////////////////////
    // Fuzz Tests            //
    ///////////////////////////

    function testFuzz_PredictAndDeploy(uint256 nonce) public {
        // Skip if would cause collision (already deployed)
        address predicted = factory.predictBudgetAddress(owner, nonce);
        if (predicted.code.length > 0) {
            return;
        }

        // Predict address
        address predictedAddress = factory.predictBudgetAddress(owner, nonce);

        // Deploy
        address actualAddress = factory.deployBudget(owner, authorized, roles, managementFee, nonce);

        // Verify match
        assertEq(predictedAddress, actualAddress, "Fuzz: Predicted should match actual");
    }

    function testFuzz_DeployWithDifferentOwners(address _owner, uint256 nonce) public {
        vm.assume(_owner != address(0));

        // Skip if would cause collision
        address predicted = factory.predictBudgetAddress(_owner, nonce);
        if (predicted.code.length > 0) {
            return;
        }

        address budget = factory.deployBudget(_owner, authorized, roles, managementFee, nonce);
        ManagedBudgetWithFeesV2 budgetContract = ManagedBudgetWithFeesV2(payable(budget));

        assertEq(budgetContract.owner(), _owner, "Fuzz: Owner should match");
    }

    function testFuzz_DeployWithDifferentFees(uint256 _fee, uint256 nonce) public {
        _fee = bound(_fee, 0, 10000);

        // Skip if would cause collision
        address predicted = factory.predictBudgetAddress(owner, nonce);
        if (predicted.code.length > 0) {
            return;
        }

        address budget = factory.deployBudget(owner, authorized, roles, _fee, nonce);
        ManagedBudgetWithFeesV2 budgetContract = ManagedBudgetWithFeesV2(payable(budget));

        assertEq(budgetContract.managementFee(), _fee, "Fuzz: Fee should match");
    }

    function testFuzz_SameOwnerNonceProducesSameAddress(address _owner, uint256 nonce) public view {
        vm.assume(_owner != address(0));

        address predicted1 = factory.predictBudgetAddress(_owner, nonce);
        address predicted2 = factory.predictBudgetAddress(_owner, nonce);

        assertEq(predicted1, predicted2, "Same owner+nonce should always produce same address");
    }

    function testFuzz_DifferentOwnersProduceDifferentAddresses(address owner1, address owner2, uint256 nonce)
        public
        view
    {
        vm.assume(owner1 != owner2);
        vm.assume(owner1 != address(0));
        vm.assume(owner2 != address(0));

        address predicted1 = factory.predictBudgetAddress(owner1, nonce);
        address predicted2 = factory.predictBudgetAddress(owner2, nonce);

        assertTrue(predicted1 != predicted2, "Different owners should produce different addresses");
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
}
