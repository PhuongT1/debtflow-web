# Debt Flow Product Plan

## Mục tiêu

Debt Flow không chỉ thay Excel bằng một cái bảng online. Sản phẩm phải giúp sale hoặc shop nhỏ nhìn được ngay: ai đang nợ, nợ bao nhiêu, khoản nào quá hạn, ai phụ trách gọi khách, khách đã trả bao nhiêu lần và còn thiếu bao nhiêu.

## Vì Sao Không Dùng Excel

Excel mạnh về nhập liệu và công thức, nhưng yếu ở những việc vận hành hằng ngày:

- Dễ sai công thức khi copy dòng, sort, merge file hoặc nhiều người cùng sửa.
- Khó biết ai đã sửa dữ liệu, sửa lúc nào, vì sao sửa.
- Không có phân quyền rõ ràng giữa sale, kế toán, quản lý.
- Khó nhắc việc thu tiền theo ngày hẹn, tuổi nợ, trạng thái follow-up.
- Không gom lịch sử thanh toán, ghi chú gọi khách và chứng từ vào một hồ sơ khách.
- Không có dashboard realtime cho manager xem tổng nợ, quá hạn, dòng tiền thu về.
- File lớn dần, dễ trùng khách, trùng hóa đơn, lệch số tiền đã thu và số còn lại.

Debt Flow phải thắng Excel bằng workflow rõ ràng, ít thao tác, có cảnh báo, có lịch sử, có phân quyền và xuất Excel khi cần đối soát.

## Người Dùng Chính

- Sale doanh thu 1-2 tỷ/tháng cần biết khách nào phải gọi thu tiền hôm nay.
- Shop nhỏ bán thiếu cần quản lý khách nợ và lịch sử trả một phần.
- Kế toán cần kiểm tra công nợ, thanh toán, hóa đơn, chứng từ.
- Quản lý cần dashboard tổng nợ, nợ quá hạn, hiệu quả thu tiền theo sale.

## Nguyên Tắc UX

- Mỗi màn hình chỉ phục vụ một việc chính.
- Dữ liệu nhập sai phải báo lỗi ngay dưới field, không báo lỗi kỹ thuật.
- Thao tác nguy hiểm dùng modal confirm có icon và mô tả hậu quả.
- Table phải compact, có phân trang, chọn số dòng, empty state rõ ràng.
- Form thêm/sửa dùng dialog để không chiếm chỗ của table.
- Field bắt buộc luôn có dấu `*`.
- Button, input, select phải cùng chiều cao và cùng style.
- Hạn chế logic ẩn: nếu không xóa được vì còn công nợ, phải nói rõ lý do.

## Kiến Trúc Frontend

- `src/app/providers.tsx`: chứa `ThemeProvider`, `QueryClientProvider`, config chung cho MUI và React Query.
- `src/components/ui`: component tái sử dụng như button, card, table, confirm dialog, form dialog, help modal.
- `src/features/*`: nghiệp vụ theo module, gồm form, schema, service.
- Server component dùng cho danh sách ban đầu để SEO/SSR và đơn giản hóa auth.
- Client component dùng cho form, mutation, confirm action và tương tác nhỏ.
- React Query dùng cho các mutation và sau đó mở rộng dần sang các list cần realtime.

## Plan Triển Khai

### Phase 1: Chuẩn UX nền

- Thay `window.confirm/alert` bằng reusable confirm dialog.
- Chuẩn hóa MUI theme: input, button, table compact.
- Chuẩn hóa form bằng `react-hook-form` và lỗi theo field.
- Chuẩn hóa table: pagination, page size, empty state, horizontal scroll.

### Phase 2: Data Fetching Và Mutation

- Dùng `useMutation` cho create/update/delete/payment/import.
- Dùng `useQuery` cho các list cần refresh nhanh: đối tác, công nợ, thanh toán.
- Sau mutation, invalidate query thay vì reload toàn trang.
- Tách API client helper để parse lỗi đồng nhất.

### Phase 3: Table Trải Nghiệm Giống Admin Tool

- Nâng `DataTable` thành grid table reusable hơn: column config, align, width, sticky header, row action.
- Nếu cần filter/sort client mạnh hơn, cân nhắc `@mui/x-data-grid`.
- Không đưa DataGrid quá sớm nếu server pagination/filter hiện tại đã đủ, tránh tăng dependency và logic.

### Phase 4: Công Nợ Thực Tế Cho Sale/Shop

- Customer 360: tổng nợ, quá hạn, lịch sử thanh toán, ghi chú follow-up.
- Aging report: chưa đến hạn, 1-7, 8-30, 31-60, trên 60 ngày.
- Follow-up task: hôm nay cần gọi ai, khách hẹn ngày nào.
- Payment partial: thanh toán một phần, tự tính còn lại và trạng thái.
- Export Excel: giữ đường thoát cho kế toán/đối soát.

### Phase 5: Kiểm Soát Và Tin Cậy

- Audit log cho tạo/sửa/xóa/thanh toán.
- Phân quyền rõ: admin, kế toán, sale, viewer.
- Soft delete có trạng thái inactive, không làm mất lịch sử.
- Chặn trùng mã khách, mã hóa đơn, chứng từ quan trọng bằng thông báo dễ hiểu.

## Tiêu Chí Hoàn Thành

- Người mới có thể tạo khách, tạo công nợ, ghi nhận thanh toán trong dưới 3 phút.
- Manager mở dashboard biết tổng nợ và nợ quá hạn ngay.
- Sale biết hôm nay cần gọi khách nào.
- Dữ liệu không bị mất lịch sử khi xóa mềm.
- Mọi lỗi nhập liệu đều là tiếng Việt, gắn đúng field hoặc modal.
