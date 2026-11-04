import AdminCaseStudies from '@/pageComponents/Admin/CaseStudies';

import { generateMetadata as genMeta } from '@/utils/metadata';

export const metadata = genMeta({
  title: 'Case Studies',
  description: 'Skyfalke Admin Dashboard',
  noIndex: true,
});

export default function AdminCaseStudiesPage() {
  return <AdminCaseStudies />;
}

