'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  HiOutlinePencilSquare,
  HiOutlineShieldCheck,
  HiOutlineBolt,
  HiOutlineDevicePhoneMobile,
  HiOutlineCloudArrowUp,
  HiOutlineUsers,
  HiOutlineLockClosed,
  HiOutlineDocumentCheck,
  HiOutlineCheckCircle,
  HiOutlineArrowRight,
  HiOutlineArrowUpRight,
  HiOutlineEnvelope,
  HiOutlineBuildingOffice,
  HiOutlineScale,
  HiOutlineHeart,
  HiOutlineBanknotes,
  HiOutlineAcademicCap,
} from 'react-icons/hi2';

const features = [
  {
    Icon: HiOutlineShieldCheck,
    title: 'Legally Binding',
    description:
      'Compliant with eIDAS, ESIGN Act, UETA, and equivalent legislation across Africa, Europe, and Asia. Every signature is court-admissible.',
  },
  {
    Icon: HiOutlineBolt,
    title: 'Sign in Seconds',
    description:
      'No downloads or accounts required for signers. Recipients open a secure link in any browser and sign in a single step.',
  },
  {
    Icon: HiOutlineLockClosed,
    title: 'Tamper-Proof Audit Trail',
    description:
      'Every action — viewed, signed, declined — is timestamped and cryptographically sealed into an immutable certificate.',
  },
  {
    Icon: HiOutlineCloudArrowUp,
    title: 'Smart Templates',
    description:
      'Build reusable templates for NDAs, contracts, and intake forms. Auto-fill fields from your CRM, HR system, or via API.',
  },
  {
    Icon: HiOutlineDevicePhoneMobile,
    title: 'Mobile-First',
    description:
      'A native-quality experience on every screen. Signers can draw, type, or upload their signature on any device.',
  },
  {
    Icon: HiOutlineUsers,
    title: 'Team Workflows',
    description:
      'Set signing order, add approvers, and configure conditional routing. Track every document in a unified team dashboard.',
  },
];

const steps = [
  {
    number: '01',
    title: 'Upload your document',
    description:
      'Drag and drop a PDF or Word file, or start from a ready-made template.',
  },
  {
    number: '02',
    title: 'Add signers & fields',
    description:
      'Place signature, date, and text fields. Assign each to a specific recipient.',
  },
  {
    number: '03',
    title: 'Send & track',
    description:
      'Recipients receive a secure link by email. You see real-time status for every document.',
  },
  {
    number: '04',
    title: 'Sealed & stored',
    description:
      'Completed documents are cryptographically sealed and stored securely in the cloud.',
  },
];

const useCases = [
  { Icon: HiOutlineScale, label: 'Legal & Compliance', description: 'Contracts, NDAs, retainer agreements' },
  { Icon: HiOutlineBanknotes, label: 'Financial Services', description: 'Loan documents, KYC forms, agreements' },
  { Icon: HiOutlineHeart, label: 'Healthcare', description: 'Consent forms, patient intake, referrals' },
  { Icon: HiOutlineBuildingOffice, label: 'Real Estate', description: 'Offer letters, leases, listings' },
  { Icon: HiOutlineAcademicCap, label: 'Education', description: 'Enrollment forms, permission slips' },
  { Icon: HiOutlineUsers, label: 'HR & People Ops', description: 'Offer letters, onboarding, policies' },
];

const faqs = [
  {
    q: 'Are Skyfalke Sign signatures legally valid?',
    a: 'Yes. Skyfalke Sign produces electronic signatures compliant with eIDAS (EU), ESIGN Act (USA), UETA, and equivalent legislation in most African and Asian jurisdictions. Each signed document includes a tamper-evident certificate.',
  },
  {
    q: 'Does the signer need a Skyfalke Sign account?',
    a: 'No. Signers receive a secure link by email and can sign directly in their browser — no download or account required.',
  },
  {
    q: 'How is my data protected?',
    a: 'All documents are encrypted in transit (TLS 1.3) and at rest (AES-256). Infrastructure is hosted on SOC 2 Type II certified servers with daily backups.',
  },
  {
    q: 'Can I integrate Skyfalke Sign with my existing tools?',
    a: 'Yes. A REST API and pre-built integrations connect to Google Workspace, Microsoft 365, Salesforce, HubSpot, and more.',
  },
  {
    q: 'What happens if a signer declines?',
    a: 'You receive an instant notification and can void the document, edit it, or send a revised version. The decline is recorded in the audit trail.',
  },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-200/90 last:border-b-0">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-4 py-5 text-left text-sm font-semibold text-slate-900 transition-colors hover:text-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span>{q}</span>
        <HiOutlineArrowRight
          className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${open ? 'rotate-90 text-primary-600' : ''}`}
          aria-hidden
        />
      </button>
      {open && (
        <p className="pb-5 text-sm leading-relaxed text-slate-600">{a}</p>
      )}
    </div>
  );
}

export default function SkyfalkeSignLanding() {
  return (
    <div className="bg-white text-slate-900">

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#303661] pb-24 pt-36 text-white">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            background:
              'radial-gradient(ellipse 70% 50% at 60% 0%, rgba(224,174,0,0.12) 0%, transparent 65%)',
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#e0ae00]/80">
              Skyfalke Sign — Electronic Signatures
            </p>
            <h1 className="mt-5 font-nexa-heavy text-4xl leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.4rem]">
              Sign anything.{' '}
              <span className="text-[#e0ae00]">From anywhere.</span>
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-white/75 sm:text-lg">
              Legally binding electronic signatures built for African and global
              enterprises. Send, sign, and close documents in minutes — not days.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href="https://skyfalkesign.com/auth/register"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#e0ae00] px-7 py-3.5 text-sm font-semibold text-[#303661] transition-colors hover:bg-[#c99a00]"
              >
                Get started free
                <HiOutlineArrowRight className="h-4 w-4" aria-hidden />
              </a>
              <a
                href="https://skyfalkesign.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-white/20 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:border-white/40 hover:bg-white/5"
              >
                Visit skyfalkesign.com
                <HiOutlineArrowUpRight className="h-4 w-4" aria-hidden />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMPLIANCE BAR ───────────────────────────────────────── */}
      <section className="border-b border-slate-200/90 bg-[#F4F6FA]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-start gap-x-8 gap-y-4 py-5">
            {[
              'eIDAS Compliant',
              'ESIGN Act',
              'UETA',
              'SOC 2 Type II',
              'GDPR Ready',
              'AES-256 Encryption',
              '180+ Countries',
            ].map((label) => (
              <span
                key={label}
                className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500"
              >
                <HiOutlineShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── INTRO ────────────────────────────────────────────────── */}
      <section className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-20 lg:px-8">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary-600">
            What is Skyfalke Sign
          </p>
          <h2 className="mt-4 font-nexa-heavy text-3xl tracking-tight text-[#303661] sm:text-[2.15rem]">
            A purpose-built platform for secure, paperless agreements
          </h2>
          <p className="mt-5 text-base leading-relaxed text-slate-600">
            Skyfalke Sign is a product of Skyfalke Limited, designed for organisations that
            need a reliable, compliant way to collect signatures at scale. Whether you are
            closing a sales contract, onboarding a new hire, or collecting patient consent,
            Skyfalke Sign eliminates paper, couriers, and delays.
          </p>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            Every document sent through Skyfalke Sign carries a cryptographic audit trail
            that records who signed, when, and from where — creating an unbroken chain of
            evidence that stands up in any jurisdiction.
          </p>
          <Link
            href="/contact?product=skyfalke-sign"
            className="mt-8 inline-flex items-center gap-2 border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-900 transition-colors hover:border-slate-400 hover:bg-slate-50"
          >
            Talk to our team
            <HiOutlineArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { value: '180+', label: 'Countries supported' },
            { value: '<60s', label: 'Average signing time' },
            { value: '100%', label: 'Paperless workflow' },
            { value: '24/7', label: 'Cloud availability' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="border border-slate-200/90 bg-[#F4F6FA] p-8"
            >
              <p className="font-nexa-heavy text-3xl tracking-tight text-[#303661]">
                {stat.value}
              </p>
              <p className="mt-2 text-sm text-slate-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────── */}
      <section className="border-t border-slate-200/90 bg-[#F4F6FA] py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14 max-w-xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
              Features
            </p>
            <h2 className="mt-4 font-nexa-heavy text-3xl tracking-tight text-[#303661] sm:text-[2.15rem]">
              Everything you need to close faster
            </h2>
          </div>
          <div className="grid gap-px border border-slate-200/90 bg-slate-200/90 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => {
              const Icon = f.Icon;
              return (
                <div key={f.title} className="group bg-white p-8 transition-colors hover:bg-[#F4F6FA]">
                  <span className="inline-flex h-10 w-10 items-center justify-center border border-slate-200/90 bg-slate-50 text-slate-500 transition-colors group-hover:border-primary-200 group-hover:text-primary-700">
                    <Icon className="h-5 w-5" strokeWidth={1.5} />
                  </span>
                  <h3 className="mt-5 text-[14px] font-semibold tracking-tight text-slate-900">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">{f.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────── */}
      <section className="border-t border-slate-200/90 bg-[#303661] py-20 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#e0ae00]/80">
              How it works
            </p>
            <h2 className="mt-4 font-nexa-heavy text-3xl tracking-tight sm:text-[2.15rem]">
              From document to signed in four steps
            </h2>
          </div>
          <div className="grid gap-0 lg:grid-cols-4 lg:divide-x lg:divide-white/10">
            {steps.map((step) => (
              <div key={step.number} className="border-t border-white/10 px-0 py-8 lg:border-t-0 lg:px-8 lg:py-0 lg:first:pl-0 lg:last:pr-0">
                <p className="font-nexa-heavy text-4xl text-[#e0ae00]/25">{step.number}</p>
                <h3 className="mt-5 text-[14px] font-semibold tracking-tight text-white">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/55">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── USE CASES ────────────────────────────────────────────── */}
      <section className="border-t border-slate-200/90 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14 max-w-xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
              Use cases
            </p>
            <h2 className="mt-4 font-nexa-heavy text-3xl tracking-tight text-[#303661] sm:text-[2.15rem]">
              Built for every sector
            </h2>
          </div>
          <div className="grid gap-px border border-slate-200/90 bg-slate-200/90 sm:grid-cols-2 lg:grid-cols-3">
            {useCases.map((u) => {
              const Icon = u.Icon;
              return (
                <div key={u.label} className="flex items-start gap-4 bg-white p-7 transition-colors hover:bg-[#F4F6FA]">
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center border border-slate-200/90 bg-slate-50 text-slate-500">
                    <Icon className="h-4 w-4" strokeWidth={1.5} />
                  </span>
                  <div>
                    <p className="text-[13px] font-semibold text-slate-900">{u.label}</p>
                    <p className="mt-1 text-xs leading-relaxed text-slate-500">{u.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── PILLARS STRIP ────────────────────────────────────────── */}
      <section className="border-t border-slate-200/90 bg-[#F4F6FA] py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { Icon: HiOutlineDocumentCheck, label: 'Compliant by design', sub: 'Meets international e-signature standards' },
              { Icon: HiOutlineLockClosed, label: 'Enterprise security', sub: 'AES-256, TLS 1.3, SOC 2 Type II' },
              { Icon: HiOutlineCloudArrowUp, label: 'Always available', sub: '99.9% uptime SLA, global CDN' },
              { Icon: HiOutlineUsers, label: 'Team-ready', sub: 'Roles, approvals, and bulk send built in' },
            ].map((item) => {
              const Icon = item.Icon;
              return (
                <div key={item.label} className="border-l-2 border-primary-500/80 pl-5">
                  <Icon className="h-5 w-5 text-primary-600" strokeWidth={1.5} />
                  <p className="mt-3 text-[13px] font-semibold text-slate-900">{item.label}</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">{item.sub}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────── */}
      <section className="border-t border-slate-200/90 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-[1fr_1.6fr]">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                FAQ
              </p>
              <h2 className="mt-4 font-nexa-heavy text-3xl tracking-tight text-[#303661]">
                Common questions
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-500">
                Need something more specific?{' '}
                <Link href="/contact?product=skyfalke-sign" className="text-primary-700 underline hover:text-primary-900">
                  Contact our team
                </Link>{' '}
                or visit{' '}
                <a href="https://skyfalkesign.com" target="_blank" rel="noopener noreferrer" className="text-primary-700 underline hover:text-primary-900">
                  skyfalkesign.com
                </a>
                .
              </p>
            </div>
            <div className="divide-y divide-slate-200/90">
              {faqs.map((faq) => (
                <FAQItem key={faq.q} q={faq.q} a={faq.a} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="bg-[#303661] py-16 text-white lg:py-20">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <h2 className="font-nexa-heavy text-2xl tracking-tight sm:text-3xl">
              Ready to go paperless?
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/60">
              Start for free on{' '}
              <a
                href="https://skyfalkesign.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#e0ae00] underline-offset-2 hover:underline"
              >
                skyfalkesign.com
              </a>{' '}
              or speak with our team about an enterprise rollout.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://skyfalkesign.com/auth/register"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#e0ae00] px-6 py-3 text-sm font-semibold text-[#303661] transition-colors hover:bg-[#c99a00]"
            >
              Get started free
              <HiOutlineArrowRight className="h-4 w-4" aria-hidden />
            </a>
            <Link
              href="/contact?product=skyfalke-sign"
              className="inline-flex items-center gap-2 border border-white/25 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              <HiOutlineEnvelope className="h-4 w-4" aria-hidden />
              Talk to sales
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
