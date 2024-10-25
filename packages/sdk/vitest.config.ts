import { loadEnv } from 'vite';
import { defineConfig } from 'vitest/config';

const env = loadEnv('', process.cwd(), '');

export default defineConfig({
  define: {
    __DEFAULT_CHAIN_ID__: env.DEFAULT_CHAIN_ID
      ? Number(env['DEFAULT_CHAIN_ID'])
      : 31337,
  },
  test: {
    fileParallelism: false,
    env,
    globalSetup: ['../../test/src/setup.hardhat.ts'],
  },
});
