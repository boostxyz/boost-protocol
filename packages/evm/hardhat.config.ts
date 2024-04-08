import "@nomicfoundation/hardhat-foundry";
import "@nomicfoundation/hardhat-viem";
import "@nomicfoundation/hardhat-ignition-viem";
import "@nomicfoundation/hardhat-toolbox-viem";

export default {
  solidity: "0.8.24",
  compilerOptions: {
    optimizer: {
      enabled: true,
      runs: 10_000,
    }
  }
};
