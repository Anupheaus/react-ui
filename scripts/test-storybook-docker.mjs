#!/usr/bin/env node
/**
 * Run Storybook tests in the same Linux environment as CI (Playwright Docker image).
 * Uses docker cp to avoid Windows volume mount permission issues.
 * Usage: node scripts/test-storybook-docker.mjs [--update-snapshots]
 */
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const cwd = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(cwd, '..');

const updateSnapshots = process.argv.includes('--update-snapshots');
const testCmd = updateSnapshots
  ? 'pnpm run test-storybook:update-snapshots'
  : 'pnpm run test-storybook:ci:play';

const envFilePath = path.join(projectRoot, '.env');
if (!existsSync(envFilePath)) {
  throw new Error('.env file not found. Create .env with NODE_AUTH_TOKEN=your_github_token');
}

const projectPath = process.platform === 'win32'
  ? projectRoot.replace(/\\/g, '/')
  : projectRoot;

// Create container (no --rm so we can copy results back)
const create = spawnSync('docker', [
  'create',
  '-e', 'CI=true',
  '--env-file', envFilePath,
  '-w', '/app',
  'mcr.microsoft.com/playwright:v1.58.2-noble',
  'bash', '-c',
  `corepack enable pnpm && printf '\\n//npm.pkg.github.com/:_authToken=%s\\n' "\$NODE_AUTH_TOKEN" >> .npmrc && rm -rf node_modules && pnpm install --no-frozen-lockfile && ${testCmd}`,
], { stdio: 'pipe', cwd: projectRoot });
if (create.status !== 0) {
  console.error(create.stderr?.toString());
  process.exit(1);
}
const containerId = create.stdout.toString().trim();

try {
  // Copy project into container (exclude node_modules, storybook-static, .git)
  const copyIn = spawnSync('docker', ['cp', `${projectPath}/.`, `${containerId}:/app`], {
    stdio: 'inherit',
    cwd: projectRoot,
  });
  if (copyIn.status !== 0) process.exit(1);

  // Run the container
  const run = spawnSync('docker', ['start', '-a', '-i', containerId], {
    stdio: 'inherit',
    cwd: projectRoot,
  });

  if (run.status !== 0) process.exit(run.status ?? 1);

  // Copy results back (snapshots, possibly node_modules for cache)
  if (updateSnapshots) {
    spawnSync('docker', ['cp', `${containerId}:/app/__image_snapshots__`, projectPath], {
      stdio: 'inherit',
      cwd: projectRoot,
    });
  }
} finally {
  spawnSync('docker', ['rm', '-f', containerId], { stdio: 'ignore' });
}
