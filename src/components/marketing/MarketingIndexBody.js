import Link from 'next/link';
import { HiOutlineArrowUpRight } from 'react-icons/hi2';

/** Extra index-page copy blocks (mission-style sections + CTA). */
export function MarketingIndexBody({ sections = [], cta }) {
  return (
    <>
      {sections.map((section) => (
        <section
          key={section.title}
          className={section.variant === 'muted' ? 'border-y border-slate-200/90 bg-[#F4F6FA]' : 'bg-white'}
        >
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            {section.eyebrow && (
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary-600">{section.eyebrow}</p>
            )}
            <h2 className="mt-4 max-w-3xl text-2xl font-nexa-heavy tracking-tight text-[#0B1220] sm:text-3xl">{section.title}</h2>
            <div className="mt-6 max-w-3xl space-y-5 text-base leading-relaxed text-slate-700">
              {section.paragraphs.map((p) => (
                <p key={p.slice(0, 40)}>{p}</p>
              ))}
            </div>
          </div>
        </section>
      ))}
      {cta && (
        <section className="border-t border-slate-200/90 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <h2 className="text-2xl font-nexa-heavy tracking-tight text-[#0B1220] sm:text-3xl">{cta.title}</h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-700">{cta.description}</p>
            {cta.href && (
              <Link
                href={cta.href}
                className="mt-8 inline-flex items-center gap-2 rounded-sm bg-primary-600 px-6 py-3 text-sm font-semibold text-white hover:bg-primary-700"
              >
                {cta.label}
                <HiOutlineArrowUpRight className="h-4 w-4" aria-hidden />
              </Link>
            )}
          </div>
        </section>
      )}
    </>
  );
}
