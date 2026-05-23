const INTERNAL_HOSTS = new Set(['skyfalke.com', 'www.skyfalke.com', 'localhost']);

function isInternalHref(href, siteOrigin = 'https://skyfalke.com') {
  if (!href || typeof href !== 'string') return false;
  const trimmed = href.trim();
  if (trimmed.startsWith('/') || trimmed.startsWith('#')) return true;
  if (/^(mailto:|tel:|javascript:)/i.test(trimmed)) return false;
  try {
    const origin = new URL(siteOrigin);
    const parsed = new URL(trimmed, origin);
    return INTERNAL_HOSTS.has(parsed.hostname.toLowerCase());
  } catch {
    return false;
  }
}

/**
 * Removes `nofollow` from internal links so crawlers can follow on-site URLs in article HTML.
 * External links keep nofollow when present.
 */
export function normalizeBlogHtmlLinks(html, siteOrigin = 'https://skyfalke.com') {
  if (!html || typeof html !== 'string') return html;

  return html.replace(/<a\b([^>]*)>/gi, (match, attrs) => {
    const hrefMatch = attrs.match(/\bhref\s*=\s*["']([^"']+)["']/i);
    if (!hrefMatch || !isInternalHref(hrefMatch[1], siteOrigin)) return match;

    const relMatch = attrs.match(/\brel\s*=\s*["']([^"']*)["']/i);
    if (!relMatch) return match;

    const cleanedRel = relMatch[1]
      .split(/\s+/)
      .filter((token) => token && token.toLowerCase() !== 'nofollow')
      .join(' ');

    if (cleanedRel === relMatch[1]) return match;

    const newAttrs = cleanedRel
      ? attrs.replace(relMatch[0], `rel="${cleanedRel}"`)
      : attrs.replace(/\s*rel\s*=\s*["'][^"']*["']/i, '');

    return `<a${newAttrs}>`;
  });
}

/**
 * Injects stable IDs into h2, h3, h4 in HTML so TOC links and scroll spy work.
 * Server-safe (no document): works during SSR and avoids hydration mismatch.
 * @param {string} html - Raw blog content HTML
 * @returns {string} HTML with id attributes on headings
 */
export function injectHeadingIds(html) {
  if (!html || typeof html !== 'string') return html;
  let index = 0;
  return html.replace(/<(h[234])(\s[^>]*)?>/gi, (_, tag, rest) => {
    const restStr = rest || '';
    if (restStr && /\bid\s*=/i.test(restStr)) return `<${tag}${restStr}>`;
    return `<${tag} id="heading-${index++}"${restStr}>`;
  });
}
