import PageLayout from '../../../components/PageLayout';
import { generateMetadata as genMeta } from '@/utils/metadata';
import ProcessAutomation from '@/pageComponents/BusinessTools/ProcessAutomation';


export const metadata = genMeta({
  title: 'Process Automation | Skyfalke - Streamline Your Operations',
  description: 'Automate repetitive tasks and streamline your operations with Skyfalke\'s process automation solutions.',
  keywords: 'process automation, workflow automation, business automation, automation tools, task automation',
  url: 'https://skyfalke.com/services/business-tools/process-automation',
});

export default function ProcessAutomationPage() {
  return (
    <PageLayout>
      <ProcessAutomation />
    </PageLayout>
  );
}

