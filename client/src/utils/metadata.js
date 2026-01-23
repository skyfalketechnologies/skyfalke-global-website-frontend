/**
 * SEO Metadata utility for Next.js App Router
 * Provides consistent metadata generation across all pages
 */

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://skyfalke.com';
const DEFAULT_IMAGE = `${BASE_URL}/favicon-512x512.png`;

/**
 * Generate metadata object for Next.js pages
 */
export function generateMetadata({
  title,
  description,
  keywords,
  image = DEFAULT_IMAGE,
  url,
  type = 'website',
  author = 'Skyfalke',
  publishedTime,
  modifiedTime,
  category,
  tags = [],
  noIndex = false,
  canonical,
  ogTitle,
  ogDescription,
  twitterTitle,
  twitterDescription,
  twitterImage,
  articleAuthor,
  articleSection,
  articleTags = []
}) {
  const fullUrl = canonical || url || BASE_URL;
  const fullImageUrl = image && image.startsWith('http') ? image : `${BASE_URL}${image}`;
  const finalTitle = title || 'Skyfalke • Leading Digital Marketing & Technology Solutions Partner in Africa';
  const finalDescription = description || 'Skyfalke - Leading digital marketing & technology solutions partner in Africa. Sustainable cloud hosting, AI-powered business tools, creative services & data analytics.';
  const finalKeywords = keywords || 'digital marketing agency Africa, sustainable cloud hosting Kenya, AI business solutions, eco-friendly web hosting, renewable energy servers, digital transformation Africa, IT consultancy Kenya, creative services Africa, data analytics, business intelligence';

  const metadata = {
    title: finalTitle,
    description: finalDescription,
    keywords: finalKeywords,
    authors: [{ name: author }],
    creator: author,
    publisher: 'Skyfalke',
    robots: noIndex ? {
      index: false,
      follow: false,
    } : {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title: ogTitle || finalTitle,
      description: ogDescription || finalDescription,
      url: fullUrl,
      siteName: 'Skyfalke',
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: ogDescription || finalDescription,
        },
      ],
      locale: 'en_US',
      type: type,
      ...(type === 'article' && {
        publishedTime: publishedTime,
        modifiedTime: modifiedTime,
        authors: [articleAuthor || author],
        section: articleSection || category,
        tags: articleTags.length > 0 ? articleTags : tags,
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: twitterTitle || ogTitle || finalTitle,
      description: twitterDescription || ogDescription || finalDescription,
      images: [twitterImage || fullImageUrl],
      site: '@skyfalke',
      creator: '@skyfalke',
    },
    alternates: {
      canonical: canonical || fullUrl,
    },
    ...(category && { category }),
  };

  return metadata;
}

/**
 * Generate metadata for blog posts
 */
export function generateBlogMetadata(blog) {
  if (!blog) {
    return generateMetadata({
      title: 'Blog Post - Skyfalke',
      description: 'Read our latest blog post',
    });
  }

  const blogUrl = `${BASE_URL}/blog/${blog.slug}`;
  const blogImage = blog.featuredImage?.url 
    ? (blog.featuredImage.url.startsWith('http') ? blog.featuredImage.url : `${BASE_URL}${blog.featuredImage.url}`)
    : DEFAULT_IMAGE;

  return generateMetadata({
    title: `${blog.title} | Skyfalke Blog`,
    description: blog.excerpt || blog.description || `Read ${blog.title} on Skyfalke blog`,
    keywords: blog.tags?.join(', ') || blog.category || '',
    image: blogImage,
    url: blogUrl,
    type: 'article',
    author: blog.author?.name || 'Skyfalke Team',
    publishedTime: blog.publishedAt ? new Date(blog.publishedAt).toISOString() : undefined,
    modifiedTime: blog.updatedAt ? new Date(blog.updatedAt).toISOString() : undefined,
    category: blog.category,
    tags: blog.tags || [],
    canonical: blogUrl,
    articleAuthor: blog.author?.name || 'Skyfalke Team',
    articleSection: blog.category,
    articleTags: blog.tags || [],
  });
}

/**
 * Generate metadata for product pages
 */
export function generateProductMetadata(product) {
  if (!product) {
    return generateMetadata({
      title: 'Product - Skyfalke',
      description: 'View our product',
    });
  }

  const productUrl = `${BASE_URL}/shop/product/${product.slug}`;
  const productImage = product.images?.[0]?.url 
    ? (product.images[0].url.startsWith('http') ? product.images[0].url : `${BASE_URL}${product.images[0].url}`)
    : DEFAULT_IMAGE;

  return generateMetadata({
    title: `${product.name} | Skyfalke Shop`,
    description: product.description || product.shortDescription || `Buy ${product.name} from Skyfalke`,
    keywords: product.tags?.join(', ') || product.category || '',
    image: productImage,
    url: productUrl,
    type: 'product',
    canonical: productUrl,
  });
}

/**
 * Generate metadata for case study pages
 */
export function generateCaseStudyMetadata(caseStudy) {
  if (!caseStudy) {
    return generateMetadata({
      title: 'Case Study - Skyfalke',
      description: 'View our case study',
    });
  }

  const caseStudyUrl = `${BASE_URL}/case-studies/${caseStudy.slug}`;
  const caseStudyImage = caseStudy.featuredImage?.url 
    ? (caseStudy.featuredImage.url.startsWith('http') ? caseStudy.featuredImage.url : `${BASE_URL}${caseStudy.featuredImage.url}`)
    : DEFAULT_IMAGE;

  return generateMetadata({
    title: `${caseStudy.title} | Skyfalke Case Study`,
    description: caseStudy.excerpt || caseStudy.description || `View ${caseStudy.title} case study`,
    keywords: caseStudy.tags?.join(', ') || caseStudy.category || '',
    image: caseStudyImage,
    url: caseStudyUrl,
    type: 'article',
    canonical: caseStudyUrl,
  });
}

/**
 * Generate metadata for job pages
 */
export function generateJobMetadata(job) {
  if (!job) {
    return generateMetadata({
      title: 'Job Opportunity - Skyfalke',
      description: 'View job opportunities at Skyfalke',
    });
  }

  const jobUrl = `${BASE_URL}/careers/${job._id}`;

  return generateMetadata({
    title: `${job.title} | Careers at Skyfalke`,
    description: job.description || `Apply for ${job.title} position at Skyfalke`,
    keywords: job.tags?.join(', ') || job.category || '',
    url: jobUrl,
    type: 'article',
    canonical: jobUrl,
    noIndex: true, // Job postings typically shouldn't be indexed
  });
}

/**
 * Page-specific metadata presets
 */
export const pageMetadata = {
  home: generateMetadata({
    title: 'Skyfalke • Leading Digital Marketing & Technology Solutions Firm Serving Africa & Beyond',
    description: 'Skyfalke - Leading digital marketing & technology solutions partner in Africa. Sustainable cloud hosting, AI-powered business tools, creative services & data analytics. Serving Africa & beyond with eco-friendly solutions.',
    keywords: 'digital marketing agency Africa, sustainable cloud hosting Kenya, AI business solutions, eco-friendly web hosting, renewable energy servers, digital transformation Africa, IT consultancy Kenya, creative services Africa, data analytics, business intelligence',
  }),

  about: generateMetadata({
    title: 'About Us',
    description: 'Learn about Skyfalke, a leading digital marketing and technology solutions partner in Africa. We provide sustainable cloud hosting, AI-powered business tools, and innovative digital solutions.',
    url: `${BASE_URL}/about`,
  }),

  services: generateMetadata({
    title: 'Digital Marketing, Cloud Hosting & Technology Solutions | Skyfalke',
    description: 'Explore Skyfalke\'s comprehensive range of digital marketing services, sustainable cloud hosting solutions, AI-powered business tools, and technology consulting services.',
    url: `${BASE_URL}/services`,
  }),

  contact: generateMetadata({
    title: 'Contact Us | Skyfalke',
    description: 'Contact Skyfalke for digital marketing services, cloud hosting solutions, and technology consulting. We\'re here to help transform your business.',
    url: `${BASE_URL}/contact`,
  }),

  blog: generateMetadata({
    title: 'Digital Marketing & Technology Insight',
    description: 'Read the latest insights, tips, and updates on digital marketing, cloud hosting, AI business tools, and technology trends from Skyfalke.',
    url: `${BASE_URL}/blog`,
  }),

  shop: generateMetadata({
    title: 'Digital Products & Services | Skyfalke',
    description: 'Browse Skyfalke\'s digital products and services. Find the perfect solution for your business needs.',
    url: `${BASE_URL}/shop`,
  }),

  careers: generateMetadata({
    title: 'Careers | Skyfalke',
    description: 'Join Skyfalke and be part of a team that\'s transforming businesses across Africa with innovative digital solutions.',
    url: `${BASE_URL}/careers`,
  }),
};

