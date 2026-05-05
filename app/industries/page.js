import Image from 'next/image';
import Link from 'next/link';
import PageLayout from '../components/PageLayout';
import { generateMetadata as genMeta } from '@/utils/metadata';
import { getAllIndustryPages } from '@/data/industryPages';
import { HiOutlineArrowUpRight } from 'react-icons/hi2';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://skyfalke.com';

export const metadata = genMeta({
  title: 'Industries',
  description:
    'Sector-specific digital transformation: agriculture, financial services, health care, logistics, retail, public sector, and more—delivered with enterprise rigor.',
  keywords:
    'industries, sector consulting, digital transformation, Skyfalke, regulated industries, enterprise technology',
  url: `${BASE}/industries`,
  canonical: `${BASE}/industries`,
  ogTitle: 'Industries | Sector-Specific Digital Transformation',
  ogDescription:
    'Explore how Skyfalke helps complex sectors modernize operations, improve decision velocity, and deliver measurable business outcomes.',
  twitterTitle: 'Industries | Skyfalke',
  twitterDescription:
    'See how we deliver sector-specific strategy, technology, and execution for regulated and growth-focused environments.',
});

export default function IndustriesIndexPage() {
  const industries = getAllIndustryPages();

  return (
    <PageLayout>
      <div className="bg-white">
        <header className="border-b border-slate-200/90 bg-[#F4F6FA]">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary-600">Industries</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-nexa-heavy tracking-tight text-[#0B1220] sm:text-5xl">
              Depth across sectors that demand precision
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
              Explore how we combine strategy, technology, and execution for regulated and growth-oriented environments—
              with the visual clarity and rigor your stakeholders expect.
            </p>
          </div>
        </header>

        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
            {industries.map((ind) => (
              <li key={ind.slug}>
                <Link
                  href={`/industries/${ind.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-sm border border-slate-200/90 bg-white shadow-sm transition hover:border-primary-200 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <Image
                      src={ind.heroImage.src}
                      alt={ind.heroImage.alt}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-[1.03]"
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/55 to-transparent opacity-80"
                      aria-hidden
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="text-xl font-nexa-heavy tracking-tight text-[#0B1220]">
                        {ind.title}
                      </h2>
                      <HiOutlineArrowUpRight
                        className="mt-1 h-5 w-5 shrink-0 text-slate-400 transition group-hover:text-primary-600"
                        aria-hidden
                      />
                    </div>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">{ind.metaDescription}</p>
                    <span className="mt-5 text-sm font-semibold text-primary-700">View sector</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </PageLayout>
  );
}
