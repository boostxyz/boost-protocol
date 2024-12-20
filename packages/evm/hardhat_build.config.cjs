require('@nomicfoundation/hardhat-foundry');
require('@nomicfoundation/hardhat-viem');
require('@nomicfoundation/hardhat-ignition-viem');

module.exports = {
  solidity: {
    settings: {
      evmVersion: 'cancun',
    },
    version: '0.8.26',
  },
  compilerOptions: {
    optimizer: {
      enabled: true,
      runs: 10_000,
    },
  },
  paths: {
    cache: './cache_hh',
  },
};
