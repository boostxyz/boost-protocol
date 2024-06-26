require('@nomicfoundation/hardhat-toolbox-viem');

task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
  console.log(hre);
  const testClient = await hre.viem.getTestClient();
  // console.log(testClient);
  console.log(hre.config.networks.hardhat.accounts);
});

module.exports = {
  solidity: '0.8.24',
};
