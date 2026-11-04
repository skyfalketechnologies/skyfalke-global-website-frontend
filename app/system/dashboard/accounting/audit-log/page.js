import AccountingAuditLog from '@/pageComponents/Admin/AccountingAuditLog';

import { generateMetadata as genMeta } from '@/utils/metadata';

export const metadata = genMeta({
  title: 'Accounting Audit Log',
  description: 'Skyfalke Admin Dashboard',
  noIndex: true,
});

export default function AccountingAuditLogPage() {
  return <AccountingAuditLog />;
}
