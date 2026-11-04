'use client';

import { useParams } from 'next/navigation';
import CourseForm from '@/components/Admin/CourseForm';

export default function EditCoursePage() {
  const params = useParams();
  const id = params?.id;

  return <CourseForm id={id} />;
}

