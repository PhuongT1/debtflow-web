# Debtflow Integration

**Activate:** integration changes in Debtflow; load only this selected local extension.

## Concrete integration contracts

| Concern                 | Use                                                     | Required behavior                                                                                                                      |
| ----------------------- | ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Central login URL       | `buildLoginUrl(platformOrigin, returnTo)`               | Preserve the complete caller URL in `callbackUrl`; do not substitute the Platform root                                                 |
| Logout                  | Confirmation UI → `signOutFromPlatform(platformOrigin)` | Cancel sends no logout request; success ends at central login with callback context; failure remains retryable                         |
| Login return validation | Shell `resolveLoginReturnTo`                            | Allowlist origins and application-page targets; accept legacy `returnTo`; reject protocol-relative/external/API/auth-loop destinations |
| Locale persistence      | `setStoredLocale` / existing provider events            | Update labels without clearing values or duplicating locale state across ad hoc stores                                                 |
| Date/money display      | Current app's formatters / locale formatter             | Respect domain precision; format at the presentation boundary                                                                          |
| HTTP failure            | Existing normalized API error + feature translation     | Separate field errors, authorization, timeout/network, and empty-success states                                                        |

The `callbackUrl` field in the logout POST is the central **login URL**; that login URL's query contains the original **application URL**. Do not confuse the two destinations or overwrite the inner return target.

For URL changes, start from the current `URL`/`URLSearchParams`; update only the feature-owned keys and preserve unrelated parameters and the fragment unless the navigation contract says otherwise. Do not double-encode callback URLs or decode untrusted destinations outside the central validator.

Translate at the owner: a feature may call `useTranslations`; shared presentation receives labels or an established explicit locale contract. Do not pass a generic app translation function into a package that should remain independent of that catalog. Existing feature-local translation functions are not cross-app contracts.

Local references: [login builder](../../../../packages/platform/sdk/src/navigation/login-url.ts), [logout integration](../../../../packages/platform/sdk/src/auth/sign-out.ts), [return validator](../../../../apps/shell/src/lib/auth/login-navigation.ts), [Shell composition](../../../../apps/shell/src/features/auth/authenticated-shell.tsx).
