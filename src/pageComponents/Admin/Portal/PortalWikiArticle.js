'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FaSpinner } from 'react-icons/fa';
import { adminApiGet } from '../../../utils/adminApi';
import PortalPageShell from './PortalPageShell';

export default function PortalWikiArticle() {
  const params = useParams();
  const slug = params?.slug;
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    (async () => {
      const res = await adminApiGet(`/api/portal/wiki/articles/${encodeURIComponent(slug)}`);
      if (!cancelled && res.success && res.data?.success) setArticle(res.data.data);
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <PortalPageShell title="Article" description="">
        <div className="flex items-center gap-2 text-gray-500 py-12">
          <FaSpinner className="animate-spin text-primary-500 text-xl" />
          Loading…
        </div>
      </PortalPageShell>
    );
  }

  if (!article) {
    return (
      <PortalPageShell title="Article" description="">
        <p className="text-gray-500 dark:text-gray-400 py-8">Article not found or was unpublished.</p>
        <Link href="/system/dashboard/portal/wiki" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">
          ← Back to knowledge base
        </Link>
      </PortalPageShell>
    );
  }

  return (
    <PortalPageShell title={article.title} description={article.category ? `Category: ${article.category}` : ''}>
      <Link
        href="/system/dashboard/portal/wiki"
        className="inline-flex text-sm text-primary-600 dark:text-primary-400 hover:underline mb-4"
      >
        ← All articles
      </Link>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Version {article.currentVersion}
        {article.updatedAt ? ` · Updated ${new Date(article.updatedAt).toLocaleString()}` : ''}
      </p>
      <div className="prose prose-neutral dark:prose-invert max-w-none rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 p-6 sm:p-8 shadow-sm">
        <div className="whitespace-pre-wrap text-gray-800 dark:text-gray-200">{article.content}</div>
      </div>
    </PortalPageShell>
  );
}
