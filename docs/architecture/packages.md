# Shared Package Boundaries

| Package                   | Responsibility                              | Inspect before editing                                     |
| ------------------------- | ------------------------------------------- | ---------------------------------------------------------- |
| `@debtflow/contracts`     | Shared data/contract definitions            | Public exports and producers/consumers                     |
| `@debtflow/design-tokens` | Shared typography, colors and visual tokens | React/Angular consumers and overrides                      |
| `@debtflow/navigation`    | Shared navigation definitions               | Route owners and actual navigation callers                 |
| `@debtflow/mfe-registry`  | Registry/manifest for composition           | Host registration, route ownership and architecture checks |
| `@debtflow/platform-sdk`  | Framework-neutral platform capabilities     | Browser/integration callers and supported contracts        |
| `@debtflow/react-ui`      | Shared React presentation primitives        | Public API, wrappers, affected apps and modes              |

## Allowed dependencies

Use supported package exports. Do not import a deployable app's internal feature into another app. Neutral contracts/helpers must remain usable independently of a particular presentation framework.

## Impact and checks

A token/default or utility change can affect several screens even when its TypeScript signature is unchanged. Search exports and consumers, assess behavior/layout effects, and select affected consumer checks before editing.

Canonical requirements: [MFE boundaries](../../.ai-rules/core/standards/microfrontend.md), [shared-code restrictions](../../.ai-rules/core/execution/shared-code.md), and [verification](../../.ai-rules/core/execution/verify.md).
