// This file was autogenerated by hardhat-viem, do not edit it.
// prettier-ignore
// tslint:disable
// eslint-disable

import "hardhat/types/artifacts";
import type { GetContractReturnType } from "@nomicfoundation/hardhat-viem/types";

import { ASimpleBudget$Type } from "./ASimpleBudget";

declare module "hardhat/types/artifacts" {
  interface ArtifactsMap {
    ["ASimpleBudget"]: ASimpleBudget$Type;
    ["contracts/budgets/ASimpleBudget.sol:ASimpleBudget"]: ASimpleBudget$Type;
  }

  interface ContractTypesMap {
    ["ASimpleBudget"]: GetContractReturnType<ASimpleBudget$Type["abi"]>;
    ["contracts/budgets/ASimpleBudget.sol:ASimpleBudget"]: GetContractReturnType<ASimpleBudget$Type["abi"]>;
  }
}