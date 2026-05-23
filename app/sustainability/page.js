import Image from 'next/image';
import Link from 'next/link';
import PageLayout from '../components/PageLayout';
import { generateMetadata as genMeta } from '@/utils/metadata';
import { getAllSustainabilityPages } from '@/data/sustainabilityPages';
import { SUSTAINABILITY_INDEX } from '@/data/indexPageCopy';
import { MarketingIndexBody } from '@/components/marketing/MarketingIndexBody';
import { HiOutlineArrowUpRight } from 'react-icons/hi2';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://skyfalke.com';

export const metadata = genMeta({
  title: 'Sustainability',
  description:
    'Explore our sustainability approach across environmental stewardship, responsible technology, and sustainable operations.',
  keywords: 'sustainability, environmental stewardship, responsible technology, sustainable operations, Skyfalke',
  url: `${BASE}/sustainability`,
  canonical: `${BASE}/sustainability`,
  ogTitle: 'Sustainability | Responsible Growth and Operations',
  ogDescription:
    'Explore how Skyfalke integrates environmental stewardship and responsible technology into practical delivery.',
  twitterTitle: 'Sustainability | Skyfalke',
  twitterDescription:
    'Learn about our approach to sustainable operations and responsible digital transformation.',
});

export default function SustainabilityPage() {
  const pages = getAllSustainabilityPages();

  return (
    <PageLayout>
      <div className="bg-white">
        <header className="border-b border-slate-200/90 bg-[#F4F6FA]">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary-600">Sustainability</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-nexa-heavy tracking-tight text-[#0B1220] sm:text-5xl">
              Sustainability integrated into strategy and execution
            </h1>
            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-relaxed text-slate-600">
              <p>
                We help organizations build responsible, resilient, and future-ready operations by aligning sustainability goals to practical delivery.
              </p>
              <p>
                Read how environmental stewardship, responsible technology, and sustainable operations connect — and how we embed them into roadmaps, architectures, and day-to-day runbooks.
              </p>
            </div>
          </div>
        </header>

        <MarketingIndexBody sections={SUSTAINABILITY_INDEX.sections} />

        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
            {pages.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/sustainability/${p.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-sm border border-slate-200/90 bg-white shadow-sm transition hover:border-primary-200 hover:shadow-md"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <Image
                      src={p.heroImage.src}
                      alt={p.heroImage.alt}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-[1.03]"
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/50 to-transparent" aria-hidden />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="text-xl font-nexa-heavy tracking-tight text-[#0B1220]">{p.title}</h2>
                      <HiOutlineArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-slate-400 transition group-hover:text-primary-600" aria-hidden />
                    </div>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">{p.metaDescription}</p>
                    <span className="mt-5 text-sm font-semibold text-primary-700">Learn more</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <MarketingIndexBody cta={SUSTAINABILITY_INDEX.cta} />
      </div>
    </PageLayout>
  );
}
