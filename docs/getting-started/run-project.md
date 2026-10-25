# Run the Project

## Prerequisites

Use the Node.js/npm versions required by the root `package.json` and the repository's existing environment setup. The workspace uses npm; preserve its lockfile. Backend/environment provisioning is separate from starting the frontend processes.

## Commands

From `debtflow-web`:

```bash
npm ci
npm run dev:all
```

The root scripts start Shell on 3000, Partner Ops on 3001, and Payments on 3002. Install only when setting up or when dependency inputs require it, not before every task.

| Need                   | Command                                          |
| ---------------------- | ------------------------------------------------ |
| Shell alone            | `npm run dev:shell`                              |
| Partner Ops alone      | `npm run dev:partner-ops`                        |
| Payments alone         | `npm run dev:payments`                           |
| Shell with Partner Ops | `npm run dev:partner-stack`                      |
| Shell with Payments    | `npm run dev:payments-stack`                     |
| This documentation     | `npm run rules:viewer` → `http://127.0.0.1:4317` |

## Before changing code

Identify the [owner](find-owner.md), inspect existing working changes, and use that owner's checks. Do not start duplicate processes or build production output over an active Next dev server's `.next`.

The scripts and package manifests are the executable source of truth. This page does not contain environment secrets or assume credentials.
