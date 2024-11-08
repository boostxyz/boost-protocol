import { resolve } from 'node:path';
import packageJson from './package.json';

const moduleDirectories = Object.keys(packageJson.exports).reduce(
  (acc, path) => {
    if (path === '.') return acc;
    const parts = path.split('/');
    // remove .
    parts.shift();
    // get the module's name
    const mod = parts.pop()!;
    acc[mod] = parts.join('/');
    return acc;
  },
  {} as Record<string, string>,
);

/** @type {import('vite').UserConfig} */
export default {
  build: {
    minify: true,
    rollupOptions: {
      external: [/node\:/, /^@boostxyz\/sdk/],
    },
    lib: {
      entry: Object.keys(packageJson.exports)
        .filter((exportName) => !exportName.endsWith('.json'))
        .map((mod) => resolve('./src', `${mod === '.' ? 'index' : mod}.ts`)),
      name: 'BoostCLI',
      fileName: (module: 'es' | 'cjs', name: string) => {
        if (name === 'index')
          return `${name}.${module === 'es' ? 'js' : 'cjs'}`;
        return `${moduleDirectories[name] ? moduleDirectories[name] + '/' : ''}${name}.${module === 'es' ? 'js' : 'cjs'}`;
      },
    },
    define: {
      __DEFAULT_CHAIN_ID__: 31337,
    },
  },
};
