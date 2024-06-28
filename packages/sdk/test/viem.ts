import { createConfig } from '@wagmi/core';
import {
  http,
  createTestClient,
  publicActions,
  walletActions,
  zeroAddress,
  zeroHash,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { hardhat } from 'viem/chains';
import { accounts } from './accounts';

const { account, key } = accounts.at(0) || {
  account: zeroAddress,
  key: zeroHash,
};

export { account, key };
export const testAccount = privateKeyToAccount(key);

export const mockWalletClient = createTestClient({
  transport: http(),
  chain: hardhat,
  mode: 'hardhat',
  account: testAccount,
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
