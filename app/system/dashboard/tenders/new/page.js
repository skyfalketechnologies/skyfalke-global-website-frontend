import TenderForm from '@/pageComponents/Admin/TenderForm';

import { generateMetadata as genMeta } from '@/utils/metadata';

export const metadata = genMeta({
  title: 'New Tender',
  description: 'Skyfalke Admin Dashboard',
  noIndex: true,
});

export default function NewTenderPage() {
  return <TenderForm />;
}

