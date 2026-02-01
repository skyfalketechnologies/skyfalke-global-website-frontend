'use client';

import { useParams } from 'next/navigation';
import ContactDetail from '@/pageComponents/Admin/ContactDetail';

export default function ContactDetailPage() {
  const params = useParams();
  const id = params?.id;

  return <ContactDetail id={id} />;
}

