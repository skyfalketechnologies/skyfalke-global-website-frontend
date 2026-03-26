import { Suspense } from 'react';
import AccountingDocumentForm from '@/pageComponents/Admin/AccountingDocumentForm';

import { generateMetadata as genMeta } from '@/utils/metadata';

export const metadata = genMeta({
  title: 'New Financial Document',
  description: 'Skyfalke Admin Dashboard',
  noIndex: true,
});

export default function AccountingDocumentNewPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-24 text-gray-500">Loading…</div>
      }
    >
      <AccountingDocumentForm />
    </Suspense>
  );
}
