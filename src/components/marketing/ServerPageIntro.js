/** Server-rendered intro copy for SEO depth (visible in initial HTML). */
export default function ServerPageIntro({ eyebrow, title, paragraphs, titleAs = 'h2', className = '' }) {
  if (!paragraphs?.length) return null;
  const TitleTag = titleAs === 'h1' ? 'h1' : 'h2';
  const titleClassName =
    titleAs === 'h1'
      ? 'mt-3 text-3xl font-nexa-heavy tracking-tight text-[#0B1220] sm:text-4xl md:text-[2.75rem]'
      : 'mt-3 text-2xl font-nexa-heavy tracking-tight text-[#0B1220] sm:text-3xl';

  return (
    <section className={`border-b border-slate-200/90 bg-[#F4F6FA] ${className}`.trim()}>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
        {eyebrow ? (
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary-600">{eyebrow}</p>
        ) : null}
        {title ? (
          <TitleTag className={titleClassName}>{title}</TitleTag>
        ) : null}
        <div className={`max-w-3xl space-y-4 text-base leading-relaxed text-slate-700 ${title || eyebrow ? 'mt-5' : ''}`}>
          {paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 48)}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
