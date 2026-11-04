'use client';

import { useParams } from 'next/navigation';
import ProjectDetail from '@/pageComponents/Admin/ProjectDetail';

export default function ProjectDetailPage() {
  const params = useParams();
  const id = params?.id;

  return <ProjectDetail id={id} />;
}

