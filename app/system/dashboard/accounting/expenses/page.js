import { Suspense } from 'react';
import Expenses from '@/pageComponents/Admin/Expenses';

import { generateMetadata as genMeta } from '@/utils/metadata';

export const metadata = genMeta({
  title: 'Expenses',
  description: 'Skyfalke Admin Dashboard',
  noIndex: true,
});

export default function ExpensesPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-12 text-gray-500">Loading…</div>}>
      <Expenses />
    </Suspense>
  );
}

