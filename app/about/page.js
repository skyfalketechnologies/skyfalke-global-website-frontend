import { pageMetadata } from '@/utils/metadata';
import PageLayout from '../components/PageLayout';
import About from '@/pageComponents/About';

export const metadata = pageMetadata.about;

export default function AboutPage() {
  return (
    <PageLayout>
      <About />
    </PageLayout>
  );
}

