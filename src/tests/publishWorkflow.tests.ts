import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * The publish workflow is the repo's only merge gate, so the dependency audit level is pinned here:
 * with `critical` a high advisory passes and the pull request merges green.
 */
const WORKFLOW_PATH = path.resolve(__dirname, '../../.github/workflows/publish.yml');

/** The level nexus audits at: a high or critical advisory must fail the step. */
const REQUIRED_AUDIT_COMMAND = 'pnpm audit --audit-level=high';
const AUDIT_STEP_NAME = 'Security audit';
const AUDIT_JOB_NAME = 'Validate-Audit';

/** Every stage the workflow must still run; the audit change may not drop any of them. */
const REQUIRED_JOBS = ['Prepare', 'Validate-TypeCheck', 'Validate-Lint', AUDIT_JOB_NAME, 'Test-Vitest', 'Test-Storybook', 'Publish'];
const REQUIRED_STEP_COMMANDS = [
  'pnpm run typecheck',
  'pnpm run lint',
  REQUIRED_AUDIT_COMMAND,
  'pnpm run test:ci',
  'pnpm run storybook:build --quiet',
  'pnpm run build',
  'pnpm pack',
];

function readWorkflow(): string {
  return readFileSync(WORKFLOW_PATH, 'utf8');
}

/** Column of the first non-space character, or -1 for a blank line. */
function lineIndent(line: string): number {
  return line.search(/\S/);
}

/** The indent level of a top-level job key, e.g. '  Publish:'. */
const JOB_INDENT = 2;

/** Lines of the block that follows `start`, up to the first line indented no deeper than `indent`. */
function collectBlock(lines: string[], start: number, indent: number): string[] {
  const block = [lines[start]];
  for (const line of lines.slice(start + 1)) {
    if (line.trim() !== '' && lineIndent(line) <= indent) break;
    block.push(line);
  }
  return block;
}

/** The text of a top-level job, or null when the workflow has no such job. */
function findJobBlock(workflow: string, jobName: string): string | null {
  const lines = workflow.split(/\r?\n/);
  const start = lines.findIndex(line => line === `${' '.repeat(JOB_INDENT)}${jobName}:`);
  return start < 0 ? null : collectBlock(lines, start, JOB_INDENT).join('\n');
}

/** The text of a step (`- name: …`, and everything indented under it), or null when it is missing. */
function findStepBlock(workflow: string, stepName: string): string | null {
  const lines = workflow.split(/\r?\n/);
  const start = lines.findIndex(line => line.trim() === `- name: ${stepName}`);
  return start < 0 ? null : collectBlock(lines, start, lineIndent(lines[start])).join('\n');
}

/** Whether the step sits inside the named job, so a look-alike step in another job cannot stand in for it. */
function isStepInJob(lines: string[], jobName: string, stepName: string): boolean {
  const jobStart = lines.findIndex(line => line === `${' '.repeat(JOB_INDENT)}${jobName}:`);
  const stepStart = lines.findIndex(line => line.trim() === `- name: ${stepName}`);
  if (jobStart < 0 || stepStart < 0) return false;
  return stepStart > jobStart && stepStart < jobStart + collectBlock(lines, jobStart, JOB_INDENT).length;
}

/** The run command of a step, or null when the step runs nothing. */
function getRunCommand(stepBlock: string): string | null {
  const runLine = stepBlock.split(/\r?\n/).find(line => line.trim().startsWith('run:'));
  return runLine == null ? null : runLine.slice(runLine.indexOf('run:') + 'run:'.length).trim();
}

/** What is wrong with the audit step, empty when it is a blocking high-severity gate. */
function auditGateProblems(workflow: string): string[] {
  const problems: string[] = [];
  const stepBlock = findStepBlock(workflow, AUDIT_STEP_NAME);
  if (stepBlock == null) return [`the workflow has no "${AUDIT_STEP_NAME}" step`];

  const command = getRunCommand(stepBlock);
  if (command == null) problems.push(`the "${AUDIT_STEP_NAME}" step runs no command`);
  else if (command !== REQUIRED_AUDIT_COMMAND) problems.push(`the "${AUDIT_STEP_NAME}" step runs "${command}" instead of "${REQUIRED_AUDIT_COMMAND}"`);

  if (/continue-on-error/.test(stepBlock)) problems.push(`the "${AUDIT_STEP_NAME}" step may fail without blocking the merge (continue-on-error)`);

  const jobBlock = findJobBlock(workflow, AUDIT_JOB_NAME);
  if (jobBlock == null) problems.push(`the workflow has no "${AUDIT_JOB_NAME}" job`);
  else if (/continue-on-error|^\s+if:/m.test(jobBlock)) problems.push(`the "${AUDIT_JOB_NAME}" job is skipped or allowed to fail`);
  // A step inside another job would not block the publish job that needs AUDIT_JOB_NAME.
  else if (!isStepInJob(workflow.split(/\r?\n/), AUDIT_JOB_NAME, AUDIT_STEP_NAME)) problems.push(`the "${AUDIT_STEP_NAME}" step is not part of the "${AUDIT_JOB_NAME}" job`);

  return problems;
}

describe('publish workflow', () => {
  it('runs the dependency audit at high severity, without continue-on-error', () => {
    expect(auditGateProblems(readWorkflow())).toEqual([]);
  });

  it('runs on push and pull requests to master', () => {
    const workflow = readWorkflow();

    expect(workflow).toMatch(/^on:\s*$/m);
    expect(workflow).toMatch(/^\s*push:\s*\n\s*branches: \[master\]\s*$/m);
    expect(workflow).toMatch(/^\s*pull_request:\s*\n\s*branches: \[master\]\s*$/m);
  });

  it('blocks the publish job on the audit, so a failing audit cannot be ignored', () => {
    const publishBlock = findJobBlock(readWorkflow(), 'Publish');

    expect(publishBlock).not.toBeNull();
    expect(publishBlock).toMatch(new RegExp(`needs: \\[[^\\]]*\\b${AUDIT_JOB_NAME}\\b[^\\]]*\\]`));
  });

  it.each(REQUIRED_JOBS)('keeps the %s stage', jobName => {
    expect(findJobBlock(readWorkflow(), jobName)).not.toBeNull();
  });

  it.each(REQUIRED_STEP_COMMANDS)('keeps the %s step', command => {
    expect(readWorkflow()).toContain(command);
  });

  describe('audit gate guard', () => {
    it('rejects a weaker audit level, which would let a high advisory through', () => {
      const weakened = readWorkflow().replace(REQUIRED_AUDIT_COMMAND, 'pnpm audit --audit-level=critical');

      expect(weakened).not.toBe(readWorkflow());
      expect(auditGateProblems(weakened).join('; ')).toMatch(/--audit-level=critical/);
    });

    it('rejects a step that swallows the audit failure', () => {
      const swallowed = readWorkflow().replace(REQUIRED_AUDIT_COMMAND, `${REQUIRED_AUDIT_COMMAND} || exit 0`);

      expect(auditGateProblems(swallowed).join('; ')).toMatch(/\|\| exit 0/);
    });

    it('rejects continue-on-error on the audit step', () => {
      const allowed = readWorkflow().replace(`- name: ${AUDIT_STEP_NAME}`, `- name: ${AUDIT_STEP_NAME}\n        continue-on-error: true`);

      expect(auditGateProblems(allowed).join('; ')).toMatch(/continue-on-error/);
    });

    it('rejects an audit step moved into another job, which would not block the publish', () => {
      const moved = readWorkflow().replace(
        '  Prepare:\n    name: Install Dependencies\n',
        `  Decoy:\n    needs: Prepare\n    steps:\n      - name: ${AUDIT_STEP_NAME}\n        run: ${REQUIRED_AUDIT_COMMAND}\n  Prepare:\n    name: Install Dependencies\n`,
      );

      expect(moved).not.toBe(readWorkflow());
      expect(auditGateProblems(moved).join('; ')).toMatch(new RegExp(`not part of the "${AUDIT_JOB_NAME}" job`));
    });

    it('rejects a missing audit step or job, and empty input', () => {
      const noStep = readWorkflow().replace(`- name: ${AUDIT_STEP_NAME}`, '- name: Something else');
      const noCommand = readWorkflow().replace(`        run: ${REQUIRED_AUDIT_COMMAND}\n`, '');

      expect(auditGateProblems(noStep).join('; ')).toMatch(/no "Security audit" step/);
      expect(auditGateProblems(readWorkflow().replace(`  ${AUDIT_JOB_NAME}:`, '  Renamed-Audit:')).join('; ')).toMatch(new RegExp(`no "${AUDIT_JOB_NAME}" job`));
      expect(auditGateProblems(noCommand).join('; ')).toMatch(/runs no command/);
      expect(auditGateProblems('').join('; ')).toMatch(/no "Security audit" step/);
    });
  });
});
