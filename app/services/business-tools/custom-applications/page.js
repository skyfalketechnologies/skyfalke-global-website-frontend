import PageLayout from '../../../components/PageLayout';
import { generateMetadata as genMeta } from '@/utils/metadata';
import CustomApplications from '@/pageComponents/BusinessTools/CustomApplications';


export const metadata = genMeta({
  title: 'Custom Applications | Skyfalke - Tailored Software Solutions',
  description: 'Get custom applications built for your specific business needs with Skyfalke\'s custom application development services.',
  keywords: 'custom applications, custom software, application development, bespoke software, tailored solutions',
  url: 'https://skyfalke.com/services/business-tools/custom-applications',
});

export default function CustomApplicationsPage() {
  return (
    <PageLayout>
      <CustomApplications />
    </PageLayout>
  );
}

