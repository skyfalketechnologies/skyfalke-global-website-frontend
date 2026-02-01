import AcademyTrainers from '@/pageComponents/Admin/AcademyTrainers';

import { generateMetadata as genMeta } from '@/utils/metadata';

export const metadata = genMeta({
  title: 'Trainers',
  description: 'Skyfalke Admin Dashboard',
  noIndex: true,
});

export default function AcademyTrainersPage() {
  return <AcademyTrainers />;
}

