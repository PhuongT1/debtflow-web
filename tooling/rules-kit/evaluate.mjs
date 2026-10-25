import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const key = (run) => `${run.caseId}:${run.trial}`;
const outcomes = new Set(['verified', 'failed', 'blocked', 'unreviewed']);
const requireValue = (condition, message) => {
  if (!condition) throw new Error(message);
};
const nonempty = (value) => typeof value === 'string' && value.trim().length > 0;

export function validateReport(report) {
  for (const field of ['suiteVersion', 'environmentId', 'agentConfig', 'rulesRevision']) {
    requireValue(nonempty(report?.[field]), `Missing ${field}`);
  }
  requireValue(Array.isArray(report.runs) && report.runs.length > 0, 'runs must not be empty');
  const seen = new Set();
  for (const run of report.runs) {
    requireValue(nonempty(run.caseId) && !run.caseId.includes(':'), 'Invalid caseId');
    requireValue(Number.isInteger(run.trial) && run.trial > 0, 'trial must be a positive integer');
    requireValue(!seen.has(key(run)), `Duplicate run ${key(run)}`);
    seen.add(key(run));
    requireValue(outcomes.has(run.outcome), `Invalid outcome for ${key(run)}`);
    requireValue(nonempty(run.selectedWorkflow), `Missing selectedWorkflow for ${key(run)}`);
    requireValue(
      typeof run.unauthorizedChanges === 'boolean' || run.unauthorizedChanges === null,
      `Invalid unauthorizedChanges for ${key(run)}`,
    );
    requireValue(
      run.ruleFilesRead === null ||
        (Array.isArray(run.ruleFilesRead) && run.ruleFilesRead.every(nonempty)),
      `Invalid ruleFilesRead for ${key(run)}`,
    );
    requireValue(
      Array.isArray(run.evidence) && run.evidence.every(nonempty),
      `Invalid evidence for ${key(run)}`,
    );
    for (const field of ['inputTokens', 'durationSeconds']) {
      requireValue(
        run[field] === null || (Number.isFinite(run[field]) && run[field] >= 0),
        `Invalid ${field} for ${key(run)}; use null if unavailable`,
      );
    }
    if (run.inputTokens !== null) {
      requireValue(Number.isInteger(run.inputTokens), `inputTokens must be an integer`);
    }
    if (run.outcome === 'verified' || run.outcome === 'failed') {
      requireValue(nonempty(run.reviewer), `Missing reviewer for ${key(run)}`);
      requireValue(run.evidence.length > 0, `Missing review evidence for ${key(run)}`);
      requireValue(run.unauthorizedChanges !== null, `Unreviewed scope for ${key(run)}`);
    }
    requireValue(
      run.outcome !== 'verified' || run.unauthorizedChanges === false,
      `A verified run cannot contain unauthorized changes: ${key(run)}`,
    );
  }
  return report;
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

export function summarize(report) {
  validateReport(report);
  const { runs } = report;
  const verified = runs.filter((run) => run.outcome === 'verified').length;
  const completeTokens = runs.every((run) => run.inputTokens !== null);
  const completeDuration = runs.every((run) => run.durationSeconds !== null);
  const totalTokens = completeTokens ? runs.reduce((sum, run) => sum + run.inputTokens, 0) : null;
  return {
    runs: runs.length,
    verified,
    failed: runs.filter((run) => run.outcome === 'failed').length,
    blocked: runs.filter((run) => run.outcome === 'blocked').length,
    unreviewed: runs.filter((run) => run.outcome === 'unreviewed').length,
    acceptanceRate: verified / runs.length,
    unauthorizedRuns: runs.filter((run) => run.unauthorizedChanges === true).length,
    scopeUnreviewed: runs.filter((run) => run.unauthorizedChanges === null).length,
    medianInputTokens: completeTokens ? median(runs.map((run) => run.inputTokens)) : null,
    totalInputTokensPerVerifiedRun: verified && completeTokens ? totalTokens / verified : null,
    medianDurationSeconds: completeDuration ? median(runs.map((run) => run.durationSeconds)) : null,
    medianRuleFilesRead: runs.every((run) => run.ruleFilesRead !== null)
      ? median(runs.map((run) => new Set(run.ruleFilesRead).size))
      : null,
  };
}

export function compareReports(baseline, candidate) {
  validateReport(baseline);
  validateReport(candidate);
  for (const field of ['suiteVersion', 'environmentId', 'agentConfig']) {
    requireValue(
      baseline[field] === candidate[field],
      `${field} differs; comparison is not paired`,
    );
  }
  const baselineKeys = baseline.runs.map(key).sort();
  const candidateKeys = candidate.runs.map(key).sort();
  requireValue(
    JSON.stringify(baselineKeys) === JSON.stringify(candidateKeys),
    'Case/trial sets differ; include failed, blocked and unreviewed attempts on both sides',
  );
  return {
    baselineRevision: baseline.rulesRevision,
    candidateRevision: candidate.rulesRevision,
    baseline: summarize(baseline),
    candidate: summarize(candidate),
    note: 'Aggregates recorded evidence; does not run agents, validate UI, or prove rule compliance.',
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const args = process.argv.slice(2);
    requireValue(
      args.length === 4 && args[0] === '--baseline' && args[2] === '--candidate',
      'Usage: node tooling/rules-kit/evaluate.mjs --baseline baseline.json --candidate candidate.json',
    );
    const reports = await Promise.all(
      args
        .filter((_, index) => index % 2)
        .map(async (path) => JSON.parse(await readFile(path, 'utf8'))),
    );
    process.stdout.write(JSON.stringify(compareReports(...reports), null, 2) + '\n');
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  }
}
