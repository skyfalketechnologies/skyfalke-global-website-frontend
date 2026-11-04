import Attendance from '@/pageComponents/Admin/Attendance';

import { generateMetadata as genMeta } from '@/utils/metadata';

export const metadata = genMeta({
  title: 'Attendance',
  description: 'Skyfalke Admin Dashboard',
  noIndex: true,
});

export default function AttendancePage() {
  return <Attendance />;
}

