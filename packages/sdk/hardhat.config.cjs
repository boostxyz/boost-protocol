require('dotenv').config();

module.exports = {
  networks: {
    ...(process.env.VITE_ALCHEMY_API_KEY
      ? {
          hardhat: {
            // We might not need the mine() function if we use this code https://github.com/NomicFoundation/hardhat/pull/5394/files
            chainId: 11155111, // Sepolia chain ID
            //hardfork: 'cancun',
            forking: {
              url:
                'https://eth-sepolia.g.alchemy.com/v2/' +
                process.env.VITE_ALCHEMY_API_KEY,
            },
          },
        }
      : {}),
  },
};
