import Tenders from '@/pageComponents/Admin/Tenders';

import { generateMetadata as genMeta } from '@/utils/metadata';

export const metadata = genMeta({
  title: 'Tenders',
  description: 'Skyfalke Admin Dashboard',
  noIndex: true,
});

export default function TendersPage() {
  return <Tenders />;
}

