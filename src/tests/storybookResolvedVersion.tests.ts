import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { resolve } from 'path';

interface PackageManifest {
  devDependencies: Record<string, string>;
}

const repoRoot = resolve(__dirname, '../..');
const packageJsonPath = resolve(repoRoot, 'package.json');
const lockfilePath = resolve(repoRoot, 'pnpm-lock.yaml');

const manifest = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as PackageManifest;
const pinnedStorybookVersion = manifest.devDependencies.storybook;
const lockfile = readFileSync(lockfilePath, 'utf8');

const storybookVersionsInLockfile = Array.from(new Set(Array.from(
  lockfile.matchAll(/^  storybook@([^(:]+?)(?:\(.*\))?:\s*$/gm),
  match => match[1],
)));

describe('storybook resolved version', () => {
  it('pins the storybook dev dependency to a single exact version', () => {
    expect(pinnedStorybookVersion).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it('resolves exactly one storybook version in pnpm-lock.yaml', () => {
    expect(storybookVersionsInLockfile).toEqual([pinnedStorybookVersion]);
  });

  it('resolves exactly one storybook version in the installed tree', () => {
    const pnpmWhy = execSync('pnpm why storybook', { cwd: repoRoot, encoding: 'utf8' });

    expect(pnpmWhy).toContain(`storybook@${pinnedStorybookVersion}`);
    expect(pnpmWhy).toContain('Found 1 version of storybook');
  });
});
