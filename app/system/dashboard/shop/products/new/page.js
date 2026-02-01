import ProductForm from '@/pageComponents/Admin/ProductForm';

import { generateMetadata as genMeta } from '@/utils/metadata';

export const metadata = genMeta({
  title: 'New Product',
  description: 'Skyfalke Admin Dashboard',
  noIndex: true,
});

export default function NewProductPage() {
  return <ProductForm />;
}

