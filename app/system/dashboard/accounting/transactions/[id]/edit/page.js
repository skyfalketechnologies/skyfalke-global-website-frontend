'use client';

import { useParams } from 'next/navigation';
import TransactionForm from '@/pageComponents/Admin/TransactionForm';

export default function EditTransactionPage() {
  const params = useParams();
  const id = params?.id;

  return <TransactionForm id={id} />;
}

