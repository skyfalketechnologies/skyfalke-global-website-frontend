'use client';

import Link from 'next/link';

/**
 * Consistent header, breadcrumb, and width for Employee Portal screens.
 */
export default function PortalPageShell({ title, description, children }) {
  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-10">
      <nav className="text-sm text-gray-500 dark:text-gray-400" aria-label="Breadcrumb">
        <Link
          href="/system/dashboard/portal"
          className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
        >
          Employee Portal
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-gray-800 dark:text-gray-200 font-medium">{title}</span>
      </nav>

      <header className="border-b border-gray-200 dark:border-gray-700 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{title}</h1>
        {description ? (
          <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-3xl">
            {description}
          </p>
        ) : null}
      </header>

      {children}
    </div>
  );
}
