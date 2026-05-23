import Link from 'next/link';
import { HiOutlineArrowUpRight } from 'react-icons/hi2';

export function OverviewSection({ title, overview = [] }) {
  if (!overview.length) return null;
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary-600">Overview</p>
      <h2 className="mt-4 max-w-3xl text-3xl font-nexa-heavy tracking-tight text-[#0B1220] sm:text-[2.15rem]">{title}</h2>
      <div className="mt-8 max-w-3xl space-y-5 text-base leading-relaxed text-slate-700">
        {overview.map((paragraph) => (
          <p key={paragraph.slice(0, 48)}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}

export function PracticesSection({ practices = [], heading = 'How we work in practice' }) {
  if (!practices.length) return null;
  return (
    <section className="border-y border-slate-200/90 bg-[#F4F6FA]">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary-600">In practice</p>
        <h2 className="mt-4 max-w-3xl text-3xl font-nexa-heavy tracking-tight text-[#0B1220] sm:text-[2.15rem]">{heading}</h2>
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
  );
}

export function RelatedLinksSection({ title, links, basePath }) {
  if (!links?.length) return null;
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary-600">Explore more</p>
      <h2 className="mt-4 text-2xl font-nexa-heavy tracking-tight text-[#0B1220] sm:text-3xl">{title}</h2>
      <ul className="mt-8 flex flex-wrap gap-3">
        {links.map((p) => (
          <li key={p.slug}>
            <Link
              href={`${basePath}/${p.slug}`}
              className="inline-flex items-center gap-2 rounded-sm border border-slate-200/90 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:border-primary-200 hover:text-primary-700"
            >
              {p.title}
              <HiOutlineArrowUpRight className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
