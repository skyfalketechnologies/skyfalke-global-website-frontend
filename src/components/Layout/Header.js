'use client';

import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HiBars3,
  HiChevronDown,
  HiOutlineAcademicCap,
  HiOutlineArrowRight,
  HiOutlineBanknotes,
  HiOutlineBuildingOffice,
  HiOutlineChevronRight,
  HiOutlineCircleStack,
  HiOutlineCloud,
  HiOutlineCube,
  HiOutlineDocumentChartBar,
  HiOutlineFilm,
  HiOutlineFlag,
  HiOutlineGlobeAmericas,
  HiOutlineHeart,
  HiOutlineMap,
  HiOutlinePhone,
  HiOutlinePresentationChartLine,
  HiOutlineScale,
  HiOutlineServerStack,
  HiOutlineShieldCheck,
  HiOutlineShoppingBag,
  HiOutlineSparkles,
  HiOutlineSquares2X2,
  HiOutlineSun,
  HiOutlineTruck,
  HiOutlineUsers,
  HiOutlineWrenchScrewdriver,
  HiXMark,
} from 'react-icons/hi2';
import { useStrategyCallModal } from '@/contexts/StrategyCallModalContext';

const TRANSITION = 'transition-all duration-200 ease-out';

const industries = [
  { name: 'Agriculture', href: '/industries/agriculture', description: 'Supply chains, agritech, and rural commerce.', Icon: HiOutlineSun },
  { name: 'Law & Justice', href: '/industries/law-justice', description: 'Legal operations, compliance, and secure systems.', Icon: HiOutlineScale },
  { name: 'Automobile', href: '/industries/automobile', description: 'Connected mobility and customer experience.', Icon: HiOutlineCube },
  { name: 'Education', href: '/industries/education', description: 'Digital learning at institutional scale.', Icon: HiOutlineAcademicCap },
  { name: 'Engineering & Construction', href: '/industries/engineering-construction', description: 'Delivery, safety, and capital efficiency.', Icon: HiOutlineWrenchScrewdriver },
  { name: 'Financial Services', href: '/industries/financial-services', description: 'Trust, risk, and omnichannel service.', Icon: HiOutlineBanknotes },
  { name: 'Health Care', href: '/industries/health-care', description: 'Clinical workflows and patient journeys.', Icon: HiOutlineHeart },
  { name: 'Logistics', href: '/industries/logistics', description: 'Network design, visibility, and resilience.', Icon: HiOutlineTruck },
  { name: 'Public Service', href: '/industries/public-service', description: 'Citizen services and secure infrastructure.', Icon: HiOutlineShieldCheck },
  { name: 'Retail', href: '/industries/retail', description: 'Omnichannel commerce and loyalty.', Icon: HiOutlineShoppingBag },
  { name: 'Real Estate', href: '/industries/real-estate', description: 'Portfolios, transactions, and experience.', Icon: HiOutlineBuildingOffice },
  { name: 'Media & Communications', href: '/industries/media-communications', description: 'Audience, content, and monetization.', Icon: HiOutlineFilm },
];

const INDUSTRY_COLUMN_LABELS = ['Primary sectors', 'Regulated & enterprise', 'Consumer & networks'];

const INDUSTRY_CHUNKS = [
  industries.slice(0, 4),
  industries.slice(4, 8),
  industries.slice(8, 12),
];

const capabilities = [
  { name: 'AI', href: '/capabilities/ai', description: 'Strategy, governance, and responsible adoption.', badge: 'New', Icon: HiOutlineSparkles },
  { name: 'Digital', href: '/capabilities/digital', description: 'Products, channels, and operating models.', Icon: HiOutlineSquares2X2 },
  { name: 'Data & Technology', href: '/capabilities/data-technology', description: 'Platforms, analytics, and engineering.', badge: 'Trending', Icon: HiOutlineCircleStack },
  { name: 'Marketing & Sales', href: '/capabilities/marketing-sales', description: 'Growth, revenue, and commercial excellence.', Icon: HiOutlinePresentationChartLine },
  { name: 'Managed Services', href: '/capabilities/managed-services', description: 'Run, secure, and continuously improve.', Icon: HiOutlineServerStack },
];

const CAPABILITY_COLUMN_LABELS = ['Strategy & platforms', 'Commercial & analytics', 'Managed operations'];

const CAPABILITY_CHUNKS = [capabilities.slice(0, 2), capabilities.slice(2, 4), capabilities.slice(4, 5)];

const howWeWork = [
  { name: 'Solutions', href: '/how-we-work/solutions', description: 'What we deliver across the stack.', Icon: HiOutlineSquares2X2 },
  { name: 'Case Studies', href: '/how-we-work/case-studies', description: 'Evidence of outcomes and impact.', Icon: HiOutlineDocumentChartBar },
  { name: 'From Idea to Impact', href: '/how-we-work/from-idea-to-impact', description: 'How engagements move end to end.', Icon: HiOutlineMap },
  { name: 'All How We Work', href: '/how-we-work', description: 'Explore the full delivery model.', Icon: HiOutlineArrowRight },
];

const aboutUs = [
  { name: 'Our Commitments', href: '/about-us/commitments', description: 'Principles that guide our work.', Icon: HiOutlineFlag },
  { name: 'Our Diverse Meritocracy', href: '/about-us/meritocracy', description: 'Talent, equity, and performance.', Icon: HiOutlineUsers },
  { name: 'Social Responsibility', href: '/about-us/social-responsibility', description: 'Communities and stakeholders.', Icon: HiOutlineGlobeAmericas },
  { name: 'Environmental Sustainability', href: '/about-us/environmental-sustainability', description: 'Climate and resource stewardship.', Icon: HiOutlineCloud },
  { name: 'All About Us', href: '/about-us', description: 'Explore our mission, culture, and values.', Icon: HiOutlineArrowRight },
];

function Badge({ children, tone = 'neutral', inverted = false }) {
  if (inverted) {
    return (
      <span className="ml-1.5 inline-flex items-center rounded-md bg-white/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-white ring-1 ring-white/25">
        {children}
      </span>
    );
  }
  const tones = {
    neutral: 'bg-slate-100 text-slate-700 ring-1 ring-slate-200/80',
    accent: 'bg-primary-50 text-primary-800 ring-1 ring-primary-200/80',
    trend: 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200/70',
  };
  return (
    <span
      className={`ml-1.5 inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] ${tones[tone] || tones.neutral}`}
    >
      {children}
    </span>
  );
}

const Header = () => {
  const pathname = usePathname();
  const { openModal } = useStrategyCallModal();
  const baseId = useId();

  const headerRef = useRef(null);
  const navShellRef = useRef(null);
  const leaveTimerRef = useRef(null);
  const menuButtonRef = useRef(null);

  const [isScrolled, setIsScrolled] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(72);
  const [activeDesktop, setActiveDesktop] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState(null);

  const clearLeaveTimer = useCallback(() => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
  }, []);

  const openDesktop = useCallback(
    (key) => {
      clearLeaveTimer();
      setActiveDesktop(key);
    },
    [clearLeaveTimer]
  );

  const scheduleCloseDesktop = useCallback(() => {
    clearLeaveTimer();
    leaveTimerRef.current = setTimeout(() => setActiveDesktop(null), 220);
  }, [clearLeaveTimer]);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const el = headerRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => setHeaderHeight(el.offsetHeight));
    ro.observe(el);
    setHeaderHeight(el.offsetHeight);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMobileSection(null);
    setActiveDesktop(null);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setActiveDesktop(null);
        setMobileOpen(false);
        setMobileSection(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (!activeDesktop) return undefined;
    const onPointer = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setActiveDesktop(null);
      }
    };
    document.addEventListener('pointerdown', onPointer);
    return () => document.removeEventListener('pointerdown', onPointer);
  }, [activeDesktop]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileOpen(false);
        setMobileSection(null);
      } else {
        setActiveDesktop(null);
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const isActiveHref = (href) => {
    if (!href || href.startsWith('#')) return false;
    const path = href.split('#')[0].split('?')[0];
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname?.startsWith(path)) return true;
    return false;
  };

  const megaPanel = (key, children) => {
    if (activeDesktop !== key) return null;
    return (
      <div
        id={`${baseId}-panel-${key}`}
        role="region"
        onMouseEnter={() => openDesktop(key)}
        onMouseLeave={scheduleCloseDesktop}
        className="header-mega-animate fixed inset-x-0 z-[60] border-t border-slate-200/90 bg-white shadow-[0_24px_64px_-20px_rgba(15,23,42,0.14)]"
        style={{ top: headerHeight }}
      >
        <div className="mx-auto w-full max-w-[1280px] px-4 py-11 sm:px-6 lg:px-8">{children}</div>
      </div>
    );
  };

  const simplePanel = (key, items) =>
    activeDesktop === key ? (
      <div
        id={`${baseId}-panel-${key}`}
        role="menu"
        className="absolute left-0 top-full z-[60] min-w-[19.5rem] max-w-[22rem] pt-2"
      >
        <div className="header-mega-animate border border-slate-200/90 bg-white py-1 shadow-[0_16px_48px_-12px_rgba(15,23,42,0.12)] ring-1 ring-slate-900/[0.03]">
          {items.map((item) => {
            const Icon = item.Icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                role="menuitem"
                className={`group flex items-start gap-3 px-3.5 py-3 ${TRANSITION} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 ${
                  isActiveHref(item.href)
                    ? 'bg-slate-50 text-primary-800'
                    : 'text-slate-800 hover:bg-slate-50/90'
                }`}
              >
                {Icon ? (
                  <span
                    className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center border border-slate-200/90 bg-slate-50/80 text-slate-500 ${TRANSITION} group-hover:border-slate-300 group-hover:text-primary-700`}
                    aria-hidden
                  >
                    <Icon className="h-4 w-4" strokeWidth={1.5} />
                  </span>
                ) : null}
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="text-[13px] font-semibold leading-snug tracking-tight text-slate-900 group-hover:text-primary-800">
                      {item.name}
                    </span>
                    <HiOutlineChevronRight
                      className={`h-4 w-4 shrink-0 text-slate-300 ${TRANSITION} group-hover:text-primary-600 group-hover:translate-x-0.5`}
                      aria-hidden
                    />
                  </span>
                  {item.description ? (
                    <span className="mt-0.5 block text-xs leading-relaxed text-slate-500">{item.description}</span>
                  ) : null}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    ) : null;

  const dropdownTriggerClass = (key) =>
    `group inline-flex items-center gap-1 rounded-md px-2.5 py-2 text-[13px] font-medium tracking-tight ${TRANSITION} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
      isScrolled ? 'focus-visible:outline-white' : 'focus-visible:outline-primary-600'
    } ${
      isScrolled
        ? activeDesktop === key
          ? 'text-white'
          : 'text-white hover:text-white'
        : activeDesktop === key
          ? 'text-primary-700'
          : 'text-slate-700 hover:text-primary-700'
    }`;

  const chevronNavClass = (open) =>
    `h-4 w-4 shrink-0 ${TRANSITION} ${isScrolled ? 'text-white' : 'text-slate-500'} ${open ? 'rotate-180' : ''}`;

  const toggleMobileSection = (id) => {
    setMobileSection((prev) => (prev === id ? null : id));
  };

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed left-0 right-0 top-0 z-50 border-b ${TRANSITION} ${
          isScrolled
            ? 'border-white/10 bg-[#303661] shadow-[0_8px_30px_-12px_rgba(0,0,0,0.25)] backdrop-blur-md'
            : 'border-transparent bg-[#F8FAFC] shadow-none'
        }`}
      >
        <nav
          ref={navShellRef}
          aria-label="Primary"
          className="mx-auto flex h-[4.25rem] w-full max-w-[1280px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 md:h-[4.5rem]"
        >
          <div className="flex min-w-0 shrink-0 items-center gap-5 lg:gap-8">
            <Link
              href="/"
              className="flex shrink-0 items-center gap-3 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
            >
              <img
                src="/images/logos/logo.svg"
                alt="Skyfalke"
                className={`h-8 w-auto md:h-9 ${isScrolled ? 'brightness-0 invert' : ''} ${TRANSITION}`}
                width={140}
                height={36}
                loading="eager"
              />
            </Link>

            <span
              className={`hidden h-7 w-px shrink-0 lg:block ${isScrolled ? 'bg-white/15' : 'bg-slate-200/90'}`}
              aria-hidden
            />
          </div>

          <div className="mx-2 hidden min-w-0 flex-1 flex-wrap items-center justify-center gap-1 lg:flex">
                {/* Industries mega */}
                <div
                  className="relative"
                  onMouseEnter={() => openDesktop('industries')}
                  onMouseLeave={scheduleCloseDesktop}
                >
                  <button
                    type="button"
                    className={dropdownTriggerClass('industries')}
                    aria-haspopup="true"
                    aria-expanded={activeDesktop === 'industries'}
                    aria-controls={`${baseId}-panel-industries`}
                    id={`${baseId}-btn-industries`}
                    onFocus={() => openDesktop('industries')}
                    onBlur={(e) => {
                      if (!e.currentTarget.parentElement?.contains(e.relatedTarget)) scheduleCloseDesktop();
                    }}
                    onClick={() =>
                      setActiveDesktop((p) => (p === 'industries' ? null : 'industries'))
                    }
                  >
                    Industries
                    <HiChevronDown className={chevronNavClass(activeDesktop === 'industries')} aria-hidden />
                  </button>
                </div>

                {/* Capabilities mega */}
                <div
                  className="relative"
                  onMouseEnter={() => openDesktop('capabilities')}
                  onMouseLeave={scheduleCloseDesktop}
                >
                  <button
                    type="button"
                    className={dropdownTriggerClass('capabilities')}
                    aria-haspopup="true"
                    aria-expanded={activeDesktop === 'capabilities'}
                    aria-controls={`${baseId}-panel-capabilities`}
                    id={`${baseId}-btn-capabilities`}
                    onFocus={() => openDesktop('capabilities')}
                    onBlur={(e) => {
                      if (!e.currentTarget.parentElement?.contains(e.relatedTarget)) scheduleCloseDesktop();
                    }}
                    onClick={() =>
                      setActiveDesktop((p) => (p === 'capabilities' ? null : 'capabilities'))
                    }
                  >
                    Capabilities
                    <HiChevronDown className={chevronNavClass(activeDesktop === 'capabilities')} aria-hidden />
                  </button>
                </div>

                {/* How we work */}
                <div
                  className="relative"
                  onMouseEnter={() => openDesktop('how')}
                  onMouseLeave={scheduleCloseDesktop}
                >
                  <button
                    type="button"
                    className={dropdownTriggerClass('how')}
                    aria-haspopup="true"
                    aria-expanded={activeDesktop === 'how'}
                    aria-controls={`${baseId}-panel-how`}
                    id={`${baseId}-btn-how`}
                    onFocus={() => openDesktop('how')}
                    onBlur={(e) => {
                      if (!e.currentTarget.parentElement?.contains(e.relatedTarget)) scheduleCloseDesktop();
                    }}
                    onClick={() => setActiveDesktop((p) => (p === 'how' ? null : 'how'))}
                  >
                    How We Work
                    <HiChevronDown className={chevronNavClass(activeDesktop === 'how')} aria-hidden />
                  </button>
                  {simplePanel('how', howWeWork)}
                </div>

                {/* About */}
                <div
                  className="relative"
                  onMouseEnter={() => openDesktop('about')}
                  onMouseLeave={scheduleCloseDesktop}
                >
                  <button
                    type="button"
                    className={dropdownTriggerClass('about')}
                    aria-haspopup="true"
                    aria-expanded={activeDesktop === 'about'}
                    aria-controls={`${baseId}-panel-about`}
                    id={`${baseId}-btn-about`}
                    onFocus={() => openDesktop('about')}
                    onBlur={(e) => {
                      if (!e.currentTarget.parentElement?.contains(e.relatedTarget)) scheduleCloseDesktop();
                    }}
                    onClick={() => setActiveDesktop((p) => (p === 'about' ? null : 'about'))}
                  >
                    About Us
                    <HiChevronDown className={chevronNavClass(activeDesktop === 'about')} aria-hidden />
                  </button>
                  {simplePanel('about', aboutUs)}
                </div>

                <span
                  className={`mx-1 hidden h-5 w-px shrink-0 self-center lg:block ${isScrolled ? 'bg-white/15' : 'bg-slate-200/90'}`}
                  aria-hidden
                />

                <Link
                  href="/tech-ai"
                  className={`hidden lg:inline-flex items-center rounded-md px-2.5 py-2 text-[13px] font-medium tracking-tight underline-offset-[10px] ${TRANSITION} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                    isScrolled
                      ? 'text-white decoration-white/40 hover:underline hover:decoration-white focus-visible:outline-white'
                      : 'text-slate-700 decoration-slate-300/80 hover:text-primary-700 hover:underline hover:decoration-primary-400/60 focus-visible:outline-primary-600'
                  }`}
                >
                  Tech &amp; AI
                </Link>

                <Link
                  href="/sustainability"
                  className={`hidden lg:inline-flex rounded-md px-2.5 py-2 text-[13px] font-medium tracking-tight underline-offset-[10px] ${TRANSITION} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                    isScrolled
                      ? 'text-white decoration-white/40 hover:underline hover:decoration-white focus-visible:outline-white'
                      : 'text-slate-700 decoration-slate-300/80 hover:text-primary-700 hover:underline hover:decoration-primary-400/60 focus-visible:outline-primary-600'
                  }`}
                >
                  Sustainability
                </Link>

                <Link
                  href="/blog"
                  className={`rounded-md px-2.5 py-2 text-[13px] font-medium tracking-tight underline-offset-[10px] ${TRANSITION} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                    isScrolled
                      ? isActiveHref('/blog')
                        ? 'text-white underline decoration-white/60 hover:decoration-white focus-visible:outline-white'
                        : 'text-white decoration-white/40 hover:underline hover:decoration-white focus-visible:outline-white'
                      : isActiveHref('/blog')
                        ? 'text-primary-700 underline decoration-primary-400/50 hover:text-primary-800 focus-visible:outline-primary-600'
                        : 'text-slate-700 decoration-slate-300/80 hover:text-primary-700 hover:underline hover:decoration-primary-400/60 focus-visible:outline-primary-600'
                  }`}
                >
                  Skyfalke Blog
                </Link>
            </div>

          <div className="flex shrink-0 items-center gap-3">
            <button
              type="button"
              onClick={() => {
                openModal({ intent: 'strategy' });
                setMobileOpen(false);
              }}
              className={`hidden lg:inline-flex items-center justify-center gap-2 rounded-none px-4 py-2.5 text-sm font-medium shadow-sm ${TRANSITION} hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 active:translate-y-[0.5px] ${
                isScrolled
                  ? 'bg-secondary-500 text-primary-900 hover:bg-secondary-400 focus-visible:outline-white'
                  : 'bg-[#0B1220] text-white hover:bg-primary-800 focus-visible:outline-primary-600'
              }`}
            >
              <HiOutlinePhone className="h-4 w-4 shrink-0" aria-hidden />
              Get Started
            </button>

            <button
              ref={menuButtonRef}
              type="button"
              className={`inline-flex items-center justify-center rounded-lg p-2.5 lg:hidden ${TRANSITION} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                isScrolled
                  ? 'text-white hover:bg-white/10 focus-visible:outline-white'
                  : 'text-slate-800 hover:bg-slate-200/60 focus-visible:outline-primary-600'
              }`}
              aria-expanded={mobileOpen}
              aria-controls={`${baseId}-mobile-menu`}
              onClick={() => setMobileOpen((o) => !o)}
            >
              <span className="sr-only">{mobileOpen ? 'Close menu' : 'Open menu'}</span>
              {mobileOpen ? <HiXMark className="h-6 w-6" aria-hidden /> : <HiBars3 className="h-6 w-6" aria-hidden />}
            </button>
          </div>
        </nav>

        {/* Desktop mega overlays (fixed, outside nav flex) */}
        {megaPanel(
          'industries',
          <div>
            <div className="mb-10 flex flex-col gap-4 border-b border-slate-200/90 pb-8 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-xl">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Industries</p>
                <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-900">Sector depth, enterprise rigor</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  Explore how we support transformation and growth across regulated and commercial environments.
                </p>
              </div>
              <Link
                href="/industries"
                className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-primary-700 hover:text-primary-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
              >
                All industries
                <HiOutlineArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
            <div className="grid gap-10 lg:grid-cols-3 lg:gap-0 lg:divide-x lg:divide-slate-200/80">
              {INDUSTRY_CHUNKS.map((chunk, colIdx) => (
                <div
                  key={INDUSTRY_COLUMN_LABELS[colIdx]}
                  className="lg:px-8 first:lg:pl-0 last:lg:pr-0"
                >
                  <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    {INDUSTRY_COLUMN_LABELS[colIdx]}
                  </p>
                  <ul className="space-y-0">
                    {chunk.map((row) => {
                      const Icon = row.Icon;
                      return (
                        <li key={row.name} className="border-b border-slate-100 last:border-b-0">
                          <Link
                            href={row.href}
                            className="group flex items-start gap-3.5 py-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                          >
                            {Icon ? (
                              <span
                                className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center border border-slate-200/90 bg-slate-50 text-slate-500 ${TRANSITION} group-hover:border-primary-200/80 group-hover:bg-white group-hover:text-primary-700`}
                                aria-hidden
                              >
                                <Icon className="h-[1.125rem] w-[1.125rem]" strokeWidth={1.5} />
                              </span>
                            ) : null}
                            <span className="min-w-0 flex-1">
                              <span className="flex items-start justify-between gap-3">
                                <span className="text-[13px] font-semibold leading-snug tracking-tight text-slate-900 group-hover:text-primary-800">
                                  {row.name}
                                </span>
                                <HiOutlineChevronRight
                                  className={`mt-0.5 h-4 w-4 shrink-0 text-slate-300 ${TRANSITION} group-hover:text-primary-600 group-hover:translate-x-0.5`}
                                  aria-hidden
                                />
                              </span>
                              {row.description ? (
                                <span className="mt-1 block text-xs leading-relaxed text-slate-500">{row.description}</span>
                              ) : null}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {megaPanel(
          'capabilities',
          <div>
            <div className="mb-10 flex flex-col gap-4 border-b border-slate-200/90 pb-8 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-xl">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Capabilities</p>
                <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-900">How we deliver value</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  Integrated services from strategy through execution-aligned to outcomes, not silos.
                </p>
              </div>
              <Link
                href="/capabilities"
                className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-primary-700 hover:text-primary-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
              >
                All capabilities
                <HiOutlineArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
            <div className="grid gap-10 lg:grid-cols-3 lg:gap-0 lg:divide-x lg:divide-slate-200/80">
              {CAPABILITY_CHUNKS.map((chunk, colIdx) => (
                <div
                  key={CAPABILITY_COLUMN_LABELS[colIdx]}
                  className="lg:px-8 first:lg:pl-0 last:lg:pr-0"
                >
                  <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    {CAPABILITY_COLUMN_LABELS[colIdx]}
                  </p>
                  <ul className="space-y-0">
                    {chunk.map((cap) => {
                      const Icon = cap.Icon;
                      return (
                        <li key={cap.name} className="border-b border-slate-100 last:border-b-0">
                          <Link
                            href={cap.href}
                            className="group flex items-start gap-3.5 py-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                          >
                            {Icon ? (
                              <span
                                className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center border border-slate-200/90 bg-slate-50 text-slate-500 ${TRANSITION} group-hover:border-primary-200/80 group-hover:bg-white group-hover:text-primary-700`}
                                aria-hidden
                              >
                                <Icon className="h-[1.125rem] w-[1.125rem]" strokeWidth={1.5} />
                              </span>
                            ) : null}
                            <span className="min-w-0 flex-1">
                              <span className="flex items-start justify-between gap-3">
                                <span className="min-w-0 flex flex-wrap items-center gap-x-2 gap-y-1">
                                  <span className="text-[13px] font-semibold leading-snug tracking-tight text-slate-900 group-hover:text-primary-800">
                                    {cap.name}
                                  </span>
                                  {cap.badge === 'New' ? <Badge tone="accent">New</Badge> : null}
                                  {cap.badge === 'Trending' ? <Badge tone="trend">Trending</Badge> : null}
                                </span>
                                <HiOutlineChevronRight
                                  className={`mt-0.5 h-4 w-4 shrink-0 text-slate-300 ${TRANSITION} group-hover:text-primary-600 group-hover:translate-x-0.5`}
                                  aria-hidden
                                />
                              </span>
                              {cap.description ? (
                                <span className="mt-1 block text-xs leading-relaxed text-slate-500">{cap.description}</span>
                              ) : null}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Mobile + tablet overlay */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-[70] lg:hidden" id={`${baseId}-mobile-menu`}>
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          />
          <div
            className="header-mega-animate absolute inset-0 flex max-h-[100dvh] flex-col bg-[#F8FAFC] max-sm:rounded-none sm:left-auto sm:right-0 sm:top-0 sm:h-full sm:max-w-md sm:border-l sm:border-slate-200/90 sm:shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${baseId}-mobile-title`}
          >
            <div className="flex items-center justify-between border-b border-slate-200/90 px-4 py-4 sm:px-5">
              <p id={`${baseId}-mobile-title`} className="text-sm font-semibold tracking-tight text-slate-900">
                Menu
              </p>
              <button
                type="button"
                className="rounded-lg p-2 text-slate-600 hover:bg-slate-200/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                onClick={() => setMobileOpen(false)}
              >
                <HiXMark className="h-6 w-6" aria-hidden />
                <span className="sr-only">Close</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-5">
              <div className="space-y-1">
                <div className="rounded-lg border border-slate-200/80 bg-white/90">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between px-4 py-3.5 text-left text-sm font-semibold text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                    aria-expanded={mobileSection === 'industries'}
                    onClick={() => toggleMobileSection('industries')}
                  >
                    Industries
                    <HiChevronDown
                      className={`h-4 w-4 text-slate-500 ${TRANSITION} ${mobileSection === 'industries' ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {mobileSection === 'industries' ? (
                    <div className="border-t border-slate-100 px-2 py-2">
                      {industries.map((row) => {
                        const Icon = row.Icon;
                        return (
                          <Link
                            key={row.name}
                            href={row.href}
                            className="flex items-start gap-3 rounded-md px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                            onClick={() => setMobileOpen(false)}
                          >
                            {Icon ? (
                              <span
                                className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center border border-slate-200/90 bg-slate-50 text-slate-500"
                                aria-hidden
                              >
                                <Icon className="h-3.5 w-3.5" />
                              </span>
                            ) : null}
                            <span className="min-w-0">
                              <span className="font-semibold text-slate-900">{row.name}</span>
                              {row.description ? (
                                <span className="mt-0.5 block text-xs leading-relaxed text-slate-500">{row.description}</span>
                              ) : null}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  ) : null}
                </div>

                <div className="rounded-lg border border-slate-200/80 bg-white/90">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between px-4 py-3.5 text-left text-sm font-semibold text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                    aria-expanded={mobileSection === 'capabilities'}
                    onClick={() => toggleMobileSection('capabilities')}
                  >
                    Capabilities
                    <HiChevronDown
                      className={`h-4 w-4 text-slate-500 ${TRANSITION} ${mobileSection === 'capabilities' ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {mobileSection === 'capabilities' ? (
                    <div className="border-t border-slate-100 px-2 py-2">
                      {capabilities.map((cap) => {
                        const Icon = cap.Icon;
                        return (
                          <Link
                            key={cap.name}
                            href={cap.href}
                            className="flex items-start gap-3 rounded-md px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                            onClick={() => setMobileOpen(false)}
                          >
                            {Icon ? (
                              <span
                                className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center border border-slate-200/90 bg-slate-50 text-slate-500"
                                aria-hidden
                              >
                                <Icon className="h-3.5 w-3.5" />
                              </span>
                            ) : null}
                            <span className="min-w-0">
                              <span className="font-semibold text-slate-900">
                                {cap.name}
                                {cap.badge === 'New' ? <Badge tone="accent">New</Badge> : null}
                                {cap.badge === 'Trending' ? <Badge tone="trend">Trending</Badge> : null}
                              </span>
                              {cap.description ? (
                                <span className="mt-0.5 block text-xs leading-relaxed text-slate-500">{cap.description}</span>
                              ) : null}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  ) : null}
                </div>

                <div className="rounded-lg border border-slate-200/80 bg-white/90">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between px-4 py-3.5 text-left text-sm font-semibold text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                    aria-expanded={mobileSection === 'how'}
                    onClick={() => toggleMobileSection('how')}
                  >
                    How We Work
                    <HiChevronDown
                      className={`h-4 w-4 text-slate-500 ${TRANSITION} ${mobileSection === 'how' ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {mobileSection === 'how' ? (
                    <div className="border-t border-slate-100 px-2 py-2">
                      {howWeWork.map((item) => {
                        const Icon = item.Icon;
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            className="flex items-start gap-3 rounded-md px-3 py-2.5 text-sm text-slate-800 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                            onClick={() => setMobileOpen(false)}
                          >
                            {Icon ? (
                              <span
                                className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center border border-slate-200/90 bg-slate-50 text-slate-500"
                                aria-hidden
                              >
                                <Icon className="h-3.5 w-3.5" />
                              </span>
                            ) : null}
                            <span className="min-w-0">
                              <span className="font-semibold text-slate-900">{item.name}</span>
                              {item.description ? (
                                <span className="mt-0.5 block text-xs leading-relaxed text-slate-500">{item.description}</span>
                              ) : null}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  ) : null}
                </div>

                <div className="rounded-lg border border-slate-200/80 bg-white/90">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between px-4 py-3.5 text-left text-sm font-semibold text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                    aria-expanded={mobileSection === 'about'}
                    onClick={() => toggleMobileSection('about')}
                  >
                    About Us
                    <HiChevronDown
                      className={`h-4 w-4 text-slate-500 ${TRANSITION} ${mobileSection === 'about' ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {mobileSection === 'about' ? (
                    <div className="border-t border-slate-100 px-2 py-2">
                      {aboutUs.map((item) => {
                        const Icon = item.Icon;
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            className="flex items-start gap-3 rounded-md px-3 py-2.5 text-sm text-slate-800 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                            onClick={() => setMobileOpen(false)}
                          >
                            {Icon ? (
                              <span
                                className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center border border-slate-200/90 bg-slate-50 text-slate-500"
                                aria-hidden
                              >
                                <Icon className="h-3.5 w-3.5" />
                              </span>
                            ) : null}
                            <span className="min-w-0">
                              <span className="font-semibold text-slate-900">{item.name}</span>
                              {item.description ? (
                                <span className="mt-0.5 block text-xs leading-relaxed text-slate-500">{item.description}</span>
                              ) : null}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  ) : null}
                </div>

                <Link
                  href="/services/ict-strategy"
                  className="block rounded-lg border border-slate-200/80 bg-white/90 px-4 py-3.5 text-sm font-semibold text-slate-900 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                  onClick={() => setMobileOpen(false)}
                >
                  Tech &amp; AI
                </Link>

                <Link
                  href="/about#environmental-sustainability"
                  className="block rounded-lg border border-slate-200/80 bg-white/90 px-4 py-3.5 text-sm font-semibold text-slate-900 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                  onClick={() => setMobileOpen(false)}
                >
                  Sustainability
                </Link>

                <Link
                  href="/blog"
                  className="block rounded-lg border border-slate-200/80 bg-white/90 px-4 py-3.5 text-sm font-semibold text-slate-900 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                  onClick={() => setMobileOpen(false)}
                >
                  Skyfalke Blog
                </Link>
              </div>
            </div>

            <div className="border-t border-slate-200/90 p-4 sm:p-5">
              <button
                type="button"
                onClick={() => {
                  openModal({ intent: 'strategy' });
                  setMobileOpen(false);
                }}
                className={`inline-flex w-full items-center justify-center gap-2 rounded-none bg-[#0B1220] py-3.5 text-sm font-medium text-white shadow-sm ${TRANSITION} hover:bg-primary-800 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600`}
              >
                <HiOutlinePhone className="h-4 w-4 shrink-0" aria-hidden />
                Get Started
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Header;
