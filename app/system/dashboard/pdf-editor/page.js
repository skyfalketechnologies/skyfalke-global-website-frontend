import PdfEditor from '@/pageComponents/Admin/PdfEditor';

import { generateMetadata as genMeta } from '@/utils/metadata';

export const metadata = genMeta({
  title: 'PDF Editor',
  description: 'Skyfalke Admin Dashboard',
  noIndex: true,
});

export default function PdfEditorPage() {
  return <PdfEditor />;
}
