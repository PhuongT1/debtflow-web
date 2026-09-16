# @debtflow/partner-ops (Partner Operations Remote)

Next.js 15 Micro Frontend owning the Partner & Supplier management domain: public landing page at `/` and workspace management at `/parties/**`.

The Shell host composes this workspace via a private embed entrypoint `/__embed/parties`. The user-facing URL is `/parties`.

- **Standalone Mode** (`http://localhost:3001`): Runs independently with its own local layout and domain navigation.
- **Embedded Mode** (`http://localhost:3000/parties`): Rendered seamlessly within the Shell's `AppShell` container via a Same-Origin Isolated Frame.

```bash
npm install
cp apps/partner-ops/.env.example apps/partner-ops/.env.local
npm run dev:partner-stack
# open http://localhost:3000/parties

npm run dev:partner-ops
# standalone public: http://localhost:3001/
# standalone workspace: http://localhost:3001/parties

npm run check:partner-ops
npm run build:partner-ops
npm run start:partner-ops
```

## Internationalization (no locale routing)

Partner Ops uses `next-intl` with the App Router. Locale is deliberately not part of the URL: routes stay `/parties` in both Vietnamese and English. The current locale comes from the shared `df_locale` cookie and is synchronized at runtime from Platform using the versioned MFE event contract.

```text
messages/
  vi.json                 # Vietnamese catalog
  en.json                 # English catalog
src/i18n/request.ts       # Reads df_locale for Server Components
src/components/providers/partner-intl-provider.tsx
                            # Runtime client provider for MFE events
```

### Add or change a translation

1. Add the same namespace/key to both `messages/vi.json` and `messages/en.json`.
2. In a Client Component, use `const t = useTranslations("Namespace")` and render `t("key")`.
3. For date, number and currency formatting, use `const format = useFormatter()` rather than creating a locale-specific formatter in the feature.

```tsx
'use client';
import { useFormatter, useTranslations } from 'next-intl';

export function Example() {
  const t = useTranslations('Parties');
  const format = useFormatter();
  return (
    <p>
      {t('title')} — {format.dateTime(new Date(), { dateStyle: 'short' })}
    </p>
  );
}
```

Do not add `[locale]` routes, call `window.location.reload()`, or keep feature-local translation dictionaries. `NextIntlClientProvider` receives `locale:changed` after Platform or standalone language selection, so client UI changes language without remounting the MFE.
