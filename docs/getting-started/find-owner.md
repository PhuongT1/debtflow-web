# Find the Owning App or Package

| Reported surface                                            | Likely owner                    | Confirm using                                                                          |
| ----------------------------------------------------------- | ------------------------------- | -------------------------------------------------------------------------------------- |
| Port 3000, global composition, native dashboard/auth routes | Shell                           | [Shell instructions](../../apps/shell/AGENTS.md), route and handler                    |
| Port 3001, parties/customers/suppliers                      | Partner Ops                     | [Partner Ops instructions](../../apps/partner-ops/AGENTS.md), feature entry and caller |
| Port 3002, payment UI                                       | Payments                        | [Payments instructions](../../apps/payments/AGENTS.md), component/service              |
| Cross-app React presentation                                | Shared React UI                 | Public export and actual consumers                                                     |
| Shared types, navigation, tokens, registry, SDK             | Relevant neutral/shared package | [Package map](../architecture/packages.md), imports and public exports                 |

Ports identify an entry point, not necessarily the cause: a Shell URL may compose a remote app. Confirm ownership with a bounded filename/symbol search before editing.

Framework conventions come from [engineering standards](../engineering/README.md); business ownership comes from the app/feature. Do not move domain logic into generic components just because it renders UI.

For the corresponding agent reading boundary, see [context rules](../../.ai-rules/core/execution/context.md).
