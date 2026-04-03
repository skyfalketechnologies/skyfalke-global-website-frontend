import { Suspense } from 'react';
import PortalAttendance from '@/pageComponents/Admin/Portal/PortalAttendance';
import { generateMetadata as genMeta } from '@/utils/metadata';

export const metadata = genMeta({
  title: 'My attendance',
  description: 'Employee portal attendance',
  noIndex: true,
});

export default function PortalAttendancePage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-12 text-gray-500">Loading…</div>}>
      <PortalAttendance />
    </Suspense>
  );
}
