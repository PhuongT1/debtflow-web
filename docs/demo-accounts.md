# Demo accounts

These accounts exist only in the local/demo database seeded by `debtflow-api/prisma/seed.ts`. Do not reuse them in production, staging, documentation screenshots, or customer environments.

All demo accounts use password `Demo@123456`.

| Organization | Type | Account | Membership role | Purpose |
| --- | --- | --- | --- | --- |
| Debt Flow platform | Platform | `admin@debtflow.local` | Platform owner | Manages platform-level accounts. It does not receive tenant ledger access by default. |
| An Phú Fashion | Business | `owner@anphu-fashion.demo` | Owner | Tests organization ownership and member administration. |
| An Phú Fashion | Business | `accountant@anphu-fashion.demo` | Accountant | Tests debt and payment operations. |
| An Phú Fashion | Business | `viewer@anphu-fashion.demo` | Viewer | Tests read-only access. |
| B Minimal Store | Business | `owner@b-minimal.demo` | Owner | Verifies isolation from An Phú Fashion. |
| Linh Personal Store | Personal | `linh@linh-store.demo` | Owner | Tests a one-person workspace. |

## Expected isolation

- An Phú Fashion has its own partners, debts, catalog and payments.
- B Minimal Store cannot retrieve or modify An Phú Fashion IDs; the API returns no tenant data for another organization.
- The active organization and membership role are carried in the API session token.
- A user who belongs to multiple organizations uses the organization-switch endpoint; the Shell will present that switcher as the next UI step.
