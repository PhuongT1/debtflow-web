# Micro Frontend architecture

## Composition

```text
Browser
  -> Platform: auth, MainLayout, MinimalLayout, BFF
       -> /payments: lazy-load Angular <debtflow-payments>
       -> /parties: Next Partner content qua same-origin isolated frame
       -> core routes: Platform features
```

Partner dùng frame vì Next xuất full document, không phải framework-neutral component artifact. Platform mount Partner qua entry nội bộ `/__embed/parties`; entry này rewrite về route nghiệp vụ mà không thêm query kỹ thuật. Embedded mode chỉ render content và giao tiếp bằng origin-checked, versioned postMessage. Payments dùng Angular Element vì đây là bounded client UI. Header/Sidebar không nằm trong remote khi composed.

Partner standalone vẫn có React AppShell để isolation test nhưng dùng shared React adapter, không copy source. Angular standalone là content harness.

## Layout policy

- main: Header + Sidebar + identity.
- minimal: Header tối giản, không navigation.
- none: remote sở hữu full document; chỉ dùng cho portal độc lập.

Policy nằm trong @debtflow/mfe-registry và tách khỏi integration type. Generic Platform catch-all compose mọi app main; không có page host riêng cho từng framework.

## Isolation

```text
apps/* ------------X------------> apps/*
any app ------------------------> neutral packages
React apps ---------------------> react adapters
Angular/Vue/etc ------X---------> react adapters
neutral packages -----X---------> UI framework
```

Mỗi app có package.json, aliases, env, build và CI riêng. Root lockfile tái lập monorepo nhưng không tạo shared runtime.

## Data/state

1. URL/query cho filters, pagination, deep link.
2. NestJS API là source of truth.
3. /api/mfe/session cung cấp minimal identity; token vẫn HttpOnly.
4. CustomEvent/postMessage versioned chỉ truyền navigation hoặc invalidation ID.

## Performance và failure

Remote lazy-load theo route; runtime manifest kiểm tra app/version/element; host có timeout/loading/retry. Angular hiện khoảng 152 kB raw / 45 kB transfer, CSS scoped. Partner frame cô lập JS/CSS và Next/React versions. Rollback bằng đổi origin/artifact, không rebuild app khác.

Single source of truth: packages/mfe-registry/src/manifest.json; schema: platform/manifests/schema.json. npm run check:architecture kiểm tra topology, contract, import, dependency và alias.
