'use client';

import { useParams } from 'next/navigation';
import OrderDetail from '@/pageComponents/Admin/OrderDetail';

export default function OrderDetailPage() {
  const params = useParams();
  const id = params?.id;

  return <OrderDetail id={id} />;
}

