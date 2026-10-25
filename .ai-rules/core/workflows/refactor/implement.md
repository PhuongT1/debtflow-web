# Implement a Behavior-Preserving Refactor

**Activate:** requested structural outcome and impact understood; implementation authorized.

- Apply [scope](../../execution/change-scope.md), [impact](../../execution/impact.md), and [shared restrictions](../../execution/shared-code.md) as triggered. Unknown compatibility/permission requires [approval](../../execution/approval.md).
- Select touched structure/import/component/state topics via [implementation rules](../../execution/implementation-rules.md). Plan public/dependent migrations using [planning](../planning/README.md) before changing them.
- Preserve state identity, event timing, cleanup, defaults, query keys, public exports, and styles where affected. Keep the refactor cohesive and within the requested boundary.
- Do not combine opportunistic fixes, upgrades, architecture migrations, or new behavior. If behavior must change, [switch rules](../../execution/switch-rules.md) and reassess permission.

**Exit:** structural patch ready for [equivalence verification](verify.md).
