# Accessibility

**Activate:** semantic controls, dialogs, focus, menus or responsive table interaction. **Scope:** this responsibility only; apply project facts and the selected task workflow.

- Use semantic buttons for actions and links for navigation. Icon-only controls need accessible names following the project's copy/localization policy. Preserve visible focus and keyboard activation.
- Keep heading levels meaningful and content landmarks owned by the layout. Responsive hiding must not remove the only meaningful page heading.
- Dialogs must have an accessible title/description, managed focus, a cancel path, and focus restoration. Opening a confirmation must not execute its action. Prevent dismissal/duplicate confirmation while a committed action is pending when interruption would mislead the user.
- Tables need stable row keys, proper headers, appropriate alignment, and a bounded scroll region on small screens. Loading/error/empty states must remain understandable without horizontal overflow of the whole page.
- Check each affected presentation mode that actually exists; standalone/embedded checks apply only to projects supporting those modes. Follow the owning app's layout conventions.

| Component           | Required observable behavior                                                                                                                                                        |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Confirmation dialog | Accessible name; focus enters; Tab/Shift+Tab stay inside; Cancel/Escape close while idle; focus returns to trigger; pending dismissal policy is explicit                            |
| Menu → dialog       | Close/finish the menu handoff before dialog focus is established; do not let the exiting menu steal focus                                                                           |
| Language dropdown   | Current selection visible; keyboard open/select/close; selected state exposed; outside click/Escape dismiss appropriately; no page reload or lost form draft merely to translate UI |
| Form field          | Visible label, linked helper/error text, `aria-invalid` when invalid; errors are not indicated by color alone                                                                       |
| Responsive table    | Container scrolls rather than the document; fixed columns/shadows track scroll; headers and values stay associated; narrow/empty/loading cases remain usable                        |
| Async control       | Disabled/loading state matches the actual promise; failure restores a usable action and announces its error                                                                         |

For affected shared typography, compare equivalent roles by computed font family, size, weight, and line height; do not assume the project has a common header or a particular dashboard layout.

**Accept when:** keyboard/focus behavior passes and affected surfaces follow the project's styling contracts in supported modes; replacing a wrapper does not lose supported refs, customization, or accessibility attributes.

External references: [MUI composition](https://mui.com/material-ui/guides/composition/), [WAI-ARIA modal dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/). The idle dialog behavior follows the accessibility pattern; a pending-operation restriction is an action-specific policy and must not trap users indefinitely after failure.
