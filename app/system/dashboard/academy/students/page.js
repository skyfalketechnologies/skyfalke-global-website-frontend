import AcademyStudents from '@/pageComponents/Admin/AcademyStudents';

import { generateMetadata as genMeta } from '@/utils/metadata';

export const metadata = genMeta({
  title: 'Students',
  description: 'Skyfalke Admin Dashboard',
  noIndex: true,
});

export default function AcademyStudentsPage() {
  return <AcademyStudents />;
}

