import { pageMetadata } from '@/utils/metadata';
import PageLayout from '../components/PageLayout';
import ShopClient from './ShopClient';

export const metadata = pageMetadata.shop;

export default function ShopPage() {
  return (
    <PageLayout>
      <ShopClient />
    </PageLayout>
  );
}

