# Run the Project

## Prerequisites

Use Node.js **22.23.1**, pinned in the root `.nvmrc`, and npm 10+. All GitHub Actions jobs read that same file. Angular CLI 22 does not support Node 20; the compatible ranges are recorded in the root `package.json` engines. The workspace uses npm; preserve its lockfile. Backend/environment provisioning is separate from starting the frontend processes.

## Step 1: Select the Node.js version

Open a terminal at the `debtflow-web` repository root. With nvm installed, run:

```bash
nvm install
nvm use
node --version
npm --version
```

**Expected result:** Node.js reports `v22.23.1` and npm reports version 10 or newer. Other Node version managers should select the version in `.nvmrc`.

## Step 2: Install dependencies

```bash
npm ci
```

**Expected result:** installation finishes successfully using `package-lock.json`. Install on first setup or when dependency inputs change; this is not a daily startup step.

## Step 3: Start the apps

```bash
npm run dev:all
```

Keep this terminal running. The root scripts start Shell on 3000, Partner Ops on 3001, and Payments on 3002. Open [Shell](http://localhost:3000) in your browser. Backend/environment provisioning is separate; request the team's environment configuration if a required service is unavailable.

For a smaller development session, choose the matching command:

| Need                   | Command                                          |
| ---------------------- | ------------------------------------------------ |
| Shell alone            | `npm run dev:shell`                              |
| Partner Ops alone      | `npm run dev:partner-ops`                        |
| Payments alone         | `npm run dev:payments`                           |
| Shell with Partner Ops | `npm run dev:partner-stack`                      |
| Shell with Payments    | `npm run dev:payments-stack`                     |
| This documentation     | `npm run rules:viewer` → `http://127.0.0.1:4317` |

## Step 4: Open the documentation and configure AI

In a separate terminal at the repository root, run:

```bash
npm run docs:dev
```

Open [the documentation](http://127.0.0.1:4317/). This server reads the Markdown source directly. For AI-assisted work, complete [Client Setup](../ai-guide/project-context/client-setup.md) once in the same checkout.

| Documentation command  | When to use it                               | Result                                                    |
| ---------------------- | -------------------------------------------- | --------------------------------------------------------- |
| `npm run docs:dev`     | Write or read current Markdown               | Local viewer on port 4317; reload after edits             |
| `npm run docs:build`   | Validate and generate a publishable snapshot | Static files in `dist/docs/`                              |
| `npm run docs:preview` | Inspect the last build                       | Static preview on port 4318; rebuild to include new edits |

## Before changing code

Identify the [owner](find-owner.md), inspect existing working changes, and use that owner's checks. Do not start duplicate processes or build production output over an active Next dev server's `.next`.

The scripts and package manifests are the executable source of truth. This page does not contain environment secrets or assume credentials.
