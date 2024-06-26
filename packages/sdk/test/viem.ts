import { createConfig } from '@wagmi/core';
import { http, createTestClient, publicActions, walletActions } from 'viem';
import { hardhat } from 'viem/chains';

import { privateKeyToAccount } from 'viem/accounts';
import { accounts } from './accounts';

const { account, key } = accounts.at(0)!;
export const testAccount = privateKeyToAccount(key);

export const mockWalletClient = createTestClient({
  transport: http(),
  chain: hardhat,
  mode: 'hardhat',
  account,
  key,
})
  .extend(publicActions)
  .extend(walletActions);

export function setupConfig(walletClient = mockWalletClient) {
  return createConfig({
    chains: [hardhat],
    client: () => walletClient,
  });
}
