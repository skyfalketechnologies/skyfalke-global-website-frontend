'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { FaSearch, FaSpinner, FaUserFriends } from 'react-icons/fa';
import { adminApiGet } from '../../../utils/adminApi';
import PortalPageShell from './PortalPageShell';

export default function PortalDirectory() {
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ limit: 80 });
    if (search.trim()) params.set('search', search.trim());
    const res = await adminApiGet(`/api/portal/directory?${params}`);
    if (res.success && res.data?.success) {
      setRows(res.data.data || []);
    }
    setLoading(false);
  }, [search]);

  useEffect(() => {
    const t = setTimeout(fetchData, 300);
    return () => clearTimeout(t);
  }, [fetchData]);

  return (
    <PortalPageShell
      title="Directory"
      description="Search colleagues by name, email, employee ID, or skills. Salary details are hidden unless your role allows it."
    >
      <div className="relative max-w-lg">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder="Search name, email, skills…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search directory"
        />
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-gray-500 py-12">
          <FaSpinner className="animate-spin text-primary-500 text-xl" />
          Loading directory…
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-600 p-12 text-center text-gray-500 dark:text-gray-400">
          <FaUserFriends className="mx-auto text-4xl mb-3 opacity-40" />
          <p>No employees match your search.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/90">
              <tr>
                <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-300">ID</th>
                <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-300">Name</th>
                <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-300">Department</th>
                <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-300">Title</th>
                <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-300">Skills</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((e) => (
                <tr
                  key={e._id}
                  className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50/80 dark:hover:bg-gray-800/50"
                >
                  <td className="p-3 font-mono text-xs text-gray-600 dark:text-gray-400">{e.employeeId}</td>
                  <td className="p-3">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {e.personalInfo?.firstName} {e.personalInfo?.lastName}
                    </span>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{e.personalInfo?.email}</div>
                  </td>
                  <td className="p-3 text-gray-700 dark:text-gray-300">{e.employmentInfo?.department}</td>
                  <td className="p-3 text-gray-700 dark:text-gray-300">{e.employmentInfo?.jobTitle}</td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {(e.skills || []).slice(0, 8).map((s) => (
                        <span
                          key={s}
                          className="px-2 py-0.5 rounded-full bg-primary-50 dark:bg-primary-900/30 text-xs text-primary-800 dark:text-primary-200"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PortalPageShell>
  );
}
