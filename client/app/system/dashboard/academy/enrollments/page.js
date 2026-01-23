import AcademyEnrollments from '@/pageComponents/Admin/AcademyEnrollments';

import { generateMetadata as genMeta } from '@/utils/metadata';

export const metadata = genMeta({
  title: 'Enrollments',
  description: 'Skyfalke Admin Dashboard',
  noIndex: true,
});

export default function AcademyEnrollmentsPage() {
  return <AcademyEnrollments />;
}

