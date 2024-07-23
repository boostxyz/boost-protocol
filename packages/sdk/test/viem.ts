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

export const makeTestClient = () =>
  createTestClient({
    transport: http(undefined, { retryCount: 0 }),
    chain: hardhat,
    mode: 'hardhat',
    account: testAccount,
    key,
  })
    .extend(publicActions)
    .extend(walletActions);

export type TestClient = ReturnType<typeof makeTestClient>;

export function setupConfig(walletClient = makeTestClient()) {
  return createConfig({
    chains: [hardhat],
    client: () => walletClient,
  });
}
