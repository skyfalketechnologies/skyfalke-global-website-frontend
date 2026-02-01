'use client';

import { useParams } from 'next/navigation';
import TrainerForm from '@/components/Admin/TrainerForm';

export default function EditTrainerPage() {
  const params = useParams();
  const id = params?.id;

  return <TrainerForm id={id} />;
}

