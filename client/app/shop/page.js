import { pageMetadata } from '@/utils/metadata';
import PageLayout from '../components/PageLayout';
import ShopClient from './ShopClient';
import ServerPageIntro from '@/components/marketing/ServerPageIntro';
import { SHOP_PAGE_INTRO } from '@/data/serverPageIntros';

export const metadata = pageMetadata.shop;

export default function ShopPage() {
  return (
    <PageLayout>
      <ShopClient />
      <ServerPageIntro {...SHOP_PAGE_INTRO} />
    </PageLayout>
  );
}

