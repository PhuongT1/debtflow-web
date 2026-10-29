# @packages/platform-navigation

Framework-neutral route ownership and navigation manifest. React, Angular or another frontend adapter can render this data without importing another app.

## Run check

```bash
npm run typecheck -w @packages/platform-navigation
```

When adding a micro frontend, add its zone and route ownership here, then implement a framework-specific renderer in that app or adapter package.

## Source ownership

`src/navigation.types.ts` defines shared models; `navigation-items.ts` owns this project's menu data; `navigation-label.ts` resolves its labels. `index.ts` is the intentional public export only. Replace menu data and branding when adopting another project; framework-neutral does not mean its routes are universal.
