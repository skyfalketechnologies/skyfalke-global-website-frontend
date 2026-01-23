'use client';

import { useParams } from 'next/navigation';
import AccountForm from '@/pageComponents/Admin/AccountForm';

export default function EditAccountPage() {
  const params = useParams();
  const id = params?.id;

  return <AccountForm id={id} />;
}

