# Partner Ops Architecture

- `apps/partner-ops` is the customer and supplier domain MFE at port 3001.
- It must work standalone and when embedded by the Shell. Keep its own header/account controls for standalone mode; do not render the Shell sidebar inside this app.
- Routes under `/parties` belong to this application. Partner/domain data, API queries, forms, and domain UI remain here.
- Navigation to another domain uses the explicit Platform navigation contract; do not import another MFE or transfer a business object.
- Validate with `npm run typecheck:partner-ops`; also run `npm run build:partner-ops` after Next config, routing, layout, provider, or integration changes.

## Source ownership

- Keep App Router pages thin and consume the stable public entry of a feature when one exists. `features/parties/index.ts` is the supported route-facing surface for the Parties domain.
- Keep Party-specific form, query, table, and client-state code in `features/parties/`; do not move it into `components/` just because it renders UI.
- `components/platform/` is reserved for embedding bridges and platform contracts. `components/ui/` contains app-specific presentation only; promote a proven multi-app UI primitive to `@debtflow/react-ui` instead of copying it.
