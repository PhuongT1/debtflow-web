# Select Implementation Standards

**Activate:** before editing a responsibility whose exact standards have not already been selected. **Scope:** code/technical policy; does not grant permission.

| Intended edit                                               | Read only matching topics                                                                                                                                                 |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Source naming, types, layout, imports                       | [Code style](../standards/code-style.md)                                                                                                                                  |
| React styles/responsiveness/accessibility                   | [Styling](../frameworks/react/ui-and-accessibility/styling.md) / [accessibility](../frameworks/react/ui-and-accessibility/accessibility.md), according to the actual edit |
| React component responsibility                              | [Responsibilities](../frameworks/react/components/responsibilities.md)                                                                                                    |
| React props/events/defaults                                 | [Props](../frameworks/react/components/props.md)                                                                                                                          |
| React modes/slots/wrapper precedence/pending ownership      | [Contracts](../frameworks/react/components/contracts.md)                                                                                                                  |
| React render logic/identity/keys                            | [Rendering](../frameworks/react/components/rendering.md)                                                                                                                  |
| React hooks/state/effects/forms/data or file/import changes | [React selector](../frameworks/react/README.md), only triggered rows                                                                                                      |
| Angular                                                     | [Angular](../frameworks/angular/README.md)                                                                                                                                |
| Next rendering/routes/config                                | [Next.js](../frameworks/nextjs/README.md)                                                                                                                                 |
| Shared package/public exports or reusable contracts         | [Shared consumers](shared-code.md) and affected owner instructions; a shared package alone does not imply microfrontends                                                  |
| Independently deployed host/embedded application contracts  | [MFE](../standards/microfrontend.md), only when those deployment boundaries actually exist                                                                                |
| Auth/session/security                                       | [Authentication](../concerns/authentication.md), [security](../standards/security.md)                                                                                     |
| Change translated text/formatting                           | [i18n](../concerns/i18n.md); existing-locale testing alone does not trigger it                                                                                            |
| API/message shape                                           | [API contracts](../concerns/api-contracts.md)                                                                                                                             |
| Dependency/lint/build tooling                               | [Tooling](../concerns/tooling.md)                                                                                                                                         |

Apply the matching local extension from the already loaded [project profile](../../project/README.md), when it declares one. Do not open its entire extension tree. Multiple rows may apply; style-value-only edits do not require props/rendering rules. Newly discovered responsibilities activate only their rows. Do not traverse every topic/reference or infer a framework from the word “component.”

**Exit:** matching implementation rules loaded; return to the selected workflow with [scope permissions](change-scope.md) satisfied.
