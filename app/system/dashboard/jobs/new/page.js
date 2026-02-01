import JobForm from '@/components/Admin/JobForm';

import { generateMetadata as genMeta } from '@/utils/metadata';

export const metadata = genMeta({
  title: 'New Job',
  description: 'Skyfalke Admin Dashboard',
  noIndex: true,
});

export default function NewJobPage() {
  return <JobForm />;
}

