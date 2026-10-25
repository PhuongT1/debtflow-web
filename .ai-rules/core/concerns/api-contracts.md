# API Contract Rules

**Activate:** changing API payloads, public types, events or cross-module schemas. Locate the actual public owner and affected consumers first.

- Keep transport contracts separate from UI, mutable stores, secrets and domain orchestration. Use the project's public contract module/package if one exists; do not create one speculatively.
- Prefer additive compatible changes. Breaking changes require authorized versioning and consumer migration, not an implicit rewrite.
- Validate untrusted boundary data at runtime where required. A TypeScript assertion does not establish payload validity.
- Match serialization, optional/empty values, error envelopes and cancellation to the installed adapter's actual contract.
- Keep domain behavior in the owning feature/application. Shared message schemas describe communication, not a global business-data store.

**Accept when:** relevant producers/consumers remain compatible and success/error/boundary scenarios are checked. Apply [shared impact](../execution/shared-code.md) for public contracts.
