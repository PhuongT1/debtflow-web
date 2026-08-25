# @debtflow/react-ui

Shared platform theme, providers and feedback primitives. It contains no Debt/Party business logic and no API client.

## Run check

```bash
npm run typecheck -w @debtflow/react-ui
```

Change the common MUI theme in `src/app-providers.tsx`. Both frontend zones receive it after rebuilding. Feature-specific components remain inside their owning app to avoid a coupled "shared everything" package.
