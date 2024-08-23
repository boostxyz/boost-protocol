/** @type {import('vite').UserConfig} */
export default {
  build: {
    rollupOptions: {
      external: [/^viem/, /^@wagmi(?!.*\/codegen)/],
    },
    lib: {
      entry: ['artifacts/generated.ts'],
      emptyOutDir: false,
      name: 'BoostEVM',
      fileName: (module, name) => {
        return `${name}.${module === 'es' ? 'js' : 'cjs'}`;
      },
    },
  },
};
