// This file was autogenerated by hardhat-viem, do not edit it.
// prettier-ignore
// tslint:disable
// eslint-disable

import "hardhat/types/artifacts";
import type { GetContractReturnType } from "@nomicfoundation/hardhat-viem/types";

import { AERC721MintAction$Type } from "./AERC721MintAction";

declare module "hardhat/types/artifacts" {
  interface ArtifactsMap {
    ["AERC721MintAction"]: AERC721MintAction$Type;
    ["contracts/actions/AERC721MintAction.sol:AERC721MintAction"]: AERC721MintAction$Type;
  }

  interface ContractTypesMap {
    ["AERC721MintAction"]: GetContractReturnType<AERC721MintAction$Type["abi"]>;
    ["contracts/actions/AERC721MintAction.sol:AERC721MintAction"]: GetContractReturnType<AERC721MintAction$Type["abi"]>;
  }
}