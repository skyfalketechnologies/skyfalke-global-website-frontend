import AccountingJournal from '@/pageComponents/Admin/AccountingJournal';

import { generateMetadata as genMeta } from '@/utils/metadata';

export const metadata = genMeta({
  title: 'Journal Entries',
  description: 'Skyfalke Admin Dashboard',
  noIndex: true,
});

export default function AccountingJournalPage() {
  return <AccountingJournal />;
}
