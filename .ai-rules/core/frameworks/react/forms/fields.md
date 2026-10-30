# Fields

**Activate:** native or controlled field bindings, refs and submit controls. **Scope:** this responsibility only; apply project facts and the selected task workflow.

- Use the installed form and validation libraries; do not add a second stack for an adjacent feature. React Hook Form/Zod examples apply only when those dependencies are configured.
- Keep a form's schema, initial-value mapping, and submission mapping owned by that domain. Extract a schema when shared or large, not automatically for a tiny form.
- Use the installed form library's supported controlled-field adapter, or the project's existing native React state pattern. Wire value, change, blur and refs as required; verify the actual input receives focus and accessible attributes. A form library is not mandatory.
- When MUI and React Hook Form are installed, reuse a shared `Controller`-backed field adapter. Pass typed `control` and `name`, forward value/change/blur and attach `field.ref` to the actual `inputRef`; expose validation/help text once. Do not spread `register` into a MUI wrapper or register a controlled field twice. Native file inputs may retain `register`; do not control a file input's value.
- Keep schema/default values and string-to-number/request mapping in the feature. A numeric HTML input does not imply that form state is numeric. Preserve disabled/read-only payload semantics, reset behavior, dynamic field-array names, autofill and error focus when migrating bindings.
- Label every input; placeholders are not labels. Connect error/help text and expose invalid state. Move focus to a useful error target after a rejected submission.
- A form must have a real submit path (`onSubmit`) supporting Enter. Non-submit controls inside forms must use `type="button"`.

| Field/lifecycle         | Required decision                                                                                                           |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Native-compatible input | Preserve the existing native/state/library binding; when using React Hook Form, `register` must reach the actual input      |
| Controlled widget       | Use the installed adapter contract; with React Hook Form, use `Controller` where needed and do not also register that field |
| Single select           | Stable option ID as the form value; `''` or `null` must have a documented meaning                                           |
| Multi-select            | Stable ID array; normalize the installed control's actual callback shape instead of casting it to the desired shape         |

**Accept when:** bindings, input refs, labels, field errors and Enter/non-submit behavior work for affected controls.
