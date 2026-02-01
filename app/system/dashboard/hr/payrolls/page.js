import Payrolls from '@/pageComponents/Admin/Payrolls';

import { generateMetadata as genMeta } from '@/utils/metadata';

export const metadata = genMeta({
  title: 'Payrolls',
  description: 'Skyfalke Admin Dashboard',
  noIndex: true,
});

export default function PayrollsPage() {
  return <Payrolls />;
}

