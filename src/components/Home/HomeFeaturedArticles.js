'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaArrowRight, FaClock } from 'react-icons/fa';
import { apiGet } from '../../utils/api';

function ArticleCard({ blog, className = '', variant = 'default' }) {
  const isHero = variant === 'hero';
  const href = `/blog/${blog.slug}`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45 }}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset] backdrop-blur-sm ${className}`}
    >
      <Link href={href} className="absolute inset-0 z-10" aria-label={`Read: ${blog.title}`} />
      <div
        className="relative aspect-[16/10] shrink-0 overflow-hidden bg-zinc-800"
      >
        {blog.featuredImage?.url ? (
          <img
            src={blog.featuredImage.url}
            alt={blog.featuredImage.alt || blog.title}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#E0AE00]/30 via-zinc-800 to-zinc-900">
            <span className="text-4xl font-bold text-white/20">{blog.title?.charAt(0) || '?'}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent opacity-90" />
        {blog.category && (
          <span className="absolute left-4 top-4 z-[1] rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#E0AE00] backdrop-blur-md">
            {blog.category}
          </span>
        )}
        {blog.readTime && (
          <span className="absolute right-4 top-4 z-[1] flex items-center gap-1.5 rounded-lg border border-white/10 bg-black/35 px-2.5 py-1 text-xs text-zinc-200 backdrop-blur-md">
            <FaClock className="text-[#E0AE00]" aria-hidden />
            {blog.readTime} min
          </span>
        )}
      </div>

      <div
        className={`relative z-[1] flex flex-col ${isHero ? 'p-5 sm:p-6' : 'flex-1 p-5'}`}
      >
        <h3
          className={`font-semibold tracking-tight text-white transition-colors group-hover:text-[#E0AE00] ${
            isHero ? 'text-xl sm:text-2xl lg:text-3xl leading-snug' : 'text-base sm:text-lg leading-snug line-clamp-2'
          }`}
        >
          {blog.title}
        </h3>
        {blog.excerpt && (
          <p
            className={`mt-3 text-sm leading-relaxed text-zinc-400 ${
              isHero ? 'line-clamp-3 max-w-2xl' : 'line-clamp-2'
            }`}
          >
            {blog.excerpt}
          </p>
        )}
        <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[#E0AE00]">
          Read article
          <FaArrowRight className="text-xs transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
        </span>
      </div>
    </motion.article>
  );
}

export default function HomeFeaturedArticles() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const response = await apiGet('/api/blogs?limit=4&featured=true');
        if (!cancelled) setBlogs(response.data?.blogs || []);
      } catch {
        if (!cancelled) setBlogs([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <section className="section-padding bg-zinc-950" aria-busy="true" aria-label="Loading featured articles">
        <div className="container-custom max-w-6xl mx-auto">
          <div className="mb-10 h-4 w-32 animate-pulse rounded-full bg-white/10" />
          <div className="h-10 max-w-md animate-pulse rounded-lg bg-white/10" />
          <div className="mt-12 grid items-start gap-6 lg:grid-cols-12 lg:gap-8">
            <div className="flex flex-col gap-6 lg:col-span-7">
              <div className="h-80 animate-pulse rounded-2xl bg-white/5" />
              <div className="h-56 animate-pulse rounded-2xl bg-white/5" />
            </div>
            <div className="flex flex-col gap-6 lg:col-span-5">
              <div className="h-40 animate-pulse rounded-2xl bg-white/5" />
              <div className="h-40 animate-pulse rounded-2xl bg-white/5" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!blogs.length) return null;

  const [primary, ...rest] = blogs;
  const side = rest.slice(0, 2);
  const belowHero = blogs.length >= 4 ? rest[2] : null;

  return (
    <section
      className="section-padding relative overflow-hidden bg-zinc-950"
      aria-labelledby="featured-articles-heading"
    >
      <div
        className="pointer-events-none absolute -left-32 top-1/2 h-[min(80vw,520px)] w-[min(80vw,520px)] -translate-y-1/2 rounded-full bg-[#E0AE00]/[0.07] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 bottom-0 h-64 w-64 rounded-full bg-amber-500/5 blur-3xl"
        aria-hidden
      />

      <div className="container-custom relative z-[1] max-w-6xl mx-auto">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <p className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#E0AE00]">
              Skyfalke Blog
            </p>
            <h2 id="featured-articles-heading" className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-[2.35rem]">
              Featured articles
            </h2>
            <p className="mt-4 text-base leading-relaxed text-zinc-400">
              Ideas on business growth, automation, and digital systems.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:border-[#E0AE00]/50 hover:bg-[#E0AE00]/10 hover:text-[#E0AE00]"
            >
              Browse all articles
              <FaArrowRight className="text-xs" aria-hidden />
            </Link>
          </motion.div>
        </div>

        {blogs.length === 1 && (
          <div className="mt-12">
            <ArticleCard blog={primary} variant="hero" />
          </div>
        )}

        {blogs.length === 2 && (
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <ArticleCard blog={primary} />
            <ArticleCard blog={rest[0]} />
          </div>
        )}

        {blogs.length >= 3 && (
          <div className="mt-12 grid items-start gap-6 lg:grid-cols-12 lg:gap-8">
            <div className="flex flex-col gap-6 lg:col-span-7">
              <ArticleCard blog={primary} variant="hero" />
              {belowHero ? <ArticleCard key={belowHero._id} blog={belowHero} /> : null}
            </div>
            <div className="flex flex-col gap-6 lg:col-span-5">
              {side.map((blog) => (
                <ArticleCard key={blog._id} blog={blog} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
