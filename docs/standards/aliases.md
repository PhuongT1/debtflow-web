# Alias and dependency policy

Aliases are compile-time conveniences owned by one application. They are not integration contracts.

## Rules

- Define aliases only in the owning app's tsconfig/bundler config.
- Every alias target starts with `./` and resolves inside that app.
- The same spelling, such as `@app/*`, may mean different local folders in different apps. Each app is compiled independently, so this is safe.
- Never import another app through a relative path, tsconfig path or package dependency.
- `@debtflow/*` is reserved for explicit workspace packages. Do not use that namespace for a local alias.
- Neutral packages expose serializable contracts, tokens or browser protocols and must not depend on React, Angular, Vue, Next or MUI.
- Framework adapters include their framework in the package name, for example `react-ui`.

Run `npm run check:architecture` after changing an alias, dependency, app manifest or route.
