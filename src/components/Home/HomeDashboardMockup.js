'use client';

import React from 'react';
import { motion } from 'framer-motion';

/**
 * Lightweight SVG dashboard illustration — no raster fetch, supports crisp scaling.
 */
export default function HomeDashboardMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full max-w-lg mx-auto"
    >
      <div
        className="rounded-sm border border-gray-200 bg-white shadow-[0_24px_48px_-12px_rgba(48,54,97,0.12)] overflow-hidden"
        role="img"
        aria-label="Stylized analytics dashboard showing revenue trend, traffic metrics, and site health indicators for business growth storytelling."
      >
        <svg
          viewBox="0 0 440 320"
          className="w-full h-auto block text-[#303661]"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <rect width="440" height="48" fill="#303661" />
          <text x="20" y="30" fill="#fff" fontSize="14" fontFamily="system-ui, sans-serif" fontWeight="600">
            Growth overview
          </text>
          <rect x="360" y="16" width="60" height="18" rx="2" fill="#e0ae00" opacity="0.95" />

          <rect x="16" y="64" width="120" height="56" rx="4" fill="#f7f8fb" stroke="#e2e8f0" />
          <text x="28" y="88" fill="#64748b" fontSize="10" fontFamily="system-ui">Revenue</text>
          <text x="28" y="108" fill="#303661" fontSize="16" fontFamily="system-ui" fontWeight="700">
            +24%
          </text>

          <rect x="148" y="64" width="120" height="56" rx="4" fill="#f7f8fb" stroke="#e2e8f0" />
          <text x="160" y="88" fill="#64748b" fontSize="10" fontFamily="system-ui">Leads</text>
          <text x="160" y="108" fill="#303661" fontSize="16" fontFamily="system-ui" fontWeight="700">
            1.4k
          </text>

          <rect x="280" y="64" width="144" height="56" rx="4" fill="#f7f8fb" stroke="#e2e8f0" />
          <text x="292" y="88" fill="#64748b" fontSize="10" fontFamily="system-ui">Conversion</text>
          <text x="292" y="108" fill="#303661" fontSize="16" fontFamily="system-ui" fontWeight="700">
            3.8%
          </text>

          <rect x="16" y="132" width="260" height="168" rx="4" fill="#fff" stroke="#e2e8f0" />
          <text x="28" y="156" fill="#303661" fontSize="12" fontFamily="system-ui" fontWeight="600">
            Performance
          </text>
          <polyline
            fill="none"
            stroke="#303661"
            strokeWidth="2"
            points="36,248 80,220 124,232 168,196 212,208 256,172"
          />
          <polyline
            fill="none"
            stroke="#e0ae00"
            strokeWidth="2"
            opacity="0.9"
            points="36,260 92,244 148,252 204,228 260,236"
          />

          <rect x="288" y="132" width="136" height="76" rx="4" fill="#fafbfc" stroke="#e2e8f0" />
          <text x="300" y="156" fill="#303661" fontSize="11" fontFamily="system-ui" fontWeight="600">
            Site health
          </text>
          <rect x="300" y="168" width="112" height="8" rx="2" fill="#e2e8f0" />
          <rect x="300" y="168" width="84" height="8" rx="2" fill="#e0ae00" />

          <rect x="288" y="216" width="136" height="84" rx="4" fill="#fafbfc" stroke="#e2e8f0" />
          <text x="300" y="240" fill="#303661" fontSize="11" fontFamily="system-ui" fontWeight="600">
            Channels
          </text>
          <rect x="300" y="252" width="36" height="36" rx="2" fill="#303661" opacity="0.12" />
          <rect x="342" y="260" width="28" height="28" rx="2" fill="#303661" opacity="0.2" />
          <rect x="376" y="268" width="20" height="20" rx="2" fill="#e0ae00" opacity="0.85" />
        </svg>
      </div>
    </motion.div>
  );
}
