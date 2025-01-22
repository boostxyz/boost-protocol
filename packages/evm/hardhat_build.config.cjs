require('@nomicfoundation/hardhat-foundry');
require('@nomicfoundation/hardhat-viem');
require('@nomicfoundation/hardhat-ignition-viem');

module.exports = {
  solidity: {
    settings: {
      evmVersion: 'cancun',
      optimizer: {
        enabled: true,
        runs: 10_000,
      },
    },
    version: '0.8.26',
  },
  paths: {
    cache: './cache_hh',
  },
};
