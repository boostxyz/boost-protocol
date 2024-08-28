import { resolve } from 'node:path';
import packageJson from './package.json';

import BoostCoreEvents from '@boostxyz/evm/artifacts/contracts/BoostCore.sol/BoostCore.json' assert {
  type: 'json',
};

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

function extractEvents(json) {
  const { abi } = json;
  return abi.reduce((acc, curr) => {
    if (curr.type === 'event') {
      acc[curr.name] = curr;
    }
    return acc;
  }, {});
}

// To avoid event parsing at runtime, define at build time
const eventsExports = {
  'import.meta.env.BoostCoreEvents': extractEvents(BoostCoreEvents),
};

/** @type {import('vite').UserConfig} */
export default {
  define: {
    ...eventsExports,
  },
  build: {
    rollupOptions: {
      external: [/^viem/, /^@wagmi(?!.*\/codegen)/],
    },
    lib: {
      entry: Object.keys(packageJson.exports).map((mod) =>
        resolve('./src', `${mod === '.' ? 'index' : mod}.ts`),
      ),
      name: 'BoostSDK',
      fileName: (module, name) => {
        if (name === 'index')
          return `${name}.${module === 'es' ? 'js' : 'cjs'}`;
        return `${moduleDirectories[name] ? moduleDirectories[name] + '/' : ''}${name}.${module === 'es' ? 'js' : 'cjs'}`;
      },
    },
  },
};
