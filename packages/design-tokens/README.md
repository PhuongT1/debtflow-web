# @debtflow/design-tokens

Framework-neutral visual tokens for React, Angular and future micro frontends.

Typography roles are available as `designTokens.typography` in TypeScript and
`--df-font-*` / `--df-line-height-*` CSS variables. Keep both representations in
sync. All apps use the same font stack, 16px/400 body text, 24px/800 domain page
titles, 16px/800 header titles, 14px/400 table cells, 12px/750 table headings, and
12px/750 language triggers. The platform overview may use a larger page title.

TypeScript consumers:

```ts
import { designTokens } from '@debtflow/design-tokens';
```

CSS consumers, including Angular:

```css
@import '@debtflow/design-tokens/tokens.css';
```

## Run check

```bash
npm run typecheck -w @debtflow/design-tokens
```
