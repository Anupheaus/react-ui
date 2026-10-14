// Local development convenience: when a sibling @anupheaus package is checked out
// next to this repo, resolve it from that local source (a live symlink) instead of the
// registry. In CI only this repo is checked out, so the siblings are absent and the
// registry versions declared in `dependencies` are used unchanged.
//
// Frozen and lockfile-only installs skip the rewrite so the resolved tree always
// matches pnpm-lock.yaml; otherwise `pnpm install --frozen-lockfile` would fail with
// an outdated-lockfile error whenever sibling checkouts happen to exist locally.
const fs = require('fs');
const path = require('path');

const SIBLINGS = ['@anupheaus/common', '@anupheaus/react-ui', '@anupheaus/nexus', '@anupheaus/mxdb'];

const isLockfileInstall = process.argv.includes('--frozen-lockfile') || process.argv.includes('--lockfile-only');

function readPackage(pkg) {
  if (isLockfileInstall) return pkg;

  for (const name of SIBLINGS) {
    if (pkg.dependencies?.[name] == null) continue;
    const shortName = name.slice('@anupheaus/'.length);
    if (fs.existsSync(path.resolve(__dirname, '..', shortName))) pkg.dependencies[name] = `link:../${shortName}`;
  }
  return pkg;
}

module.exports = { hooks: { readPackage } };
