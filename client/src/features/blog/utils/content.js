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
