import { type ChildProcessWithoutNullStreams, spawn } from 'node:child_process';
import { kill } from 'node:process';
import findProcess from 'find-process';
import type { GlobalSetupContext } from 'vitest/node';

export async function setupHardhat() {
  const pids = await findProcess('port', 8545);
  if (!pids.length) {
    await createHardhatProcess();
  } else {
    await teardownHardhat(pids);
    await createHardhatProcess();
  }
}

async function teardownHardhat(_pids?: { pid: number }[]) {
  const pids = _pids || (await findProcess('port', 8545));
  for (let pid of pids) {
    kill(pid.pid, 9);
  }
}

function createHardhatProcess(): Promise<ChildProcessWithoutNullStreams> {
  return new Promise((resolve, reject) => {
    const hardhatProcess = spawn('npx', ['hardhat', 'node']);

    hardhatProcess.stdout.on('data', () => {
      resolve(hardhatProcess);
    });

    hardhatProcess.stderr.on('data', (data) => {
      console.error('stderr', data.toString());
      reject(data);
    });

    hardhatProcess.on('close', () => {
      console.log(`hardhat process closed`);
    });
  });
}

export async function setup({}: GlobalSetupContext) {
  const pids = await findProcess('port', 8545);
  let proc: ChildProcessWithoutNullStreams;
  if (pids.length)
    console.log('hardhat process already running, not starting a new one');
  else {
    proc = await createHardhatProcess();
    console.log('hardhat started successfully');
  }

  return function () {
    if (!process.env.HARDHAT_KEEPALIVE && proc && !proc.killed) {
      proc.kill();
    }
  };
}

export default setup;
