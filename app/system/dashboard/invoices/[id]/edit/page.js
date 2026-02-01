'use client';

import { useParams } from 'next/navigation';
import InvoiceMaker from '@/pageComponents/Admin/InvoiceMaker';

export default function EditInvoicePage() {
  const params = useParams();
  const id = params?.id;

  return <InvoiceMaker id={id} />;
}

