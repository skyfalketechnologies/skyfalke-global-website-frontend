import Image from 'next/image';
import Link from 'next/link';
import { HiOutlineArrowRight, HiOutlineArrowUpRight } from 'react-icons/hi2';

function SectionLabel({ children }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary-600">{children}</p>
  );
}

export default function IndustryDetail({ industry }) {
  const {
    eyebrow,
    headline,
    lede,
    heroImage,
    spotlightImage,
    gallery,
    stats,
    challenges,
    capabilities,
    approach,
    relatedHref,
    relatedLabel,
    title,
  } = industry;

  return (
    <div className="bg-white text-slate-900">
      {/* Hero */}
      <section className="relative min-h-[max(520px,78vh)] w-full overflow-hidden bg-[#0B1220]">
        <Image
          src={heroImage.src}
          alt={heroImage.alt}
          fill
          priority
          className="object-cover opacity-90"
          sizes="100vw"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#0B1220]/95 via-[#0B1220]/75 to-[#0B1220]/35"
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/90 via-transparent to-transparent" aria-hidden />

        <div className="relative z-10 mx-auto flex min-h-[max(520px,78vh)] max-w-6xl flex-col justify-end px-4 pb-16 pt-36 sm:px-6 lg:px-8 lg:pb-24 lg:pt-40">
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/70">{eyebrow}</p>
            <h1 className="mt-4 text-4xl font-nexa-heavy leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.25rem]">
              {headline}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/85 sm:text-xl">{lede}</p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/schedule-consultation"
                className="inline-flex items-center gap-2 rounded-sm bg-white px-6 py-3.5 text-sm font-semibold text-[#0B1220] shadow-lg transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Discuss your priorities
                <HiOutlineArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/90 underline-offset-4 hover:text-white hover:underline"
              >
                Contact us
                <HiOutlineArrowUpRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stat band */}
      <section className="border-b border-slate-200/90 bg-[#F4F6FA]">
        <div className="mx-auto grid max-w-6xl gap-0 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          {stats.map((s) => (
            <div
              key={s.label}
              className="border-b border-slate-200/90 py-10 last:border-b-0 lg:border-b-0 lg:border-r lg:border-slate-200/90 lg:px-8 lg:py-14 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0"
            >
              <p className="text-2xl font-nexa-heavy tracking-tight text-[#0B1220] sm:text-[1.75rem]">
                {s.value}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Spotlight + challenges */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:flex lg:items-stretch lg:gap-16 lg:px-8 lg:py-28">
        <div className="relative mb-12 aspect-[4/3] w-full overflow-hidden rounded-sm bg-slate-100 shadow-xl lg:mb-0 lg:w-[48%] lg:shrink-0">
          <Image
            src={spotlightImage.src}
            alt={spotlightImage.alt}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 480px, 100vw"
          />
        </div>
        <div className="flex flex-1 flex-col justify-center">
          <SectionLabel>Where leaders feel the pressure</SectionLabel>
          <h2 className="mt-4 text-3xl font-nexa-heavy tracking-tight text-[#0B1220] sm:text-[2.15rem]">
            Challenges we help you confront
          </h2>
          <ul className="mt-8 space-y-5">
            {challenges.map((item) => (
              <li key={item} className="flex gap-4 border-l-2 border-primary-500/80 pl-5 text-base leading-relaxed text-slate-700">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Capabilities — full-bleed dark */}
      <section className="bg-[#0B1220] py-20 text-white lg:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/50">Capabilities</p>
            <h2 className="mt-4 text-3xl font-nexa-heavy tracking-tight sm:text-[2.15rem]">
              What we bring to {title}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/75">
              Pragmatic delivery across strategy, product, data, and managed operations—structured for adoption and measurable impact.
            </p>
          </div>
          <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {capabilities.map((cap) => (
              <li
                key={cap}
                className="rounded-sm border border-white/10 bg-white/[0.04] px-6 py-7 text-sm leading-relaxed text-white/88"
              >
                {cap}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Image strip */}
      <section className="border-y border-slate-200/90 bg-white py-6">
        <div className="mx-auto grid max-w-6xl gap-3 px-4 sm:grid-cols-3 sm:px-6 lg:gap-4 lg:px-8">
          {gallery.map((img) => (
            <figure key={img.src} className="relative aspect-[16/10] overflow-hidden rounded-sm bg-slate-100">
              <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="(min-width: 1024px) 33vw, 100vw" />
            </figure>
          ))}
        </div>
      </section>

      {/* Approach */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <SectionLabel>How we work</SectionLabel>
        <h2 className="mt-4 max-w-2xl text-3xl font-nexa-heavy tracking-tight text-[#0B1220] sm:text-[2.15rem]">
          A disciplined path from diagnosis to scale
        </h2>
        <ol className="mt-14 space-y-0 border-t border-slate-200">
          {approach.map((step, i) => (
            <li
              key={step.title}
              className="grid gap-6 border-b border-slate-200 py-10 lg:grid-cols-[7rem_1fr] lg:gap-12 lg:py-12"
            >
              <span className="text-4xl font-nexa-heavy tabular-nums text-primary-500 lg:text-5xl">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="text-lg font-semibold tracking-tight text-[#0B1220]">{step.title}</h3>
                <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* CTA */}
      <section className="border-t border-slate-200/90 bg-[#F4F6FA] py-16 lg:py-20">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-10 px-4 sm:px-6 lg:flex-row lg:items-center lg:px-8">
          <div className="max-w-xl">
            <h2 className="text-2xl font-nexa-heavy tracking-tight text-[#0B1220] sm:text-3xl">
              Ready to move with clarity in {title.toLowerCase()}?
            </h2>
            <p className="mt-3 text-slate-600">
              Share your context—we will help you prioritize the initiatives that unlock value fastest.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/schedule-consultation"
              className="inline-flex items-center gap-2 rounded-sm bg-[#0B1220] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-primary-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
            >
              Schedule a consultation
              <HiOutlineArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            {relatedHref ? (
              <Link
                href={relatedHref}
                className="inline-flex items-center gap-2 rounded-sm border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-[#0B1220] transition hover:border-slate-400 hover:bg-slate-50"
              >
                {relatedLabel}
                <HiOutlineArrowUpRight className="h-4 w-4" aria-hidden />
              </Link>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
