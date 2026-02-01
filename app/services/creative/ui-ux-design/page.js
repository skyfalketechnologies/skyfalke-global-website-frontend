import PageLayout from '../../../components/PageLayout';
import { generateMetadata as genMeta } from '@/utils/metadata';
import UIUXDesign from '@/pageComponents/Creative/UIUXDesign';


export const metadata = genMeta({
  title: 'UI/UX Design Services | Skyfalke - User-Centered Design',
  description: 'Create intuitive, user-friendly interfaces with Skyfalke\'s UI/UX design services. User-centered design that converts.',
  keywords: 'UI UX design, user interface design, user experience design, interface design, UX consulting',
  url: 'https://skyfalke.com/services/creative/ui-ux-design',
});

export default function UIUXDesignPage() {
  return (
    <PageLayout>
      <UIUXDesign />
    </PageLayout>
  );
}

