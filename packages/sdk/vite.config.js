import { resolve } from 'node:path';
import packageJson from './package.json';

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
  build: {
    rollupOptions: {
      external: [/^viem/, /^@wagmi(?!.*\/codegen)/, /^@boostxyz\/signatures/],
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
