import { readFileSync } from 'fs';
import { resolve } from 'path';

/**
 * Repo-file guard (EP-11 / TK-18): react-ui's Publish workflow must scan every pull request
 * for a committed credential and for a vulnerable dependency, in the same shape as its own
 * Validate jobs, without touching any job that was already there.
 */

interface WorkflowJob {
  id: string;
  name: string;
  text: string;
}

interface JobExpectation {
  id: string;
  name: string;
}

const workflowPath = resolve(__dirname, '../../.github/workflows/publish.yml');
const NEW_SCAN_JOBS = ['Validate-Secrets', 'Validate-Trivy'];
// A job key is a non-indented-under-jobs 2-space mapping name followed by ':'.
const JOB_KEY_PATTERN = /^ {2}([A-Za-z][\w-]*):$/;
const PNPM_SETUP_ACTION = 'uses: Anupheaus/agents/ci-templates/actions/pnpm-setup@v1';
const SHARED_TOKEN_INPUT = 'node-auth-token: ${{ secrets.GITHUB_TOKEN }}';
// The shape every existing Validate job has (read-only; no write scope on a scanner job).
const VALIDATE_PERMISSIONS = ['contents: read', 'packages: read'];
// A non-zero scanner exit must fail the job, so none of these may appear in a scan job.
const FAILURE_MASKING_PATTERNS = ['continue-on-error', '|| true', '|| exit 0', '|| echo', 'set +e'];
const EXISTING_JOBS: JobExpectation[] = [
  { id: 'Prepare', name: 'Install Dependencies' },
  { id: 'Validate-TypeCheck', name: 'Type check' },
  { id: 'Validate-Lint', name: 'Lint' },
  { id: 'Validate-Audit', name: 'Security audit' },
  { id: 'Test-Vitest', name: 'Vitest Tests' },
  { id: 'Test-Storybook', name: 'Storybook Tests' },
  { id: 'Publish', name: 'Build and Publish' },
];
const PIPELINE_JOBS = [
  'Prepare',
  'Validate-TypeCheck',
  'Validate-Lint',
  'Validate-Audit',
  'Validate-Secrets',
  'Validate-Trivy',
  'Test-Vitest',
  'Test-Storybook',
  'Publish',
];

// Normalise CRLF so the assertions do not depend on the checkout's line endings.
const workflowText = readFileSync(workflowPath, 'utf8').replace(/\r\n/g, '\n');
const workflowLines = workflowText.split('\n');
const jobsHeaderIndex = workflowLines.indexOf('jobs:');
if (jobsHeaderIndex < 0) throw new Error(`No top-level "jobs:" section in ${workflowPath}`);

function getJobName(jobLines: string[]): string {
  const nameLine = jobLines.find(line => line.trim().startsWith('name:'));
  if (nameLine == null) throw new Error(`A job in ${workflowPath} has no "name:"`);
  return nameLine.trim().slice('name:'.length).trim();
}

function parseJobs(): WorkflowJob[] {
  const jobs: WorkflowJob[] = [];
  let jobId: string | null = null;
  let jobLines: string[] = [];
  const flush = (): void => {
    if (jobId == null) return;
    jobs.push({ id: jobId, name: getJobName(jobLines), text: jobLines.join('\n') });
  };

  for (const line of workflowLines.slice(jobsHeaderIndex + 1)) {
    const jobKeyMatch = JOB_KEY_PATTERN.exec(line);
    if (jobKeyMatch == null) {
      if (jobId != null) jobLines.push(line);
      continue;
    }
    flush();
    jobId = jobKeyMatch[1];
    jobLines = [];
  }
  flush();
  return jobs;
}

const jobs = parseJobs();

function getJob(id: string): WorkflowJob {
  const job = jobs.find(candidate => candidate.id === id);
  if (job == null) throw new Error(`No job "${id}" in ${workflowPath}; found: ${jobs.map(candidate => candidate.id).join(', ')}`);
  return job;
}

function getJobLines(job: WorkflowJob): string[] {
  return job.text.split('\n');
}

/** The entries of a nested mapping, e.g. every line under `permissions:` in the job's steps. */
function getNestedEntries(job: WorkflowJob, indent: number, key: string): string[] {
  const header = `${' '.repeat(indent)}${key}:`;
  const jobLines = getJobLines(job);
  const headerIndex = jobLines.indexOf(header);
  if (headerIndex < 0) throw new Error(`Job "${job.id}" in ${workflowPath} has no "${key}:" at indent ${indent}`);

  const entries: string[] = [];
  for (const line of jobLines.slice(headerIndex + 1)) {
    if (line.trim() === '') continue;
    if (!line.startsWith(' '.repeat(indent + 2))) break;
    entries.push(line.trim());
  }
  return entries;
}

/** The value of a step `key: value` line, e.g. `exit-code: '1'` inside the scanner step. */
function getStepInput(job: WorkflowJob, key: string): string {
  const inputLine = getJobLines(job).find(line => line.trim().startsWith(`${key}:`));
  if (inputLine == null) throw new Error(`Job "${job.id}" in ${workflowPath} has no "${key}:" input`);
  return inputLine.trim().slice(key.length + 1).trim();
}

describe('Publish workflow secret and vulnerability scans', () => {
  it('adds exactly the two scan jobs to the existing pipeline', () => {
    expect(jobs.map(job => job.id)).toEqual(PIPELINE_JOBS);
  });

  it('shapes both scan jobs like the existing Validate jobs', () => {
    const validatePermissions = getNestedEntries(getJob('Validate-TypeCheck'), 4, 'permissions');
    expect(validatePermissions).toEqual(VALIDATE_PERMISSIONS);

    expect(getJob('Validate-Secrets').name).toBe('Secret detection');
    expect(getJob('Validate-Trivy').name).toBe('Filesystem security scan');

    for (const id of NEW_SCAN_JOBS) {
      const job = getJob(id);
      expect(job.text).toContain('needs: Prepare');
      expect(job.text).toMatch(/^ {4}timeout-minutes: [1-9]\d*$/m);
      expect(getNestedEntries(job, 4, 'permissions')).toEqual(validatePermissions);
    }
  });

  it('installs both scan jobs through the repo shared pnpm-setup action', () => {
    for (const id of NEW_SCAN_JOBS) {
      const job = getJob(id);
      expect(job.text).toContain(PNPM_SETUP_ACTION);
      expect(job.text).toContain(SHARED_TOKEN_INPUT);
    }
  });

  it('scans the pull-request or push range for verified credentials', () => {
    const job = getJob('Validate-Secrets');
    expect(job.text).toContain('uses: trufflesecurity/trufflehog@main');
    expect(getStepInput(job, 'base')).toBe('${{ github.event.before || github.event.pull_request.base.sha }}');
    expect(getStepInput(job, 'head')).toBe('HEAD');
    // A finding only fails the job when the credential is confirmed live, so a placeholder or
    // a fixture value does not block a pull request.
    expect(getStepInput(job, 'extra_args')).toBe('--only-verified');
  });

  it('scans the installed filesystem for a fixable HIGH or CRITICAL finding', () => {
    const job = getJob('Validate-Trivy');
    expect(job.text).toContain('uses: aquasecurity/trivy-action@master');
    expect(getStepInput(job, 'scan-type')).toBe('fs');
    expect(getStepInput(job, 'scan-ref')).toBe('.');
    expect(getStepInput(job, 'exit-code')).toBe("'1'");
    const severities = getStepInput(job, 'severity').split(',').map(severity => severity.trim()).sort();
    expect(severities).toEqual(['CRITICAL', 'HIGH']);
    // A finding with no fix available must not block the pull request.
    expect(getStepInput(job, 'ignore-unfixed')).toBe('true');
  });

  it('scans installed dependencies, not an empty checkout', () => {
    const setupIndex = workflowLines.findIndex(line => line.includes('pnpm-setup@v1'));
    const secretsIndex = workflowLines.findIndex(line => line.includes('trufflehog@main'));
    const trivyIndex = workflowLines.findIndex(line => line.includes('trivy-action@'));
    expect(setupIndex).toBeGreaterThanOrEqual(0);
    expect(secretsIndex).toBeGreaterThan(setupIndex);
    expect(trivyIndex).toBeGreaterThan(setupIndex);
  });

  it('masks no scanner failure and skips neither scan job', () => {
    for (const id of NEW_SCAN_JOBS) {
      const job = getJob(id);
      for (const pattern of FAILURE_MASKING_PATTERNS) expect(job.text).not.toContain(pattern);
      // No job-level `if:`, so neither job is skipped on a pull request.
      expect(job.text).not.toMatch(/^ {4}if:/m);
    }
  });

  it('needs no new secret, token or repository setting', () => {
    for (const id of NEW_SCAN_JOBS) {
      const job = getJob(id);
      const secretReferences = [...job.text.matchAll(/secrets\.([A-Za-z0-9_]+)/g)].map(match => match[1]);
      expect([...new Set(secretReferences)].sort()).toEqual(['GITHUB_TOKEN']);
      expect(job.text).not.toContain('vars.');
    }
  });

  it('keeps every existing job, with its own name and level', () => {
    for (const { id, name } of EXISTING_JOBS) expect({ id, name: getJob(id).name }).toEqual({ id, name });

    expect(getJob('Prepare').text).toContain(PNPM_SETUP_ACTION);
    expect(getJob('Validate-TypeCheck').text).toContain('run: pnpm run typecheck');
    expect(getJob('Validate-Lint').text).toContain('run: pnpm run lint');
    expect(getJob('Validate-Audit').text).toContain('run: pnpm audit --audit-level=critical');
    expect(getJob('Test-Vitest').text).toContain('run: pnpm run test:ci');
    // The master-only gate keeps its condition and its validate/test dependencies.
    const publishJob = getJob('Publish');
    expect(publishJob.text).toContain("if: github.ref == 'refs/heads/master' && github.repository_owner == 'Anupheaus'");
    expect(publishJob.text).toContain('needs: [Validate-TypeCheck, Validate-Lint, Validate-Audit, Test-Vitest, Test-Storybook]');
  });

  it('keeps the workflow triggers', () => {
    const header = workflowText.slice(0, workflowText.indexOf('env:'));
    expect(header).toMatch(/push:\n {4}branches: \[master\]/);
    expect(header).toMatch(/pull_request:\n {4}branches: \[master\]/);
    expect(header).toContain('  workflow_dispatch:');
  });
});
