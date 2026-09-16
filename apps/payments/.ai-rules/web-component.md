# Payments Web Component Boundary

- Do not expose Angular internals to the Shell or rely on host DOM implementation details.
- Keep element lifecycle, inputs, outputs, and error/loading behavior explicit and documented near the element entry point.
- Use versioned contracts for messages shared beyond the component boundary.
