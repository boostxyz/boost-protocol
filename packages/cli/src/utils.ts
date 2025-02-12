import { createConfig } from '@wagmi/core';
import {
  http,
  type Client,
  type Hex,
  createTestClient,
  createWalletClient,
  publicActions,
  walletActions,
} from 'viem';
import { mnemonicToAccount, privateKeyToAccount } from 'viem/accounts';
import * as chains from 'viem/chains';

export const Chains = chains as Record<string, chains.Chain>;

export type Options = {
  help?: boolean;
  version?: boolean;
  chain?: string;
  privateKey?: string;
  mnemonic?: string;
  rpcUrl?: string;
  out?: string;
  cacheDir?: string;
  force?: boolean;
  format?: 'env' | 'json';
};

export type Command<T extends Record<string, unknown> = {}> = (
  positionals: string[],
  options: Options,
) => Promise<T>;

export function objectToEnv<T extends object>(obj: T) {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    return `${acc}${key}=${JSON.stringify(value)}\n`;
  }, '');
}

export function envToObject(str: string): object {
  return str.split('\n').reduce(
    (acc, envPair) => {
      let [key, value] = envPair.split('=');
      if (!key || !value) return acc;
      try {
        value = JSON.parse(value);
        // biome-ignore lint/suspicious/noEmptyBlockStatements: we don't care if a value isn't valid, let it be
      } catch {}
      acc[key] = value;
      return acc;
    },
    {} as Record<string, unknown>,
  );
}

export function validateJson(str: string): Record<string, unknown> | false {
  try {
    return JSON.parse(str);
  } catch (_e) {
    return false;
  }
}

export function getDeployableOptions({
  chain: _chain,
  privateKey,
  mnemonic,
  rpcUrl,
}: {
  chain: string;
  privateKey?: string;
  mnemonic?: string;
  rpcUrl?: string;
}) {
  const chain = Chains[_chain];

  if (!chain) throw new Error(`No matching chain for ${chain}`);

  const account = privateKey
    ? privateKeyToAccount(privateKey as Hex)
    : mnemonicToAccount(mnemonic as string, { addressIndex: 0 });
  let client: Client;
  if (chain === Chains.hardhat || chain === Chains.anvil) {
    client = createTestClient({
      transport: http(rpcUrl ?? 'http://127.0.0.1:8545', { retryCount: 0 }),
      chain: chain,
      mode: chain === Chains.hardhat ? 'hardhat' : 'anvil',
      account,
      key: privateKey,
    })
      .extend(publicActions)
      .extend(walletActions);
  } else {
    client = createWalletClient({
      account,
      chain,
      transport: rpcUrl ? http(rpcUrl, { retryCount: 0 }) : http(),
    }).extend(publicActions);
  }
  const config = createConfig({
    chains: [chain],
    // biome-ignore lint/suspicious/noExplicitAny: Client will not be undefined
    client: () => client as any,
  });

  return [{ config, account }, chain] as const;
}
