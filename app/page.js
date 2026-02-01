import { pageMetadata } from '@/utils/metadata';
import PageLayout from './components/PageLayout';
import Home from '@/pageComponents/Home';

export const metadata = pageMetadata.home;

export default function HomePage() {
  return (
    <PageLayout>
      <Home />
    </PageLayout>
  );
}

