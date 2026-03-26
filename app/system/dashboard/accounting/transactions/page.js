import { Suspense } from 'react';
import Transactions from '@/pageComponents/Admin/Transactions';

import { generateMetadata as genMeta } from '@/utils/metadata';

export const metadata = genMeta({
  title: 'Transactions',
  description: 'Skyfalke Admin Dashboard',
  noIndex: true,
});

export default function TransactionsPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-12 text-gray-500">Loading…</div>}>
      <Transactions />
    </Suspense>
  );
}

