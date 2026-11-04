'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FaUsers,
  FaSitemap,
  FaCalendarAlt,
  FaBullhorn,
  FaBookOpen,
  FaChartLine,
  FaServer,
  FaClipboardList,
  FaProjectDiagram,
  FaSpinner,
  FaCalendarCheck,
  FaCog,
  FaLink
} from 'react-icons/fa';
import { adminApiGet } from '../../../utils/adminApi';
import { useAuth } from '../../../contexts/AuthContext';
import PortalPageShell from './PortalPageShell';

const mainCards = [
  { href: '/system/dashboard/portal/directory', title: 'Directory', desc: 'Search people and skills', icon: FaUsers },
  { href: '/system/dashboard/portal/org-chart', title: 'Org chart', desc: 'Reporting lines', icon: FaSitemap },
  { href: '/system/dashboard/portal/leave', title: 'Leave', desc: 'Requests and balances', icon: FaCalendarAlt },
  { href: '/system/dashboard/portal/attendance', title: 'My attendance', desc: 'Your time records', icon: FaCalendarCheck },
  { href: '/system/dashboard/portal/announcements', title: 'Announcements', desc: 'Company news', icon: FaBullhorn },
  { href: '/system/dashboard/portal/wiki', title: 'Knowledge base', desc: 'Internal wiki', icon: FaBookOpen },
  { href: '/system/dashboard/portal/performance', title: 'Performance', desc: 'Goals & reviews', icon: FaChartLine },
  { href: '/system/dashboard/portal/it', title: 'IT & support', desc: 'Assets & tickets', icon: FaServer },
  { href: '/system/dashboard/portal/onboarding', title: 'Onboarding', desc: 'Your checklist', icon: FaClipboardList },
  { href: '/system/dashboard/projects', title: 'Projects', desc: 'Tasks & delivery', icon: FaProjectDiagram }
];

export default function EmployeePortalHome() {
  const { user, canAccessHRModule, isSuperAdmin } = useAuth();
  const [dash, setDash] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await adminApiGet('/api/portal/dashboard');
      if (!cancelled && res.success && res.data?.success) {
        setDash(res.data.data);
      }
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const linked = !!user?.employeeProfile;

  return (
    <PortalPageShell
      title="Overview"
      description="Quick access to HR, IT, knowledge, and projects. Link your HR profile in Staff settings if leave or attendance shows as unavailable."
    >
      {!linked && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800 px-4 py-3 text-sm text-amber-900 dark:text-amber-100 flex items-start gap-3">
          <FaLink className="mt-0.5 shrink-0 text-amber-600" />
          <div>
            <strong>No HR profile linked.</strong> Ask an admin to open{' '}
            <strong>HR → Employees</strong>, edit your record, and choose your account under{' '}
            <em>Employee Portal login</em> so leave and attendance work.
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-gray-500 py-4">
          <FaSpinner className="animate-spin text-primary-500" /> Loading snapshot…
        </div>
      ) : (
        dash && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="rounded-xl bg-white dark:bg-gray-800 shadow-sm p-4 border border-gray-100 dark:border-gray-700">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                HR profile
              </p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white mt-1">
                {dash.employeeLinked ? 'Linked' : 'Not linked'}
              </p>
            </div>
            <div className="rounded-xl bg-white dark:bg-gray-800 shadow-sm p-4 border border-gray-100 dark:border-gray-700">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Pending leave
              </p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white mt-1">{dash.myPendingLeaves}</p>
            </div>
            <div className="rounded-xl bg-white dark:bg-gray-800 shadow-sm p-4 border border-gray-100 dark:border-gray-700">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Open IT tickets
              </p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white mt-1">{dash.openTickets}</p>
            </div>
            {canAccessHRModule() && dash.pendingApprovals !== undefined && (
              <div className="rounded-xl bg-amber-50 dark:bg-amber-900/20 shadow-sm p-4 border border-amber-100 dark:border-amber-800">
                <p className="text-xs font-medium uppercase tracking-wide text-amber-800 dark:text-amber-200">
                  Awaiting your approval
                </p>
                <p className="text-xl font-semibold text-amber-900 dark:text-amber-100 mt-1">
                  {dash.pendingApprovals}
                </p>
              </div>
            )}
          </div>
        )
      )}

      <div>
        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
          Modules
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {mainCards.map((c) => {
            const Icon = c.icon;
            return (
              <Link key={c.href} href={c.href} className="group block">
                <motion.div
                  whileHover={{ y: -2 }}
                  className="h-full rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5 shadow-sm hover:shadow-md hover:border-primary-300 dark:hover:border-primary-700 transition-all"
                >
                  <Icon className="text-primary-500 text-lg mb-2 group-hover:scale-105 transition-transform" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">{c.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{c.desc}</p>
                </motion.div>
              </Link>
            );
          })}
          {isSuperAdmin() && (
            <Link href="/system/dashboard/portal/integrations" className="group block">
              <motion.div
                whileHover={{ y: -2 }}
                className="h-full rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 border border-gray-700 p-5 shadow-sm hover:shadow-md transition-all text-white"
              >
                <FaCog className="text-primary-400 text-lg mb-2" />
                <h3 className="font-semibold">Integrations</h3>
                <p className="text-sm text-gray-300 mt-1">Slack, Jira, GitHub, Google</p>
              </motion.div>
            </Link>
          )}
        </div>
      </div>
    </PortalPageShell>
  );
}
