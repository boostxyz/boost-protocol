import type { Abi, Hex } from 'viem';

export interface Artifact {
  _format: string;
  contractName: string;
  sourceName: string;
  abi: Abi;
  bytecode: Hex;
  deployedBytecode: string;
  linkReferences: unknown;
  deployedLinkReferences: unknown;
}
