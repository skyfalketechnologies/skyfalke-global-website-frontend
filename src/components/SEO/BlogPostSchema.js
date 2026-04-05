import React from 'react';
import { Helmet } from 'react-helmet-async';

const DEFAULT_SITE =
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SITE_URL) ||
  'https://skyfalke.com';

const BlogPostSchema = ({ post, siteUrl = DEFAULT_SITE }) => {
  const base = String(siteUrl).replace(/\/$/, '');
  /** Breadcrumb `item` as WebPage so Google gets `item.name`, not only a URL node without a name. */
  const breadcrumbWebPage = (name, path) => ({
    '@type': 'WebPage',
    '@id': `${base}${path}`,
    name,
  });
  if (!post) return null;

  const generateArticleSchema = () => {
    return {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": post.title || "Blog Post",
      "description": post.excerpt || (post.content ? post.content.replace(/<[^>]*>/g, '').substring(0, 160) : "Blog post content"),
      "image": post.featuredImage?.url || `${siteUrl}/images/logos/logo.svg`,
      "author": {
        "@type": "Person",
        "name": post.author?.name || "Skyfalke Team",
        "url": post.author?.url || `${siteUrl}/about`
      },
      "publisher": {
        "@type": "Organization",
        "name": "Skyfalke",
        "logo": {
          "@type": "ImageObject",
          "url": `${siteUrl}/images/logos/logo.svg`,
          "width": 200,
          "height": 60
        },
        "url": siteUrl,
        "sameAs": [
          "https://www.linkedin.com/company/skyfalke",
          "https://twitter.com/skyfalke",
          "https://facebook.com/skyfalke"
        ]
      },
      "datePublished": post.publishedAt || new Date().toISOString(),
      "dateModified": post.updatedAt || post.publishedAt || new Date().toISOString(),
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `${siteUrl}/blog/${post.slug || 'post'}`
      },
      "url": `${siteUrl}/blog/${post.slug || 'post'}`,
      "keywords": post.tags?.join(", ") || "digital marketing, cloud solutions, green hosting",
      "articleSection": post.category || "Digital Marketing",
      "wordCount": post.wordCount || (post.content ? post.content.replace(/<[^>]*>/g, '').split(' ').length : 0),
      "timeRequired": post.readingTime || "5 min read",
      "inLanguage": "en-US",
      "isAccessibleForFree": true,
      "genre": "Technology",
      "about": post.tags?.map(tag => ({
        "@type": "Thing",
        "name": tag
      })) || []
    };
  };

  const generateBreadcrumbSchema = () => {
    const postTitle = post.title && post.title.trim() ? post.title : "Blog Post";
    const postSlug = post.slug || 'post';
    
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": breadcrumbWebPage("Home", "/")
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Blog",
          "item": breadcrumbWebPage("Blog", "/blog")
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": postTitle,
          "item": breadcrumbWebPage(postTitle, `/blog/${postSlug}`)
        }
      ]
    };
  };

  const generateWebPageSchema = () => {
    return {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": post.title || "Blog Post",
      "description": post.excerpt || (post.content ? post.content.replace(/<[^>]*>/g, '').substring(0, 160) : "Blog post content"),
      "url": `${siteUrl}/blog/${post.slug || 'post'}`,
      "mainEntity": {
        "@type": "Article",
        "headline": post.title || "Blog Post"
      },
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": breadcrumbWebPage("Home", "/")
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Blog",
            "item": breadcrumbWebPage("Blog", "/blog")
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": (post.title && post.title.trim()) || "Blog Post",
            "item": breadcrumbWebPage(
              (post.title && post.title.trim()) || "Blog Post",
              `/blog/${post.slug || 'post'}`
            )
          }
        ]
      }
    };
  };

  const schemas = [
    generateArticleSchema(),
    generateBreadcrumbSchema(),
    generateWebPageSchema(),
  ];

  return (
    <Helmet>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema, null, 2)
          }}
        />
      ))}
    </Helmet>
  );
};

export default BlogPostSchema;
