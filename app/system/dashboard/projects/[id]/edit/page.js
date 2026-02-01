'use client';

import { useParams } from 'next/navigation';
import ProjectForm from '@/pageComponents/Admin/ProjectForm';

export default function EditProjectPage() {
  const params = useParams();
  const id = params?.id;

  return <ProjectForm id={id} />;
}

