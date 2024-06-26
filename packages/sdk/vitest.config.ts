import { defineConfig } from 'vitest/config';
import setup, { teardown } from './test/setup.hardhat';

export default defineConfig({
  test: {
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
