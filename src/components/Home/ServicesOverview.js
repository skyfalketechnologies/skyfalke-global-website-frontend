'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';

const SKYFALKE_SOLUTION_ICON =
  'https://ik.imagekit.io/g3nahgeeu/icons/skyfalke-solution-icon.webp';

const PROBLEM_SECTION_IMAGE =
  'https://ik.imagekit.io/g3nahgeeu/skyfalke-solutions.webp';

const ServicesOverview = () => {
  return (
    <section className="section-padding bg-gradient-to-b from-gray-50 to-white">
      <div className="container-custom">
        {/* Positioning / Problem */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 sm:mb-16 lg:mb-20"
        >
          <div className="text-center mb-8 sm:mb-10">
            <div className="inline-flex items-center px-4 py-2 bg-[#303661]/10 text-[#303661] uppercase text-xs sm:text-sm font-bold mb-4 sm:mb-6 rounded-sm">
              Positioning / Problem
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#303661] mb-6 sm:mb-8 px-4 max-w-5xl mx-auto leading-tight">
              Your Organization Doesn&apos;t Have a Tech Problem. It Has a Systems Problem
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center max-w-6xl mx-auto">
            <div className="order-2 lg:order-1 text-left">
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-6">
                You&apos;ve invested in tools. But when those tools don&apos;t talk to each other, your data doesn&apos;t drive decisions, and your team is buried in manual work, therefore, growth stalls.
              </p>
              <p className="text-base sm:text-lg font-semibold text-[#303661] mb-4">
                Here&apos;s what we see in most organizations:
              </p>
              <ol className="list-decimal list-outside pl-5 sm:pl-6 space-y-3 sm:space-y-4 text-base sm:text-lg text-gray-700 leading-relaxed marker:font-semibold marker:text-[#303661]">
                <li className="pl-1">Disconnected tools that create data silos and duplicate work</li>
                <li className="pl-1">Unused data that could be driving smarter decisions</li>
                <li className="pl-1">Manual processes that cost time, money, and competitive advantage</li>
              </ol>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="order-1 lg:order-2 relative rounded-2xl overflow-hidden shadow-xl border border-gray-100 aspect-[4/3] bg-gray-100"
            >
              <img
                src={PROBLEM_SECTION_IMAGE}
                alt="Digital systems and connected business tools"
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Solution Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-full min-w-0 max-w-full overflow-hidden rounded-xl bg-gradient-to-r from-[#303661] to-[#1e2440] px-4 py-5 text-white shadow-lg sm:rounded-2xl sm:px-5 sm:py-6 md:px-7 md:py-6"
        >
          <div className="mx-auto w-full min-w-0 max-w-2xl">
            <div className="mb-3 flex justify-center sm:mb-4">
              <img
                src={SKYFALKE_SOLUTION_ICON}
                alt="Skyfalke solution"
                className="h-20 w-20 shrink-0 object-contain sm:h-24 sm:w-24 md:h-28 md:w-28"
                loading="lazy"
              />
            </div>
            <h3 className="mb-2 text-center text-lg font-bold leading-snug sm:mb-3 sm:text-xl">
              The Skyfalke Solution
            </h3>
            <p className="mx-auto max-w-xl text-center text-sm font-light leading-relaxed text-gray-100/95 sm:max-w-2xl sm:text-[0.9375rem] md:text-base md:leading-relaxed">
              We don&apos;t just implement softwares, we design complete digital systems built around how your organization actually works. From automation and AI to cloud infrastructure and digital marketing, we connect every layer so your business can grow without the friction.
            </p>
            <div className="mt-3 flex w-full min-w-0 flex-col items-stretch justify-center gap-2 sm:mt-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-2.5">
              <Link
                href="/contact"
                className="inline-flex flex-1 items-center justify-center rounded-md bg-[#e0ae00] px-4 py-2 text-sm font-semibold text-white shadow transition-all duration-300 hover:bg-blue-700 hover:shadow-md sm:flex-initial sm:px-5 sm:py-2.5"
              >
                <span>Get Free Consultation</span>
                <FaArrowRight className="ml-1.5 shrink-0 text-xs" />
              </Link>
              <Link
                href="/case-studies"
                className="inline-flex flex-1 items-center justify-center rounded-md border border-white px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-white hover:text-gray-900 sm:flex-initial sm:px-5 sm:py-2.5"
              >
                <span>View Case Studies</span>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesOverview;
