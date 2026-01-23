import CaseStudyForm from '@/components/Admin/CaseStudyForm';

import { generateMetadata as genMeta } from '@/utils/metadata';

export const metadata = genMeta({
  title: 'New Case Study',
  description: 'Skyfalke Admin Dashboard',
  noIndex: true,
});

export default function NewCaseStudyPage() {
  return <CaseStudyForm />;
}

