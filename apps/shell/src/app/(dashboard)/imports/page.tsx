import { HelpModal } from "@/components/ui/help-modal";
import { Page, PageGrid, PageHeader } from "@/components/ui/page";
import { SectionCard } from "@/components/ui/section-card";
import { DebtImportForm } from "@/features/imports/debt-import-form";

export default function ImportsPage() {
  return (
    <Page>
      <PageHeader title="Import Excel" description="Đưa dữ liệu công nợ cũ từ Excel vào hệ thống để sale chuyển qua web nhanh hơn." actions={
        <HelpModal
          title="Cách import Excel"
          description="Dành cho lần đầu chuyển dữ liệu từ file cũ sang web."
          steps={[
            "Chuẩn bị file Excel với dòng đầu là tên cột đúng format.",
            "Mỗi dòng là một khoản công nợ.",
            "Nếu khách chưa tồn tại, hệ thống tự tạo khách mới.",
            "Sau khi import xong, vào Công nợ hoặc Khách hàng để kiểm tra lại.",
          ]}
          tips={["Nên import thử 5-10 dòng trước khi import file lớn.", "Nếu dùng saleEmail, email đó phải tồn tại trong danh sách user."]}
        />
      } />

      <PageGrid>
        <SectionCard title="Upload file" description="Chọn file Excel theo đúng định dạng hệ thống">
          <DebtImportForm />
        </SectionCard>
        <SectionCard title="Định dạng file" description="Danh sách cột được hỗ trợ">
          <div className="grid gap-3 text-sm text-slate-600">
            <p>Dòng đầu tiên là header. Các cột hỗ trợ:</p>
            <code className="rounded-lg bg-slate-100 p-3 text-xs">
              partyName, partyCode, partyPhone, saleEmail, type, title, originalAmount, issueDate, dueDate, invoiceNo, orderNo, contractNo, poNo, followUpNote
            </code>
            <p>
              `type` dùng `RECEIVABLE` cho phải thu hoặc `PAYABLE` cho phải trả. Nếu không nhập `issueDate`, hệ thống lấy ngày hiện tại.
            </p>
          </div>
        </SectionCard>
      </PageGrid>
    </Page>
  );
}
