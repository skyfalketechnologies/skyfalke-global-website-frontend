'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaQuoteLeft } from 'react-icons/fa';

const testimonials = [
  {
    quote:
      'Skyfalke gave us a single roadmap across our site, campaigns, and CRM. We finally see what is working and where to invest next.',
    name: 'Manager',
    company: 'Talmar Computers',
  },
  {
    quote:
      'We replaced a patchwork of freelancers with one accountable partner. Delivery was structured, documented, and aligned to revenue goals.',
    name: 'Owner',
    company: 'Nuru Atelier',
  },
  {
    quote:
      'The team connected marketing data to our internal workflows. Reporting went from ad-hoc spreadsheets to a clear weekly rhythm.',
    name: 'Head of Marketing',
    company: 'Softonic Solutions',
  },
];

const customers = [
  {
    id: 1,
    name: 'Talmar Computers',
    logo: 'https://ik.imagekit.io/g3nahgeeu/customers/tc.webp?tr=w-240,f-auto,q-auto:good',
    alt: 'Talmar Computers company logo',
  },
  {
    id: 2,
    name: 'MKA Advocates',
    logo: 'https://ik.imagekit.io/g3nahgeeu/customers/mka.webp?tr=w-240,f-auto,q-auto:good',
    alt: 'MKA Advocates law firm logo',
  },
  {
    id: 3,
    name: 'CFAO Motors',
    logo: '/images/customers/cfao.png',
    alt: 'CFAO Motors company logo',
  },
  {
    id: 4,
    name: 'Quickmart',
    logo: 'https://ik.imagekit.io/g3nahgeeu/customers/qm.png?tr=w-240,f-auto,q-auto:good',
    alt: 'Quickmart retail brand logo',
  },
  {
    id: 5,
    name: 'Total Energies',
    logo: 'https://ik.imagekit.io/g3nahgeeu/customers/te.png?tr=w-240,f-auto,q-auto:good',
    alt: 'Total Energies brand logo',
  },
  {
    id: 6,
    name: 'Automobile Warehouse',
    logo: 'https://ik.imagekit.io/g3nahgeeu/customers/awl.png?tr=w-240,f-auto,q-auto:good',
    alt: 'Automobile Warehouse company logo',
  },
  {
    id: 7,
    name: 'Shell',
    logo: 'https://ik.imagekit.io/g3nahgeeu/icons/shell-seeklogo.png',
    alt: 'Shell company logo',
  },
];

export default function HomeSocialProof() {
  const [index, setIndex] = useState(0);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % testimonials.length);
  }, []);

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + testimonials.length) % testimonials.length);
  }, []);

  useEffect(() => {
    const t = setInterval(next, 9000);
    return () => clearInterval(t);
  }, [next]);

  const current = testimonials[index];

  const duplicatedCustomers = [...customers, ...customers, ...customers];

  return (
    <section className="section-padding bg-[#fafbfc] border-y border-gray-100" aria-labelledby="social-heading">
      <div className="container-custom">
        <h2 id="social-heading" className="text-2xl sm:text-3xl font-bold text-primary-600 text-center tracking-tight mb-10">
          Trusted by Growing Businesses
        </h2>

        <div className="max-w-3xl mx-auto mb-14">
          <div className="relative bg-white border border-gray-200 px-6 py-8 sm:px-10 sm:py-10 shadow-sm">
            <FaQuoteLeft className="text-secondary-500/40 text-2xl mb-4" aria-hidden />
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
              >
                <blockquote className="text-lg sm:text-xl text-gray-800 leading-relaxed mb-6 font-light">
                  {current.quote}
                </blockquote>
                <footer className="text-sm text-gray-500">
                  <span className="font-semibold text-primary-600">{current.name}</span>
                  <span className="mx-2 text-gray-300" aria-hidden>
                    ·
                  </span>
                  <span>{current.company}</span>
                </footer>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-between mt-8 gap-4">
              <button
                type="button"
                onClick={prev}
                className="inline-flex items-center justify-center w-10 h-10 border border-gray-200 text-primary-600 hover:bg-[#fafbfc] transition-colors"
                aria-label="Previous testimonial"
              >
                <FaChevronLeft aria-hidden />
              </button>
              <div className="flex gap-2" role="tablist" aria-label="Testimonial slides">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setIndex(i)}
                    className={`h-2 rounded-full transition-all ${i === index ? 'w-8 bg-primary-600' : 'w-2 bg-gray-300'}`}
                    aria-label={`Show testimonial ${i + 1}`}
                    aria-current={i === index}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={next}
                className="inline-flex items-center justify-center w-10 h-10 border border-gray-200 text-primary-600 hover:bg-[#fafbfc] transition-colors"
                aria-label="Next testimonial"
              >
                <FaChevronRight aria-hidden />
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto">
          <p className="text-center text-xs font-semibold uppercase tracking-wider text-gray-500 mb-6">
            You're In Safe Hands
          </p>
          <div className="relative" aria-label="Client logos">
            <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-12 bg-gradient-to-r from-[#fafbfc] to-transparent sm:w-16" />
            <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-12 bg-gradient-to-l from-[#fafbfc] to-transparent sm:w-16" />
            <div className="flex overflow-hidden">
              <div className="marquee-slide flex shrink-0 items-center gap-4 pr-4 sm:gap-6 sm:pr-6">
                {duplicatedCustomers.map((customer, i) => (
                  <div
                    key={`${customer.id}-${i}`}
                    className="flex h-16 w-28 shrink-0 items-center justify-center border border-gray-200 bg-white px-3 sm:h-20 sm:w-36"
                  >
                    <img
                      src={customer.logo}
                      alt={customer.alt}
                      width={140}
                      height={56}
                      loading="lazy"
                      decoding="async"
                      className="max-h-10 w-auto max-w-full object-contain opacity-80 grayscale transition-all hover:grayscale-0"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        const el = e.target.nextElementSibling;
                        if (el) el.classList.replace('hidden', 'flex');
                      }}
                    />
                    <span className="hidden h-full w-full items-center justify-center px-1 text-center text-[10px] font-medium leading-tight text-gray-400">
                      {customer.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
