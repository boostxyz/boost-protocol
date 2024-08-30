import { defineConfig } from 'vitest/config';

export default defineConfig({
  define: {},
  test: {
    fileParallelism: false,
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
