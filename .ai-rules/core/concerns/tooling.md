# Tooling Rules

**Activate:** dependencies, formatting/linting, scripts, compiler or build changes. Inspect the project profile, manifests, lockfile and affected tool configuration.

- Use the existing package manager and declared scripts; do not mix lockfiles or assume npm/workspaces.
- Reuse configured formatter/linter ownership. Do not introduce competing app-local settings, change config formats or upgrade dependencies without a task-specific need.
- Keep formatting focused on changed files; repository-wide formatting is a separate authorized change.
- Declare dependencies in the package that imports them. Do not rely on incidental hoisting or undeclared workspace links.
- Keep framework-specific compiler/lint rules scoped to their owners. Audit existing imports before introducing boundary restrictions, and explain the supported replacement.
- Check the configured commands affected by the change. Do not invent a script or claim a runner exists because another project uses it.

**Accept when:** dependency resolution, ownership and relevant commands remain correct, with unavailable validation reported explicitly.
