'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaUserTimes, FaUnlink, FaCompass, FaChartLine } from 'react-icons/fa';

const cards = [
  {
    title: 'Unreliable freelancers',
    icon: FaUserTimes,
    alt: 'Icon representing inconsistent freelance support',
  },
  {
    title: 'Disconnected services',
    icon: FaUnlink,
    alt: 'Icon representing fragmented tools and vendors',
  },
  {
    title: 'No clear strategy',
    icon: FaCompass,
    alt: 'Icon representing lack of strategic direction',
  },
  {
    title: 'Poor ROI visibility',
    icon: FaChartLine,
    alt: 'Icon representing unclear return on marketing and technology spend',
  },
];

export default function HomeProblemSection() {
  return (
    <section
      className="section-padding bg-gradient-to-br from-[#303661] to-[#011BE0] border-b border-white/10"
      aria-labelledby="problem-heading"
    >
      <div className="container-custom max-w-4xl mx-auto text-center mb-12 sm:mb-16">
        <h2
          id="problem-heading"
          className="text-2xl sm:text-3xl md:text-[2rem] font-bold text-white tracking-tight leading-snug mb-6"
        >
          You Know Your Business Needs to Evolve, But Where Do You Start?
        </h2>
        <p className="text-base sm:text-lg text-white/85 leading-relaxed max-w-3xl mx-auto mb-2">
          You&apos;ve probably thought about improving your website, running digital campaigns, or adopting new tools
          like AI.
        </p>
        <p className="text-base sm:text-lg text-white/85 leading-relaxed max-w-3xl mx-auto mb-8">
          But instead, you&apos;re stuck with:
        </p>
      </div>

      <div className="container-custom">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.article
                key={card.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="border border-white/20 bg-white/10 backdrop-blur-sm p-6 text-center hover:border-white/40 transition-colors"
              >
                <div
                  className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-sm bg-white border border-white/30 text-[#011BE0]"
                  role="img"
                  aria-label={card.alt}
                >
                  <Icon className="text-lg" aria-hidden />
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-white leading-snug">{card.title}</h3>
              </motion.article>
            );
          })}
        </div>

        <p className="text-center mt-12 text-lg sm:text-xl font-semibold text-white max-w-2xl mx-auto leading-snug">
          You don&apos;t need more vendors. You need a partner.
        </p>
      </div>
    </section>
  );
}
