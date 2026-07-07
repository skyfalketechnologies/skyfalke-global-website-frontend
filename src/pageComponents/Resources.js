'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';

// Published reports — each report links to its own landing page where
// visitors submit their details before downloading
const PUBLISHED_REPORTS = [
  {
    id: 'roi-of-ai-customer-experience',
    eyebrow: 'Research Report',
    title: 'The ROI of AI in Customer Experience',
    tagline: 'How AI agents are helping boost engagement and delight customers',
    description:
      'Based on a survey of 3,466 senior leaders of global enterprises, this report unpacks how gen AI and agentic AI are helping organizations deliver highly engaging, personalized customer experiences at scale.',
    partner: 'In partnership with Google Cloud',
    image:
      'https://ik.imagekit.io/g3nahgeeu/Campaign%20Tile-PSZD-501-92b7956c-867c-460f-be69-da41ce466955.png',
    href: '/resources/roi-of-ai-customer-experience',
  },
];

const Resources = () => {
  return (
    <div className="bg-white">
      {/* Reports we publish */}
      <section className="py-20 border-t border-gray-200">
        <div className="container-custom">
          <div className="max-w-3xl mb-14">
            <div className="flex items-center gap-3 mb-4">
              <span className="block w-10 h-[3px] bg-secondary-500" aria-hidden="true" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                Research &amp; Insights
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-primary-500 tracking-tight mb-5">
              Reports we publish
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Original research and partner reports on AI, digital marketing, cloud adoption, and consumer trends
              across the markets we serve.
            </p>
          </div>

          <div className="space-y-12">
            {PUBLISHED_REPORTS.map((report, index) => (
              <motion.article
                key={report.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="group grid grid-cols-1 lg:grid-cols-2 border-t border-gray-200 pt-12"
              >
                <Link href={report.href} className="block overflow-hidden">
                  <img
                    src={report.image}
                    alt={report.title}
                    className="w-full h-auto transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </Link>

                <div className="flex flex-col justify-center py-8 lg:py-4 lg:pl-14">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 mb-4">
                    {report.eyebrow}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-bold text-primary-500 tracking-tight leading-snug mb-4">
                    <Link href={report.href} className="hover:underline decoration-2 underline-offset-4">
                      {report.title}
                    </Link>
                  </h3>
                  <p className="text-lg text-gray-700 font-medium mb-3">{report.tagline}</p>
                  <p className="text-gray-600 leading-relaxed mb-4">{report.description}</p>
                  <p className="text-sm text-gray-500 mb-8">{report.partner}</p>
                  <Link
                    href={report.href}
                    className="inline-flex items-center gap-3 text-primary-500 font-semibold group/link"
                  >
                    <span className="border-b-2 border-secondary-500 pb-0.5">Get the report</span>
                    <FaArrowRight className="text-sm transition-transform duration-300 group-hover/link:translate-x-1.5" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary-500 text-white py-20">
        <div className="container-custom">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="block w-10 h-[3px] bg-secondary-500" aria-hidden="true" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-100">
                Work with us
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-5">
              Need custom research or advisory for your organization?
            </h2>
            <p className="text-lg text-primary-100 mb-10 max-w-2xl leading-relaxed">
              Our consultants create custom market research, strategy frameworks, and implementation roadmaps
              tailored to your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/contact"
                className="bg-secondary-500 text-primary-900 px-8 py-4 font-semibold hover:bg-secondary-400 transition-colors inline-flex items-center justify-center gap-3"
              >
                Talk to our team
                <FaArrowRight className="text-sm" />
              </Link>
              <Link
                href="/services"
                className="border border-white/50 text-white px-8 py-4 font-semibold hover:bg-white/10 transition-colors inline-flex items-center justify-center"
              >
                View our services
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Resources;
