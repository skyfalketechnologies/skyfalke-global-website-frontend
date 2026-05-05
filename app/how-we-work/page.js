import Image from 'next/image';
import Link from 'next/link';
import PageLayout from '../components/PageLayout';
import { generateMetadata as genMeta } from '@/utils/metadata';
import { getAllHowWeWorkPages } from '@/data/howWeWorkPages';
import { HiOutlineArrowUpRight } from 'react-icons/hi2';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://skyfalke.com';

export const metadata = genMeta({
  title: 'How We Work',
  description:
    'Understand our delivery model: solutions design, evidence through case studies, and disciplined execution from idea to impact.',
  keywords: 'how we work, delivery model, solutions, case studies, idea to impact, Skyfalke',
  url: `${BASE}/how-we-work`,
  canonical: `${BASE}/how-we-work`,
  ogTitle: 'How We Work | Delivery Model from Strategy to Impact',
  ogDescription:
    'Understand our practical operating model for diagnosing problems, designing solutions, and delivering sustained business value.',
  twitterTitle: 'How We Work | Skyfalke',
  twitterDescription:
    'See the delivery model we use to turn strategy into measurable outcomes.',
});

export default function HowWeWorkPage() {
  const pages = getAllHowWeWorkPages();

  return (
    <PageLayout>
      <div className="bg-white">
        <header className="border-b border-slate-200/90 bg-[#F4F6FA]">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary-600">How We Work</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-nexa-heavy tracking-tight text-[#0B1220] sm:text-5xl">
              A practical delivery model from strategy to sustained value
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
              We combine deep diagnostic thinking with execution discipline so initiatives deliver measurable outcomes, not slideware.
            </p>
          </div>
        </header>

        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
            {pages.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/how-we-work/${p.slug}`}
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
                    <span className="mt-5 text-sm font-semibold text-primary-700">View page</span>
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
