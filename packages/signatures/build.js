import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { parseAbiItem, toEventSelector, toFunctionSelector } from 'viem';
import { pad } from 'viem';
import events from './manifests/events.json' with { type: 'json' };
import functions from './manifests/functions.json' with { type: 'json' };

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

function addToIndex(type, signature, target) {
  if (signature.startsWith('//') || signature.startsWith('*')) return;
  const signatureWithoutType = signature.startsWith(type)
    ? signature.split(type).at(1).trim()
    : signature;
  const itemString = `${type} ${signatureWithoutType}`;
  const selector = generateSelector(type, signature);
  const abiItem = parseAbiItem(itemString);
  target.abi[selector] = abiItem;
  target.abi[signatureWithoutType] = abiItem;
  target.selectors[signatureWithoutType] = selector;
}

function generateSelector(type, signature) {
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
