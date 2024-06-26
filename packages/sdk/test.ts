import { deployContract, getAccount, injected } from '@wagmi/core';
import { http, createTestClient, publicActions, walletActions } from 'viem';
import { mnemonicToAccount } from 'viem/accounts';
import { hardhat } from 'viem/chains';

import { mock } from '@wagmi/connectors';
import { CreateConfigParameters, createConfig } from '@wagmi/core';

const account = mnemonicToAccount(
  'test test test test test test test test test test test junk',
);

console.log(account);

const client = createTestClient({
  chain: hardhat,
  account,
  mode: 'hardhat',
  transport: http(),
})
  .extend(publicActions)
  .extend(walletActions);

export const config = createConfig({
  chains: [hardhat],
  connectors: [
    injected({
      target() {
        return {
          id: 'viemHardhat',
          name: 'Viem Hardhat',
          provider: client,
        };
      },
    }),
  ],
  transports: {
    [hardhat.id]: http(),
  },
});

console.log(client);
// console.log(getAccount(config));

const t = await deployContract(config, {
  account: mnemonicToAccount(
    'test test test test test test test test test test test junk',
  ),
});

// console.log(t);

// const boostClient = new BoostClient({});
