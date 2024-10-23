import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import packageJson from './package.json';

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
const config = {
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
      entry: './src/index.ts',
      name: 'BoostSignatures',
      fileName: (module, name) => {
        if (name === 'index')
          return `${name}.${module === 'es' ? 'js' : 'cjs'}`;
        return `${moduleDirectories[name] ? moduleDirectories[name] + '/' : ''}${name}.${module === 'es' ? 'js' : 'cjs'}`;
      },
    },
  },
};

export default config;
