/** @type {import('vite').UserConfig} */
export default {
  build: {
    rollupOptions: {
      external: [/wagmi/, /viem/],
    },
    lib: {
      entry: ['src/index.ts'],
      emptyOutDir: false,
      name: 'BoostSDK',
      fileName: (module, name) => {
        return `${name}.${module === 'es' ? 'js' : 'cjs'}`;
      },
    },
  },
};
