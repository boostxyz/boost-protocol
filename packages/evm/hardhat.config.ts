import "@nomicfoundation/hardhat-viem";
import "@nomicfoundation/hardhat-toolbox-viem";
import "@nomicfoundation/hardhat-foundry";

export default {
  solidity: "0.8.24",
  compilerOptions: {
    optimizer: {
      enabled: true,
      runs: 10_000,
    }
  }
};
