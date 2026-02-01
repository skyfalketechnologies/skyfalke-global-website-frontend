import AcademyCourses from '@/pageComponents/Admin/AcademyCourses';

import { generateMetadata as genMeta } from '@/utils/metadata';

export const metadata = genMeta({
  title: 'Courses',
  description: 'Skyfalke Admin Dashboard',
  noIndex: true,
});

export default function AcademyCoursesPage() {
  return <AcademyCourses />;
}

