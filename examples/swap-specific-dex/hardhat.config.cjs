require('dotenv').config();
module.exports = {
  networks: {
    hardhat: {
      // We might not need the mine() function if we use this code https://github.com/NomicFoundation/hardhat/pull/5394/files
      chainId: 42161, // Arbitrum mainnet chain ID
      //hardfork: 'cancun',
      forking: {
        url:
          'https://arb-mainnet.g.alchemy.com/v2/' +
          process.env.VITE_ALCHEMY_API_KEY,
      },
    },
  },
};
