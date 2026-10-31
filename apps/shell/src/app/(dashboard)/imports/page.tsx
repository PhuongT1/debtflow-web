import { useTranslations } from 'next-intl';

import { HelpModal } from '@/components/ui/dialog/help-modal';
import { Page, PageGrid, PageHeader } from '@/components/ui/page/page';
import { SectionCard } from '@/components/ui/page/section-card';
import { DebtImportForm } from '@/features/imports';

export default function ImportsPage() {
  const ui = useTranslations('Workspace');

  return (
    <Page>
      <PageHeader
        title={ui('importExcel')}
        description={ui('moveExistingDebtRecordsFromExcelIntoTheApp')}
        actions={
          <HelpModal
            title={ui('howToImportExcel')}
            description={ui('forYourFirstMigrationFromAnExistingSpreadsheet')}
            steps={[
              ui('prepareAnExcelFileWithTheExpectedColumnHeaders'),
              ui('eachRowRepresentsOneDebtRecord'),
              ui('theSystemCreatesANewCustomerWhenNeeded'),
              ui('afterImportingCheckTheDebtsOrPartnersScreen'),
            ]}
            tips={[
              ui('tryImporting510RowsBeforeImportingALarge'),
              ui('ifYouProvideSaleemailTheEmailMustBelongTo'),
            ]}
          />
        }
      />

      <PageGrid>
        <SectionCard
          title={ui('uploadFile')}
          description={ui('chooseAnExcelFileInTheSupportedFormat')}
        >
          <DebtImportForm />
        </SectionCard>
        <SectionCard title={ui('fileFormat')} description={ui('supportedColumns')}>
          <div className="grid gap-3 text-sm text-slate-600">
            <p>{ui('theFirstRowContainsHeadersSupportedColumns')}</p>
            <code className="rounded-lg bg-slate-100 p-3 text-xs">
              partyName, partyCode, partyPhone, saleEmail, type, title, originalAmount, issueDate,
              dueDate, invoiceNo, orderNo, contractNo, poNo, followUpNote
            </code>
            <p>{ui('useReceivableForAmountsOwedToYouAndPayable')}</p>
          </div>
        </SectionCard>
      </PageGrid>
    </Page>
  );
}
