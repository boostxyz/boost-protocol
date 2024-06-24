import type { Address, Hex } from 'viem';

export type CallParams<T extends (_c: any, params: any) => any> = Omit<
  Parameters<T>[1],
  'address' | 'args'
>;
