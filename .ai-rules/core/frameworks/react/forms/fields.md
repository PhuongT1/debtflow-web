# Fields

**Activate:** native or controlled field bindings, refs and submit controls. **Scope:** this responsibility only; apply project facts and the selected task workflow.

- Use the installed form and validation libraries; do not add a second stack for an adjacent feature. React Hook Form/Zod examples apply only when those dependencies are configured.
- Keep a form's schema, initial-value mapping, and submission mapping owned by that domain. Extract a schema when shared or large, not automatically for a tiny form.
- Use the installed form library's supported controlled-field adapter, or the project's existing native React state pattern. Wire value, change, blur and refs as required; verify the actual input receives focus and accessible attributes. A form library is not mandatory.
- Label every input; placeholders are not labels. Connect error/help text and expose invalid state. Move focus to a useful error target after a rejected submission.
- A form must have a real submit path (`onSubmit`) supporting Enter. Non-submit controls inside forms must use `type="button"`.

| Field/lifecycle         | Required decision                                                                                                           |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Native-compatible input | Preserve the existing native/state/library binding; when using React Hook Form, `register` must reach the actual input      |
| Controlled widget       | Use the installed adapter contract; with React Hook Form, use `Controller` where needed and do not also register that field |
| Single select           | Stable option ID as the form value; `''` or `null` must have a documented meaning                                           |
| Multi-select            | Stable ID array; normalize the installed control's actual callback shape instead of casting it to the desired shape         |

**Accept when:** bindings, input refs, labels, field errors and Enter/non-submit behavior work for affected controls.
