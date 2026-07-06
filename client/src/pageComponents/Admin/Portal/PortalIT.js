'use client';

import React, { useEffect, useState } from 'react';
import { FaSpinner, FaLaptop, FaTicketAlt } from 'react-icons/fa';
import { adminApiGet, adminApiPost, adminApiPatch } from '../../../utils/adminApi';
import { useAuth } from '../../../contexts/AuthContext';
import PortalPageShell from './PortalPageShell';

export default function PortalIT() {
  const { canAccessHRModule, isSuperAdmin } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [assets, setAssets] = useState([]);
  const [licenses, setLicenses] = useState([]);
  const [tab, setTab] = useState('tickets');
  const [loading, setLoading] = useState(true);
  const [ticketForm, setTicketForm] = useState({
    title: '',
    description: '',
    category: 'other',
    priority: 'medium'
  });

  const load = async () => {
    setLoading(true);
    const [t, a, l] = await Promise.all([
      adminApiGet('/api/portal/it/tickets'),
      adminApiGet('/api/portal/it/assets'),
      adminApiGet('/api/portal/it/licenses')
    ]);
    if (t.success && t.data?.success) setTickets(t.data.data || []);
    if (a.success && a.data?.success) setAssets(a.data.data || []);
    if (l.success && l.data?.success) setLicenses(l.data.data || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const submitTicket = async (e) => {
    e.preventDefault();
    const res = await adminApiPost('/api/portal/it/tickets', ticketForm);
    if (res.success && res.data?.success) {
      setTicketForm({ title: '', description: '', category: 'other', priority: 'medium' });
      load();
    } else {
      alert(res.error?.message || 'Could not create ticket');
    }
  };

  const patchTicket = async (id, status) => {
    await adminApiPatch(`/api/portal/it/tickets/${id}`, { status });
    load();
  };

  const canManage = canAccessHRModule() || isSuperAdmin();

  return (
    <PortalPageShell
      title="IT & support"
      description="Log hardware/software issues and view assets assigned to you. IT or HR can update ticket status."
    >
      <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-700 pb-1">
        {[
          { id: 'tickets', label: 'Tickets' },
          { id: 'assets', label: 'Assets' },
          { id: 'licenses', label: 'Licenses' }
        ].map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`px-4 py-2 rounded-t-lg text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === id
                ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'tickets' && (
        <div className="space-y-8 pt-4">
          <form
            onSubmit={submitTicket}
            className="max-w-lg space-y-4 rounded-xl border border-gray-200 dark:border-gray-700 p-6 bg-white dark:bg-gray-800 shadow-sm"
          >
            <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <FaTicketAlt className="text-primary-500" /> New ticket
            </h2>
            <input
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 p-2.5 bg-white dark:bg-gray-900"
              placeholder="Short title"
              value={ticketForm.title}
              onChange={(e) => setTicketForm({ ...ticketForm, title: e.target.value })}
              required
            />
            <textarea
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 p-2.5 bg-white dark:bg-gray-900 min-h-[88px]"
              placeholder="What happened?"
              value={ticketForm.description}
              onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-3">
              <select
                className="rounded-lg border border-gray-300 dark:border-gray-600 p-2.5 bg-white dark:bg-gray-900"
                value={ticketForm.category}
                onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
              >
                <option value="hardware">Hardware</option>
                <option value="software">Software</option>
                <option value="access">Access</option>
                <option value="network">Network</option>
                <option value="other">Other</option>
              </select>
              <select
                className="rounded-lg border border-gray-300 dark:border-gray-600 p-2.5 bg-white dark:bg-gray-900"
                value={ticketForm.priority}
                onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <button type="submit" className="bg-primary-600 text-white px-5 py-2.5 rounded-lg font-medium">
              Submit ticket
            </button>
          </form>

          {loading ? (
            <FaSpinner className="animate-spin text-primary-500 text-xl" />
          ) : tickets.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm py-6">No tickets yet.</p>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800/90">
                  <tr>
                    <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-300">Title</th>
                    <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-300">Status</th>
                    <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-300">Priority</th>
                    {canManage && <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-300">Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((x) => (
                    <tr key={x._id} className="border-t border-gray-100 dark:border-gray-700">
                      <td className="p-3 text-gray-900 dark:text-white">{x.title}</td>
                      <td className="p-3 capitalize text-gray-700 dark:text-gray-300">{x.status?.replace('_', ' ')}</td>
                      <td className="p-3 text-gray-700 dark:text-gray-300">{x.priority}</td>
                      {canManage && (
                        <td className="p-3 space-x-2">
                          {x.status === 'open' && (
                            <button
                              type="button"
                              className="text-xs text-primary-600 dark:text-primary-400 font-medium"
                              onClick={() => patchTicket(x._id, 'in_progress')}
                            >
                              Start
                            </button>
                          )}
                          {x.status !== 'resolved' && x.status !== 'closed' && (
                            <button
                              type="button"
                              className="text-xs text-green-600 dark:text-green-400 font-medium"
                              onClick={() => patchTicket(x._id, 'resolved')}
                            >
                              Resolve
                            </button>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {tab === 'assets' && (
        <div className="pt-4">
          {loading ? (
            <FaSpinner className="animate-spin text-primary-500" />
          ) : assets.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-600 p-12 text-center text-gray-500">
              <FaLaptop className="mx-auto text-4xl mb-3 opacity-40" />
              <p>No assets assigned or registered.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800/90">
                  <tr>
                    <th className="text-left p-3 font-semibold">Name</th>
                    <th className="text-left p-3 font-semibold">Type</th>
                    <th className="text-left p-3 font-semibold">Serial</th>
                    <th className="text-left p-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {assets.map((a) => (
                    <tr key={a._id} className="border-t border-gray-100 dark:border-gray-700">
                      <td className="p-3">{a.name}</td>
                      <td className="p-3 capitalize">{a.assetType}</td>
                      <td className="p-3 font-mono text-xs">{a.serialNumber || '—'}</td>
                      <td className="p-3 capitalize">{a.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {tab === 'licenses' && (
        <div className="pt-4">
          {loading ? (
            <FaSpinner className="animate-spin text-primary-500" />
          ) : licenses.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-600 p-12 text-center text-gray-500">
              <p>No software licenses on file.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800/90">
                  <tr>
                    <th className="text-left p-3 font-semibold">Software</th>
                    <th className="text-left p-3 font-semibold">Vendor</th>
                    <th className="text-left p-3 font-semibold">Seats</th>
                    <th className="text-left p-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {licenses.map((a) => (
                    <tr key={a._id} className="border-t border-gray-100 dark:border-gray-700">
                      <td className="p-3">{a.name}</td>
                      <td className="p-3">{a.vendor || '—'}</td>
                      <td className="p-3">{a.totalSeats}</td>
                      <td className="p-3 capitalize">{a.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </PortalPageShell>
  );
}
