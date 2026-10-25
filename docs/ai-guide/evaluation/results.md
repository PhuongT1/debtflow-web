# Record Evaluation Results

Create one JSON report per rules variant. Copy the shape below and replace all placeholders with measured identifiers and evidence. This example is deliberately unreviewed and has no measured telemetry.

```json
{
  "suiteVersion": "local-pilot-v1",
  "environmentId": "source-commit+fixture-version+runtime",
  "agentConfig": "tool+model+settings+permissions",
  "rulesRevision": "rules-commit-or-content-hash",
  "runs": [
    {
      "caseId": "local-ui",
      "trial": 1,
      "selectedWorkflow": "ui",
      "outcome": "unreviewed",
      "reviewer": null,
      "unauthorizedChanges": null,
      "inputTokens": null,
      "durationSeconds": null,
      "ruleFilesRead": null,
      "evidence": []
    }
  ]
}
```

Use case IDs from the [catalog](cases.md), or version a custom suite before running it. `ruleFilesRead` contains actual instruction paths observed in the trace, not a planned reading list; use `null` if reads are unavailable, and `[]` only when the trace confirms none. Its median is unknown if any trace is unavailable. `evidence` references review notes, diffs, command results, browser captures and interventions accessible to the reviewer. Do not include secret-bearing logs.

Both reports must use matching suite/environment/agent identifiers and the same case/trial set. The utility rejects mismatches and duplicate attempts. These identifiers are supplied by the evaluator; the utility cannot independently attest to the environment.

`verified` and `failed` require a reviewer, evidence and a boolean scope assessment. `verified` cannot include unauthorized changes. Acceptance rate includes all attempts. Total input tokens per verified result includes unsuccessful attempts; it is `null` if any token measurement is missing or no result is verified. Median token/time metrics are also `null` when incomplete, preventing missing data from appearing cheaper. Token counts must use the same provider accounting, including the same cached-input convention; they are not monetary cost across different pricing plans.
