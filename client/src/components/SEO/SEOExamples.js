import React from 'react';
import SEOHead from './SEOHead';

// Example usage for different page types

// Home Page Example
export const HomePageSEO = () => {
  return (
    <SEOHead
      pageType="home"
      title="Skyfalke • Sustainable Cloud Solutions Partner In Africa & Beyond"
      description="Leading sustainable cloud solutions and digital marketing services. Eco-friendly hosting, renewable energy servers, and comprehensive IT solutions for businesses worldwide."
      keywords="sustainable cloud solutions, green hosting, digital marketing, IT services, renewable energy servers, eco-friendly technology"
    />
  );
};

// Blog Post Example
export const BlogPostSEO = ({ post }) => {
  const breadcrumbs = [
    { name: 'Home', url: 'https://skyfalke.com' },
    { name: 'Blog', url: 'https://skyfalke.com/blog' },
    { name: post.title, url: `https://skyfalke.com/blog/${post.slug}` }
  ];

  return (
    <SEOHead
      pageType="blog"
      data={post}
      title={`${post.title} - Skyfalke Blog`}
      description={post.excerpt || (post.content ? post.content.substring(0, 160) : 'Blog post content')}
      keywords={post.tags?.join(', ') || 'digital marketing, cloud solutions'}
      image={post.featuredImage}
      type="article"
      breadcrumbs={breadcrumbs}
      canonical={`https://skyfalke.com/blog/${post.slug}`}
    />
  );
};

// Product Page Example
export const ProductPageSEO = ({ product }) => {
  const breadcrumbs = [
    { name: 'Home', url: 'https://skyfalke.com' },
    { name: 'Shop', url: 'https://skyfalke.com/shop' },
    { name: product.category, url: `https://skyfalke.com/shop?category=${product.category}` },
    { name: product.name, url: `https://skyfalke.com/shop/product/${product.slug}` }
  ];

  return (
    <SEOHead
      pageType="product"
      data={product}
      title={`${product.name} - Skyfalke Shop`}
      description={product.shortDescription || product.description}
      keywords={`${product.name}, ${product.category}, cloud solutions, digital services`}
      image={product.images?.[0]?.url}
      type="product"
      breadcrumbs={breadcrumbs}
      canonical={`https://skyfalke.com/shop/product/${product.slug}`}
    />
  );
};

// Service Page Example
export const ServicePageSEO = ({ service }) => {
  const breadcrumbs = [
    { name: 'Home', url: 'https://skyfalke.com' },
    { name: 'Services', url: 'https://skyfalke.com/services' },
    { name: service.name, url: `https://skyfalke.com/services/${service.slug}` }
  ];

  const faqs = [
    {
      question: "What makes Skyfalke's hosting sustainable?",
      answer: "Our hosting infrastructure is powered by 100% renewable energy sources, reducing carbon footprint while maintaining high performance."
    },
    {
      question: "How do you ensure service reliability?",
      answer: "We use enterprise-grade infrastructure with 99.9% uptime guarantee and 24/7 monitoring and support."
    }
  ];

  return (
    <SEOHead
      pageType="service"
      data={service}
      title={`${service.name} - Skyfalke Services`}
      description={service.description}
      keywords={`${service.name}, ${service.category}, digital services, cloud solutions`}
      image={service.image}
      type="website"
      breadcrumbs={breadcrumbs}
      faqs={faqs}
      canonical={`https://skyfalke.com/services/${service.slug}`}
    />
  );
};

// Job Posting Example
export const JobPostingSEO = ({ job }) => {
  const breadcrumbs = [
    { name: 'Home', url: 'https://skyfalke.com' },
    { name: 'Careers', url: 'https://skyfalke.com/careers' },
    { name: job.title, url: `https://skyfalke.com/careers/${job.slug}` }
  ];

  return (
    <SEOHead
      pageType="job"
      data={job}
      title={`${job.title} - Careers at Skyfalke`}
      description={`Join our team as ${job.title}. ${job.shortDescription || (job.description ? job.description.substring(0, 120) : 'Job description')}`}
      keywords={`${job.title}, careers, jobs, ${job.location?.city || 'remote'}, ${job.type}`}
      type="website"
      breadcrumbs={breadcrumbs}
      canonical={`https://skyfalke.com/careers/${job.slug}`}
    />
  );
};

// Case Study Example
export const CaseStudySEO = ({ caseStudy }) => {
  const breadcrumbs = [
    { name: 'Home', url: 'https://skyfalke.com' },
    { name: 'Case Studies', url: 'https://skyfalke.com/case-studies' },
    { name: caseStudy.title, url: `https://skyfalke.com/case-studies/${caseStudy.slug}` }
  ];

  return (
    <SEOHead
      pageType="case-study"
      data={caseStudy}
      title={`${caseStudy.title} - Skyfalke Case Study`}
      description={caseStudy.summary}
      keywords={`${caseStudy.title}, case study, ${caseStudy.client.industry}, digital marketing, cloud solutions`}
      image={caseStudy.images?.[0]?.url}
      type="article"
      breadcrumbs={breadcrumbs}
      canonical={`https://skyfalke.com/case-studies/${caseStudy.slug}`}
    />
  );
};

// Contact Page Example
export const ContactPageSEO = () => {
  const faqs = [
    {
      question: "How can I get in touch with Skyfalke?",
      answer: "You can contact us through our contact form, email us at info@skyfalke.com, or call us directly."
    },
    {
      question: "What are your business hours?",
      answer: "We operate Monday to Friday, 9 AM to 6 PM GMT, with 24/7 support for hosting services."
    },
    {
      question: "Do you offer free consultations?",
      answer: "Yes, we offer free initial consultations to understand your needs and provide tailored solutions."
    }
  ];

  return (
    <SEOHead
      pageType="contact"
      title="Contact Skyfalke - Get In Touch"
      description="Get in touch with Skyfalke for sustainable cloud solutions and digital marketing services. Free consultation available."
      keywords="contact skyfalke, get quote, consultation, support, customer service"
      type="website"
      faqs={faqs}
      canonical="https://skyfalke.com/contact"
    />
  );
};

// About Page Example
export const AboutPageSEO = () => {
  return (
    <SEOHead
      pageType="about"
      title="About Skyfalke - Sustainable Cloud Solutions Partner"
      description="Learn about Skyfalke's mission to provide sustainable cloud solutions and digital marketing services. Discover our story, values, and commitment to eco-friendly technology."
      keywords="about skyfalke, company history, mission, values, sustainable technology, green hosting"
      type="website"
      canonical="https://skyfalke.com/about"
    />
  );
};

// Admin Page Example (No Index)
export const AdminPageSEO = () => {
  return (
    <SEOHead
      title="Admin Dashboard - Skyfalke"
      description="Skyfalke admin dashboard"
      noIndex={true} // Prevents indexing of admin pages
    />
  );
};
