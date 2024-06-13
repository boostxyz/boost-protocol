// This file was autogenerated by hardhat-viem, do not edit it.
// prettier-ignore
// tslint:disable
// eslint-disable

import type { Address } from "viem";
import type { GetContractReturnType } from "@nomicfoundation/hardhat-viem/types";
import "@nomicfoundation/hardhat-viem/types";

export interface BoostLib$Type {
  "_format": "hh-sol-artifact-1",
  "contractName": "BoostLib",
  "sourceName": "contracts/shared/BoostLib.sol",
  "abi": [],
  "bytecode": "0x6055604b600b8282823980515f1a607314603f577f4e487b71000000000000000000000000000000000000000000000000000000005f525f60045260245ffd5b305f52607381538281f3fe730000000000000000000000000000000000000000301460806040525f80fdfea2646970667358221220e27d8083a7d8974c7ad085df29284bd9369e7c0268f2844c220d20b82e00e65364736f6c63430008190033",
  "deployedBytecode": "0x730000000000000000000000000000000000000000301460806040525f80fdfea2646970667358221220e27d8083a7d8974c7ad085df29284bd9369e7c0268f2844c220d20b82e00e65364736f6c63430008190033",
  "linkReferences": {},
  "deployedLinkReferences": {}
}

declare module "@nomicfoundation/hardhat-viem/types" {
  export function deployContract(
    contractName: "BoostLib",
    constructorArgs?: [],
    config?: DeployContractConfig
  ): Promise<GetContractReturnType<BoostLib$Type["abi"]>>;
  export function deployContract(
    contractName: "contracts/shared/BoostLib.sol:BoostLib",
    constructorArgs?: [],
    config?: DeployContractConfig
  ): Promise<GetContractReturnType<BoostLib$Type["abi"]>>;

  export function sendDeploymentTransaction(
    contractName: "BoostLib",
    constructorArgs?: [],
    config?: SendDeploymentTransactionConfig
  ): Promise<{
    contract: GetContractReturnType<BoostLib$Type["abi"]>;
    deploymentTransaction: GetTransactionReturnType;
  }>;
  export function sendDeploymentTransaction(
    contractName: "contracts/shared/BoostLib.sol:BoostLib",
    constructorArgs?: [],
    config?: SendDeploymentTransactionConfig
  ): Promise<{
    contract: GetContractReturnType<BoostLib$Type["abi"]>;
    deploymentTransaction: GetTransactionReturnType;
  }>;

  export function getContractAt(
    contractName: "BoostLib",
    address: Address,
    config?: GetContractAtConfig
  ): Promise<GetContractReturnType<BoostLib$Type["abi"]>>;
  export function getContractAt(
    contractName: "contracts/shared/BoostLib.sol:BoostLib",
    address: Address,
    config?: GetContractAtConfig
  ): Promise<GetContractReturnType<BoostLib$Type["abi"]>>;
}