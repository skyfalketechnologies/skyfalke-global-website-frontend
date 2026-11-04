import Employees from '@/pageComponents/Admin/Employees';

import { generateMetadata as genMeta } from '@/utils/metadata';

export const metadata = genMeta({
  title: 'Employees',
  description: 'Skyfalke Admin Dashboard',
  noIndex: true,
});

export default function EmployeesPage() {
  return <Employees />;
}

