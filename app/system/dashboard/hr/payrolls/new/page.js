import PayrollForm from '@/pageComponents/Admin/PayrollForm';

import { generateMetadata as genMeta } from '@/utils/metadata';

export const metadata = genMeta({
  title: 'New Payroll',
  description: 'Skyfalke Admin Dashboard',
  noIndex: true,
});

export default function NewPayrollPage() {
  return <PayrollForm />;
}

