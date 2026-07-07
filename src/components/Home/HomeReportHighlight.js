'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';

const REPORT = {
  eyebrow: 'Featured Research',
  title: 'The ROI of AI in Customer Experience',
  tagline: 'How AI agents are helping boost engagement and delight customers',
  description:
    'Based on a survey of 3,466 senior leaders of global enterprises, this report unpacks how gen AI and agentic AI are helping organizations deliver highly engaging, personalized customer experiences at scale.',
  partner: 'In partnership with Google Cloud',
  image:
    'https://ik.imagekit.io/g3nahgeeu/Campaign%20Tile-PSZD-501-92b7956c-867c-460f-be69-da41ce466955.png',
  href: '/resources/roi-of-ai-customer-experience',
};

const HomeReportHighlight = () => {
  return (
    <section className="py-20 bg-white border-t border-gray-200">
      <div className="container-custom">
        <motion.article
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="group grid grid-cols-1 lg:grid-cols-2 items-center"
        >
          <Link href={REPORT.href} className="block overflow-hidden">
            <img
              src={REPORT.image}
              alt={REPORT.title}
              className="w-full h-auto transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </Link>

          <div className="flex flex-col justify-center py-10 lg:py-4 lg:pl-14">
            <div className="flex items-center gap-3 mb-4">
              <span className="block w-10 h-[3px] bg-secondary-500" aria-hidden="true" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                {REPORT.eyebrow}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary-500 tracking-tight leading-snug mb-4">
              <Link href={REPORT.href} className="hover:underline decoration-2 underline-offset-4">
                {REPORT.title}
              </Link>
            </h2>
            <p className="text-lg text-gray-700 font-medium mb-3">{REPORT.tagline}</p>
            <p className="text-gray-600 leading-relaxed mb-4">{REPORT.description}</p>
            <p className="text-sm text-gray-500 mb-8">{REPORT.partner}</p>
            <Link
              href={REPORT.href}
              className="inline-flex items-center gap-3 text-primary-500 font-semibold group/link"
            >
              <span className="border-b-2 border-secondary-500 pb-0.5">Get the report</span>
              <FaArrowRight className="text-sm transition-transform duration-300 group-hover/link:translate-x-1.5" />
            </Link>
          </div>
        </motion.article>
      </div>
    </section>
  );
};

export default HomeReportHighlight;
