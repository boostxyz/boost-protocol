import { mock } from '@wagmi/connectors';
import { createConfig } from '@wagmi/core';
import { http, createTestClient, publicActions, walletActions } from 'viem';
import { hardhat } from 'viem/chains';
import { accounts } from './accounts';

const { account, key } = accounts.at(0)!;

export const mockWalletClient = createTestClient({
  transport: http(),
  chain: hardhat,
  mode: 'hardhat',
  account,
  key,
  // pollingInterval: 250,
})
  .extend(publicActions)
  .extend(walletActions);

export function setupConfig(walletClient = mockWalletClient) {
  return createConfig({
    chains: [hardhat],
    connectors: [mock({ accounts: [account] })],
    client: () => walletClient,
  });
}
