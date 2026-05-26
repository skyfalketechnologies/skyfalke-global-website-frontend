'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { apiPost } from '../../utils/api';
import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaYoutube,
  FaTiktok,
  FaGithub,
  FaReddit,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaShieldAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
} from 'react-icons/fa';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const currentYear = new Date().getFullYear();

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrorMessage('');

    try {
      if (!email) {
        throw new Error('Email address is required');
      }

      const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Please enter a valid email address');
      }

      const response = await apiPost('/api/subscriptions/subscribe', {
        email,
        source: 'footer',
      });

      if (response.data.success) {
        setSubmitStatus('success');
        setEmail('');
        setTimeout(() => {
          setSubmitStatus(null);
        }, 5000);
      }
    } catch (error) {
      console.error('Subscription error:', error);
      setSubmitStatus('error');

      if (error.response?.status === 429) {
        setErrorMessage('Too many attempts. Please wait a few minutes before trying again.');
      } else if (error.message) {
        setErrorMessage(error.message);
      } else if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else if (error.response?.data?.errors) {
        const errorMessages = error.response.data.errors.map((err) => err.message).join(', ');
        setErrorMessage(errorMessages);
      } else {
        setErrorMessage('Something went wrong. Please try again.');
      }
      setTimeout(() => {
        setSubmitStatus(null);
        setErrorMessage('');
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const footerSections = [
    {
      title: 'Company',
      links: [
        { name: 'About', href: '/about-us' },
        { name: 'Services', href: '/services' },
        { name: 'Careers', href: '/careers' },
        { name: 'Shop', href: '/shop' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { name: 'Blog', href: '/blog' },
        { name: 'Insights', href: '/resources' },
        { name: 'Case Studies', href: '/how-we-work/case-studies' },
        { name: 'Support', href: '/support' },
      ],
    },
    {
      title: 'Connect',
      links: [
        { name: 'Contact', href: '/contact' },
        { name: 'Schedule consultation', href: '/schedule-consultation' },
        { name: 'Partners', href: '/partners' },
        { name: 'Academy', href: '/academy' },
      ],
    },
  ];

  const socialLinks = [
    { name: 'Facebook', icon: FaFacebook, href: 'https://facebook.com/skyfalke' },
    { name: 'X', icon: FaTwitter, href: 'https://x.com/skyfalke' },
    { name: 'LinkedIn', icon: FaLinkedin, href: 'https://linkedin.com/company/skyfalke' },
    { name: 'Instagram', icon: FaInstagram, href: 'https://instagram.com/skyfalkeofficial' },
    { name: 'YouTube', icon: FaYoutube, href: 'https://youtube.com/skyfalke' },
    { name: 'TikTok', icon: FaTiktok, href: 'https://tiktok.com/@skyfalke' },
    { name: 'GitHub', icon: FaGithub, href: 'https://github.com/skyfalketechnologies' },
    // { name: 'Reddit', icon: FaReddit, href: 'https://www.reddit.com/user/skyfalke_limited' },
  ];

  const contactLines = [
    {
      icon: FaPhone,
      text: '+254 (0) 717 797 238',
      href: 'tel:+254717797238',
    },
    {
      icon: FaEnvelope,
      text: 'info@skyfalke.com',
      href: 'mailto:info@skyfalke.com',
    },
    {
      icon: FaMapMarkerAlt,
      text: 'Nairobi, Kenya',
      href: 'https://maps.google.com/?q=Nairobi,Kenya',
      external: true,
    },
  ];

  return (
    <footer className="relative border-t border-white/10 bg-[#0c0f14] text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#e0ae00]/80 to-transparent" aria-hidden />

      <div className="relative z-10">
        <div className="container-custom pt-14 pb-10">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10 xl:gap-14">
            {/* Brand + contact */}
            <div className="lg:col-span-4">
              <Link href="/" className="inline-flex items-center gap-3">
                <img
                  src="/images/logos/logo.svg"
                  alt="Skyfalke — return to homepage"
                  className="h-9 w-auto brightness-0 invert"
                  width={160}
                  height={36}
                />
              </Link>
              <p className="mt-5 max-w-sm text-sm leading-relaxed text-zinc-400">
                Technology and marketing partner for teams that want clarity, execution, and measurable growth.
              </p>
              <ul className="mt-8 space-y-3 border-t border-white/10 pt-8">
                {contactLines.map((item) => (
                  <li key={item.text}>
                    <a
                      href={item.href}
                      target={item.external ? '_blank' : undefined}
                      rel={item.external ? 'noopener noreferrer' : undefined}
                      className="group inline-flex max-w-full items-start gap-3 text-sm text-zinc-300 transition-colors hover:text-white"
                    >
                      <item.icon
                        className="mt-0.5 h-4 w-4 shrink-0 text-[#e0ae00]/90 transition-colors group-hover:text-[#e0ae00]"
                        aria-hidden
                      />
                      <span className="break-words">{item.text}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Link columns */}
            <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-5 lg:gap-8">
              {footerSections.map((section) => (
                <div key={section.title}>
                  <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    {section.title}
                  </h2>
                  <ul className="mt-5 space-y-3">
                    {section.links.map((link) => {
                      if (!link.href) return null;
                      return (
                        <li key={link.name}>
                          <Link
                            href={link.href}
                            target={link.external ? '_blank' : undefined}
                            rel={link.external ? 'noopener noreferrer' : undefined}
                            className="text-sm text-zinc-300 transition-colors hover:text-white"
                          >
                            {link.name}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>

            {/* Newsletter */}
            <div className="lg:col-span-3">
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm">
                <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  Newsletter
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                  Short updates on strategy, technology, and how we work with clients.
                </p>
                <form onSubmit={handleSubscribe} className="mt-5 space-y-3">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
                    <label htmlFor="footer-newsletter-email" className="sr-only">
                      Email address
                    </label>
                    <input
                      id="footer-newsletter-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Work email"
                      className="min-h-[44px] flex-1 rounded-lg border border-white/10 bg-[#0c0f14]/80 px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-[#e0ae00]/50 focus:outline-none focus:ring-1 focus:ring-[#e0ae00]/40"
                      required
                      disabled={isSubmitting}
                      autoComplete="email"
                    />
                    <button
                      type="submit"
                      className={`inline-flex min-h-[44px] shrink-0 items-center justify-center gap-2 rounded-lg px-5 text-sm font-semibold transition-colors ${
                        submitStatus === 'success'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#e0ae00] text-[#0c0f14] hover:bg-[#c99a00]'
                      }`}
                      disabled={isSubmitting || submitStatus === 'success'}
                    >
                      {isSubmitting ? (
                        <>
                          <FaSpinner className="animate-spin" aria-hidden />
                          <span>Sending</span>
                        </>
                      ) : submitStatus === 'success' ? (
                        <>
                          <FaCheckCircle aria-hidden />
                          <span>Done</span>
                        </>
                      ) : (
                        <>
                          <span>Subscribe</span>
                          <FaPaperPlane className="opacity-90" size={14} aria-hidden />
                        </>
                      )}
                    </button>
                  </div>

                  {submitStatus === 'success' && (
                    <p className="flex items-start gap-2 text-xs text-emerald-400/95">
                      <FaCheckCircle className="mt-0.5 shrink-0" aria-hidden />
                      <span>Thank you! You are on the list.</span>
                    </p>
                  )}

                  {submitStatus === 'error' && (
                    <p className="flex items-start gap-2 text-xs text-red-300/95">
                      <FaTimesCircle className="mt-0.5 shrink-0" aria-hidden />
                      <span>{errorMessage}</span>
                    </p>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 bg-black/20">
          <div className="container-custom flex flex-col gap-6 py-6 md:flex-row md:items-center md:justify-between md:gap-8">
            <div className="flex flex-col items-center gap-4 md:flex-row md:items-center md:gap-6">
              <p className="text-center text-xs text-zinc-500 md:text-left">
                © {currentYear} Skyfalke Limited. All rights reserved.
              </p>
              <img
                src="/pci.svg"
                alt="PCI DSS compliant"
                className="h-9 w-auto opacity-90"
                width={68}
                height={54}
              />
            </div>

            <nav
              aria-label="Policies and sitemap"
              className="flex flex-wrap items-center justify-center gap-x-1 gap-y-2 text-xs text-zinc-500 md:justify-end"
            >
              <Link href="/privacy" className="inline-flex items-center gap-1.5 px-2 py-1 text-zinc-400 transition-colors hover:text-white">
                <FaShieldAlt className="opacity-70" size={12} aria-hidden />
                Privacy
              </Link>
              <span className="text-zinc-700" aria-hidden>
                ·
              </span>
              <Link href="/terms" className="px-2 py-1 text-zinc-400 transition-colors hover:text-white">
                Terms
              </Link>
              <span className="text-zinc-700" aria-hidden>
                ·
              </span>
              <Link href="/site-map" className="px-2 py-1 text-zinc-400 transition-colors hover:text-white">
                Sitemap
              </Link>
            </nav>

            <div className="flex justify-center gap-2 md:justify-end">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-zinc-400 transition-colors hover:border-white/20 hover:text-white"
                >
                  <social.icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
