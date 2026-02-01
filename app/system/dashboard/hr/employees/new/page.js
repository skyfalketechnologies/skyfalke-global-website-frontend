import EmployeeForm from '@/pageComponents/Admin/EmployeeForm';

import { generateMetadata as genMeta } from '@/utils/metadata';

export const metadata = genMeta({
  title: 'New Employee',
  description: 'Skyfalke Admin Dashboard',
  noIndex: true,
});

export default function NewEmployeePage() {
  return <EmployeeForm />;
}

