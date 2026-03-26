import AccountingBankReconciliation from '@/pageComponents/Admin/AccountingBankReconciliation';

import { generateMetadata as genMeta } from '@/utils/metadata';

export const metadata = genMeta({
  title: 'Bank Reconciliation',
  description: 'Skyfalke Admin Dashboard',
  noIndex: true,
});

export default function AccountingBankReconciliationPage() {
  return <AccountingBankReconciliation />;
}
