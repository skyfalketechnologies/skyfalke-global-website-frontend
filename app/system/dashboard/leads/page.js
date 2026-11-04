import Leads from '@/pageComponents/Admin/Leads';

import { generateMetadata as genMeta } from '@/utils/metadata';

export const metadata = genMeta({
  title: 'Leads',
  description: 'Skyfalke Admin Dashboard',
  noIndex: true,
});

export default function LeadsPage() {
  return <Leads />;
}

