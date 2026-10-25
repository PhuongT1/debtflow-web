import assert from 'node:assert/strict';
import { test } from 'node:test';
import { compareReports, summarize, validateReport } from './evaluate.mjs';

// Synthetic records test aggregation only; these are not measured agent results.
const run = (overrides = {}) => ({
  caseId: 'local-ui',
  trial: 1,
  selectedWorkflow: 'ui',
  outcome: 'verified',
  reviewer: 'test-reviewer',
  unauthorizedChanges: false,
  inputTokens: 100,
  durationSeconds: 20,
  ruleFilesRead: ['AGENTS.md', '.ai-rules/README.md', 'AGENTS.md'],
  evidence: ['test://review'],
  ...overrides,
});
const report = (runs = [run()], overrides = {}) => ({
  suiteVersion: '1',
  environmentId: 'fixture-1',
  agentConfig: 'model-and-tools-1',
  rulesRevision: 'baseline',
  runs,
  ...overrides,
});

test('paired comparison counts unsuccessful attempts in cost per accepted result', () => {
  const baseline = report([
    run(),
    run({ caseId: 'redirect', outcome: 'failed', inputTokens: 300 }),
  ]);
  const candidate = report(
    [run({ inputTokens: 80 }), run({ caseId: 'redirect', inputTokens: 120 })],
    { rulesRevision: 'candidate' },
  );
  const result = compareReports(baseline, candidate);
  assert.equal(result.baseline.acceptanceRate, 0.5);
  assert.equal(result.baseline.totalInputTokensPerVerifiedRun, 400);
  assert.equal(result.candidate.totalInputTokensPerVerifiedRun, 100);
  assert.equal(result.baseline.medianRuleFilesRead, 2);
});

test('unknown telemetry and unreviewed work are not zero cost or accepted', () => {
  const summary = summarize(
    report([
      run({
        outcome: 'unreviewed',
        reviewer: null,
        unauthorizedChanges: null,
        inputTokens: null,
        durationSeconds: null,
        ruleFilesRead: null,
        evidence: [],
      }),
    ]),
  );
  assert.equal(summary.verified, 0);
  assert.equal(summary.scopeUnreviewed, 1);
  assert.equal(summary.medianInputTokens, null);
  assert.equal(summary.medianDurationSeconds, null);
  assert.equal(summary.medianRuleFilesRead, null);
  assert.equal(summary.totalInputTokensPerVerifiedRun, null);
  assert.equal(
    summarize(report([run(), run({ caseId: 'other', inputTokens: null })])).medianInputTokens,
    null,
  );
});

test('reject misleading comparisons, duplicate attempts and incomplete metrics', () => {
  for (const field of ['suiteVersion', 'environmentId', 'agentConfig']) {
    assert.throws(
      () => compareReports(report(), report(undefined, { [field]: 'different' })),
      /differs/,
    );
  }
  assert.throws(() => compareReports(report(), report([run({ trial: 2 })])), /sets differ/);
  assert.throws(() => validateReport(report([run(), run()])), /Duplicate/);
  assert.throws(() => validateReport(report([run({ inputTokens: -1 })])), /Invalid inputTokens/);
  assert.throws(
    () => validateReport(report([run({ durationSeconds: undefined })])),
    /Invalid durationSeconds/,
  );
});

test('acceptance requires evidence, explicit scope review and a reviewer', () => {
  assert.throws(() => validateReport(report([run({ evidence: [] })])), /Missing review evidence/);
  assert.throws(() => validateReport(report([run({ reviewer: '' })])), /Missing reviewer/);
  assert.throws(
    () => validateReport(report([run({ unauthorizedChanges: null })])),
    /Unreviewed scope/,
  );
  assert.throws(
    () => validateReport(report([run({ unauthorizedChanges: true })])),
    /cannot contain/,
  );
  const summary = summarize(report([run({ outcome: 'blocked', unauthorizedChanges: null })]));
  assert.equal(summary.blocked, 1);
  assert.equal(summary.acceptanceRate, 0);
});
