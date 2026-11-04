import { pageMetadata } from '@/utils/metadata';
import PageLayout from '../components/PageLayout';
import Contact from '@/pageComponents/Contact';

export const metadata = pageMetadata.contact;

export default function ContactPage() {
  return (
    <PageLayout>
      <Contact />
    </PageLayout>
  );
}

