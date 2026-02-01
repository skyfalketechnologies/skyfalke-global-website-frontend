import CourseForm from '@/components/Admin/CourseForm';

import { generateMetadata as genMeta } from '@/utils/metadata';

export const metadata = genMeta({
  title: 'New Course',
  description: 'Skyfalke Admin Dashboard',
  noIndex: true,
});

export default function NewCoursePage() {
  return <CourseForm />;
}

