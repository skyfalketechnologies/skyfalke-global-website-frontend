'use client';

import Link from 'next/link';
import {
  siteMapPrimary,
  siteMapServiceCategories,
  siteMapResources,
  siteMapCompany,
  siteMapLegal,
} from '@/data/siteMapSections';

function LinkList({ links, className = '' }) {
  return (
    <ul className={`space-y-2 ${className}`}>
      {links.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            className="text-gray-700 hover:text-primary-600 underline-offset-2 hover:underline"
          >
            {item.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function SiteMap() {
  return (
    <div className="bg-gray-50 pb-20 pt-28 md:pt-32">
      <div className="container-custom max-w-5xl">
        <header className="mb-12 border-b border-gray-200 pb-10">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary-600">Navigation</p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900 md:text-4xl">Sitemap</h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-600">
            Browse all main sections of the Skyfalke site. For search engines, use the{' '}
            <a
              href="/sitemap.xml"
              className="font-medium text-primary-600 underline-offset-2 hover:underline"
            >
              XML sitemap
            </a>
            .
          </p>
        </header>

        <div className="grid gap-12 md:grid-cols-2">
          <section aria-labelledby="sitemap-primary">
            <h2 id="sitemap-primary" className="text-lg font-bold text-gray-900">
              Main pages
            </h2>
            <LinkList links={siteMapPrimary} className="mt-4" />
          </section>

          <section aria-labelledby="sitemap-resources">
            <h2 id="sitemap-resources" className="text-lg font-bold text-gray-900">
              Resources & programs
            </h2>
            <LinkList links={[...siteMapResources, ...siteMapCompany]} className="mt-4" />
          </section>
        </div>

        <section aria-labelledby="sitemap-services" className="mt-14">
          <h2 id="sitemap-services" className="text-lg font-bold text-gray-900">
            Solutions & services
          </h2>
          <div className="mt-8 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {siteMapServiceCategories.map((cat) => (
              <div key={cat.title} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-base font-semibold text-gray-900">
                  <Link href={cat.href} className="hover:text-primary-600">
                    {cat.title}
                  </Link>
                </h3>
                {cat.links.length > 0 ? (
                  <LinkList links={cat.links} className="mt-4 text-sm" />
                ) : (
                  <p className="mt-3 text-sm text-gray-500">Overview and engagement on the category page.</p>
                )}
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="sitemap-legal" className="mt-14 border-t border-gray-200 pt-10">
          <h2 id="sitemap-legal" className="text-lg font-bold text-gray-900">
            Legal
          </h2>
          <LinkList links={siteMapLegal} className="mt-4" />
        </section>
      </div>
    </div>
  );
}
