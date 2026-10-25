# Define a New Component

**Activate:** creating reusable UI. **Scope:** contract and placement, not implementation permission.

- Identify purpose, actual consumers, required variants, inputs/outputs, state/data ownership, labels, keyboard behavior, and responsive needs. Include only relevant default/empty/loading/invalid/pending/error/disabled/success states.
- Inspect nearest existing implementations and public primitives before creating alternatives. Reuse or extend a compatible primitive; anticipated future consumers alone do not justify abstraction.
- Put domain actions/forms in their feature; presentation shared within one app in its presentation layer; compatible cross-app presentation in the established shared UI package.
- Across frameworks, share neutral contracts/helpers/tokens and keep supported presentation adapters. Do not import another deployable app's internal source.

**Exit:** explicit component contract, owner, and real caller. Return to [creation sequence](README.md) for scope/impact gates before implementation.
