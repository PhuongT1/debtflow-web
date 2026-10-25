# Assess an Existing Code Change

**Activate:** shared/default/core contracts change, or the [common edit check](../standards/common.md#before-an-edit) leaves propagation uncertain. **Scope:** the proposed behavior/contract delta, not an audit of every reachable file. Local changes still require purpose, usage and compatibility understanding under the common check.

1. Understand the target's purpose and current inputs/outputs/defaults. Read its declaration, relevant imports, and immediate caller. Note state ownership, effects, requests, and rendering responsibilities when affected.
2. Identify direct consumers through symbol/import and re-export searches. Follow wrappers, aliases, registrations, and transitive contracts where the changed behavior propagates. A local pathname does not prove a single consumer.
3. Evaluate only affected contracts: types/defaults, callback timing, state/reset, focus/keyboard/ARIA, styles/layout/overflow, locale, errors, query/cache behavior, navigation, and public exports.
4. Note affected pages/features/apps/modes and meaningful checks. Shared/reusable targets activate [shared-code restrictions](shared-code.md).
5. Keep a short impact statement in working context: target/purpose, changed contract, consumers, preserved behavior, checks, and unresolved gaps. Share it before shared/high-impact edits; a routine understood local fix needs only a brief summary.

Unsearched/unavailable consumers, unexplained side effects, or an unverified compatibility assumption are concrete uncertainty, not permission to guess. Investigate narrowly; if impact still cannot be determined confidently, [request approval](approval.md) before editing the uncertain target. Never require proof against every hypothetical risk.

**Exit:** supported impact boundary and verification scope, or a specific approval gate.
