import TrainerForm from '@/components/Admin/TrainerForm';

import { generateMetadata as genMeta } from '@/utils/metadata';

export const metadata = genMeta({
  title: 'New Trainer',
  description: 'Skyfalke Admin Dashboard',
  noIndex: true,
});

export default function NewTrainerPage() {
  return <TrainerForm />;
}

