# ADR 001: Persistent Platform with hybrid composition

Status: accepted

Debtflow cần UI chung không đổi khi chuyển route nhưng micro apps phải khác framework/version và deploy độc lập. Route delegation toàn document làm layout bị dựng lại; ép mọi app vào một Module Federation runtime tăng coupling.

Next Platform sở hữu persistent product chrome. Registry tách layout khỏi integration. Angular Payments là Web Component content; Next Partner Ops là content-only isolated frame; route handoff chỉ dùng với layout none. Generic composer mount remote on demand, còn origin nằm trong env.

Kết quả: Header/Sidebar sửa một nơi, app vẫn build/deploy/rollback độc lập. Platform là platform dependency cho composed UX nên remote host có timeout/error/retry và contract phải backward compatible trong cutover.
