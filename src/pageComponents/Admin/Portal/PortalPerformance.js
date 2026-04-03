'use client';

import React, { useEffect, useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { adminApiGet, adminApiPost } from '../../../utils/adminApi';
import { useAuth } from '../../../contexts/AuthContext';
import PortalPageShell from './PortalPageShell';

export default function PortalPerformance() {
  const { user } = useAuth();
  const [goals, setGoals] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [fb, setFb] = useState({ toEmployee: '', body: '', anonymous: false });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [g, r, dir] = await Promise.all([
        adminApiGet(`/api/portal/performance/goals?year=${new Date().getFullYear()}`),
        adminApiGet('/api/portal/performance/reviews'),
        adminApiGet('/api/portal/directory?limit=200')
      ]);
      if (g.success && g.data?.success) setGoals(g.data.data || []);
      if (r.success && r.data?.success) setReviews(r.data.data || []);
      if (dir.success && dir.data?.success) setEmployees(dir.data.data || []);
      setLoading(false);
    })();
  }, []);

  const sendFeedback = async (e) => {
    e.preventDefault();
    if (!fb.toEmployee || !fb.body) return;
    const res = await adminApiPost('/api/portal/feedback', fb);
    if (res.success && res.data?.success) {
      setFb({ toEmployee: '', body: '', anonymous: false });
      alert('Feedback sent.');
    } else {
      alert(res.error?.message || 'Failed to send feedback');
    }
  };

  return (
    <PortalPageShell
      title="Performance"
      description="Goals, reviews, and peer feedback. HR can create goals via API or future admin tools."
    >
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Goals (OKRs / KPIs)</h2>
        {loading ? (
          <FaSpinner className="animate-spin text-primary-500" />
        ) : (
          <ul className="space-y-3">
            {goals.map((g) => (
              <li
                key={g._id}
                className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800/50 shadow-sm"
              >
                <div className="font-medium text-gray-900 dark:text-white">{g.title}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {g.year} · {g.status} · {g.progress ?? 0}%
                </div>
                {(g.keyResults || []).length > 0 && (
                  <ul className="mt-2 text-sm text-gray-600 dark:text-gray-300 list-disc list-inside">
                    {g.keyResults.map((kr, i) => (
                      <li key={i}>
                        {kr.text} ({kr.progress ?? 0}%)
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
            {goals.length === 0 && (
              <p className="text-gray-500 dark:text-gray-400 text-sm py-4">No goals for this year yet.</p>
            )}
          </ul>
        )}
      </section>

      <section className="space-y-4 pt-8 border-t border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Reviews</h2>
        <ul className="space-y-3">
          {reviews.map((r) => (
            <li
              key={r._id}
              className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800/50 shadow-sm"
            >
              <div className="font-medium text-gray-900 dark:text-white">{r.periodLabel}</div>
              <div className="text-sm text-gray-500 capitalize">{r.status}</div>
              {r.summary && <p className="text-sm mt-2 text-gray-700 dark:text-gray-300">{r.summary}</p>}
            </li>
          ))}
          {!loading && reviews.length === 0 && (
            <p className="text-gray-500 dark:text-gray-400 text-sm">No reviews yet.</p>
          )}
        </ul>
      </section>

      <section className="space-y-4 pt-8 border-t border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Peer / manager feedback</h2>
        <form
          onSubmit={sendFeedback}
          className="max-w-lg space-y-4 rounded-xl border border-gray-200 dark:border-gray-700 p-6 bg-white dark:bg-gray-800 shadow-sm"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">To employee</label>
            <select
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 p-2.5 bg-white dark:bg-gray-900"
              value={fb.toEmployee}
              onChange={(e) => setFb({ ...fb, toEmployee: e.target.value })}
              required
            >
              <option value="">Select colleague…</option>
              {employees.map((e) => (
                <option key={e._id} value={e._id}>
                  {e.personalInfo?.firstName} {e.personalInfo?.lastName} ({e.employeeId})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
            <textarea
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 p-2.5 bg-white dark:bg-gray-900 min-h-[100px]"
              placeholder="Constructive feedback"
              value={fb.body}
              onChange={(e) => setFb({ ...fb, body: e.target.value })}
              required
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <input
              type="checkbox"
              checked={fb.anonymous}
              onChange={(e) => setFb({ ...fb, anonymous: e.target.checked })}
            />
            Send anonymously
          </label>
          <button type="submit" className="bg-primary-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-primary-700">
            Send feedback
          </button>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Signed in as {user?.email}. Recipients see feedback in their Performance view unless anonymous.
          </p>
        </form>
      </section>
    </PortalPageShell>
  );
}
