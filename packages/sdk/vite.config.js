import 'dotenv/config';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import packageJson from './package.json';

// get all deployments checked into `packages/evm/deploys`
const deployments = (
  await readdirSync(resolve(__dirname, '../evm/deploys'))
).filter((file) => Number(file.split('.').at(0)) > 0);

// Record<BaseName, Record<chainId, Address>>
const baseContractChainIdAddresses = {};
// traverse deployments, build data structure to define in build
for (const chainDeployment of deployments) {
  const baseAddresses = JSON.parse(
    (await readFileSync(`../evm/deploys/${chainDeployment}`)).toString(),
  );
  const chainId = Number(chainDeployment.split('.').at(0));
  for (const [baseName, address] of Object.entries(baseAddresses)) {
    if (!baseContractChainIdAddresses[baseName])
      baseContractChainIdAddresses[baseName] = {};
    baseContractChainIdAddresses[baseName][chainId] = address;
  }
}

// Write the file to avoid stringifying / parsing injected string at runtime
const baseContractChainIdAddressesArtifact = JSON.stringify(
  baseContractChainIdAddresses,
  null,
  2,
);
writeFileSync(
  resolve(__dirname, './dist/deployments.json'),
  baseContractChainIdAddressesArtifact,
);
// parse package.json exports and map them to their associated src/**/*.ts entrypoint folders
const moduleDirectories = Object.keys(packageJson.exports).reduce(
  (acc, path) => {
    if (path === '.') return acc;
    const parts = path.split('/');
    // remove .
    parts.shift();
    // get the module's name
    const mod = parts.pop();
    acc[mod] = parts.join('/');
    return acc;
  },
  {},
);

/** @type {import('vite').UserConfig} */
export default {
  define: {
    __DEFAULT_CHAIN_ID__: Number(process.env.DEFAULT_CHAIN_ID) || 11155111,
  },
  build: {
    emptyOutDir: false,
    sourcemap: true,
    rollupOptions: {
      external: [/^viem/, /^@wagmi(?!.*\/codegen)/],
    },
    lib: {
      entry: Object.keys(packageJson.exports)
        .filter((exportName) => !exportName.endsWith('.json'))
        .map((mod) => resolve('./src', `${mod === '.' ? 'index' : mod}.ts`)),
      name: 'BoostSDK',
      fileName: (module, name) => {
        if (name === 'index')
          return `${name}.${module === 'es' ? 'js' : 'cjs'}`;
        return `${moduleDirectories[name] ? moduleDirectories[name] + '/' : ''}${name}.${module === 'es' ? 'js' : 'cjs'}`;
      },
    },
  },
};
