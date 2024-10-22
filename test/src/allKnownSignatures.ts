import { events, functions } from '@boostxyz/signatures';
import type { AbiEvent, AbiFunction, Hex } from 'viem';

export const allKnownSignatures = {
  ...events.abi,
  ...functions.abi,
} as Record<Hex, AbiFunction | AbiEvent>;
