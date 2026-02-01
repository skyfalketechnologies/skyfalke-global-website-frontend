'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import SEOHead from '../components/SEO/SEOHead';

const CourseDetail = () => {
  const params = useParams();
  const slug = params?.slug;
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        // Check for SSR-injected initial data
        const initialData = window.__INITIAL_DATA__;
        if (initialData && initialData.course && initialData.course.slug === slug) {
          console.log('Using SSR-injected data for course');
          setCourse(initialData.course);
          
          // Clear initial data to prevent reuse
          window.__INITIAL_DATA__ = null;
          
          setLoading(false);
          return;
        }
        
        const response = await fetch(`/api/academy/courses/${slug}`);
        if (!response.ok) {
          throw new Error('Course not found');
        }
        const data = await response.json();
        setCourse(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#e0ae00]"></div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#303661] mb-4">Course Not Found</h1>
          <p className="text-gray-600 mb-8">The course you're looking for doesn't exist or has been removed.</p>
          <Link href="/academy"
            className="inline-flex items-center px-6 py-3 bg-[#e0ae00] hover:bg-[#d4a000] text-[#303661] font-semibold rounded-lg transition-all duration-300"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Academy
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        pageType="course"
        title={`${course.title} - Skyfalke Academy`}
        description={course.shortDescription}
        keywords={`${course.category}, ${course.level}, online course, ${course.title}, Skyfalke Academy`}
        canonical={`https://skyfalke.com/academy/courses/${course.slug}`}
        ogTitle={course.title}
        ogDescription={course.shortDescription}
      />

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#303661] to-[#2a2f4e] py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Course Info */}
              <div className="text-white">
                <div className="flex items-center space-x-4 mb-6">
                  <span className="px-4 py-2 bg-[#e0ae00] text-[#303661] rounded-full text-sm font-semibold">
                    {course.category}
                  </span>
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    course.level === 'Beginner' ? 'bg-green-500' :
                    course.level === 'Intermediate' ? 'bg-yellow-500' :
                    course.level === 'Advanced' ? 'bg-orange-500' :
                    'bg-red-500'
                  }`}>
                    {course.level}
                  </span>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  {course.title}
                </h1>

                <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                  {course.shortDescription}
                </p>

                {/* Course Meta */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                  <div>
                    <div className="text-2xl font-bold text-[#e0ae00]">{course.duration}</div>
                    <div className="text-gray-300 text-sm">Duration</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[#e0ae00]">{course.durationHours}h</div>
                    <div className="text-gray-300 text-sm">Total Hours</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[#e0ae00]">{course.enrollmentCount}</div>
                    <div className="text-gray-300 text-sm">Students</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[#e0ae00]">{course.rating.toFixed(1)}</div>
                    <div className="text-gray-300 text-sm">Rating</div>
                  </div>
                </div>

                {/* Price and CTA */}
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <span className="text-4xl font-bold text-[#e0ae00]">
                      ${course.price}
                    </span>
                    {course.originalPrice && course.originalPrice > course.price && (
                      <span className="text-2xl text-gray-400 line-through">
                        ${course.originalPrice}
                      </span>
                    )}
                  </div>
                  
                  <button className="px-8 py-4 bg-[#e0ae00] hover:bg-[#d4a000] text-[#303661] font-bold text-lg rounded-lg transition-all duration-300 transform hover:scale-105">
                    Enroll Now
                  </button>
                </div>
              </div>

              {/* Course Image */}
              <div className="relative">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-96 object-cover rounded-2xl shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Course Content */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2">
                {/* Description */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                  <h2 className="text-3xl font-bold text-[#303661] mb-6">About This Course</h2>
                  <div className="prose prose-lg max-w-none text-gray-700">
                    {course.description.split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-4">{paragraph}</p>
                    ))}
                  </div>
                </div>

                {/* Syllabus */}
                {course.syllabus && course.syllabus.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                    <h2 className="text-3xl font-bold text-[#303661] mb-6">Course Syllabus</h2>
                    <div className="space-y-6">
                      {course.syllabus.map((week, index) => (
                        <div key={index} className="border-l-4 border-[#e0ae00] pl-6">
                          <h3 className="text-xl font-semibold text-[#303661] mb-2">
                            Week {week.week}: {week.title}
                          </h3>
                          <p className="text-gray-600 mb-3">{week.duration}</p>
                          <ul className="space-y-2">
                            {week.topics.map((topic, topicIndex) => (
                              <li key={topicIndex} className="flex items-center text-gray-700">
                                <svg className="w-4 h-4 text-[#e0ae00] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                {topic}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Learning Outcomes */}
                {course.learningOutcomes && course.learningOutcomes.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h2 className="text-3xl font-bold text-[#303661] mb-6">What You'll Learn</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {course.learningOutcomes.map((outcome, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="flex-shrink-0 w-6 h-6 bg-[#e0ae00] rounded-full flex items-center justify-center mt-1">
                            <svg className="w-3 h-3 text-[#303661]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <p className="text-gray-700">{outcome}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                {/* Trainer Info */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                  <h3 className="text-2xl font-bold text-[#303661] mb-6">Your Trainer</h3>
                  <div className="text-center">
                    <img
                      src={course.trainer.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'}
                      alt={course.trainer.name}
                      className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
                    />
                    <h4 className="text-xl font-semibold text-[#303661] mb-2">{course.trainer.name}</h4>
                    <div className="flex items-center justify-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(course.trainer.rating) ? 'text-[#e0ae00]' : 'text-gray-300'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="ml-2 text-sm text-gray-600">
                        {course.trainer.rating.toFixed(1)} ({course.trainer.reviewCount} reviews)
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{course.trainer.shortBio}</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {course.trainer.expertise.slice(0, 3).map((skill, index) => (
                        <span key={index} className="px-3 py-1 bg-[#e0ae00] bg-opacity-20 text-[#303661] rounded-full text-xs font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Course Details */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-[#303661] mb-6">Course Details</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-semibold text-[#303661]">{course.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Level:</span>
                      <span className="font-semibold text-[#303661]">{course.level}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Format:</span>
                      <span className="font-semibold text-[#303661]">{course.format}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Language:</span>
                      <span className="font-semibold text-[#303661]">{course.language}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Certificate:</span>
                      <span className="font-semibold text-[#303661]">
                        {course.certificate ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <button className="w-full px-6 py-4 bg-[#e0ae00] hover:bg-[#d4a000] text-[#303661] font-bold text-lg rounded-lg transition-all duration-300 transform hover:scale-105">
                      Enroll Now - ${course.price}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default CourseDetail;
