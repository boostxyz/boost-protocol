#!/usr/bin/env node
'use strict';

import fs from 'node:fs/promises';
import path from 'node:path';
import arg from 'arg';
import { version as sdkVersion } from '../../sdk/package.json';
import { version } from '../package.json';
import help from './help';
import { commands } from './index';
import { type Options, envToObject, objectToEnv, validateJson } from './utils';

type validCommands = keyof typeof commands;

const args = arg({
  '--help': Boolean,
  '--version': Boolean,
  '--chain': String,
  '--privateKey': String,
  '--out': String,
  '--cacheDir': String,
  '--force': Boolean,
  '--format': String,
  '--from': String,
  '--generate-seed': String,
  '--generate-erc20': Boolean,
  '-h': '--help',
  '-v': '--version',
});

async function main(): Promise<number | undefined> {
  const { _, ..._options } = args;
  const command = _.at(0) as validCommands;
  if (args['--version']) {
    console.log(version);
    return 0;
  }
  if (args['--help']) {
    console.log(help);
    return 0;
  }
  if (!command || !commands[command]) {
    console.log(help);
    return 127;
  }
  const options: Options = {
    help: _options['--help'],
    version: _options['--version'],
    chain: _options['--chain'],
    privateKey: _options['--privateKey'],
    out: _options['--out'],
    cacheDir: _options['--cacheDir'],
    force: _options['--force'],
    from: _options['--from'],
    generateSeed: _options['--generate-seed'],
    generateERC20: _options['--generate-erc20'],
    format: _options['--format'] as Options['format'],
  };
  // Default format to .env syntax
  if (!options.format) options.format = 'env';

  // Where to dump cached command result, default to ./.boost
  const cacheDir = options.cacheDir?.startsWith('./')
    ? path.resolve(process.cwd(), options.cacheDir)
    : options.cacheDir || path.resolve(process.cwd(), './.boost');
  // Build a cache key resembling - 'deploy-v0-0-mainnet-00000'
  const cacheKey = `${command}-v${sdkVersion.split('.').slice(0, 2).join('-')}-${options.chain}-${options.privateKey?.slice(options.privateKey.length - 5)}`;
  const cachedResultPath = path.resolve(cacheDir, cacheKey);

  // run command and format result for cache
  async function runCommandAndFormat() {
    const result = await commands[command](options);
    return options.format === 'env'
      ? objectToEnv(result)
      : JSON.stringify(result, null, 2);
  }

  // cached result will either be stringified json, or env formatted string
  let cachedResult;
  // if we're forcing, always run command, otherwise try to read
  if (options.force) {
    cachedResult = await runCommandAndFormat();
  } else {
    try {
      cachedResult = await fs.readFile(cachedResultPath, { encoding: 'utf-8' });
      const parsedResult = validateJson(cachedResult);
      // if we want json and the cached result is env
      if (options.format === 'json' && parsedResult === false) {
        cachedResult = JSON.stringify(envToObject(cachedResult), null, 2);
      }
      // if we want env and cached result is json
      if (options.format === 'env' && parsedResult !== false) {
        cachedResult = objectToEnv(parsedResult);
      }
    } catch (e: unknown) {
      // cached result not found, run command and cache
      if (e instanceof Error && e.message.includes('ENOENT')) {
        cachedResult = await runCommandAndFormat();
      } else throw e;
    }
  }

  // if for some reason there's no cached result, throw
  if (typeof cachedResult == undefined) {
    throw new Error(
      `No result found after cache and command operations. This shouldn't happen.`,
    );
  }

  // Cache result
  //await fs.mkdir(cacheDir, { recursive: true });
  //await fs.writeFile(cachedResultPath, cachedResult, { encoding: 'utf8' });

  // If specifying an outfile
  if (options.out) {
    await fs.mkdir(options.out, { recursive: true });
    await fs.writeFile(options.out, cachedResult, { encoding: 'utf8' });
    console.log(`Succesfully wrote result to ${options.out}`);
  } else {
    console.log(cachedResult);
  }
}

main()
  .then((result = 0) => process.exit(result))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
