import Image from 'next/image';
import Link from 'next/link';
import { HiOutlineArrowRight, HiOutlineArrowUpRight } from 'react-icons/hi2';

export default function HowWeWorkCaseStudiesPage({ page, caseStudies = [] }) {
  const { headline, lede, heroImage, stats } = page;

  return (
    <div className="bg-white text-slate-900">
      <section className="relative min-h-[max(520px,72vh)] overflow-hidden bg-[#0B1220]">
        <Image src={heroImage.src} alt={heroImage.alt} fill priority className="object-cover opacity-90" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1220]/95 via-[#0B1220]/72 to-[#0B1220]/35" aria-hidden />
        <div className="relative z-10 mx-auto flex min-h-[max(520px,72vh)] max-w-6xl flex-col justify-end px-4 pb-16 pt-36 sm:px-6 lg:px-8 lg:pb-24">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/70">How We Work</p>
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

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary-600">Case studies</p>
          <h2 className="mt-3 text-3xl font-nexa-heavy tracking-tight text-[#0B1220] sm:text-[2.15rem]">
            Recent engagements and measurable outcomes
          </h2>
          <p className="mt-4 max-w-3xl text-slate-600">
            A curated view of transformation programs across industries, focused on the challenge, intervention, and business impact.
          </p>
        </div>

        {caseStudies.length > 0 ? (
          <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {caseStudies.map((study) => {
              const image =
                study?.images?.find((img) => img?.isPrimary)?.url ||
                study?.images?.[0]?.url ||
                '/images/hero/business_tools.webp';

              return (
                <li key={study._id || study.slug}>
                  <Link
                    href={`/how-we-work/case-studies/${study.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-sm border border-slate-200/90 bg-white shadow-sm transition hover:border-primary-200 hover:shadow-md"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                      <Image
                        src={image}
                        alt={study.title || 'Case study image'}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-[1.03]"
                        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        {study?.client?.industry || 'Case Study'}
                      </p>
                      <h3 className="mt-2 text-lg font-nexa-heavy tracking-tight text-[#0B1220]">
                        {study.title}
                      </h3>
                      <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">
                        {study.summary || 'Explore the challenge, approach, and measurable outcomes.'}
                      </p>
                      <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary-700">
                        Read case study
                        <HiOutlineArrowUpRight className="h-4 w-4" aria-hidden />
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="mt-10 rounded-sm border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
            Case studies are being updated. Please check back shortly.
          </div>
        )}
      </section>

      <section className="bg-[#0B1220] py-16 text-white lg:py-20">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <h2 className="text-2xl font-nexa-heavy tracking-tight sm:text-3xl">Need results like these?</h2>
            <p className="mt-3 max-w-2xl text-white/75">
              We can help you define the right scope, de-risk delivery, and move from strategy to measurable impact.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link href="/schedule-consultation" className="inline-flex items-center gap-2 rounded-sm bg-white px-6 py-3 text-sm font-semibold text-[#0B1220] hover:bg-slate-100">
              Schedule consultation
              <HiOutlineArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link href="/how-we-work" className="inline-flex items-center gap-2 rounded-sm border border-white/25 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10">
              All how we work
              <HiOutlineArrowUpRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
