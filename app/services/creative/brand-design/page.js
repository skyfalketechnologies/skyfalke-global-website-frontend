import PageLayout from '../../../components/PageLayout';
import { generateMetadata as genMeta } from '@/utils/metadata';
import BrandDesign from '@/pageComponents/Creative/BrandDesign';


export const metadata = genMeta({
  title: 'Brand Design Services | Skyfalke - Create Your Visual Identity',
  description: 'Create a strong visual identity with Skyfalke\'s brand design services. Logo design, brand guidelines, and visual identity development.',
  keywords: 'brand design, logo design, visual identity, brand identity, brand guidelines',
  url: 'https://skyfalke.com/services/creative/brand-design',
});

export default function BrandDesignPage() {
  return (
    <PageLayout>
      <BrandDesign />
    </PageLayout>
  );
}

