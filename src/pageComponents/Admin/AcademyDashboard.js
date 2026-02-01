'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const AcademyDashboard = () => {
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalRevenue: 0,
    activeEnrollments: 0
  });
  const [recentEnrollments, setRecentEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch dashboard statistics
        const [coursesRes, enrollmentsRes] = await Promise.all([
          fetch('/api/academy/courses').catch(() => ({ ok: false, json: async () => ({ total: 0 }) })),
          fetch('/api/academy/enrollments').catch(() => ({ ok: false, json: async () => ({ enrollments: [], data: [] }) }))
        ]);

        const coursesData = await coursesRes.json();
        const enrollmentsData = await enrollmentsRes.json();

        // Extract enrollments array - handle different response structures
        let enrollments = [];
        if (Array.isArray(enrollmentsData)) {
          enrollments = enrollmentsData;
        } else if (Array.isArray(enrollmentsData.enrollments)) {
          enrollments = enrollmentsData.enrollments;
        } else if (Array.isArray(enrollmentsData.data)) {
          enrollments = enrollmentsData.data;
        } else {
          enrollments = [];
        }

        // Calculate stats with safe defaults
        const totalCourses = coursesData?.total || coursesData?.data?.total || 0;
        const totalStudents = enrollments.length || 0;
        const totalRevenue = enrollments.reduce((sum, enrollment) => {
          const amount = enrollment?.payment?.amount || 0;
          return sum + (typeof amount === 'number' ? amount : 0);
        }, 0);
        const activeEnrollments = enrollments.filter(e => e?.status === 'In Progress').length;

        setStats({
          totalCourses,
          totalStudents,
          totalRevenue,
          activeEnrollments
        });

        setRecentEnrollments(enrollments.slice(0, 5));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Set default values on error
        setStats({
          totalCourses: 0,
          totalStudents: 0,
          totalRevenue: 0,
          activeEnrollments: 0
        });
        setRecentEnrollments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-300 rounded-lg h-32"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#303661] mb-2">Academy Dashboard</h1>
        <p className="text-gray-600">Manage courses, students, and track academy performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-[#e0ae00]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Courses</p>
              <p className="text-3xl font-bold text-[#303661]">{stats.totalCourses}</p>
            </div>
            <div className="w-12 h-12 bg-[#e0ae00] bg-opacity-20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-[#e0ae00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-[#303661]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-3xl font-bold text-[#303661]">{stats.totalStudents}</p>
            </div>
            <div className="w-12 h-12 bg-[#303661] bg-opacity-20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-[#303661]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-3xl font-bold text-[#303661]">${stats.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-green-500 bg-opacity-20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Enrollments</p>
              <p className="text-3xl font-bold text-[#303661]">{stats.activeEnrollments}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 bg-opacity-20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link href="/system/dashboard/academy/courses"
          className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-[#e0ae00] bg-opacity-20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-[#e0ae00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-[#303661]">Manage Courses</h3>
              <p className="text-sm text-gray-600">Add, edit, and organize courses</p>
            </div>
          </div>
        </Link>

        <Link href="/system/dashboard/academy/trainers"
          className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-[#303661] bg-opacity-20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-[#303661]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-[#303661]">Manage Trainers</h3>
              <p className="text-sm text-gray-600">Add and manage expert trainers</p>
            </div>
          </div>
        </Link>

        <Link href="/system/dashboard/academy/students"
          className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-500 bg-opacity-20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-[#303661]">Manage Students</h3>
              <p className="text-sm text-gray-600">View and manage student profiles</p>
            </div>
          </div>
        </Link>

        <Link href="/system/dashboard/academy/enrollments"
          className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-500 bg-opacity-20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-[#303661]">View Enrollments</h3>
              <p className="text-sm text-gray-600">Track student progress and payments</p>
            </div>
          </div>
        </Link>

        <Link href="/system/dashboard/academy/analytics"
          className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-purple-500 bg-opacity-20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-[#303661]">Academy Analytics</h3>
              <p className="text-sm text-gray-600">View detailed performance metrics</p>
            </div>
          </div>
        </Link>

        <Link href="/system/dashboard/academy/analytics"
          className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-500 bg-opacity-20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-[#303661]">Analytics</h3>
              <p className="text-sm text-gray-600">View detailed academy analytics</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Enrollments */}
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-[#303661]">Recent Enrollments</h3>
        </div>
        <div className="p-6">
          {recentEnrollments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Course
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentEnrollments.map((enrollment) => (
                    <tr key={enrollment._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {enrollment.student?.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {enrollment.course?.title || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${enrollment.payment?.amount || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          enrollment.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          enrollment.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                          enrollment.status === 'Enrolled' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {enrollment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(enrollment.enrollmentDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No enrollments yet</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating your first course.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AcademyDashboard;




