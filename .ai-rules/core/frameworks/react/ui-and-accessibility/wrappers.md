# Wrappers

**Activate:** refs, attributes, slots or prop precedence in a UI wrapper. **Scope:** this responsibility only; apply project facts and the selected task workflow.

- Preserve supported styling props, disabled state, `aria-*`, handlers, and required refs through the wrapper's documented API. Decide which props callers may override; place spreads deliberately. Do not add library-specific props to native or unrelated controls.
- Preserve nested caller attributes and customization when composing a wrapper. If the installed library uses slots (for example MUI `slotProps`), merge them according to its actual version contract, including function-valued slots; do not assume all libraries share that API.
- Verify refs reach the intended element using the installed React version and control contract. A ref to a wrapper root does not prove a form library can focus the actual input. Keys identify React elements; do not forward them as DOM attributes.
- Keep a controlled widget's semantic value at the app boundary (IDs, not accidental option-object identity).

Library-specific APIs apply only when installed; preserve the actual library/version contract. **Accept when:** supported refs/attributes/events/slots reach the intended element and precedence is verified.
