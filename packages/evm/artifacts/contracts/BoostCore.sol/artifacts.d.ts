// This file was autogenerated by hardhat-viem, do not edit it.
// prettier-ignore
// tslint:disable
// eslint-disable

import "hardhat/types/artifacts";
import type { GetContractReturnType } from "@nomicfoundation/hardhat-viem/types";

import { BoostCore$Type } from "./BoostCore";

declare module "hardhat/types/artifacts" {
  interface ArtifactsMap {
    ["BoostCore"]: BoostCore$Type;
    ["contracts/BoostCore.sol:BoostCore"]: BoostCore$Type;
  }

  interface ContractTypesMap {
    ["BoostCore"]: GetContractReturnType<BoostCore$Type["abi"]>;
    ["contracts/BoostCore.sol:BoostCore"]: GetContractReturnType<BoostCore$Type["abi"]>;
  }
}
