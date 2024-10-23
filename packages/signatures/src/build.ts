import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import {
  type Hex,
  type ParseAbiItem,
  parseAbiItem,
  toEventSelector,
  toFunctionSelector,
} from 'viem';
import { pad } from 'viem';
import events from '../manifests/events.json' with { type: 'json' };
import functions from '../manifests/functions.json' with { type: 'json' };

type SignatureType = 'event' | 'function';

interface AbiIndex {
  [key: string]: ParseAbiItem<string>;
}

interface SelectorIndex {
  [key: string]: Hex | string;
}

interface SignatureRepo {
  abi: AbiIndex;
  selectors: SelectorIndex;
}

const index = {
  events: {
    abi: {},
    selectors: {},
  },
  functions: {
    abi: {},
    selectors: {},
  },
};

function addToIndex(
  type: SignatureType,
  signature: string,
  target: SignatureRepo,
) {
  if (signature.startsWith('//') || signature.startsWith('*')) return;

  const segmentedSignature = signature.split(type);
  const signatureWithoutType =
    typeof segmentedSignature[1] == 'undefined'
      ? signature
      : segmentedSignature[1].trim();
  const itemString = `${type} ${signatureWithoutType}`;
  const selector = generateSelector(type, signature);
  const abiItem = parseAbiItem(itemString);
  target.abi[selector] = abiItem;
  target.abi[signatureWithoutType] = abiItem;
  target.selectors[signatureWithoutType] = selector;
  target.selectors[selector] = signatureWithoutType;
}

function generateSelector(type: SignatureType, signature: string) {
  switch (type) {
    case 'event':
      return toEventSelector(signature);
    case 'function':
      return pad(toFunctionSelector(signature));
    default:
      throw new Error(`Invalid type: ${type}`);
  }
}

for (let signature of events) {
  addToIndex('event', signature, index.events);
}

for (let signature of functions) {
  addToIndex('function', signature, index.functions);
}

await Promise.all([
  writeFile(
    resolve(process.cwd(), './dist/index.json'),
    JSON.stringify(index, null, 2),
  ),
  writeFile(
    resolve(process.cwd(), './dist/events.json'),
    JSON.stringify(index.events, null, 2),
  ),
  writeFile(
    resolve(process.cwd(), './dist/functions.json'),
    JSON.stringify(index.functions, null, 2),
  ),
]);

/*

signature parse pipeline TODO

1. remove duplicate spaces
2. parse out capture groups with specified regex for functions and types: https://regex101.com/r/7fPJoY/1
3. reconstruct normalized string with capture groups
4. error if reconstruction fails (any capture groups are null)
5. separate out named param vs no param named abis
6. hash abi for events to generate a good lookup hash that respects indexing

We need the following functions:
  - normalizeAbiItem
  - generateEventHash
*/
