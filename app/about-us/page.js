import Image from 'next/image';
import Link from 'next/link';
import PageLayout from '../components/PageLayout';
import { generateMetadata as genMeta } from '@/utils/metadata';
import { getAllAboutPages } from '@/data/aboutPages';
import { HiOutlineArrowUpRight } from 'react-icons/hi2';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://skyfalke.com';

export const metadata = genMeta({
  title: 'About Us',
  description:
    'Learn about our commitments, meritocratic culture, social responsibility, and environmental sustainability approach.',
  keywords: 'about us, commitments, meritocracy, social responsibility, environmental sustainability, Skyfalke',
  url: `${BASE}/about-us`,
  canonical: `${BASE}/about-us`,
  ogTitle: 'About Us | Mission, Values, and Responsibility',
  ogDescription:
    'Learn how Skyfalke translates mission, culture, and responsibility into practical commitments and measurable impact.',
  twitterTitle: 'About Us | Skyfalke',
  twitterDescription:
    'Explore our mission, values, social responsibility, and sustainability principles in practice.',
});

export default function AboutUsPage() {
  const pages = getAllAboutPages();

  return (
    <PageLayout>
      <div className="bg-white">
        <header className="border-b border-slate-200/90 bg-[#F4F6FA]">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary-600">About Us</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-nexa-heavy tracking-tight text-[#0B1220] sm:text-5xl">
              Our mission, values, and responsibility in practice
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
              We help businesses succeed online through innovative, reliable, and sustainable digital solutions that create meaningful long-term value.
            </p>
          </div>
        </header>

        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {pages.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/about-us/${p.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-sm border border-slate-200/90 bg-white shadow-sm transition hover:border-primary-200 hover:shadow-md"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                    <Image
                      src={p.heroImage.src}
                      alt={p.heroImage.alt}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-[1.03]"
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/50 to-transparent" aria-hidden />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="text-lg font-nexa-heavy tracking-tight text-[#0B1220]">{p.title}</h2>
                      <HiOutlineArrowUpRight className="mt-0.5 h-5 w-5 shrink-0 text-slate-400 transition group-hover:text-primary-600" aria-hidden />
                    </div>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">{p.metaDescription}</p>
                    <span className="mt-4 text-sm font-semibold text-primary-700">View page</span>
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
