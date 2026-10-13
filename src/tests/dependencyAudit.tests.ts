import { readFileSync } from 'fs';
import { resolve } from 'path';

interface PackageManifest {
  pnpm?: {
    auditConfig?: {
      ignoreCves?: string[];
    };
    overrides?: Record<string, string>;
  };
}

const packageJsonPath = resolve(__dirname, '../../package.json');
const lockfilePath = resolve(__dirname, '../../pnpm-lock.yaml');
const manifest = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as PackageManifest;
const lockfile = readFileSync(lockfilePath, 'utf8');
const overrides = manifest.pnpm?.overrides ?? {};
const ignoredCves = manifest.pnpm?.auditConfig?.ignoreCves ?? [];

const highAdvisoryOverrides = {
  'axios@>=1.0.0 <1.20.0': '1.20.0',
  'brace-expansion@<1.1.21': '1.1.21',
  'brace-expansion@>=3.0.0 <5.0.12': '5.0.12',
  'browserslist@<=4.28.6': '4.28.7',
  'fast-uri@>=3.0.0 <3.1.8': '3.1.8',
  'form-data@>=4.0.0 <4.0.6': '4.0.6',
  'joi@>=17.2.0 <17.13.7': '17.13.8',
  'joi@>=18.0.0 <18.2.6': '18.2.9',
  'js-yaml@>=3.0.0 <3.15.2': '3.15.2',
  'js-yaml@>=4.0.0 <4.3.2': '4.3.2',
  'nanoid@<3.3.18': '3.3.20',
  'postcss@<8.5.18': '8.5.18',
  'source-map-js@>=1.0.0 <1.2.2': '1.2.2',
  'vite@<=6.4.2': '6.4.4',
  'webpack-dev-middleware@<7.4.6': '7.4.6',
  'ws@>=8.0.0 <8.21.0': '8.21.0',
};

describe('dependency audit remediation', () => {
  it('overrides every fixable high advisory to a patched version', () => {
    expect(overrides).toMatchObject(highAdvisoryOverrides);
  });

  it('explicitly ignores the one unfixable high advisory by CVE', () => {
    expect(ignoredCves).toContain('CVE-2026-93687');
  });

  it('keeps the lockfile override section in sync with package.json', () => {
    for (const [selector, version] of Object.entries(highAdvisoryOverrides)) {
      expect(lockfile).toContain(`${selector}: ${version}`);
    }
  });
});
