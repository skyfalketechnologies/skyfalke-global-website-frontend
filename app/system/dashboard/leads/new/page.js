import LeadForm from '@/pageComponents/Admin/LeadForm';

import { generateMetadata as genMeta } from '@/utils/metadata';

export const metadata = genMeta({
  title: 'New Lead',
  description: 'Skyfalke Admin Dashboard',
  noIndex: true,
});

export default function NewLeadPage() {
  return <LeadForm />;
}

