'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  HiOutlineShieldCheck,
  HiOutlineBolt,
  HiOutlineChatBubbleLeftRight,
  HiOutlinePhone,
  HiOutlineCloudArrowUp,
  HiOutlineUsers,
  HiOutlineLockClosed,
  HiOutlineArrowsRightLeft,
  HiOutlineCheckCircle,
  HiOutlineArrowRight,
  HiOutlineArrowUpRight,
  HiOutlineEnvelope,
  HiOutlineBuildingOffice,
  HiOutlineScale,
  HiOutlineHeart,
  HiOutlineBanknotes,
  HiOutlineShoppingBag,
  HiOutlineServerStack,
} from 'react-icons/hi2';
import { FaWhatsapp, FaInstagram, FaFacebook, FaTiktok } from 'react-icons/fa';

const features = [
  {
    Icon: HiOutlineChatBubbleLeftRight,
    title: 'Omnichannel Messaging',
    description:
      'WhatsApp, Instagram, Facebook, TikTok, email, and live chat — all routed through a single API and a single dashboard. No more juggling providers.',
  },
  {
    Icon: HiOutlinePhone,
    title: 'Contact Center Voice',
    description:
      'A full cloud contact center with call routing, IVR, and agent queues — handled with the same tools as your messaging channels.',
  },
  {
    Icon: HiOutlineArrowsRightLeft,
    title: 'Two-Way Conversations',
    description:
      'Receive replies, run chatbots, and manage support threads in one inbox — across every social and messaging channel your customers use.',
  },
  {
    Icon: HiOutlineServerStack,
    title: 'Developer-First API',
    description:
      'REST and webhook APIs, SDKs for major languages, and sandbox testing so your team ships integrations in days, not months.',
  },
  {
    Icon: HiOutlineLockClosed,
    title: 'Secure by Default',
    description:
      'End-to-end encryption in transit, granular API keys, and full conversation audit logs across every channel.',
  },
  {
    Icon: HiOutlineUsers,
    title: 'Built for Teams',
    description:
      'Shared inboxes, agent queues, role-based access, and campaign approvals so marketing, support, and ops stay in sync.',
  },
];

const channels = [
  { Icon: FaWhatsapp, label: 'WhatsApp' },
  { Icon: FaInstagram, label: 'Instagram' },
  { Icon: FaFacebook, label: 'Facebook' },
  { Icon: FaTiktok, label: 'TikTok' },
  { Icon: HiOutlinePhone, label: 'Voice' },
  { Icon: HiOutlineEnvelope, label: 'Email' },
  { Icon: HiOutlineChatBubbleLeftRight, label: 'Live Chat' },
];

const steps = [
  {
    number: '01',
    title: 'Connect your channels',
    description:
      'Link WhatsApp, Instagram, Facebook, TikTok, email, live chat, and your contact center numbers to a single Skyfalke Connect workspace.',
  },
  {
    number: '02',
    title: 'Integrate the API',
    description:
      'Send and receive messages through one unified API, or use our no-code dashboard to get started instantly.',
  },
  {
    number: '03',
    title: 'Automate & route',
    description:
      'Set up flows, chatbots, and smart routing rules so the right conversation reaches the right agent or channel every time.',
  },
  {
    number: '04',
    title: 'Track everything',
    description:
      'Monitor conversations, agent performance, and channel engagement in real time from a single analytics dashboard.',
  },
];

const useCases = [
  { Icon: HiOutlineShoppingBag, label: 'E-commerce', description: 'Order updates via WhatsApp, Instagram DMs, cart reminders' },
  { Icon: HiOutlineBanknotes, label: 'Financial Services', description: 'Secure alerts, verification, and support across channels' },
  { Icon: HiOutlineHeart, label: 'Healthcare', description: 'Appointment reminders, patient follow-ups, live chat support' },
  { Icon: HiOutlineBuildingOffice, label: 'Enterprise Ops', description: 'Internal alerts, workforce notifications' },
  { Icon: HiOutlineScale, label: 'Public Sector', description: 'Citizen notifications, service alerts, contact center support' },
  { Icon: HiOutlineUsers, label: 'Customer Support', description: 'Unified inbox and voice queues across every channel' },
];

const faqs = [
  {
    q: 'What channels does Skyfalke Connect support?',
    a: 'WhatsApp, Instagram, Facebook, TikTok, voice (contact center), email, and live chat — all through one API and one dashboard, with more channels added regularly.',
  },
  {
    q: 'Do I need separate accounts for each channel?',
    a: 'No. Skyfalke Connect unifies every social, messaging, and voice channel under a single workspace, API key, and billing account, so your team manages one integration instead of many.',
  },
  {
    q: 'Can I automate replies and conversations?',
    a: 'Yes. Build chatbot flows and automated responses that work across WhatsApp, Instagram, Facebook, TikTok, and live chat, with seamless handoff to a human agent when needed.',
  },
  {
    q: 'Does Skyfalke Connect include a contact center?',
    a: 'Yes. Voice is a first-class channel with call routing, IVR, and agent queues, managed alongside every other channel in the same dashboard.',
  },
  {
    q: 'Is there a developer API?',
    a: 'Yes. A REST API, webhooks, and SDKs for major languages let your engineering team integrate Skyfalke Connect into any product or workflow.',
  },
  {
    q: 'How is delivery reliability handled?',
    a: 'Skyfalke Connect routes messages and calls through redundant infrastructure with automatic failover, keeping delivery and uptime high even during peak traffic.',
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

export default function SkyfalkeConnectLanding() {
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
              Skyfalke Connect — Omnichannel Customer Engagement
            </p>
            <h1 className="mt-5 font-nexa-heavy text-4xl leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.4rem]">
              Every channel.{' '}
              <span className="text-[#e0ae00]">One connection.</span>
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-white/75 sm:text-lg">
              WhatsApp, Instagram, Facebook, TikTok, voice contact center, email, and
              live chat — unified under a single platform. Reach every customer, on
              every channel, from one place.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href="https://skyfalkeconnect.io/register"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#e0ae00] px-7 py-3.5 text-sm font-semibold text-[#303661] transition-colors hover:bg-[#c99a00]"
              >
                Get started free
                <HiOutlineArrowRight className="h-4 w-4" aria-hidden />
              </a>
              <a
                href="https://skyfalkeconnect.io"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-white/20 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:border-white/40 hover:bg-white/5"
              >
                Visit skyfalkeconnect.io
                <HiOutlineArrowUpRight className="h-4 w-4" aria-hidden />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── CHANNELS BAR ─────────────────────────────────────────── */}
      <section className="border-b border-slate-200/90 bg-[#F4F6FA]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-start gap-x-8 gap-y-4 py-5">
            {channels.map(({ Icon, label }) => (
              <span
                key={label}
                className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500"
              >
                <Icon className="h-3.5 w-3.5 text-emerald-500" />
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
            What is Skyfalke Connect
          </p>
          <h2 className="mt-4 font-nexa-heavy text-3xl tracking-tight text-[#303661] sm:text-[2.15rem]">
            A single platform for every customer conversation
          </h2>
          <p className="mt-5 text-base leading-relaxed text-slate-600">
            Skyfalke Connect is a product of Skyfalke Limited, built for organisations
            that need to engage customers reliably across WhatsApp, Instagram, Facebook,
            TikTok, voice, email, and live chat — without stitching together separate
            tools for each channel.
          </p>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            One platform, one inbox, one contact center. Route every conversation to
            the right channel or agent, automate replies with chatbots, and hand off
            to a human the moment it matters.
          </p>
          <Link
            href="/contact?product=skyfalke-connect"
            className="mt-8 inline-flex items-center gap-2 border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-900 transition-colors hover:border-slate-400 hover:bg-slate-50"
          >
            Talk to our team
            <HiOutlineArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { value: '7', label: 'Channels unified' },
            { value: '99.9%', label: 'Platform uptime' },
            { value: '1', label: 'Inbox for everything' },
            { value: '24/7', label: 'Contact center availability' },
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
              Everything you need to reach every customer
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
              From integration to conversation in four steps
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
              { Icon: HiOutlineCheckCircle, label: 'High deliverability', sub: 'Smart routing across every channel with automatic failover' },
              { Icon: HiOutlineLockClosed, label: 'Enterprise security', sub: 'Encrypted transport, scoped API keys, full audit logs' },
              { Icon: HiOutlineCloudArrowUp, label: 'Always available', sub: '99.9% uptime SLA, global infrastructure' },
              { Icon: HiOutlineUsers, label: 'Team-ready', sub: 'Shared inboxes, roles, and campaign approvals' },
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
                <Link href="/contact?product=skyfalke-connect" className="text-primary-700 underline hover:text-primary-900">
                  Contact our team
                </Link>{' '}
                or visit{' '}
                <a href="https://skyfalkeconnect.io" target="_blank" rel="noopener noreferrer" className="text-primary-700 underline hover:text-primary-900">
                  skyfalkeconnect.io
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
              Ready to unify your channels?
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/60">
              Start for free on{' '}
              <a
                href="https://skyfalkeconnect.io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#e0ae00] underline-offset-2 hover:underline"
              >
                skyfalkeconnect.io
              </a>{' '}
              or speak with our team about an enterprise rollout.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://skyfalkeconnect.io/register"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#e0ae00] px-6 py-3 text-sm font-semibold text-[#303661] transition-colors hover:bg-[#c99a00]"
            >
              Get started free
              <HiOutlineArrowRight className="h-4 w-4" aria-hidden />
            </a>
            <Link
              href="/contact?product=skyfalke-connect"
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
