# Verify Feature Acceptance

**Activate:** capability patch ready. **Scope:** agreed acceptance criteria and actual entry points/consumers.

Exercise requested success behavior and relevant invalid, pending/duplicate, error/retry, empty, permission, and navigation cases. Check responsive/locale/focus behavior only where affected. New endpoints/contracts need the matching boundary checks; shared changes need affected apps/modes.

Use existing tools and real consumers; do not add a runner just to mirror markup. Follow [common checks/reporting](../../execution/verify.md). Unavailable scenarios remain explicit limitations. Failed acceptance returns to investigation; unrelated failures do not authorize unrelated modifications.

**Exit:** requested capability evidenced within scope, required checks pass, and material limits reported.
