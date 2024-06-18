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

// console.log(Object.values(packageJson.exports).map((p) => p.slice(2)));

/** @type {import('vite').UserConfig} */
export default {
  build: {
    rollupOptions: {
      external: [/wagmi/, /viem/],
    },
    lib: {
      entry: Object.values(packageJson.exports),
      emptyOutDir: false,
      name: 'BoostSDK',
      fileName: (module, name) => {
        if (name === 'index')
          return `${name}.${module === 'es' ? 'js' : 'cjs'}`;
        return `${moduleDirectories[name] || ''}/${name}.${module === 'es' ? 'js' : 'cjs'}`;
      },
    },
  },
};
