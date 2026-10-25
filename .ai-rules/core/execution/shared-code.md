# Shared Code Restrictions

**Activate:** editing a reusable component/hook/utility, exported package API, shared token/style/default, provider, or core routing/auth/cache/configuration capability. Applies even inside a feature when several consumers reuse the target.

**Read boundary:** target contract, export/re-export chain, discovered consumer usages, owner instructions, and relevant tests/configuration. Search all applicable workspace consumers; read only affected usage sections. Do not edit consumers merely because they were found.

Before editing:

- Identify dependent components/pages/features/workflows, apps, and standalone/embedded modes. Check consumer-specific overrides, defaults, refs/slots, and framework adapters where relevant.
- Evaluate whether a local caller correction can satisfy the request safely. Avoid global default changes to solve a single caller's problem.
- State intended delta, dependent surfaces, compatibility evidence, and verification scope. For hooks/utilities include side effects, inputs/outputs, async behavior, and mutation ownership as applicable.

**May proceed:** the request authorizes this outcome, concrete impact is understood, and existing consumer contracts are preserved or their requested changes are explicitly authorized.

**Must stop for approval:** consumer coverage is incomplete in a way that affects confidence; a public/default behavior may break; core architecture changes are needed outside scope; or required consumer edits exceed authorization. Present the concrete patch/options using [approval](approval.md), not a vague request to “change shared code.” Approval does not prove compatibility or replace retesting.

**Exit:** justified shared edit with affected-consumer checks, or approval pending.
