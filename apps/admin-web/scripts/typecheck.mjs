import { access, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { spawn } from 'node:child_process';

const currentFile = fileURLToPath(import.meta.url);
const appDirectory = dirname(dirname(currentFile));
const workspaceDirectory = dirname(dirname(appDirectory));

const runNodeScript = (scriptPath, args) =>
  new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [scriptPath, ...args], {
      cwd: appDirectory,
      stdio: 'inherit',
    });

    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${scriptPath} ${args.join(' ')} failed with exit code ${code ?? 'unknown'}`));
    });
  });

const resolveScriptPath = async (relativePath) => {
  const candidates = [join(appDirectory, relativePath), join(workspaceDirectory, relativePath)];

  for (const candidate of candidates) {
    try {
      await access(candidate);
      return candidate;
    } catch {
      continue;
    }
  }

  throw new Error(`Unable to resolve script path for ${relativePath}`);
};

const removeTypecheckArtifacts = async () => {
  await rm(join(appDirectory, 'tsconfig.tsbuildinfo'), { force: true });
  await rm(join(appDirectory, '.next', 'types'), { recursive: true, force: true });
};

const nextBinaryPath = await resolveScriptPath('node_modules/next/dist/bin/next');
const typeScriptBinaryPath = await resolveScriptPath('node_modules/typescript/bin/tsc');

await runNodeScript(nextBinaryPath, ['typegen']);
await removeTypecheckArtifacts();
await runNodeScript(nextBinaryPath, ['typegen']);
await runNodeScript(typeScriptBinaryPath, ['--noEmit']);
