import type { Address, Hex } from 'viem';

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type CallParams<T extends (_c: any, params: any) => any> = Omit<
  Parameters<T>[1],
  'address' | 'args'
>;
