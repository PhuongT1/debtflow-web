# Git Workflow

This is the branch naming convention for Debtflow contributors and AI agents. It is a project convention, not a requirement of the reusable core rules.

## Branch names

Use `<type>/<short-description>`. Choose the type from the main purpose of the change:

| Type       | Purpose                                              | Example                 |
| ---------- | ---------------------------------------------------- | ----------------------- |
| `feature`  | Add a capability or intentionally enhance behavior   | `feature/party-search`  |
| `fixbug`   | Correct existing incorrect behavior                  | `fixbug/login-redirect` |
| `refactor` | Reorganize code while preserving observable behavior | `refactor/shared-table` |
| `chore`    | Maintain tooling, configuration or AI skills         | `chore/ai-rules-audit`  |
| `docs`     | Change documentation only                            | `docs/ai-onboarding`    |

Write the description in lowercase English kebab-case. Use one type segment and a concise description of the outcome; do not use spaces, underscores, personal names or vague names such as `update` or `fix-stuff`. Use `fixbug/` consistently for bug fixes rather than alternating with `fix/` or `bugfix/`.

For example, use `chore/ai-rules-audit` to improve skills and assess rule compliance. If that assessment identifies product defects, fix independent defects on focused `fixbug/` branches. Use `docs/` only when the change contains documentation alone; documentation accompanying a feature stays with that feature.

## Before creating a branch

Inspect the current branch and working tree first. Create a new work branch from the team's agreed target branch, normally `main`; do not assume it is safe to switch while unrelated changes are present. Keep one coherent task per branch. Branch naming does not authorize discarding changes, committing, pushing or merging.

When asked to create a branch for AI toolkit maintenance, for example:

```bash
git switch -c chore/ai-rules-audit
```

The command creates a branch from the current HEAD; check that this is the intended base first. Do not rename existing branches or move unrelated work merely to enforce naming. Apply the convention when creating new branches or when explicitly asked to rename one.

## Review and AI behavior

Contributors and reviewers check branch naming before opening a pull request. AI agents proposing or creating a branch must use the same table and preserve the user's current work. A request to edit code alone does not require creating a branch or a commit.

This convention is documented and checked during review; there is currently no branch-name hook or CI enforcement. Branch prefixes and commit message types are separate conventions: `fixbug/` does not require a `fixbug:` commit prefix.
