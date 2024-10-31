import { seed } from './commands/create-seed';
import { deploy } from './commands/deploy';
import type { Command } from './utils';

export type Commands = {
  deploy: Command;
  seed: Command;
};

export const commands: Commands = {
  deploy,
  seed,
};
