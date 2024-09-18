import { loadEnv } from 'vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  define: {},
  test: {
    fileParallelism: false,
    env: loadEnv('', process.cwd(), ''),
    globalSetup: ['./test/setup.hardhat.ts'],
    // reporters: [
    //   'default',
    //   {
    //     async onWatcherRerun() {
    //       await teardown();
    //       await setup();
    //     },
    //   },
    // ],
  },
});
