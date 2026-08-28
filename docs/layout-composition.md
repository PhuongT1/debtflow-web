# Layout composition

Platform sở hữu product chrome: Header, Sidebar, account menu, responsive behavior và global feedback. Domain team sở hữu content trong main outlet. Sửa Sidebar chỉ sửa React AppShell/navigation một lần; Payments và Partner embedded mode không render lại Sidebar.

| Requirement        | Layout  | Result                                  |
| ------------------ | ------- | --------------------------------------- |
| Product module     | main    | Platform Header + Sidebar + remote content |
| Focused flow       | minimal | Platform minimal chrome + remote content   |
| Independent portal | none    | remote full document                    |

Platform đọc layout policy từ package registry và tự tạo runtime route. Vì vậy thêm app mới không cần copy một host page riêng cho từng framework.

Integration được chọn riêng:

- Web Component: bounded Angular/Vue/React UI cùng document; cần scoped CSS/runtime manifest.
- iframe: full-document framework như Next hoặc cần isolation mạnh; dùng same-origin proxy/versioned postMessage.
- route: full handoff chỉ khi không cần product chrome.

Không import app khác, không copy layout vào embedded mode, không share framework store/token, không dùng alias xuyên workspace và không nới boundary checker.
