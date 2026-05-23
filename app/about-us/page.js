import Image from 'next/image';
import Link from 'next/link';
import PageLayout from '../components/PageLayout';
import { generateMetadata as genMeta } from '@/utils/metadata';
import { getAllAboutPages } from '@/data/aboutPages';
import { HiOutlineArrowUpRight } from 'react-icons/hi2';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://skyfalke.com';

export const metadata = genMeta({
  title: 'About Us | Mission, Values & Responsibility',
  description:
    'Learn about Skyfalke’s mission, commitments, meritocratic culture, social responsibility, and environmental sustainability — and how we translate values into client delivery.',
  keywords: 'about us, commitments, meritocracy, social responsibility, environmental sustainability, Skyfalke, digital partner Africa',
  url: `${BASE}/about-us`,
  canonical: `${BASE}/about-us`,
  ogTitle: 'About Us | Mission, Values, and Responsibility',
  ogDescription:
    'Learn how Skyfalke translates mission, culture, and responsibility into practical commitments and measurable impact for businesses across Africa and beyond.',
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
            <div className="mt-6 max-w-3xl space-y-5 text-lg leading-relaxed text-slate-600">
              <p>
                Skyfalke is a technology and marketing partner for organizations that want clarity, disciplined execution, and measurable growth. We help teams build online presence, acquire customers, automate operations, and modernize platforms — with one partner accountable across strategy and delivery.
              </p>
              <p>
                Founded with a focus on sustainable, practical digital systems for African markets and global clients alike, we combine consulting rigor with hands-on implementation. That means fewer handoffs, faster decisions, and solutions your team can run after launch.
              </p>
            </div>
          </div>
        </header>

        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary-600">Mission</p>
              <h2 className="mt-4 text-2xl font-nexa-heavy tracking-tight text-[#0B1220] sm:text-3xl">
                Help businesses succeed online with reliable, innovative solutions
              </h2>
              <p className="mt-5 text-base leading-relaxed text-slate-700">
                We deliver digital marketing, cloud, data, and automation capabilities that are accessible, tailored to real operating conditions, and designed for long-term adoption. Our mission is to remove friction between ambition and execution — so marketing, technology, and operations work as one system.
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary-600">Vision</p>
              <h2 className="mt-4 text-2xl font-nexa-heavy tracking-tight text-[#0B1220] sm:text-3xl">
                Be a trusted partner for digital transformation and sustainable growth
              </h2>
              <p className="mt-5 text-base leading-relaxed text-slate-700">
                We aim to be recognized for outcomes that last: stronger revenue engines, cleaner data, efficient infrastructure, and teams that grow capability over time. Innovation and sustainability are not opposing goals — when scoped well, they reinforce each other through smarter design and responsible operations.
              </p>
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200/90 bg-[#F4F6FA]">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary-600">What guides us</p>
            <h2 className="mt-4 max-w-3xl text-3xl font-nexa-heavy tracking-tight text-[#0B1220] sm:text-[2.15rem]">
              Four lenses on how we work and who we are
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-slate-700">
              The pages below go deeper on the principles that shape our culture, client delivery, and impact. Each explains what we believe, how we apply it on engagements, and what you can expect when you work with us.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-20 lg:pt-4">
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
                    <span className="mt-4 text-sm font-semibold text-primary-700">Read more</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <section className="border-t border-slate-200/90 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <h2 className="text-2xl font-nexa-heavy tracking-tight text-[#0B1220] sm:text-3xl">Ready to discuss your goals?</h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-700">
              Whether you are modernizing platforms, rebuilding your digital presence, or aligning marketing with operations, we start with listening. Schedule a consultation to explore fit, priorities, and a practical path forward.
            </p>
            <Link
              href="/schedule-consultation"
              className="mt-8 inline-flex items-center gap-2 rounded-sm bg-primary-600 px-6 py-3 text-sm font-semibold text-white hover:bg-primary-700"
            >
              Schedule consultation
              <HiOutlineArrowUpRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
