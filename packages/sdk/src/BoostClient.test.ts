import { http, createConfig } from '@wagmi/core';
import { sepolia } from 'viem/chains';
import { expect, test } from 'vitest';
import {
  SimpleAllowList,
  type SimpleAllowListPayload,
} from './AllowLists/SimpleAllowList';
import { BoostClient } from './BoostClient';

test('expect true', async () => {
  const config = createConfig({
    chains: [sepolia],
    transports: { [sepolia.id]: http() },
  });
  const client = new BoostClient({
    address: '0x',
    config,
  });

  const allowList = new SimpleAllowList(config, '0x');
  allowList.isAllowed('0x');
  // or
  const _allowList = new SimpleAllowList('0x');
  _allowList.isAllowed(config, '0x');
  // or
  const al = client.SimpleAllowList('0x');
  const _al = client.SimpleAllowList({ owner: '0x', allowed: [] });

  const boost = await client.createBoost({
    allowList,
  });
});
