import { defineConfig, Config } from '@wagmi/cli'
import { actions, hardhat, react } from '@wagmi/cli/plugins'

const exclude = [
  'Ownable.sol/**',
  'MockERC*.sol/**',

  // Ignore tests and scripts
  '**.t.sol/*.json',
  '**.s.sol/*.json',
];

export default defineConfig({
  out: "artifacts/generated.ts",
  plugins: [
    hardhat({
      project: ".",
      exclude,
    }),
    react(),
    actions(),
  ],
}) as Config;
