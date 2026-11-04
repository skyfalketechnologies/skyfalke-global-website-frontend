import Image from 'next/image';
import Link from 'next/link';
import { HiOutlineArrowRight, HiOutlineArrowUpRight } from 'react-icons/hi2';
import { getAllCapabilityPages } from '@/data/capabilityPages';
import { OverviewSection, PracticesSection, RelatedLinksSection } from '@/components/marketing/ContentExpansionSections';

export default function CapabilityDetail({ capability }) {
  const { slug, title, headline, lede, heroImage, spotlightImage, stats, pillars, gallery, overview = [], practices = [] } = capability;
  const related = getAllCapabilityPages().filter((p) => p.slug !== slug);

  return (
    <div className="bg-white text-slate-900">
      <section className="relative min-h-[max(520px,78vh)] overflow-hidden bg-[#0B1220]">
        <Image src={heroImage.src} alt={heroImage.alt} fill priority className="object-cover opacity-90" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1220]/95 via-[#0B1220]/70 to-[#0B1220]/35" aria-hidden />
        <div className="relative z-10 mx-auto flex min-h-[max(520px,78vh)] max-w-6xl flex-col justify-end px-4 pb-16 pt-36 sm:px-6 lg:px-8 lg:pb-24">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/70">Capabilities</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-nexa-heavy leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.2rem]">
            {headline}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/85">{lede}</p>
        </div>
      </section>

      <section className="border-b border-slate-200/90 bg-[#F4F6FA]">
        <div className="mx-auto grid max-w-6xl px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          {stats.map((s) => (
            <div key={s.label} className="border-b border-slate-200/90 py-10 last:border-b-0 lg:border-b-0 lg:border-r lg:px-8 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0">
              <p className="text-2xl font-nexa-heavy tracking-tight text-[#0B1220] sm:text-[1.75rem]">{s.value}</p>
              <p className="mt-2 text-sm text-slate-600">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <OverviewSection title={`Why ${title} matters for your organization`} overview={overview} />

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-14 lg:px-8">
        <div className="relative aspect-[16/10] overflow-hidden rounded-sm bg-slate-100 shadow-xl">
          <Image src={spotlightImage.src} alt={spotlightImage.alt} fill className="object-cover" sizes="(min-width: 1024px) 700px, 100vw" />
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary-600">What we deliver</p>
          <h2 className="mt-4 text-3xl font-nexa-heavy tracking-tight text-[#0B1220] sm:text-[2.15rem]">Core pillars for {title}</h2>
          <ul className="mt-8 space-y-4">
            {pillars.map((pillar) => (
              <li key={pillar} className="border-l-2 border-primary-500/80 pl-5 text-base leading-relaxed text-slate-700">
                {pillar}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <PracticesSection practices={practices} />

      <section className="border-y border-slate-200/90 bg-white py-6">
        <div className="mx-auto grid max-w-6xl gap-3 px-4 sm:grid-cols-3 sm:px-6 lg:gap-4 lg:px-8">
          {gallery.map((img) => (
            <figure key={img.src} className="relative aspect-[16/10] overflow-hidden rounded-sm bg-slate-100">
              <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="(min-width: 1024px) 33vw, 100vw" />
            </figure>
          ))}
        </div>
      </section>

      <RelatedLinksSection title="Other capabilities" links={related} basePath="/capabilities" />

      <section className="bg-[#0B1220] py-16 text-white lg:py-20">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <h2 className="text-2xl font-nexa-heavy tracking-tight sm:text-3xl">Need to accelerate your {title.toLowerCase()} agenda?</h2>
            <p className="mt-3 max-w-2xl text-white/75">Bring your current priorities. We will map a practical sequence from quick wins to durable scale.</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link href="/schedule-consultation" className="inline-flex items-center gap-2 rounded-sm bg-white px-6 py-3 text-sm font-semibold text-[#0B1220] hover:bg-slate-100">
              Schedule consultation
              <HiOutlineArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link href="/capabilities" className="inline-flex items-center gap-2 rounded-sm border border-white/25 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10">
              All capabilities
              <HiOutlineArrowUpRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
