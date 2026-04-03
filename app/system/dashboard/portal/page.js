import { Suspense } from 'react';
import EmployeePortalHome from '@/pageComponents/Admin/Portal/EmployeePortalHome';
import { generateMetadata as genMeta } from '@/utils/metadata';

export const metadata = genMeta({
  title: 'Employee Portal',
  description: 'Internal employee portal',
  noIndex: true,
});

export default function PortalHomePage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-12 text-gray-500">Loading…</div>}>
      <EmployeePortalHome />
    </Suspense>
  );
}
