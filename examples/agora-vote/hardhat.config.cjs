require('dotenv').config();
const { optimism } = require('viem/chains');

module.exports = {
  networks: {
    hardhat: {
      // We might not need the mine() function if we use this code https://github.com/NomicFoundation/hardhat/pull/5394/files
      chainId: optimism.id,
      //hardfork: 'cancun',
      forking: {
        url: optimism.rpcUrls.default.http[0],
      },
    },
  },
};
