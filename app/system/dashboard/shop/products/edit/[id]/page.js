'use client';

import { useParams } from 'next/navigation';
import ProductForm from '@/pageComponents/Admin/ProductForm';

export default function EditProductPage() {
  const params = useParams();
  const id = params?.id;

  return <ProductForm id={id} />;
}

