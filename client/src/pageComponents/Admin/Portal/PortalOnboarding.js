'use client';

import React, { useEffect, useState } from 'react';
import { FaSpinner, FaClipboardCheck } from 'react-icons/fa';
import { adminApiGet, adminApiPatch } from '../../../utils/adminApi';
import { useAuth } from '../../../contexts/AuthContext';
import PortalPageShell from './PortalPageShell';

export default function PortalOnboarding() {
  const { canAccessHRModule } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await adminApiGet('/api/portal/onboarding/me');
      if (res.success && res.data?.success) setData(res.data.data);
      setLoading(false);
    })();
  }, []);

  const toggle = async (index, done) => {
    const res = await adminApiPatch(`/api/portal/onboarding/me/items/${index}`, { done });
    if (res.success && res.data?.success) {
      setData(res.data.data);
    }
  };

  if (loading) {
    return (
      <PortalPageShell title="Onboarding" description="">
        <div className="flex items-center gap-2 text-gray-500 py-12">
          <FaSpinner className="animate-spin text-primary-500 text-xl" />
          Loading…
        </div>
      </PortalPageShell>
    );
  }

  if (!data) {
    return (
      <PortalPageShell
        title="Onboarding"
        description="HR assigns a checklist when you join. Complete items as you go."
      >
        <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-600 p-12 text-center text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
          <FaClipboardCheck className="mx-auto text-4xl mb-3 opacity-40" />
          <p className="font-medium text-gray-700 dark:text-gray-300">No onboarding checklist yet</p>
          <p className="text-sm mt-2">
            {canAccessHRModule()
              ? 'Create a template under HR tools or assign one via the onboarding API.'
              : 'Your HR team will assign a template to your profile.'}
          </p>
        </div>
      </PortalPageShell>
    );
  }

  const doneCount = (data.items || []).filter((i) => i.done).length;
  const total = (data.items || []).length;

  return (
    <PortalPageShell
      title="Onboarding"
      description={`${doneCount} of ${total} steps complete. Check items off as you finish each task.`}
    >
      <ul className="space-y-3 max-w-2xl">
        {(data.items || []).map((item, idx) => (
          <li
            key={idx}
            className="flex items-start gap-4 rounded-xl border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800/50 shadow-sm"
          >
            <input
              type="checkbox"
              className="mt-1.5 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              checked={!!item.done}
              onChange={(e) => toggle(idx, e.target.checked)}
              aria-label={item.title}
            />
            <div className="flex-1 min-w-0">
              <div className={`font-medium ${item.done ? 'line-through text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                {item.title}
              </div>
              {item.description && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{item.description}</p>}
            </div>
          </li>
        ))}
      </ul>
    </PortalPageShell>
  );
}
