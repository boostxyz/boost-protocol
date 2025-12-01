// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {LibClone} from "@solady/utils/LibClone.sol";
import {Ownable} from "@solady/auth/Ownable.sol";
import {ManagedBudgetWithFeesV2} from "./ManagedBudgetWithFeesV2.sol";
import {ManagedBudgetWithFees} from "./ManagedBudgetWithFees.sol";

/// @title ManagedBudgetWithFeesV2 Factory
/// @notice Factory contract for deploying ManagedBudgetWithFeesV2 instances with deterministic addresses using CREATE2
/// @dev This factory enables cross-chain deployments at the same address when using the same salt and initialization parameters
contract ManagedBudgetWithFeesV2Factory is Ownable {
    /// @notice The base implementation of ManagedBudgetWithFeesV2 used for cloning
    address public implementation;
    /// @notice Emitted when a new ManagedBudgetWithFeesV2 is deployed
    /// @param budget The address of the newly deployed budget
    /// @param owner The owner of the budget
    /// @param implementation The implementation address used for cloning
    /// @param salt The salt used for CREATE2 deployment
    event BudgetDeployed(address indexed budget, address indexed owner, address indexed implementation, bytes32 salt);

    /// @notice Emitted when the implementation address is updated
    /// @param oldImplementation The previous implementation address
    /// @param newImplementation The new implementation address
    event ImplementationUpdated(address indexed oldImplementation, address indexed newImplementation);

    /// @notice Deploys the factory with the specified implementation
    /// @param _managedBudgetWithFeesV2BaseAddress The address of the ManagedBudgetWithFeesV2 implementation
    constructor(address _managedBudgetWithFeesV2BaseAddress) {
        require(_managedBudgetWithFeesV2BaseAddress != address(0), "Implementation cannot be zero address");
        implementation = _managedBudgetWithFeesV2BaseAddress;
        _initializeOwner(msg.sender);
    }

    /// @notice Deploys a new ManagedBudgetWithFeesV2 contract using CREATE2
    /// @param owner The owner address for the budget
    /// @param authorized Array of authorized addresses (first address should be the BoostCore contract)
    /// @param roles Array of roles corresponding to each authorized address
    /// @param managementFee The management fee in basis points (100 = 1%)
    /// @param nonce A nonce value that combines with owner to generate deterministic address
    /// @return budget The address of the newly deployed budget
    /// @dev The same owner + nonce will generate the same address across different chains
    /// @dev The first address in the authorized array must be the BoostCore contract
    function deployBudget(
        address owner,
        address[] calldata authorized,
        uint256[] calldata roles,
        uint256 managementFee,
        uint256 nonce
    ) external returns (address budget) {
        require(authorized.length > 0, "Must have at least one authorized address");
        require(authorized.length == roles.length, "Authorized and roles length mismatch");
        require(managementFee <= 10000, "Fee cannot exceed 100%");

        // Derive salt from owner + nonce to ensure only this owner can deploy at this address
        bytes32 salt = keccak256(abi.encodePacked(owner, nonce));

        // Clone the implementation using CREATE2 for deterministic address
        budget = LibClone.cloneDeterministic(implementation, salt);

        // Prepare initialization data
        bytes memory initData = abi.encode(
            ManagedBudgetWithFees.InitPayloadWithFee({
                owner: owner,
                authorized: authorized,
                roles: roles,
                managementFee: managementFee
            })
        );

        // Initialize the budget
        ManagedBudgetWithFeesV2(payable(budget)).initialize(initData);

        emit BudgetDeployed(budget, owner, implementation, salt);
    }

    /// @notice Computes the deterministic address for a budget deployment
    /// @param owner The owner address for the budget
    /// @param nonce A nonce value that combines with owner to generate deterministic address
    /// @return The predicted address where the budget will be deployed
    /// @dev This can be used to predict the address before deployment
    /// @dev Note: The address will be the same across chains only if this factory is deployed at the same address on each chain.
    function predictBudgetAddress(address owner, uint256 nonce) external view returns (address) {
        bytes32 salt = keccak256(abi.encodePacked(owner, nonce));
        return LibClone.predictDeterministicAddress(implementation, salt, address(this));
    }

    /// @notice Updates the implementation address
    /// @param _newImplementation The new implementation address
    /// @dev Only callable by the owner
    function setImplementation(address _newImplementation) external onlyOwner {
        require(_newImplementation != address(0), "Implementation cannot be zero address");
        address oldImplementation = implementation;
        implementation = _newImplementation;
        emit ImplementationUpdated(oldImplementation, _newImplementation);
    }
}
