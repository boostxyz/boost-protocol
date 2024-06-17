/** @type {import('vite').UserConfig} */
export default {
  build: {
    rollupOptions: {
      external: [/wagmi/],
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
