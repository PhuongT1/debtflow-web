# Common Engineering Rules

- Use TypeScript when the target framework supports it; avoid `any`. Narrow untrusted data at boundaries.
- Inspect the target module and its local conventions before introducing an abstraction or dependency.
- Prefer small, cohesive files and explicit names. Keep state near its consumers.
- Reuse an existing package or pattern before creating a new one. Do not create speculative abstractions.
- Do not modify unrelated files, reformat unrelated code, or silently change public behavior.
- Do not commit secrets, credentials, personal tokens, generated caches, or local environment files.
- Preserve backward compatibility for public contracts unless the task explicitly authorizes a versioned breaking change.
- Use the root npm scripts. Do not mix package managers.
- Validate proportionally: typecheck for TypeScript changes; lint when it is configured; build for framework/configuration changes. Report checks that could not run.
- Do not use destructive Git operations (`reset --hard`, force push, checkout of user changes) unless explicitly requested.
