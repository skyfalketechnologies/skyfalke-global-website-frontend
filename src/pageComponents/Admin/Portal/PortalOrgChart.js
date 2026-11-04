'use client';

import React, { useEffect, useState } from 'react';
import { FaSpinner, FaSitemap } from 'react-icons/fa';
import { adminApiGet } from '../../../utils/adminApi';
import PortalPageShell from './PortalPageShell';

export default function PortalOrgChart() {
  const [nodes, setNodes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await adminApiGet('/api/portal/org-chart');
      if (res.success && res.data?.success) {
        setNodes(res.data.data?.nodes || []);
      }
      setLoading(false);
    })();
  }, []);

  const map = {};
  nodes.forEach((n) => {
    map[String(n.id)] = n;
  });

  return (
    <PortalPageShell
      title="Organizational chart"
      description="Who reports to whom, based on HR records. Use Directory to search by skill or name."
    >
      {loading ? (
        <div className="flex items-center gap-2 text-gray-500 py-12">
          <FaSpinner className="animate-spin text-primary-500 text-xl" />
          Loading org data…
        </div>
      ) : nodes.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-600 p-12 text-center text-gray-500 dark:text-gray-400">
          <FaSitemap className="mx-auto text-4xl mb-3 opacity-40" />
          <p>No active employees found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/90">
              <tr>
                <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-300">Employee</th>
                <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-300">Department</th>
                <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-300">Title</th>
                <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-300">Reports to</th>
              </tr>
            </thead>
            <tbody>
              {nodes.map((n) => {
                const mgr = n.managerId ? map[String(n.managerId)] : null;
                return (
                  <tr
                    key={String(n.id)}
                    className="border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800/40 hover:bg-gray-50/80 dark:hover:bg-gray-800/80"
                  >
                    <td className="p-3">
                      <span className="font-mono text-xs text-gray-500 mr-2">{n.employeeId}</span>
                      <span className="font-medium text-gray-900 dark:text-white">{n.name}</span>
                    </td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">{n.department}</td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">{n.jobTitle}</td>
                    <td className="p-3 text-gray-600 dark:text-gray-400">{mgr ? mgr.name : '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </PortalPageShell>
  );
}
