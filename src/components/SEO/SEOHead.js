'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Helmet } from 'react-helmet-async';
import SchemaMarkup from './SchemaMarkup';

const HOME_OG_DESCRIPTION =
  'Build online presence, acquire customers, and streamline operations with strategic technology — one partner, clear execution.';
const HOME_TWITTER_DESCRIPTION =
  'Websites, marketing, automation, and AI - unified into one growth engine for serious businesses.';

const SEOHead = ({
  title = "Digital Growth Partner in Africa | Skyfalke",
  description = "Growth-focused digital partner: websites, branding, SEO, ads, CRM, automation, and AI roadmaps; one clear strategy to scale revenue.",
  keywords = "digital growth partner, business automation, SEO and ads, CRM workflows, AI roadmap, digital transformation Africa, Skyfalke",
  image = "https://ik.imagekit.io/g3nahgeeu/hero/skyfalke-digital-tech-firm.webp?tr=w-1200,h-630,f-auto,q-auto:good",
  url = "https://skyfalke.com",
  type = "website",
  pageType = "home",
  data = {},
  breadcrumbs = [],
  faqs = [],
  customSchemas = [],
  noIndex = false,
  skipBaseMeta = false,
  canonical = null,
  ogTitle = "Digital Growth Partner in Africa | Skyfalke",
  ogDescription,
  twitterDescription,
  twitterTitle = null
}) => {
  const pathname = usePathname();
  const fullUrl = canonical || `${url}${pathname || ''}`;
  const fullImageUrl = image && typeof image === 'string' && image.startsWith('http') ? image : `${url}${image || ''}`;
  const resolvedOgTitle = ogTitle || title;
  const resolvedTwitterTitle = twitterTitle || resolvedOgTitle;
  const resolvedOgDescription =
    ogDescription ?? (pageType === 'home' ? HOME_OG_DESCRIPTION : description);
  const resolvedTwitterDescription =
    twitterDescription ?? (pageType === 'home' ? HOME_TWITTER_DESCRIPTION : description);

  return (
    <>
      <Helmet>
        {!skipBaseMeta ? (
          <>
            {/* Basic Meta Tags */}
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <meta name="author" content="Skyfalke" />

            {/* Canonical URL */}
            <link rel="canonical" href={fullUrl} />

            {/* Only emit robots when blocking — public pages use Next.js `metadata.robots` */}
            {noIndex ? <meta name="robots" content="noindex, nofollow" /> : null}

            {/* Open Graph Meta Tags */}
            <meta property="og:title" content={resolvedOgTitle} />
            <meta property="og:description" content={resolvedOgDescription} />
            <meta property="og:type" content={type} />
            <meta property="og:url" content={fullUrl} />
            <meta property="og:image" content={fullImageUrl} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:image:alt" content="Skyfalke - digital growth partner for websites, marketing, automation, and AI strategy" />
            <meta property="og:site_name" content="Skyfalke" />
            <meta property="og:locale" content="en_US" />

            {/* Additional Open Graph tags for articles */}
            {type === 'article' && (
              <>
                <meta property="article:published_time" content={data.publishedAt} />
                <meta property="article:author" content={data.author?.name || 'Skyfalke Team'} />
                <meta property="article:section" content={data.category} />
                {data.tags && data.tags.map((tag, index) => (
                  <meta key={index} property="article:tag" content={tag} />
                ))}
              </>
            )}

            {/* Twitter Card Meta Tags */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={resolvedTwitterTitle} />
            <meta name="twitter:description" content={resolvedTwitterDescription} />
            <meta name="twitter:image" content={fullImageUrl} />
            <meta name="twitter:image:alt" content="Skyfalke — digital growth partner for websites, marketing, automation, and AI strategy" />
            <meta name="twitter:site" content="@skyfalke" />
            <meta name="twitter:creator" content="@skyfalke" />
          </>
        ) : noIndex ? (
          <meta name="robots" content="noindex, nofollow" />
        ) : null}

        {/* Additional Meta Tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="theme-color" content="#303661" />
        
        {/* Geo Meta Tags */}
        <meta name="geo.region" content="Global" />
        <meta name="geo.position" content="0;0" />
        <meta name="ICBM" content="0, 0" />
        
        {/* Verification Meta Tags */}
        <meta name="google-site-verification" content="T8MkAO4SIbD1tIYOfP4vQUg9wvKb_mZIdYHqQYi9n3E" />
        <meta name="msvalidate.01" content="your-bing-verification-code" />
        
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://www.google-analytics.com" />
        
        {/* Enhanced Favicon and Icons */}
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="icon" href="/favicon-16x16.png" sizes="16x16" type="image/png" />
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="icon" href="/favicon-96x96.png" sizes="96x96" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon-192x192.png" sizes="192x192" />
        <link rel="apple-touch-icon" href="/favicon-512x512.png" sizes="512x512" />
        
        {/* Additional structured data for better SEO */}
        <meta name="application-name" content="Skyfalke" />
        <meta name="apple-mobile-web-app-title" content="Skyfalke" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        
        {/* Enhanced Mobile & Windows Meta Tags */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#303661" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileImage" content="/favicon-192x192.png" />
        <meta name="msapplication-square70x70logo" content="/favicon-96x96.png" />
        <meta name="msapplication-square150x150logo" content="/favicon-192x192.png" />
        <meta name="msapplication-square310x310logo" content="/favicon-512x512.png" />
        
        {/* Additional SEO Meta Tags */}
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta name="distribution" content="global" />
        <meta name="rating" content="general" />
        <meta name="HandheldFriendly" content="true" />
        <meta name="MobileOptimized" content="320" />
        
        {/* Security Meta Tags */}
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        
        {/* Performance Meta Tags */}
        <meta name="referrer" content="strict-origin-when-cross-origin" />
      </Helmet>
      
      {/* Schema Markup */}
      <SchemaMarkup
        pageType={pageType}
        data={data}
        breadcrumbs={breadcrumbs}
        faqs={faqs}
        customSchemas={customSchemas}
      />
    </>
  );
};

export default SEOHead;
