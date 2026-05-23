import Image from 'next/image';
import Link from 'next/link';
import { HiOutlineArrowRight, HiOutlineArrowUpRight } from 'react-icons/hi2';
import { getAllAboutPages } from '@/data/aboutPages';

export default function AboutDetail({ page }) {
  const { slug, title, headline, lede, heroImage, spotlightImage, pillars, stats, overview = [], practices = [] } = page;
  const related = getAllAboutPages().filter((p) => p.slug !== slug);

  return (
    <div className="bg-white text-slate-900">
      <section className="relative min-h-[max(520px,78vh)] overflow-hidden bg-[#0B1220]">
        <Image src={heroImage.src} alt={heroImage.alt} fill priority className="object-cover opacity-90" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1220]/95 via-[#0B1220]/72 to-[#0B1220]/35" aria-hidden />
        <div className="relative z-10 mx-auto flex min-h-[max(520px,78vh)] max-w-6xl flex-col justify-end px-4 pb-16 pt-36 sm:px-6 lg:px-8 lg:pb-24">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/70">About Us</p>
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

      {overview.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary-600">Overview</p>
          <h2 className="mt-4 max-w-3xl text-3xl font-nexa-heavy tracking-tight text-[#0B1220] sm:text-[2.15rem]">
            Why {title.toLowerCase()} matters at Skyfalke
          </h2>
          <div className="mt-8 max-w-3xl space-y-5 text-base leading-relaxed text-slate-700">
            {overview.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-14 lg:px-8">
        <div className="relative aspect-[16/10] overflow-hidden rounded-sm bg-slate-100 shadow-xl">
          <Image src={spotlightImage.src} alt={spotlightImage.alt} fill className="object-cover" sizes="(min-width: 1024px) 700px, 100vw" />
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary-600">What this means in practice</p>
          <h2 className="mt-4 text-3xl font-nexa-heavy tracking-tight text-[#0B1220] sm:text-[2.15rem]">How we apply {title.toLowerCase()}</h2>
          <div className="mt-8 space-y-6">
            {pillars.map((p) => (
              <div key={p.title} className="border-l-2 border-primary-500/80 pl-5">
                <h3 className="text-base font-semibold text-[#0B1220]">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {practices.length > 0 && (
        <section className="border-y border-slate-200/90 bg-[#F4F6FA]">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary-600">How we work</p>
            <h2 className="mt-4 max-w-3xl text-3xl font-nexa-heavy tracking-tight text-[#0B1220] sm:text-[2.15rem]">
              Practical ways we live this commitment
            </h2>
            <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {practices.map((item) => (
                <li key={item.title} className="rounded-sm border border-slate-200/90 bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-[#0B1220]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-700">{item.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary-600">Explore more</p>
          <h2 className="mt-4 text-2xl font-nexa-heavy tracking-tight text-[#0B1220] sm:text-3xl">Other areas of our culture and responsibility</h2>
          <ul className="mt-8 flex flex-wrap gap-3">
            {related.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/about-us/${p.slug}`}
                  className="inline-flex items-center gap-2 rounded-sm border border-slate-200/90 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:border-primary-200 hover:text-primary-700"
                >
                  {p.title}
                  <HiOutlineArrowUpRight className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="bg-[#0B1220] py-16 text-white lg:py-20">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <h2 className="text-2xl font-nexa-heavy tracking-tight sm:text-3xl">Want to work with a values-driven partner?</h2>
            <p className="mt-3 max-w-2xl text-white/75">
              Share your priorities and constraints. We will outline a practical path to outcomes — aligned with how we commit to deliver, grow our people, and act responsibly.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link href="/schedule-consultation" className="inline-flex items-center gap-2 rounded-sm bg-white px-6 py-3 text-sm font-semibold text-[#0B1220] hover:bg-slate-100">
              Schedule consultation
              <HiOutlineArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link href="/about-us" className="inline-flex items-center gap-2 rounded-sm border border-white/25 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10">
              All about us
              <HiOutlineArrowUpRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
