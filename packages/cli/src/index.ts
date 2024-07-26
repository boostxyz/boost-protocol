import { deploy } from './commands/deploy';
import type { Command } from './utils';

export type Commands = {
  deploy: Command;
};

export const commands: Commands = {
  deploy,
};
