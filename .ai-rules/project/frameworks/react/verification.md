# Debtflow Verification

**Activate:** verification changes in Debtflow; load only this selected local extension.

| Change                                                     | Required verification                                                                             |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Shell React source                                         | `npm run typecheck:shell` and `npm run lint:shell`                                                |
| Partner Ops React source                                   | `npm run typecheck:partner-ops` and `npm run lint:partner-ops`                                    |
| Shared React source                                        | `npm run typecheck -w @packages/ui-react`, `npm run lint:packages`, and affected app checks       |
| Package boundary/export/dependency changes                 | `npm run check:architecture` and relevant package/consumer checks                                 |
| Routing, layouts/composition, provider, Next configuration | Owning app's `npm run build:shell` / `npm run build:partner-ops` in addition to targeted checks   |
| Documentation-only rules                                   | Targeted Prettier check, Markdown link/path checks, and conflict review against existing policies |

Login/logout changes cover ports 3000, 3001 and 3002 with full return context, direct remote entry, allowlist rejection and legacy return links. React apps currently provide lint/typecheck/build scripts, not a unit-test runner; report this limit instead of inventing a command.

Local references: [root scripts](../../../../package.json), [Next lint rules](../../../../tooling/eslint/next.mjs), [architecture checker](../../../../scripts/check-frontend-boundaries.mjs). Documentation-only changes require formatting/link/consistency checks, not an unrelated production build.
