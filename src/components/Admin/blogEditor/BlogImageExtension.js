import Image from '@tiptap/extension-image';
import { mergeAttributes } from '@tiptap/core';

/**
 * Block images with optional caption, alignment, and full alt support for SEO/a11y.
 * Serializes as <figure data-blog-image> + <img> + optional <figcaption>.
 */
export const BlogImage = Image.extend({
  name: 'image',

  addAttributes() {
    return {
      ...this.parent?.(),
      caption: {
        default: '',
      },
      align: {
        default: 'center',
      },
    };
  },

  parseHTML() {
    const allowBase64 = this.options.allowBase64;
    const imgSelector = allowBase64 ? 'img[src]' : 'img[src]:not([src^="data:"])';

    return [
      {
        tag: 'figure[data-blog-image]',
        getAttrs: (node) => {
          const img = node.querySelector('img');
          if (!img) return false;
          return {
            src: img.getAttribute('src'),
            alt: img.getAttribute('alt') || '',
            title: img.getAttribute('title') || '',
            width: img.getAttribute('width'),
            height: img.getAttribute('height'),
            caption: node.querySelector('figcaption')?.textContent?.trim() || '',
            align: node.getAttribute('data-align') || 'center',
          };
        },
      },
      {
        tag: imgSelector,
        getAttrs: (element) => {
          if (element.closest('figure[data-blog-image]')) {
            return false;
          }
          const src = element.getAttribute('src');
          if (!src) return false;
          return {
            src,
            alt: element.getAttribute('alt') || '',
            title: element.getAttribute('title') || '',
            width: element.getAttribute('width'),
            height: element.getAttribute('height'),
            caption: element.getAttribute('data-caption') || '',
            align: element.getAttribute('data-align') || 'center',
          };
        },
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    const { caption, align } = node.attrs;
    const imgAttrs = mergeAttributes(this.options.HTMLAttributes, HTMLAttributes);

    const body = [['img', imgAttrs]];
    if (caption) {
      body.push(['figcaption', { class: 'blog-content-figcaption' }, caption]);
    }

    return [
      'figure',
      {
        class: `blog-content-figure blog-align-${align}`,
        'data-blog-image': 'true',
        'data-align': align,
      },
      ...body,
    ];
  },
});

export default BlogImage;
