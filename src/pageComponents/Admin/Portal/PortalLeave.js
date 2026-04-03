'use client';

import React, { useEffect, useState } from 'react';
import { FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import { adminApiGet, adminApiPost } from '../../../utils/adminApi';
import { useAuth } from '../../../contexts/AuthContext';
import PortalPageShell from './PortalPageShell';

export default function PortalLeave() {
  const { canAccessHRModule, user } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    leaveType: 'annual',
    startDate: '',
    endDate: '',
    reason: ''
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const linked = !!user?.employeeProfile;

  const load = async () => {
    setLoading(true);
    const res = await adminApiGet('/api/portal/leaves');
    if (res.success && res.data?.success) setRows(res.data.data || []);
    else if (!res.success && res.error?.message) {
      setMessage({ type: 'error', text: res.error.message });
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setSaving(true);
    const res = await adminApiPost('/api/portal/leaves', form);
    setSaving(false);
    if (res.success && res.data?.success) {
      setForm({ leaveType: 'annual', startDate: '', endDate: '', reason: '' });
      setMessage({ type: 'ok', text: 'Leave request submitted.' });
      load();
    } else {
      setMessage({
        type: 'error',
        text: res.error?.message || res.data?.message || 'Could not submit leave request.'
      });
    }
  };

  const approve = async (id) => {
    const res = await adminApiPost(`/api/portal/leaves/${id}/approve`, {});
    if (res.success && res.data?.success) load();
    else alert(res.error?.message || 'Approve failed');
  };

  const reject = async (id) => {
    const reviewNote = window.prompt('Reason (optional)') || '';
    const res = await adminApiPost(`/api/portal/leaves/${id}/reject`, { reviewNote });
    if (res.success && res.data?.success) load();
    else alert(res.error?.message || 'Reject failed');
  };

  return (
    <PortalPageShell
      title="Leave"
      description={
        canAccessHRModule()
          ? 'Submit your own leave or review pending requests for the team.'
          : 'Submit leave requests. Your manager or HR will approve them.'
      }
    >
      {!linked && (
        <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800 px-4 py-3 text-sm text-amber-900 dark:text-amber-100">
          <FaExclamationTriangle className="shrink-0 mt-0.5 text-amber-600" />
          <div>
            You need an HR employee profile linked to your account to request leave. Contact HR to link your
            portal user under <strong>HR → Employees → Employee Portal login</strong>.
          </div>
        </div>
      )}

      {message.text && (
        <div
          className={`rounded-lg px-4 py-3 text-sm ${
            message.type === 'ok'
              ? 'bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-200'
              : 'bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      <form
        onSubmit={submit}
        className={`max-w-lg space-y-4 rounded-xl border border-gray-200 dark:border-gray-700 p-6 bg-white dark:bg-gray-800 shadow-sm ${
          !linked ? 'opacity-60 pointer-events-none' : ''
        }`}
      >
        <h2 className="font-semibold text-gray-900 dark:text-white">New request</h2>
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Type</label>
          <select
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 p-2.5"
            value={form.leaveType}
            onChange={(e) => setForm({ ...form, leaveType: e.target.value })}
          >
            <option value="annual">Annual</option>
            <option value="sick">Sick</option>
            <option value="personal">Personal</option>
            <option value="unpaid">Unpaid</option>
            <option value="maternity">Maternity</option>
            <option value="paternity">Paternity</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Start</label>
            <input
              type="date"
              required
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 p-2.5"
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">End</label>
            <input
              type="date"
              required
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 p-2.5"
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Reason</label>
          <textarea
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 p-2.5"
            rows={3}
            value={form.reason}
            onChange={(e) => setForm({ ...form, reason: e.target.value })}
          />
        </div>
        <button
          type="submit"
          disabled={saving || !linked}
          className="bg-primary-600 text-white px-5 py-2.5 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {saving ? 'Submitting…' : 'Submit request'}
        </button>
      </form>

      <div>
        <h2 className="font-semibold text-gray-900 dark:text-white mb-3">
          {canAccessHRModule() ? 'All requests' : 'My requests'}
        </h2>
        {loading ? (
          <FaSpinner className="animate-spin text-primary-500 text-xl" />
        ) : rows.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm py-6">No leave requests yet.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800/90">
                <tr>
                  <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-300">Employee</th>
                  <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-300">Type</th>
                  <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-300">Dates</th>
                  <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-300">Days</th>
                  <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-300">Status</th>
                  {canAccessHRModule() && <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-300">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r._id} className="border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800/40">
                    <td className="p-3">
                      {r.employee?.personalInfo
                        ? `${r.employee.personalInfo.firstName} ${r.employee.personalInfo.lastName}`
                        : '—'}
                    </td>
                    <td className="p-3 capitalize text-gray-700 dark:text-gray-300">{r.leaveType}</td>
                    <td className="p-3 whitespace-nowrap text-gray-700 dark:text-gray-300">
                      {new Date(r.startDate).toLocaleDateString()} – {new Date(r.endDate).toLocaleDateString()}
                    </td>
                    <td className="p-3">{r.days}</td>
                    <td className="p-3">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                          r.status === 'approved'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200'
                            : r.status === 'rejected'
                              ? 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200'
                              : r.status === 'pending'
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200'
                                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    {canAccessHRModule() && r.status === 'pending' && (
                      <td className="p-3 space-x-2">
                        <button
                          type="button"
                          className="text-green-600 dark:text-green-400 text-xs font-medium hover:underline"
                          onClick={() => approve(r._id)}
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          className="text-red-600 dark:text-red-400 text-xs font-medium hover:underline"
                          onClick={() => reject(r._id)}
                        >
                          Reject
                        </button>
                      </td>
                    )}
                    {canAccessHRModule() && r.status !== 'pending' && <td className="p-3 text-gray-400">—</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PortalPageShell>
  );
}
