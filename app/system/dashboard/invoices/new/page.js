import InvoiceMaker from '@/pageComponents/Admin/InvoiceMaker';

import { generateMetadata as genMeta } from '@/utils/metadata';

export const metadata = genMeta({
  title: 'New Invoice',
  description: 'Skyfalke Admin Dashboard',
  noIndex: true,
});

export default function NewInvoicePage() {
  return <InvoiceMaker />;
}

