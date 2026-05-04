'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaGlobe, FaBullhorn, FaCogs, FaLightbulb } from 'react-icons/fa';

const services = [
  {
    title: 'Digital Presence & Branding',
    body: 'Websites, branding systems',
    icon: FaGlobe,
    iconLabel: 'Globe icon for digital presence and branding services',
  },
  {
    title: 'Visibility & Customer Acquisition',
    body: 'SEO, ads, digital strategy',
    icon: FaBullhorn,
    iconLabel: 'Megaphone icon for visibility and acquisition services',
  },
  {
    title: 'Business Systems & Automation',
    body: 'CRM, workflows, integrations',
    icon: FaCogs,
    iconLabel: 'Gears icon for systems and automation services',
  },
  {
    title: 'Growth & Technology Strategy',
    body: 'Consulting, AI roadmap',
    icon: FaLightbulb,
    iconLabel: 'Light bulb icon for strategy and technology consulting',
  },
];

export default function HomeServicesGrid() {
  return (
    <section className="section-padding bg-[#fafbfc] border-b border-gray-100" aria-labelledby="services-heading">
      <div className="container-custom">
        <h2
          id="services-heading"
          className="text-2xl sm:text-3xl font-bold text-primary-600 text-center tracking-tight mb-10 sm:mb-12 max-w-3xl mx-auto leading-snug"
        >
          Everything You Need to Grow With Skyfalke In One Place
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {services.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                className="bg-white border border-gray-200 p-6 sm:p-8 hover:border-primary-600/25 transition-colors"
              >
                <div
                  className="w-11 h-11 mb-4 flex items-center justify-center rounded-sm bg-primary-600 text-white"
                  role="img"
                  aria-label={item.iconLabel}
                >
                  <Icon aria-hidden />
                </div>
                <h3 className="text-lg font-bold text-primary-600 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{item.body}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
