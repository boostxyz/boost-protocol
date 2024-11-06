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

    function onData(d) {
      if (d.toString().includes('WARNING')) {
        cleanup();
        resolve(hardhatProcess);
      }
    }

    function onError(d) {
      cleanup();
      reject(d);
    }

    function onClose() {
      cleanup();
      console.log(`hardhat process closed`);
    }

    function cleanup() {
      hardhatProcess.stdout.off('data', onData);
      hardhatProcess.stderr.off('data', onError);
    }

    hardhatProcess.stdout.on('data', onData);
    hardhatProcess.stderr.on('data', onError);
    hardhatProcess.on('close', onClose);
  });
}

export async function setup() {
  const pids = await findProcess('port', 8545);
  let proc: ChildProcessWithoutNullStreams;
  if (pids.length)
    console.log('hardhat process already running, not starting a new one');
  else {
    try {
      proc = await createHardhatProcess();
      console.log('hardhat started successfully');
    } catch (_e) {
      console.warn('hardhat may already be running');
    }
  }

  return function () {
    if (proc && !proc.killed) {
      proc.kill();
    }
  };
}

export default setup;
