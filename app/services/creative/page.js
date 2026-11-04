import { generateMetadata as genMeta } from '@/utils/metadata';
import PageLayout from '../../components/PageLayout';
import Creative from '@/pageComponents/Creative';

export const metadata = genMeta({
  title: 'Creative Services | Skyfalke - Brand Design, UI/UX, Graphic Design & Video Production',
  description: 'Skyfalke offers comprehensive creative services including brand design, UI/UX design, graphic design, video production, and content creation to help your brand stand out.',
  keywords: 'creative services, brand design, UI UX design, graphic design, video production, content creation, logo design, visual identity',
  url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://skyfalke.com'}/services/creative`,
});

export default function CreativePage() {
  return (
    <PageLayout>
      <Creative />
    </PageLayout>
  );
}

