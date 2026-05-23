import { permanentRedirect } from 'next/navigation';

/** Legacy `/case-studies/:slug` → canonical `/how-we-work/case-studies/:slug`. */
export default async function CaseStudyLegacyRedirect({ params }) {
  const { slug } = await params;
  permanentRedirect(`/how-we-work/case-studies/${slug}`);
}
