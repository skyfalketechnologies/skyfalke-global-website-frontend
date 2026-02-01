import QuotationForm from '@/components/Admin/QuotationForm';

import { generateMetadata as genMeta } from '@/utils/metadata';

export const metadata = genMeta({
  title: 'New Quotation',
  description: 'Create a new quotation',
  noIndex: true,
});

export default function NewQuotationPage() {
  return <QuotationForm />;
}

