'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  HiOutlinePresentationChartLine,
  HiOutlineBuildingOffice2,
  HiOutlineArrowTrendingUp,
  HiOutlineShieldCheck,
} from 'react-icons/hi2';

const DIFFERENTIATION_IMAGE =
  'https://ik.imagekit.io/g3nahgeeu/skyfalke-strategy.webp';

const points = [
  {
    text: 'Strategic, Not Just Technical',
    Icon: HiOutlinePresentationChartLine,
    label: 'Strategic planning beyond pure technical implementation',
  },
  {
    text: 'All-in-One Partner',
    Icon: HiOutlineBuildingOffice2,
    label: 'Single trusted partner across disciplines',
  },
  {
    text: 'Built for Growth',
    Icon: HiOutlineArrowTrendingUp,
    label: 'Scalable growth orientation',
  },
  {
    text: 'Professional Execution',
    Icon: HiOutlineShieldCheck,
    label: 'Disciplined delivery quality',
  },
];

export default function HomeDifferentiation() {
  return (
    <section
      className="section-padding bg-[#E0AE00] border-b border-black/10"
      aria-labelledby="why-heading"
    >
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center max-w-6xl mx-auto">
          <div>
            <h2
              id="why-heading"
              className="text-2xl sm:text-3xl md:text-[2rem] font-bold text-primary-600 tracking-tight leading-snug mb-6"
            >
              Why Businesses Choose Skyfalke
            </h2>
            <p className="text-base sm:text-lg text-primary-900/80 leading-relaxed mb-8 max-w-xl">
              We combine business strategy, execution discipline, creativity and scalable technology to deliver measurable outcomes.
            </p>
            <ul className="space-y-4">
              {points.map(({ text, Icon, label }) => (
                <li key={text} className="flex gap-4 text-gray-800 text-base sm:text-lg leading-relaxed">
                  <span
                    className="mt-0.5 shrink-0 flex h-10 w-10 items-center justify-center rounded-sm border border-gray-200 bg-white text-[#303661] shadow-sm"
                    role="img"
                    aria-label={label}
                  >
                    <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden />
                  </span>
                  <span className="pt-1.5 font-medium">{text}</span>
                </li>
              ))}
            </ul>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="relative rounded-sm overflow-hidden shadow-[0_20px_50px_-20px_rgba(48,54,97,0.25)] bg-black"
          >
            <img
              src={DIFFERENTIATION_IMAGE}
              alt="Orange chess king on a board, symbolizing strategic leadership and differentiation"
              className="w-full h-auto block"
              loading="lazy"
              decoding="async"
              width={800}
              height={800}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
