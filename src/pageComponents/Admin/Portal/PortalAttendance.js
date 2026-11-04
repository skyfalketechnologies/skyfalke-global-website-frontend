'use client';

import React, { useEffect, useState } from 'react';
import { FaSpinner, FaCalendarCheck } from 'react-icons/fa';
import { adminApiGet } from '../../../utils/adminApi';
import { useAuth } from '../../../contexts/AuthContext';
import PortalPageShell from './PortalPageShell';

export default function PortalAttendance() {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await adminApiGet('/api/portal/attendance/me');
      if (res.success && res.data?.success) {
        setRows(res.data.data || []);
      }
      setLoading(false);
    })();
  }, []);

  const linked = !!user?.employeeProfile;

  return (
    <PortalPageShell
      title="My attendance"
      description="Recent attendance records from HR. Full corrections are handled by your manager or HR."
    >
      {!linked && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800 px-4 py-3 text-sm text-amber-900 dark:text-amber-100">
          Your account is not linked to an HR employee profile yet. Ask HR to link your portal login under{' '}
          <strong>HR → Employees → Employee Portal login</strong>.
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-gray-500 py-8">
          <FaSpinner className="animate-spin text-primary-500 text-xl" />
          Loading records…
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-600 p-12 text-center text-gray-500 dark:text-gray-400">
          <FaCalendarCheck className="mx-auto text-3xl mb-3 opacity-50" />
          <p>No attendance rows yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/90">
              <tr>
                <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-300">Date</th>
                <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-300">Status</th>
                <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-300">Hours</th>
                <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-300">Check-in</th>
                <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-300">Check-out</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r._id} className="border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800/50">
                  <td className="p-3 whitespace-nowrap">
                    {r.date ? new Date(r.date).toLocaleDateString(undefined, { dateStyle: 'medium' }) : '—'}
                  </td>
                  <td className="p-3 capitalize">{r.status || '—'}</td>
                  <td className="p-3">{r.totalHours != null ? Number(r.totalHours).toFixed(1) : '—'}</td>
                  <td className="p-3 text-xs text-gray-600 dark:text-gray-400">
                    {r.checkIn?.time ? new Date(r.checkIn.time).toLocaleString() : '—'}
                  </td>
                  <td className="p-3 text-xs text-gray-600 dark:text-gray-400">
                    {r.checkOut?.time ? new Date(r.checkOut.time).toLocaleString() : '—'}
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
