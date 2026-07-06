'use client';

import React, { useState, useEffect, useCallback } from 'react';
import api from '../../utils/api';

const POLL_INTERVAL_MS = 10000;
const REQUEST_TIMEOUT_MS = 8000;

function formatUptime(seconds) {
  if (seconds == null || Number.isNaN(seconds)) return null;
  const s = Math.floor(seconds);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

/**
 * Polls GET /api/health and shows live API/server reachability in the admin navbar.
 */
const ServerStatusIndicator = () => {
  const [status, setStatus] = useState('checking');
  const [latencyMs, setLatencyMs] = useState(null);
  const [meta, setMeta] = useState(null);

  const ping = useCallback(async () => {
    const started = typeof performance !== 'undefined' ? performance.now() : Date.now();
    try {
      const { data } = await api.get('/api/health', { timeout: REQUEST_TIMEOUT_MS });
      const end = typeof performance !== 'undefined' ? performance.now() : Date.now();
      setLatencyMs(Math.round(end - started));
      setStatus('online');
      setMeta({
        uptime: data.uptime,
        version: data.version,
        environment: data.environment,
        timestamp: data.timestamp,
      });
    } catch {
      setStatus('offline');
      setLatencyMs(null);
      setMeta(null);
    }
  }, []);

  useEffect(() => {
    ping();
    const id = setInterval(ping, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [ping]);

  const dotClass =
    status === 'online'
      ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]'
      : status === 'offline'
        ? 'bg-red-500'
        : 'bg-amber-400 animate-pulse';

  const label =
    status === 'online'
      ? 'Server online'
      : status === 'offline'
        ? 'Server offline'
        : 'Checking…';

  const uptimeStr = meta?.uptime != null ? formatUptime(meta.uptime) : null;
  const tooltip = [
    status === 'online' ? 'Backend API is reachable.' : 'Cannot reach backend API.',
    latencyMs != null ? `Latency: ${latencyMs} ms` : null,
    uptimeStr ? `Uptime: ${uptimeStr}` : null,
    meta?.version ? `Version: ${meta.version}` : null,
    meta?.environment ? `Env: ${meta.environment}` : null,
  ]
    .filter(Boolean)
    .join('\n');

  return (
    <div
      className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-gray-50 dark:bg-gray-700/60 border border-gray-200/80 dark:border-gray-600/80"
      title={tooltip}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <span className="relative flex h-2 w-2 shrink-0">
        <span
          className={`h-2 w-2 rounded-full ${dotClass}`}
          aria-hidden
        />
      </span>
      <span className="hidden sm:inline text-xs font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">
        {label}
        {status === 'online' && latencyMs != null && (
          <span className="text-gray-500 dark:text-gray-400 font-normal"> · {latencyMs}ms</span>
        )}
      </span>
    </div>
  );
};

export default ServerStatusIndicator;
