import PageLayout from '../../../components/PageLayout';
import { generateMetadata as genMeta } from '@/utils/metadata';
import GraphicDesign from '@/pageComponents/Creative/GraphicDesign';


export const metadata = genMeta({
  title: 'Graphic Design Services | Skyfalke - Visual Communication',
  description: 'Professional graphic design services from Skyfalke. Create compelling visuals that communicate your message effectively.',
  keywords: 'graphic design, visual design, design services, creative design, visual communication',
  url: 'https://skyfalke.com/services/creative/graphic-design',
});

export default function GraphicDesignPage() {
  return (
    <PageLayout>
      <GraphicDesign />
    </PageLayout>
  );
}

