import { loadEnv } from 'vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  define: {
    __DEFAULT_CHAIN_ID__: 42161,
  },
  test: {
    fileParallelism: false,
    env: loadEnv('', process.cwd(), ''),
    globalSetup: process.env.CI ? [] : ['../../test/src/setup.hardhat.ts'],
    hookTimeout: 30_000,
    testTimeout: 30_000,
  },
});
