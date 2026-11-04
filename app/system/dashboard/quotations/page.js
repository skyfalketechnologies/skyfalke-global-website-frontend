import QuotationsPage from '@/pageComponents/QuotationsPage';

import { generateMetadata as genMeta } from '@/utils/metadata';

export const metadata = genMeta({
  title: 'Quotations',
  description: 'Skyfalke Admin Dashboard',
  noIndex: true,
});

export default function QuotationsPageRoute() {
  return <QuotationsPage />;
}

