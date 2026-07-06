'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { apiPost } from '../utils/api';
import { useAnalytics } from '../hooks/useAnalytics';
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaGraduationCap,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
} from 'react-icons/fa';

function CourseQueryPrefill({ courses, onCourse }) {
  const searchParams = useSearchParams();
  const courseSlug = searchParams?.get('course') || '';

  useEffect(() => {
    if (!courseSlug || courses.length === 0) return;
    const match = courses.find((c) => c.slug === courseSlug);
    if (match) {
      onCourse(match._id);
    }
  }, [courseSlug, courses, onCourse]);

  return null;
}

const AcademyJoin = () => {
  const { trackContactFormSubmission, trackLeadGeneration } = useAnalytics();
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    courseId: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('/api/academy/courses?limit=100');
        const data = await response.json();
        setCourses(data.courses || []);
      } catch (err) {
        console.error('Error fetching courses:', err);
      } finally {
        setLoadingCourses(false);
      }
    };
    fetchCourses();
  }, []);

  const applyCourseFromUrl = useCallback((courseId) => {
    setFormData((prev) => ({ ...prev, courseId }));
  }, []);

  const selectedCourse = courses.find((c) => c._id === formData.courseId);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const name = `${formData.firstName} ${formData.lastName}`.trim();
      const courseLabel = selectedCourse
        ? `${selectedCourse.title} (${selectedCourse.slug})`
        : 'Not specified — needs guidance';

      let message = formData.message || '';
      message += `\n\n--- Enrollment Details ---\nCourse: ${courseLabel}`;
      if (!formData.message?.trim()) {
        message = `I would like to enroll in Skyfalke Academy.\n${message}`;
      }

      const response = await apiPost('/api/contact/submit', {
        name,
        email: formData.email,
        phone: formData.phone || '',
        company: '',
        subject: selectedCourse
          ? `Academy Enrollment - ${selectedCourse.title}`
          : 'Academy Enrollment Request',
        message: message.trim(),
        type: 'academy',
        service: selectedCourse?.title || 'Skyfalke Academy',
        budget: 'not_specified',
        timeline: 'not_specified',
      });

      if (response.data.success) {
        setIsSubmitted(true);
        trackContactFormSubmission('academy');
        trackLeadGeneration('academy', selectedCourse?.price ?? null);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          courseId: '',
          message: '',
        });
      }
    } catch (err) {
      console.error('Enrollment submission error:', err);
      if (err.response?.status === 429) {
        setError('Too many attempts. Please wait a few minutes before trying again.');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.errors) {
        setError(err.response.data.errors.map((e) => e.message).join(', '));
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <FaCheckCircle className="text-6xl text-[#e0ae00] mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-[#303661] mb-4">Enrollment Request Received</h2>
          <p className="text-lg text-gray-600 mb-8">
            Thank you for your interest in Skyfalke Academy. Our team will contact you within one
            business day with next steps.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/academy/courses"
              className="inline-flex items-center justify-center px-6 py-3 bg-[#e0ae00] hover:bg-[#d4a000] text-[#303661] font-semibold rounded-lg transition-colors"
            >
              Browse Courses
            </Link>
            <Link
              href="/academy"
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-[#303661] text-[#303661] hover:bg-[#303661] hover:text-white font-semibold rounded-lg transition-colors"
            >
              Back to Academy
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <Suspense fallback={null}>
        <CourseQueryPrefill courses={courses} onCourse={applyCourseFromUrl} />
      </Suspense>

      <section className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[#303661] mb-4">Enrollment Request</h2>
            <p className="text-lg text-gray-600">
              Complete the form below and we will confirm your enrollment, payment options, and
              onboarding details.
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg flex items-start">
              <FaTimesCircle className="text-red-500 text-xl mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
          >
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  <FaUser className="inline mr-2" />
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e0ae00] focus:border-[#e0ae00] bg-white"
                  placeholder="First name"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  <FaUser className="inline mr-2" />
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e0ae00] focus:border-[#e0ae00] bg-white"
                  placeholder="Last name"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  <FaEnvelope className="inline mr-2" />
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e0ae00] focus:border-[#e0ae00] bg-white"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  <FaPhone className="inline mr-2" />
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e0ae00] focus:border-[#e0ae00] bg-white"
                  placeholder="+254 ..."
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">
                <FaGraduationCap className="inline mr-2" />
                Course
              </label>
              <select
                name="courseId"
                value={formData.courseId}
                onChange={handleInputChange}
                disabled={loadingCourses}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e0ae00] focus:border-[#e0ae00] bg-white disabled:opacity-60"
              >
                <option value="">Select a course (optional)</option>
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.title}
                    {course.price != null ? ` — $${course.price}` : ''}
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-500 mt-2">
                Not sure which course? Leave blank and we will help you choose.{' '}
                <Link href="/academy/courses" className="text-[#303661] font-medium underline">
                  Browse all courses
                </Link>
              </p>
            </div>

            <div className="mb-8">
              <label className="block text-gray-700 font-semibold mb-2">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e0ae00] focus:border-[#e0ae00] bg-white"
                placeholder="Goals, team size, preferred start date, or questions..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-4 bg-[#303661] hover:bg-[#2a2f4e] disabled:opacity-70 text-white font-bold text-lg rounded-lg transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Enrollment Request'
              )}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-8">
            Prefer to talk first?{' '}
            <a href="mailto:academy@skyfalke.com" className="text-[#303661] font-medium">
              academy@skyfalke.com
            </a>{' '}
            ·{' '}
            <a href="tel:+254717797238" className="text-[#303661] font-medium">
              +254 717 797 238
            </a>
          </p>
        </div>
      </section>
    </>
  );
};

export default AcademyJoin;
