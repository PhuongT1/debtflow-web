# Add a frontend zone

1. Chọn bounded capability/public path.
2. Tạo apps/<zone> với package, alias, env, test, build, README, CI riêng.
3. Chọn layout main|minimal|none theo UX, không theo framework.
4. Chọn Web Component cho content cùng document, iframe cho full-document/isolation, route cho full handoff.
5. Chỉ depend neutral package; không import app khác.
6. Register app/version/contracts/publicPath/layout/integration/proxy/entry/env-key trong packages/mfe-registry/src/manifest.json. Platform tự compose main/minimal hoặc route handoff cho none; không tạo bản sao Header/Sidebar trong remote.
7. Thêm menu metadata và deployment env; không commit production URL.
8. Thêm app-owned CI/root convenience scripts.
9. Chạy npm run check:architecture và app checks.
10. Test standalone, composed, auth, deep links, unavailable remote, version mismatch và rollback.

Web Component publish runtime manifest/scoped CSS/stable element name. Frame có content-only mode/same-origin proxy/versioned postMessage. Business state luôn qua API.
