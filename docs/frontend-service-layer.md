# Frontend service layer

## Mục tiêu

Mọi giao tiếp HTTP của Shell nằm tại `apps/shell/src/services`. Feature chỉ giữ UI, state tương tác và logic trình bày; schema/validation nằm trong `features/<domain>/model`.

## Cấu trúc

- `*.server.ts`: chỉ dành cho Server Components, route/page server. File có `import 'server-only'`, dùng service server và chuẩn hóa DTO từ backend.
- `*.client.ts`: dành cho Client Components, hooks và mutations. File chỉ gọi `apiClient.get/post/patch/put/delete`; không chứa React state, toast, router hay UI.
- `lib/api/http.ts`: transport native `fetch` duy nhất của Shell. Mọi code khác không gọi `fetch` trực tiếp.
- `lib/api/client.ts`: facade phía trình duyệt, tự xử lý locale/header, same-origin credentials, timeout, hủy request, JSON/FormData và chuẩn hóa lỗi.
- `lib/api/server.ts`: adapter server-side. Không đặt endpoint nghiệp vụ tại `lib/api`.
- `features/<domain>/model`: Zod schema, type và validation của domain.
- `features/<domain>/{forms,list,detail,...}`: chỉ import hàm service theo domain.

## API client

Cú pháp công khai theo kiểu Axios, nhưng không cần thêm Axios:

```ts
apiClient.get<PartyPage>('/api/parties?page=1');
apiClient.post('/api/debts', payload);
apiClient.patch('/api/debts/' + id, payload);
apiClient.delete('/api/debts/' + id);
```

Phần gọi `fetch`, set method, serialize JSON/FormData, timeout và parse envelope được giữ riêng trong `lib/api`. Vì thế service không được truyền `method: 'POST'` hoặc tự `JSON.stringify` nữa.

Không tự retry `POST/PATCH/PUT/DELETE` cho dữ liệu tài chính: retry sau lỗi mạng không xác định có thể tạo trùng công nợ hoặc thanh toán. Nếu cần retry trong tương lai, endpoint đó phải hỗ trợ idempotency key rõ ràng.

## Quy ước

1. Mỗi service theo resource/domain, ví dụ `debt.server.ts`, `party.client.ts`; không tạo `api.ts` nghiệp vụ chung chung.
2. Server/client luôn tách file để tránh vô tình đưa credential hoặc code server vào bundle trình duyệt.
3. Thêm endpoint: mở rộng service đúng domain, sau đó feature gọi qua service.
4. Không dùng barrel `services/index.ts` trộn server và client vì có thể kéo server module vào client bundle.

## Shared library map

```text
src/lib/
├── api/           # HTTP transport, client facade, server adapter, API envelope
├── auth/          # NextAuth session and role authorization
├── config/        # validated environment and MFE manifest
├── domain/        # cross-feature domain enums/value types
├── forms/         # generic server-field-error adapter
├── presentation/  # display formatters (money, date inputs)
├── routing/       # URL and pagination helpers
├── styling/       # class name composition
└── validation/    # generic query validation helpers
```

Chỉ thêm module shared khi ít nhất hai domain dùng được; còn lại giữ trong feature sở hữu nó. Không tạo thư mục `utils` tổng hợp.
## Service naming convention

- File: `<domain>.<runtime>.ts`, lowercase kebab-case domain. Ví dụ: `debt.server.ts`, `payment.client.ts`. Không thêm `.service` vì file đã ở trong `services/`.
- Cùng capability ở client/server phải cùng tên. Ví dụ: cả `catalog.client.ts` và `catalog.server.ts` export `getCatalogOptions`.
- Query collection: `list<NounPlural>` — `listDebts`, `listPartyDebtSummaries`.
- Query single resource hoặc singleton: `get<Noun>` — `getDebt`, `getDashboard`.
- Mutation: imperative verb + domain noun — `createDebt`, `updateDebt`, `recordDebtPayment`, `importDebtWorkbook`.
- Không đặt tên theo UI hoặc transport như `get...Page`, `...Client`, `fetchData`, `handleRequest`; return type và query/pagination là chi tiết của implementation, không phải tên capability.
## API route catalog

Client-facing URLs are defined only in `lib/api/routes.ts` as `shellApiRoutes`, grouped by domain. A dynamic segment is a builder, for example `shellApiRoutes.debts.detail(debtId)`; query strings use `buildApiRouteWithQuery`.

Service modules must not contain literal `/api/...` paths. For a new endpoint, extend the correct domain object in the route catalog, then use that named route in the owning service. When the catalog becomes large, split it into `lib/api/routes/<domain>.ts` and re-export a composed `shellApiRoutes`; do not create a flat global string enum.

