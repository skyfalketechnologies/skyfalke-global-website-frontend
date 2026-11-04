import { generateMetadata as genMeta } from '@/utils/metadata';
import PageLayout from '../../components/PageLayout';
import ICTStrategy from '@/pageComponents/ICTStrategy';

export const metadata = genMeta({
  title: 'ICT Strategy & Consulting | Skyfalke - Technology Strategy & Digital Transformation',
  description: 'Skyfalke provides ICT strategy and consulting services to help businesses plan, implement, and optimize their technology infrastructure and digital transformation initiatives.',
  keywords: 'ICT strategy, technology consulting, digital transformation, IT strategy, technology planning, ICT consulting, digital strategy',
  url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://skyfalke.com'}/services/ict-strategy`,
});

export default function ICTStrategyPage() {
  return (
    <PageLayout>
      <ICTStrategy />
    </PageLayout>
  );
}

