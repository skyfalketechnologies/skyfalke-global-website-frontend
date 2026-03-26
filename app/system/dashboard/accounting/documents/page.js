import AccountingDocuments from '@/pageComponents/Admin/AccountingDocuments';

import { generateMetadata as genMeta } from '@/utils/metadata';

export const metadata = genMeta({
  title: 'Sales Receipts & Notes',
  description: 'Skyfalke Admin Dashboard',
  noIndex: true,
});

export default function AccountingDocumentsPage() {
  return <AccountingDocuments />;
}
