import QuotationForm from '@/components/Admin/QuotationForm';

import { generateMetadata as genMeta } from '@/utils/metadata';

export const metadata = genMeta({
  title: 'Edit Quotation',
  description: 'Edit quotation',
  noIndex: true,
});

export default function EditQuotationPage() {
  return <QuotationForm />;
}

