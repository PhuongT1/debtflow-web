# Lifecycle

**Activate:** default values, async records, reset or locale/dirty state. **Scope:** this responsibility only; apply project facts and the selected task workflow.

- Set intentional default values. Do not switch fields between controlled/uncontrolled values or overwrite edits when async data changes without a reset policy.
- Initial/default values follow the installed library or native React contract; they do not prevent browser autofill. For example, React Hook Form `defaultValues` are not a general reactive-update policy. Use an explicit reset/prefill action when the user needs it.
- Reset when the selected record changes or an explicit reset is requested, following the form library contract. Do not reset on a locale change.
- Follow the existing copy/localization policy for field messages, server-error fallbacks, button labels, and success messages. In localized apps, store stable error codes/keys where practical so errors can change language without clearing inputs; do not introduce an i18n system into an unlocalized app.

| Field/lifecycle      | Required decision                                                                                                                           |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Async initial record | Populate/reset once data for the selected record is ready; never overwrite dirty input because a background refetch returned a fresh object |
| Switch record A to B | Explicit record-identity reset/remount; if unsaved edits matter, apply the feature's discard policy                                         |
| Switch language      | Keep values/dirty state; translate the displayed errors                                                                                     |
| Save rejects         | Keep the dialog/values, map known API field errors, show a form-level fallback for unmapped errors                                          |
| Save succeeds        | Close/reset according to the feature contract, then refresh affected data                                                                   |

Do not reset a form from an effect depending on an unstable `initialValues` object on every render. For existing-record refresh, define whether to retain dirty fields, ask to discard, or accept the new version. Use the installed form library's reset options only after that decision.

**Accept when:** record changes reset intentionally, refetches do not overwrite dirty edits, locale changes preserve values and success/failure follow the feature contract.
