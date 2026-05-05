import Image from 'next/image';
import Link from 'next/link';
import PageLayout from '../components/PageLayout';
import { generateMetadata as genMeta } from '@/utils/metadata';
import { getAllCapabilityPages } from '@/data/capabilityPages';
import { HiOutlineArrowUpRight } from 'react-icons/hi2';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://skyfalke.com';

export const metadata = genMeta({
  title: 'Capabilities',
  description:
    'Integrated capabilities across AI, digital transformation, data and technology, marketing and sales, and managed services.',
  keywords: 'capabilities, AI, digital, data technology, marketing sales, managed services, Skyfalke',
  url: `${BASE}/capabilities`,
  canonical: `${BASE}/capabilities`,
  ogTitle: 'Capabilities | Strategy, Technology, and Execution',
  ogDescription:
    'Discover integrated capabilities across AI, data, digital transformation, growth, and managed services.',
  twitterTitle: 'Capabilities | Skyfalke',
  twitterDescription:
    'Explore the capabilities we use to turn business priorities into measurable outcomes.',
});

export default function CapabilitiesPage() {
  const capabilities = getAllCapabilityPages();

  return (
    <PageLayout>
      <div className="bg-white">
        <header className="border-b border-slate-200/90 bg-[#F4F6FA]">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary-600">Capabilities</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-nexa-heavy tracking-tight text-[#0B1220] sm:text-5xl">
              Execution capabilities built for measurable outcomes
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
              We combine strategic thinking with delivery discipline to help teams turn priorities into sustained performance.
            </p>
          </div>
        </header>

        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
            {capabilities.map((cap) => (
              <li key={cap.slug}>
                <Link
                  href={`/capabilities/${cap.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-sm border border-slate-200/90 bg-white shadow-sm transition hover:border-primary-200 hover:shadow-md"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <Image
                      src={cap.heroImage.src}
                      alt={cap.heroImage.alt}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-[1.03]"
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/50 to-transparent" aria-hidden />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="text-xl font-nexa-heavy tracking-tight text-[#0B1220]">{cap.title}</h2>
                      <HiOutlineArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-slate-400 transition group-hover:text-primary-600" aria-hidden />
                    </div>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">{cap.metaDescription}</p>
                    <span className="mt-5 text-sm font-semibold text-primary-700">View capability</span>
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
