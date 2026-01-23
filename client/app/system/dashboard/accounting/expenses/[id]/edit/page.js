'use client';

import { useParams } from 'next/navigation';
import ExpenseForm from '@/pageComponents/Admin/ExpenseForm';

export default function EditExpensePage() {
  const params = useParams();
  const id = params?.id;

  return <ExpenseForm id={id} />;
}

