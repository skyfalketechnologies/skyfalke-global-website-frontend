'use client';

import { useParams } from 'next/navigation';
import PayrollForm from '@/pageComponents/Admin/PayrollForm';

export default function PayrollDetailPage() {
  const params = useParams();
  const id = params?.id;

  return <PayrollForm id={id} />;
}

