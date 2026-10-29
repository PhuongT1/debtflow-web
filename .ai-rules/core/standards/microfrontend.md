# Microfrontend Rules

**Activate:** independently deployed/embedded application boundaries. Do not load this for an ordinary single-app change. Host/domain responsibilities come from the project profile.

- Each app is independently buildable, deployable, and runnable. Preserve standalone behavior when changing embedded behavior.
- An MFE owns its domain state, API queries, and domain UI. The configured host owns only the platform responsibilities assigned by the project.
- Never import internal source files from one deployable app into another. Share only public workspace packages.
- Put neutral types/message schemas and browser integration helpers in their existing public owners; do not turn either package into a global business-data store.
- Use URLs for navigable state and deep links. Use explicit, versioned events for notifications that cross MFE boundaries. Events carry identifiers or small metadata, never full business entities, tokens, or stores.
- Validate event `source`, `version`, and origin. Use explicit allowlisted target origins in production; never use `*` for sensitive messages.
- Do not share Redux, Zustand, NgRx, React context, or framework runtime state across MFEs.
- A host-level modal/backdrop belongs to the configured host. An MFE-local modal remains inside that MFE; do not solve cross-window layering with z-index patches.
- Runtime origins and feature enablement come from environment/registry configuration, never hard-coded deployment URLs.

## Cross-window overlays

- Use the adopting project's registered host-overlay contract for global dialogs. Keep business forms/validation/mutations in the remote and backdrop/viewport modality in the host; preserve standalone local rendering.
- Centralize request/result transport, view registration and UI adapters. Features supply a view ID and bounded input, never arbitrary URLs, executable UI, callbacks or credentials. Validate origin, source window, protocol, payload and request correlation in both directions.
- Keep the source application mounted. An independently mounted overlay has its own providers/cache; report completion to the initiating feature to refresh only the affected data.
- Preserve draft/pending/error guards, focus restoration, Escape/backdrop policy, nested controls, content sizing and translated labels. Do not close pending mutations or discard drafts merely because the host requested closure.
- Verify success, cancel, retry, unmount, unsupported host/load failure, spoofed messages, standalone and embedded modes, desktop and mobile. Do not claim another framework's UI adapter is supported merely because its transport is framework-neutral.

- Keep cross-window send/listen, host sessions and content sessions framework-independent. UI adapters own rendering/focus/animations. Distinguish listener readiness from measured UI readiness; reveal after initial layout and retain content until exit ends. Define input/result schemas and show concrete emit/listen examples in the adopting project’s documentation.
