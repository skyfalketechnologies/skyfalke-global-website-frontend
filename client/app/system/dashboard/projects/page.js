import Projects from '@/pageComponents/Admin/Projects';

import { generateMetadata as genMeta } from '@/utils/metadata';

export const metadata = genMeta({
  title: 'Projects',
  description: 'Skyfalke Admin Dashboard',
  noIndex: true,
});

export default function ProjectsPage() {
  return <Projects />;
}

