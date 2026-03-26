import AccountingGeneralLedger from '@/pageComponents/Admin/AccountingGeneralLedger';

import { generateMetadata as genMeta } from '@/utils/metadata';

export const metadata = genMeta({
  title: 'General Ledger',
  description: 'Skyfalke Admin Dashboard',
  noIndex: true,
});

export default function AccountingGeneralLedgerPage() {
  return <AccountingGeneralLedger />;
}
