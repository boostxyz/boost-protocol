function readPackage(pkg) {
  // we don't want to publish @boostxyz/evm, and don't want it to appear in sdk's dependencies
  if (pkg.name === '@boostxyz/sdk') {
    pkg.dependencies = {
      ...pkg.dependencies,
      '@boostxyz/evm': 'workspace:*',
    };
  }

  return pkg;
}

module.exports = {
  hooks: {
    readPackage,
  },
};
