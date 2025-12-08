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
        factory = new ManagedBudgetWithFeesV2Factory(address(baseAddress), address(this));

        // Deploy mock ERC20
        mockERC20 = new MockERC20();

        // Setup authorized addresses and roles
        authorized = new address[](2);
        authorized[0] = coreMock; // First must be BoostCore
        authorized[1] = admin;

        roles = new uint256[](2);
        roles[0] = 1 << 0; // MANAGER_ROLE
        roles[1] = 1 << 1; // ADMIN_ROLE
    }

    //////////////////////////////
    // Factory Deployment Tests //
    //////////////////////////////

    function test_DeployBudget() public {
        // Get the current nonce for owner (should be 0)
        uint256 nonce = factory.nonces(owner);

        // Predict the address that will be deployed
        address predictedBudget = factory.predictBudgetAddress(owner, nonce);

        // The salt is derived from owner + nonce
        bytes32 expectedSalt = keccak256(abi.encodePacked(owner, nonce));

        vm.expectEmit(true, true, true, true);
        emit ManagedBudgetWithFeesV2Factory.BudgetDeployed(predictedBudget, owner, address(baseAddress), expectedSalt, nonce);

        vm.prank(owner);
        address budget = factory.deployBudget(authorized, roles, managementFee);

        // Verify budget was deployed
        assertTrue(budget != address(0), "Budget should be deployed");

        // Verify nonce was incremented
        assertEq(factory.nonces(owner), nonce + 1, "Nonce should be incremented");

        // Verify budget is initialized
        ManagedBudgetWithFeesV2 budgetContract = ManagedBudgetWithFeesV2(payable(budget));
        assertEq(budgetContract.owner(), owner, "Owner should match");
        assertEq(budgetContract.managementFee(), managementFee, "Management fee should match");
        assertTrue(budgetContract.isAuthorized(admin), "Admin should be authorized");
    }

    function test_DeployBudget_MultipleDeployments() public {
        vm.prank(owner);
        address budget1 = factory.deployBudget(authorized, roles, managementFee);
        vm.prank(owner);
        address budget2 = factory.deployBudget(authorized, roles, managementFee);

        // Verify sequential deployments produce different addresses
        assertTrue(budget1 != budget2, "Sequential deployments should produce different addresses");

        // Verify nonce was incremented twice
        assertEq(factory.nonces(owner), 2, "Nonce should be 2 after two deployments");
    }

    function test_DeployBudget_DifferentOwnersStartAtNonceZero() public {
        address owner2 = makeAddr("owner2");

        // Both owners start at nonce 0
        assertEq(factory.nonces(owner), 0, "Owner nonce should start at 0");
        assertEq(factory.nonces(owner2), 0, "Owner2 nonce should start at 0");

        vm.prank(owner);
        address budget1 = factory.deployBudget(authorized, roles, managementFee);
        vm.prank(owner2);
        address budget2 = factory.deployBudget(authorized, roles, managementFee);

        // Different owners with same starting nonce should produce different addresses
        assertTrue(budget1 != budget2, "Different owners should produce different addresses even with same nonce");

        // Each owner's nonce incremented independently
        assertEq(factory.nonces(owner), 1, "Owner nonce should be 1");
        assertEq(factory.nonces(owner2), 1, "Owner2 nonce should be 1");
    }

    ///////////////////////////////
    // Address Prediction Tests  //
    ///////////////////////////////

    function test_PredictBudgetAddress() public view {
        uint256 nonce = factory.nonces(owner);

        address predicted = factory.predictBudgetAddress(owner, nonce);

        // Verify prediction is not zero address
        assertTrue(predicted != address(0), "Predicted address should not be zero");
    }

    function test_PredictBudgetAddress_MatchesActualDeployment() public {
        // Get current nonce
        uint256 nonce = factory.nonces(owner);

        // Predict address using current nonce
        address predicted = factory.predictBudgetAddress(owner, nonce);

        // Deploy
        vm.prank(owner);
        address actual = factory.deployBudget(authorized, roles, managementFee);

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
        // Store the factory address and bytecode for redeployment
        address factoryAddress = address(factory);
        bytes memory factoryCode = factoryAddress.code;

        // Take snapshot and revert to simulate fresh chain
        uint256 snapshot = vm.snapshot();

        // Get nonce (should be 0 on fresh factory)
        uint256 nonce = factory.nonces(owner);

        // Deploy on "chain 1" (current state)
        vm.prank(owner);
        address chain1Address = factory.deployBudget(authorized, roles, managementFee);

        // Revert and redeploy factory at same address (simulating different chain)
        vm.revertTo(snapshot);

        // Redeploy factory at the SAME address using vm.etch to simulate cross-chain deployment
        vm.etch(factoryAddress, factoryCode);
        factory = ManagedBudgetWithFeesV2Factory(factoryAddress);

        // Predict address on "chain 2" using same nonce
        address chain2Prediction = factory.predictBudgetAddress(owner, nonce);

        // Deploy on "chain 2" (nonce also starts at 0)
        vm.prank(owner);
        address chain2Address = factory.deployBudget(authorized, roles, managementFee);

        // Verify addresses match across "chains"
        assertEq(chain1Address, chain2Address, "Addresses should match across chains");
        assertEq(chain2Prediction, chain2Address, "Prediction should match deployment on chain 2");
    }

    ///////////////////////////
    // Initialization Tests  //
    ///////////////////////////

    function test_DeployedBudgetIsInitialized() public {
        vm.prank(owner);
        address budget = factory.deployBudget(authorized, roles, managementFee);
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
        vm.prank(owner);
        address budget = factory.deployBudget(authorized, roles, managementFee);
        ManagedBudgetWithFeesV2 budgetContract = ManagedBudgetWithFeesV2(payable(budget));

        // Verify core is set to first authorized address
        assertTrue(budgetContract.coreAllowed(BoostCore(coreMock)), "Core should be allowed");
    }

    function test_DeployedBudget_RolesAreSet() public {
        vm.prank(owner);
        address budget = factory.deployBudget(authorized, roles, managementFee);
        ManagedBudgetWithFeesV2 budgetContract = ManagedBudgetWithFeesV2(payable(budget));

        // Verify roles are set
        assertTrue(budgetContract.isAuthorized(coreMock), "Core should be authorized");
        assertTrue(budgetContract.isAuthorized(admin), "Admin should be authorized");
    }

    //////////////////////////////
    // Edge Cases & Validation  //
    //////////////////////////////

    function test_DeployBudget_RevertsWithNoAuthorized() public {
        address[] memory emptyAuth = new address[](0);
        uint256[] memory emptyRoles = new uint256[](0);

        vm.expectRevert("Must have at least one authorized address");
        vm.prank(owner);
        factory.deployBudget(emptyAuth, emptyRoles, managementFee);
    }

    function test_DeployBudget_RevertsWithMismatchedArrays() public {
        uint256[] memory shortRoles = new uint256[](1);
        shortRoles[0] = 0;

        vm.expectRevert("Authorized and roles length mismatch");
        vm.prank(owner);
        factory.deployBudget(authorized, shortRoles, managementFee);
    }

    function test_DeployBudget_RevertsWithExcessiveFee() public {
        uint256 excessiveFee = 10001; // > 100%

        vm.expectRevert("Fee cannot exceed 100%");
        vm.prank(owner);
        factory.deployBudget(authorized, roles, excessiveFee);
    }

    function test_DeployBudget_MaxFee() public {
        uint256 maxFee = 10000; // 100%

        vm.prank(owner);
        address budget = factory.deployBudget(authorized, roles, maxFee);
        ManagedBudgetWithFeesV2 budgetContract = ManagedBudgetWithFeesV2(payable(budget));

        assertEq(budgetContract.managementFee(), maxFee, "Max fee should be set");
    }

    function test_DeployBudget_ZeroFee() public {
        uint256 zeroFee = 0;

        vm.prank(owner);
        address budget = factory.deployBudget(authorized, roles, zeroFee);
        ManagedBudgetWithFeesV2 budgetContract = ManagedBudgetWithFeesV2(payable(budget));

        assertEq(budgetContract.managementFee(), zeroFee, "Zero fee should be set");
    }

    ////////////////////////////
    // Functional Tests       //
    ////////////////////////////

    function test_DeployedBudget_CanAllocate() public {
        vm.prank(owner);
        address budget = factory.deployBudget(authorized, roles, managementFee);
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
        vm.prank(owner);
        address budget = factory.deployBudget(authorized, roles, managementFee);
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

    function testFuzz_PredictAndDeploy(address _owner) public {
        vm.assume(_owner != address(0));

        // Get current nonce for this owner
        uint256 nonce = factory.nonces(_owner);

        // Predict address
        address predictedAddress = factory.predictBudgetAddress(_owner, nonce);

        // Deploy
        vm.prank(_owner);
        address actualAddress = factory.deployBudget(authorized, roles, managementFee);

        // Verify match
        assertEq(predictedAddress, actualAddress, "Fuzz: Predicted should match actual");

        // Verify nonce incremented
        assertEq(factory.nonces(_owner), nonce + 1, "Fuzz: Nonce should increment");
    }

    function testFuzz_DeployWithDifferentOwners(address _owner) public {
        vm.assume(_owner != address(0));

        vm.prank(_owner);
        address budget = factory.deployBudget(authorized, roles, managementFee);
        ManagedBudgetWithFeesV2 budgetContract = ManagedBudgetWithFeesV2(payable(budget));

        assertEq(budgetContract.owner(), _owner, "Fuzz: Owner should match");
    }

    function testFuzz_DeployWithDifferentFees(uint256 _fee) public {
        _fee = bound(_fee, 0, 10000);

        vm.prank(owner);
        address budget = factory.deployBudget(authorized, roles, _fee);
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

    function testFuzz_MultipleDeploysIncrementNonce(uint8 deployCount) public {
        vm.assume(deployCount > 0 && deployCount <= 10);

        uint256 initialNonce = factory.nonces(owner);

        for (uint8 i = 0; i < deployCount; i++) {
            vm.prank(owner);
            factory.deployBudget(authorized, roles, managementFee);
        }

        assertEq(factory.nonces(owner), initialNonce + deployCount, "Nonce should increment by deploy count");
    }

    //////////////////////////////
    // setImplementation Tests  //
    //////////////////////////////

    function test_SetImplementation() public {
        address oldImplementation = factory.implementation();
        address newImplementation = makeAddr("newImplementation");

        vm.expectEmit(true, true, true, true);
        emit ManagedBudgetWithFeesV2Factory.ImplementationUpdated(oldImplementation, newImplementation);

        factory.setImplementation(newImplementation);

        assertEq(factory.implementation(), newImplementation, "Implementation should be updated");
    }

    function test_SetImplementation_RevertsWhenNotOwner() public {
        address nonOwner = makeAddr("nonOwner");
        address newImplementation = makeAddr("newImplementation");

        vm.prank(nonOwner);
        vm.expectRevert();
        factory.setImplementation(newImplementation);
    }

    function test_SetImplementation_RevertsWithZeroAddress() public {
        vm.expectRevert("Implementation cannot be zero address");
        factory.setImplementation(address(0));
    }

    function test_SetImplementation_UpdatesImplementation() public {
        address oldImplementation = factory.implementation();
        address newImplementation = makeAddr("newImplementation");

        factory.setImplementation(newImplementation);

        assertEq(factory.implementation(), newImplementation, "Implementation should be updated");
        assertTrue(oldImplementation != newImplementation, "Old and new implementations should differ");
    }

    function test_SetImplementation_EmitsEvent() public {
        address oldImplementation = factory.implementation();
        address newImplementation = makeAddr("newImplementation");

        vm.expectEmit(true, true, true, true);
        emit ManagedBudgetWithFeesV2Factory.ImplementationUpdated(oldImplementation, newImplementation);

        factory.setImplementation(newImplementation);
    }

    function test_SetImplementation_MultipleUpdates() public {
        address implementation1 = makeAddr("implementation1");
        address implementation2 = makeAddr("implementation2");
        address implementation3 = makeAddr("implementation3");

        // First update
        factory.setImplementation(implementation1);
        assertEq(factory.implementation(), implementation1, "First update should succeed");

        // Second update
        factory.setImplementation(implementation2);
        assertEq(factory.implementation(), implementation2, "Second update should succeed");

        // Third update
        factory.setImplementation(implementation3);
        assertEq(factory.implementation(), implementation3, "Third update should succeed");
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
