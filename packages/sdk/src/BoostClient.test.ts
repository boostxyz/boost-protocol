import { http, createConfig } from '@wagmi/core';
import { sepolia } from 'viem/chains';
import { test } from 'vitest';
import { SimpleAllowList } from './AllowLists/SimpleAllowList';
import { BoostClient } from './BoostClient';

test('expect true', async () => {
  const config = createConfig({
    chains: [sepolia],
    transports: { [sepolia.id]: http() },
  });
  const client = new BoostClient({
    address: '0xfoobar',
    config,
  });

  // or
  // const _allowList = new SimpleAllowList('0x');
  // _allowList.isAllowed(config, '0x');
  // // or
  const _a = client.SimpleAllowList('0xfoobar');
  // const _al = client.SimpleAllowList({ owner: '0x', allowed: [] });

  const _boost = await client.createBoost({
    allowList: _a,
  });
});
