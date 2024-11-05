import { deploy } from './commands/deploy';
import { seed } from './commands/seed';
import type { Command } from './utils';

export type Commands = {
  deploy: Command;
  seed: Command;
};

export const commands: Commands = {
  deploy,
  seed,
};
