import InvoiceList from '@/pageComponents/Admin/InvoiceList';

import { generateMetadata as genMeta } from '@/utils/metadata';

export const metadata = genMeta({
  title: 'Invoices',
  description: 'Skyfalke Admin Dashboard',
  noIndex: true,
});

export default function InvoiceListPage() {
  return <InvoiceList />;
}

