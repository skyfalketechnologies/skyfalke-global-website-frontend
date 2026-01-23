import ProjectForm from '@/pageComponents/Admin/ProjectForm';

import { generateMetadata as genMeta } from '@/utils/metadata';

export const metadata = genMeta({
  title: 'New Project',
  description: 'Skyfalke Admin Dashboard',
  noIndex: true,
});

export default function NewProjectPage() {
  return <ProjectForm />;
}

