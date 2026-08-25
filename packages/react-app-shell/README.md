# @debtflow/react-app-shell

Single source of truth for Debt Flow header, account menu, sidebar and cross-zone navigation.

- `shell` owns all core routes.
- `partner-ops` owns `/parties/**`.
- Same-zone links use Next navigation.
- Cross-zone links use a normal document navigation, as required by route-based Multi-Zones.

## Run check

```bash
npm run typecheck -w @debtflow/react-app-shell
```

Route/menu ownership comes from framework-neutral `@debtflow/navigation`. Change React header/sidebar rendering only in `src/app-shell.tsx`.
