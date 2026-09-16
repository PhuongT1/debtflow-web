# Micro Frontend Rules

- Each app is independently buildable, deployable, and runnable. Preserve standalone behavior when changing embedded behavior.
- An MFE owns its domain state, API queries, and domain UI. The Shell owns composition, global navigation, authenticated session UX, locale selection, tenant selection, and global overlays.
- Never import internal source files from one deployable app into another. Share only public workspace packages.
- Put framework-neutral types and versioned message shapes in `@debtflow/contracts`; put small browser integration helpers in `@debtflow/platform-sdk`; do not turn either package into a global business-data store.
- Use URLs for navigable state and deep links. Use explicit, versioned events for notifications that cross MFE boundaries. Events carry identifiers or small metadata, never full business entities, tokens, or stores.
- Validate event `source`, `version`, and origin. Use explicit allowlisted target origins in production; never use `*` for sensitive messages.
- Do not share Redux, Zustand, NgRx, React context, or framework runtime state across MFEs.
- A host-level modal/backdrop belongs to the Shell. An MFE-local modal remains inside that MFE; do not solve cross-window layering with z-index patches.
- Runtime origins and feature enablement come from environment/registry configuration, never hard-coded deployment URLs.
