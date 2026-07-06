import { generateMetadata as genMeta } from '@/utils/metadata';
import PageLayout from '../components/PageLayout';
import EventsClient from './EventsClient';
import ServerPageIntro from '@/components/marketing/ServerPageIntro';
import { EVENTS_PAGE_INTRO } from '@/data/serverPageIntros';

export const metadata = genMeta({
  title: 'Events | Skyfalke - Upcoming Events & Webinars',
  description: 'Join Skyfalke at upcoming events, webinars, and conferences. Learn about digital marketing, cloud hosting, and technology trends.',
  url: 'https://skyfalke.com/events',
});

export default function EventsPage() {
  return (
    <PageLayout>
      <EventsClient />
      <ServerPageIntro {...EVENTS_PAGE_INTRO} />
    </PageLayout>
  );
}

