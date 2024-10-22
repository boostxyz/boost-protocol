import { createConfig } from '@wagmi/core';
import {
  http,
  type TestClient,
  createTestClient,
  publicActions,
  walletActions,
  zeroAddress,
  zeroHash,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { arbitrum, base, hardhat, optimism, sepolia } from 'viem/chains';
import { accounts } from './accounts';

export type { TestClient };

const { account, key } = accounts.at(0) || {
  account: zeroAddress,
  key: zeroHash,
};

export { account, key };
export const testAccount = privateKeyToAccount(key);

export const makeTestClient: () => TestClient = () =>
  createTestClient({
    transport: http('http://127.0.0.1:8545', { retryCount: 0 }),
    chain: hardhat,
    mode: 'hardhat',
    account: testAccount,
    key,
  })
    .extend(publicActions)
    .extend(walletActions) as any;

export function setupConfig(walletClient = makeTestClient()) {
  return createConfig({
    ssr: true,
    chains: [hardhat, arbitrum, base, optimism, sepolia],
    client: () => walletClient as any,
  });
}
