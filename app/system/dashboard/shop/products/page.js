import Products from '@/pageComponents/Admin/Products';

import { generateMetadata as genMeta } from '@/utils/metadata';

export const metadata = genMeta({
  title: 'Products',
  description: 'Skyfalke Admin Dashboard',
  noIndex: true,
});

export default function ProductsPage() {
  return <Products />;
}

