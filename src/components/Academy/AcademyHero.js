import React from 'react';
import Link from 'next/link';

const AcademyHero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"
          alt="Academy Background"
          className="w-full h-full object-cover"
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-[#303661] bg-opacity-80"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-28">
        <div className="max-w-4xl mx-auto">
          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Empowering Professionals with{' '}
            <span className="text-[#e0ae00]">
              Future-Ready
            </span>{' '}
            Digital Skills
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Learn from industry experts with hands-on, practical training in Data Science, AI, Digital Transformation, and Cloud Innovation.
          </p>

          {/* CTA Button */}
          <div className="flex justify-center">
            <Link href="/academy/courses"
              className="inline-flex items-center px-8 py-4 bg-[#e0ae00] hover:bg-[#d4a000] text-[#303661] font-bold text-lg rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg"
            >
              <span>Explore Courses</span>
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AcademyHero;
