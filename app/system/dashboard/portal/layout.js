'use client';

/** Visual grouping for all `/system/dashboard/portal/*` routes inside the admin shell. */
export default function PortalModuleLayout({ children }) {
  return (
    <div className="border-l-4 border-primary-500/70 pl-4 sm:pl-6 -ml-px sm:-ml-1 min-h-[50vh]">
      {children}
    </div>
  );
}
