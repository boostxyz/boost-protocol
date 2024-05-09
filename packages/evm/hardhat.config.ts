import "@nomicfoundation/hardhat-foundry";
import "@nomicfoundation/hardhat-viem";
import "@nomicfoundation/hardhat-ignition-viem";
import "@nomicfoundation/hardhat-toolbox-viem";

export default {
  solidity: {
    settings: {
      evmVersion: "cancun",
    },
    version: "0.8.25",
  },
  compilerOptions: {
    optimizer: {
      enabled: true,
      runs: 10_000,
    },
  },
};
