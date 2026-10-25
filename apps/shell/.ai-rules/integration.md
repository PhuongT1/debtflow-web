# Shell MFE Integration

- Treat each remote as independently deployed; its runtime origin and enablement come from environment/registry configuration.
- Validate every incoming cross-window message against origin, source, and contract version before acting on it.
- Send locale/navigation notifications through the versioned Platform contract, not by touching an MFE DOM or runtime state.
- Platform-level modals and backdrops are rendered by the Shell. Do not use iframe z-index workarounds for global overlays.
- For iframe remotes advertising route synchronization, keep the mounted document stable; own public URL/history and map route messages through the registry. Same-application navigation and Back/Forward must not reload the iframe or reset its ready state. Retain document navigation for older remotes without the capability.
