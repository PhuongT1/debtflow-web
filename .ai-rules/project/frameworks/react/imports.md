# Debtflow Imports

**Activate:** imports changes in Debtflow; load only this selected local extension.

Local references: [Parties public API](../../../../apps/partner-ops/src/features/parties/index.ts), [server-only adapter](../../../../apps/shell/src/services/debt.server.ts), [package exports](../../../../packages/react-ui/package.json), [boundary checker](../../../../scripts/check-frontend-boundaries.mjs).

## Choose the import path

In both React apps, `@/` resolves to that app's own `src/` directory. It does not refer to the monorepo root or another app.

| Import relationship                          | Required form                   | Example                                        |
| -------------------------------------------- | ------------------------------- | ---------------------------------------------- |
| Sibling / child in the same cohesive feature | Direct relative import          | `./party-table`, `./hooks/use-party-filters`   |
| Parent inside that same feature              | At most one `../` where clearer | `../party-types`                               |
| Other app layer or feature public API        | Configured app alias            | `@/components/ui/button`, `@/features/auth`    |
| Shared workspace package                     | Declared public package export  | `@debtflow/react-ui`, `@debtflow/platform-sdk` |
| Shared package internal sibling              | Relative module import          | `./table-cell`                                 |

```ts
// Inside features/parties/list/party-list.tsx:
import { useTranslations } from 'next-intl';
import { AppLocaleMenu } from '@debtflow/react-ui';
import { Button } from '@/components/ui/button';
import { useParties } from '../hooks/use-parties';
import { PartyTable } from './party-table';
import type { PartyFilters } from './party-types';

// Outside the feature, consume an intentional public entry:
import { PartyList } from '@/features/parties';
```

The example paths illustrate ownership; they are not a claim that every example module currently exists.

Must not add imports such as:

```ts
import { Button } from '../../../components/ui/button';
import { PartyForm } from '@/features/parties/form/party-form'; // from a different feature
import { AppLocaleMenu } from '@debtflow/react-ui/src/shell/app-shell-locale-menu';
import { PartnerTable } from '../../../../partner-ops/src/features/parties/party-table';
```
