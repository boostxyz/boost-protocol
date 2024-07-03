// This file was autogenerated by hardhat-viem, do not edit it.
// prettier-ignore
// tslint:disable
// eslint-disable

import type { Address } from "viem";
import type { GetContractReturnType } from "@nomicfoundation/hardhat-viem/types";
import "@nomicfoundation/hardhat-viem/types";

export interface Budget$Type {
  "_format": "hh-sol-artifact-1",
  "contractName": "Budget",
  "sourceName": "contracts/budgets/Budget.sol",
  "abi": [
    {
      "inputs": [],
      "name": "AlreadyInitialized",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "CloneAlreadyInitialized",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InitializerNotImplemented",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "asset",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "available",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "required",
          "type": "uint256"
        }
      ],
      "name": "InsufficientFunds",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "asset",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "InvalidAllocation",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InvalidInitialization",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InvalidInitializationData",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "NewOwnerIsZeroAddress",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "NoHandoverRequest",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "NotInitializing",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "asset",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "TransferFailed",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "Unauthorized",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "isAuthorized",
          "type": "bool"
        }
      ],
      "name": "Authorized",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "asset",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "Distributed",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint64",
          "name": "version",
          "type": "uint64"
        }
      ],
      "name": "Initialized",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "pendingOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipHandoverCanceled",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "pendingOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipHandoverRequested",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "oldOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "stateMutability": "payable",
      "type": "fallback"
    },
    {
      "inputs": [
        {
          "internalType": "bytes",
          "name": "data_",
          "type": "bytes"
        }
      ],
      "name": "allocate",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "asset_",
          "type": "address"
        }
      ],
      "name": "available",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "cancelOwnershipHandover",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "pendingOwner",
          "type": "address"
        }
      ],
      "name": "completeOwnershipHandover",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes",
          "name": "data_",
          "type": "bytes"
        }
      ],
      "name": "disburse",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes[]",
          "name": "data_",
          "type": "bytes[]"
        }
      ],
      "name": "disburseBatch",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "asset_",
          "type": "address"
        }
      ],
      "name": "distributed",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getComponentInterface",
      "outputs": [
        {
          "internalType": "bytes4",
          "name": "",
          "type": "bytes4"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes",
          "name": "",
          "type": "bytes"
        }
      ],
      "name": "initialize",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account_",
          "type": "address"
        }
      ],
      "name": "isAuthorized",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "result",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "pendingOwner",
          "type": "address"
        }
      ],
      "name": "ownershipHandoverExpiresAt",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "result",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes",
          "name": "data_",
          "type": "bytes"
        }
      ],
      "name": "reclaim",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes",
          "name": "data_",
          "type": "bytes"
        }
      ],
      "name": "reconcile",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "requestOwnershipHandover",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address[]",
          "name": "accounts_",
          "type": "address[]"
        },
        {
          "internalType": "bool[]",
          "name": "authorized_",
          "type": "bool[]"
        }
      ],
      "name": "setAuthorized",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes4",
          "name": "interfaceId",
          "type": "bytes4"
        }
      ],
      "name": "supportsInterface",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "asset_",
          "type": "address"
        }
      ],
      "name": "total",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "stateMutability": "payable",
      "type": "receive"
    }
  ],
  "bytecode": "0x",
  "deployedBytecode": "0x",
  "linkReferences": {},
  "deployedLinkReferences": {}
}

declare module "@nomicfoundation/hardhat-viem/types" {
  export function deployContract(
    contractName: "Budget",
    constructorArgs?: [],
    config?: DeployContractConfig
  ): Promise<GetContractReturnType<Budget$Type["abi"]>>;
  export function deployContract(
    contractName: "contracts/budgets/Budget.sol:Budget",
    constructorArgs?: [],
    config?: DeployContractConfig
  ): Promise<GetContractReturnType<Budget$Type["abi"]>>;

  export function sendDeploymentTransaction(
    contractName: "Budget",
    constructorArgs?: [],
    config?: SendDeploymentTransactionConfig
  ): Promise<{
    contract: GetContractReturnType<Budget$Type["abi"]>;
    deploymentTransaction: GetTransactionReturnType;
  }>;
  export function sendDeploymentTransaction(
    contractName: "contracts/budgets/Budget.sol:Budget",
    constructorArgs?: [],
    config?: SendDeploymentTransactionConfig
  ): Promise<{
    contract: GetContractReturnType<Budget$Type["abi"]>;
    deploymentTransaction: GetTransactionReturnType;
  }>;

  export function getContractAt(
    contractName: "Budget",
    address: Address,
    config?: GetContractAtConfig
  ): Promise<GetContractReturnType<Budget$Type["abi"]>>;
  export function getContractAt(
    contractName: "contracts/budgets/Budget.sol:Budget",
    address: Address,
    config?: GetContractAtConfig
  ): Promise<GetContractReturnType<Budget$Type["abi"]>>;
}
