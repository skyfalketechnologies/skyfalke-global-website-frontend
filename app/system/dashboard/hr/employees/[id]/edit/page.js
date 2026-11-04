'use client';

import { useParams } from 'next/navigation';
import EmployeeForm from '@/pageComponents/Admin/EmployeeForm';

export default function EditEmployeePage() {
  const params = useParams();
  const id = params?.id;

  return <EmployeeForm id={id} />;
}

