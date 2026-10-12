import { readFileSync } from 'fs';
import path from 'path';
import { describe, expect, it } from 'vitest';

/**
 * react-ui is installed by nexus, mxdb and vision, so a high or critical advisory in its resolved dependency
 * tree reaches every consumer. The Security audit step must therefore be able to fail the run and block the
 * merge rather than merge green at a weaker level (VIS-5, epic E3). Do not quieten this step or raise the
 * tolerance again — override the dependency instead.
 */
const WORKFLOW_PATH = path.resolve(__dirname, '../../.github/workflows/publish.yml');
const AUDIT_JOB = 'Validate-Audit';
const AUDIT_STEP = 'Security audit';

interface WorkflowStep {
  indent: number;
  name: string;
  text: string;
}

function readWorkflow(): string {
  return readFileSync(WORKFLOW_PATH, 'utf8');
}

function unquote(value: string): string {
  return value.replace(/^(['"])(.*)\1$/, '$2');
}

function indentOf(line: string): number {
  return /^(\s*)/.exec(line)![1].length;
}

/**
 * Every step of a workflow (or job) fragment, named or anonymous. A list item starts a step when it carries a
 * `name:` or sits at the indentation of the step list; a deeper `- ` inside a `run: |` block stays in the step.
 */
function parseSteps(fragment: string): WorkflowStep[] {
  const steps: { indent: number; name: string; lines: string[] }[] = [];
  let current: (typeof steps)[number] | undefined;

  for (const line of fragment.split(/\r?\n/)) {
    const marker = /^(\s*)- (.*)$/.exec(line);
    const named = marker === null ? null : /^name:\s*(.+?)\s*$/.exec(marker[2]);

    if (marker !== null && (named !== null || current === undefined || indentOf(line) <= current.indent)) {
      current = { indent: indentOf(line), name: named === null ? '' : unquote(named[1]), lines: [line] };
      steps.push(current);
      continue;
    }

    if (current === undefined) continue;
    if (line.trim() === '' || indentOf(line) > current.indent) current.lines.push(line);
    else current = undefined;
  }

  return steps.map(step => ({ indent: step.indent, name: step.name, text: step.lines.join('\n') }));
}

/** The single step with this name; more than one would make the gate ambiguous. */
function findStep(fragment: string, name: string): WorkflowStep {
  const matches = parseSteps(fragment).filter(step => step.name === name);

  expect(matches, `expected exactly one "${name}" step, found ${matches.length}`).toHaveLength(1);
  return matches[0];
}

/** The lines of one job of the `jobs:` map, up to the next job key. */
function findJob(workflow: string, job: string): string {
  const lines = workflow.split(/\r?\n/);
  const jobsAt = lines.findIndex(line => /^jobs:\s*$/.test(line));

  expect(jobsAt, 'workflow has no jobs: key').toBeGreaterThan(-1);

  const start = lines.findIndex((line, index) => index > jobsAt && line === `  ${job}:`);

  expect(start, `workflow has no "${job}" job`).toBeGreaterThan(-1);

  const end = lines.findIndex((line, index) => index > start && /^ {2}\S/.test(line));
  return lines.slice(start, end === -1 ? undefined : end).join('\n');
}

/** Every job name of the `jobs:` map, in file order. */
function jobsOf(workflow: string): string[] {
  const lines = workflow.split(/\r?\n/);
  const jobsAt = lines.findIndex(line => /^jobs:\s*$/.test(line));

  expect(jobsAt, 'workflow has no jobs: key').toBeGreaterThan(-1);

  return lines
    .slice(jobsAt + 1)
    .filter(line => /^ {2}\S/.test(line) && !line.trim().startsWith('#'))
    .map(line => line.trim());
}

/** The workflow's `on:` block, up to the next top-level key. */
function findTriggers(workflow: string): string {
  const lines = workflow.split(/\r?\n/);
  const start = lines.findIndex(line => /^on:\s*$/.test(line));

  expect(start, 'workflow has no on: key').toBeGreaterThan(-1);

  const end = lines.findIndex((line, index) => index > start && /^\S/.test(line));
  return lines.slice(start, end === -1 ? undefined : end).join('\n');
}

describe('dependency audit gate', () => {
  const workflow = readWorkflow();
  const auditJob = findJob(workflow, AUDIT_JOB);
  const audit = findStep(auditJob, AUDIT_STEP);

  it('runs pnpm audit at --audit-level=high', () => {
    expect(audit.text).toMatch(/^\s+run: pnpm audit --audit-level=high$/m);
  });

  it('does not audit at a weaker level anywhere in the workflow', () => {
    expect(workflow).not.toMatch(/--audit-level=(critical|moderate|low|info)\b/);
    expect(workflow.match(/pnpm audit/g) ?? []).toHaveLength(1);
  });

  it('does not set continue-on-error, so a high or critical advisory fails the run', () => {
    expect(audit.text).not.toMatch(/continue-on-error/);
  });

  it('does not swallow a failing audit exit code', () => {
    expect(audit.text).not.toMatch(/\|\|\s*true/);
    expect(audit.text).not.toMatch(/\|\|\s*exit 0/);
    expect(audit.text).not.toMatch(/;\s*exit 0/);
  });

  it('is not skipped by a condition', () => {
    expect(audit.text).not.toMatch(/^\s+if:/m);
    expect(auditJob).not.toMatch(/^ {4}if:/m);
  });

  it('runs on every push to master and on every pull request to master', () => {
    const triggers = findTriggers(workflow);

    expect(triggers).toMatch(/^ {2}push:\n {4}branches: \[master\]$/m);
    expect(triggers).toMatch(/^ {2}pull_request:\n {4}branches: \[master\]$/m);
  });

  it('keeps every stage of the pipeline, in order', () => {
    expect(jobsOf(workflow)).toEqual([
      'Prepare:',
      'Validate-TypeCheck:',
      'Validate-Lint:',
      'Validate-Audit:',
      'Test-Vitest:',
      'Test-Storybook:',
      'Publish:',
    ]);
  });

  it('still gates publish behind the audit job', () => {
    expect(findJob(workflow, 'Publish')).toMatch(/Validate-Audit,/);
  });

  it.each([
    ['Type check', 'run: pnpm run typecheck'],
    ['Lint', 'run: pnpm run lint'],
    ['Run Vitest tests', 'pnpm run test:ci'],
    ['Run Storybook tests', 'pnpm run storybook:build'],
    ['Build', 'pnpm run build'],
  ])('keeps the %s step as before', (stepName, expected) => {
    expect(findStep(workflow, stepName).text).toContain(expected);
  });
});
