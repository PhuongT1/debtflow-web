# Shell MFE Integration

- Treat each remote as independently deployed; its runtime origin and enablement come from environment/registry configuration.
- Validate every incoming cross-window message against origin, source, and contract version before acting on it.
- Send locale/navigation notifications through the versioned Platform contract, not by touching an MFE DOM or runtime state.
- Platform-level modals and backdrops are rendered by the Shell. Do not use iframe z-index workarounds for global overlays.
- For iframe remotes advertising route synchronization, keep the mounted document stable; own public URL/history and map route messages through the registry. Same-application navigation and Back/Forward must not reload the iframe or reset its ready state. Retain document navigation for older remotes without the capability.

- Embedded screens use a page-shaped skeleton while the remote first initializes. Do not display implementation labels such as “loading micro frontend.” After readiness, the embedded screen owns data loading; internal navigation must not reintroduce the host placeholder. Keep timeout/error/retry and message validation intact. Accessible loading labels use the locale catalog.

- Loading composition uses the registry's public presentation metadata and a neutral shared skeleton renderer. Keep its geometry aligned with the live remote and evaluate breakpoints against the embedded container; never import remote app source or duplicate a page-specific layout in the host.

- Use the public shared `OverlayHost` with registered view routes. Keep its frame owned by a top-document MUI dialog; do not import remote domain UI. The [overlay guide](../../../docs/architecture/overlays/README.md) maps sources and registration.
