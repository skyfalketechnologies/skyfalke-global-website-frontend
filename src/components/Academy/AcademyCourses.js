import React from 'react';
import Link from 'next/link';

const AcademyCourses = ({ courses, loading }) => {
  return (
    <section className="bg-[#F8FAFC] border-y border-slate-200/80 py-20 lg:py-28" aria-labelledby="academy-courses-heading">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-5">
              <span className="block h-px w-8 bg-[#e0ae00]" />
              <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-primary-600">
                Featured Courses
              </span>
            </div>
            <h2
              id="academy-courses-heading"
              className="font-nexa-heavy text-[1.9rem] sm:text-[2.2rem] lg:text-[2.5rem] leading-[1.1] tracking-tight text-[#0B1220] mb-4"
            >
              Courses designed by practitioners
            </h2>
            <p className="text-base text-slate-500 leading-relaxed">
              Master the latest digital technologies and business skills with courses
              built and taught by industry experts.
            </p>
          </div>
          <Link
            href="/academy/courses"
            className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-[#0B1220] hover:text-primary-600 transition-colors"
          >
            View all courses
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white border border-slate-200/80 p-6 animate-pulse">
                <div className="w-full h-44 bg-slate-200 mb-4" />
                <div className="h-4 bg-slate-200 mb-2" />
                <div className="h-4 bg-slate-200 w-3/4 mb-4" />
                <div className="h-6 bg-slate-200 w-1/2" />
              </div>
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="border border-slate-200/80 bg-white py-16 text-center">
            <p className="text-slate-600 mb-4">New courses are being prepared. Browse the full catalog for current availability.</p>
            <Link
              href="/academy/courses"
              className="inline-flex items-center justify-center px-7 py-3 bg-[#0B1220] text-white font-semibold text-sm hover:bg-primary-800 transition-colors"
            >
              Browse Catalog
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses.map((course) => (
              <article
                key={course._id}
                className="group flex flex-col bg-white border border-slate-200/80 hover:border-[#0B1220] transition-colors overflow-hidden"
              >
                {/* Course Image */}
                <Link href={`/academy/courses/${course.slug}`} className="relative block h-44 bg-[#0B1220]">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-2.5 py-1 bg-[#0B1220]/90 text-[#e0ae00] text-[11px] font-semibold uppercase tracking-wide">
                      {course.category}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 bg-white/95 text-[#0B1220] text-[11px] font-semibold">
                      {course.level}
                    </span>
                  </div>
                </Link>

                {/* Course Content */}
                <div className="flex flex-col flex-1 p-6">
                  <h3 className="font-nexa-heavy text-lg tracking-tight text-[#0B1220] leading-snug mb-2 line-clamp-2">
                    <Link
                      href={`/academy/courses/${course.slug}`}
                      className="hover:text-primary-600 transition-colors"
                    >
                      {course.title}
                    </Link>
                  </h3>

                  <p className="text-sm text-slate-500 leading-relaxed mb-5 line-clamp-3">
                    {course.shortDescription}
                  </p>

                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mb-5">
                    <span>{course.duration}</span>
                    <span aria-hidden>·</span>
                    <span>{course.enrollmentCount} students</span>
                    {course.rating > 0 && (
                      <>
                        <span aria-hidden>·</span>
                        <span className="inline-flex items-center gap-1">
                          <svg className="w-3.5 h-3.5 text-[#e0ae00]" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          {course.rating.toFixed(1)} ({course.reviewCount})
                        </span>
                      </>
                    )}
                  </div>

                  {/* Price and CTA */}
                  <div className="mt-auto flex items-center justify-between pt-5 border-t border-slate-100">
                    <div className="flex items-baseline gap-2">
                      <span className="font-nexa-heavy text-xl text-[#0B1220]">${course.price}</span>
                      {course.originalPrice && course.originalPrice > course.price && (
                        <span className="text-sm text-slate-400 line-through">${course.originalPrice}</span>
                      )}
                    </div>
                    <Link
                      href={`/academy/courses/${course.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-[#0B1220] hover:text-primary-600 transition-colors"
                    >
                      View Details
                      <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AcademyCourses;
