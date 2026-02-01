import QuotationView from '@/components/Admin/QuotationView';

import { generateMetadata as genMeta } from '@/utils/metadata';

export const metadata = genMeta({
  title: 'View Quotation',
  description: 'View quotation details',
  noIndex: true,
});

export default function QuotationDetailPage() {
  return <QuotationView />;
}

