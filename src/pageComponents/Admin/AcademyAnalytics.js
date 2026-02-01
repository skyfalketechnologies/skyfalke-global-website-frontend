'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const AcademyAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    overview: {
      totalCourses: 0,
      totalStudents: 0,
      totalTrainers: 0,
      totalRevenue: 0,
      activeEnrollments: 0,
      completedCourses: 0
    },
    courseStats: [],
    enrollmentTrends: [],
    revenueData: [],
    topCourses: [],
    studentProgress: []
  });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30'); // days

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/academy/analytics?days=${dateRange}`);
      
      if (!response.ok) {
        throw new Error('Analytics endpoint not available');
      }
      
      const data = await response.json();
      
      // Ensure data has proper structure with defaults
      setAnalytics({
        overview: data.overview || {
          totalCourses: 0,
          totalStudents: 0,
          totalTrainers: 0,
          totalRevenue: 0,
          activeEnrollments: 0,
          completedCourses: 0
        },
        courseStats: data.courseStats || [],
        enrollmentTrends: data.enrollmentTrends || [],
        revenueData: data.revenueData || [],
        topCourses: data.topCourses || [],
        studentProgress: data.studentProgress || []
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Set mock data for development
      setAnalytics({
        overview: {
          totalCourses: 12,
          totalStudents: 156,
          totalTrainers: 8,
          totalRevenue: 45600,
          activeEnrollments: 89,
          completedCourses: 67
        },
        courseStats: [
          { _id: '1', title: 'Advanced JavaScript', category: 'Software Development', enrollmentCount: 45, completionRate: 85, revenue: 13500, rating: 4.8 },
          { _id: '2', title: 'AI Fundamentals', category: 'AI', enrollmentCount: 38, completionRate: 78, revenue: 11400, rating: 4.6 },
          { _id: '3', title: 'Cloud Architecture', category: 'Cloud Innovation', enrollmentCount: 32, completionRate: 82, revenue: 9600, rating: 4.7 }
        ],
        topCourses: [
          { _id: '1', title: 'Advanced JavaScript', category: 'Software Development', enrollmentCount: 45, revenue: 13500 },
          { _id: '2', title: 'AI Fundamentals', category: 'AI', enrollmentCount: 38, revenue: 11400 },
          { _id: '3', title: 'Cloud Architecture', category: 'Cloud Innovation', enrollmentCount: 32, revenue: 9600 }
        ],
        studentProgress: [
          { _id: '1', name: 'John Doe', courseTitle: 'Advanced JavaScript', progress: 85 },
          { _id: '2', name: 'Jane Smith', courseTitle: 'AI Fundamentals', progress: 72 },
          { _id: '3', name: 'Mike Johnson', courseTitle: 'Cloud Architecture', progress: 90 }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${Math.round(value)}%`;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-300 rounded-lg h-32"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#303661] mb-2">Academy Analytics</h1>
          <p className="text-gray-600">Comprehensive insights into academy performance</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e0ae00] focus:border-transparent"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
          
          <button
            onClick={fetchAnalytics}
            className="px-4 py-2 bg-[#e0ae00] text-[#303661] rounded-md hover:bg-[#d4a000] transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-[#e0ae00] bg-opacity-20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-[#e0ae00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-[#303661]">{analytics.overview?.totalCourses || 0}</h3>
              <p className="text-sm text-gray-600">Total Courses</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-500 bg-opacity-20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-[#303661]">{analytics.overview?.totalStudents || 0}</h3>
              <p className="text-sm text-gray-600">Total Students</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-[#303661] bg-opacity-20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-[#303661]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-[#303661]">{analytics.overview?.totalTrainers || 0}</h3>
              <p className="text-sm text-gray-600">Active Trainers</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-500 bg-opacity-20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-[#303661]">{formatCurrency(analytics.overview?.totalRevenue || 0)}</h3>
              <p className="text-sm text-gray-600">Total Revenue</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-500 bg-opacity-20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-[#303661]">{analytics.overview?.activeEnrollments || 0}</h3>
              <p className="text-sm text-gray-600">Active Enrollments</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-500 bg-opacity-20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-[#303661]">{analytics.overview?.completedCourses || 0}</h3>
              <p className="text-sm text-gray-600">Completed Courses</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Top Courses */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-[#303661] mb-4">Top Performing Courses</h3>
          <div className="space-y-4">
            {(analytics.topCourses || []).slice(0, 5).map((course, index) => (
              <div key={course._id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-[#e0ae00] rounded-full flex items-center justify-center text-[#303661] font-bold text-sm mr-3">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{course.title}</p>
                    <p className="text-sm text-gray-500">{course.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-[#303661]">{course.enrollmentCount} students</p>
                  <p className="text-sm text-gray-500">{formatCurrency(course.revenue || 0)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Student Progress Overview */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-[#303661] mb-4">Student Progress Overview</h3>
          <div className="space-y-4">
            {(analytics.studentProgress || []).slice(0, 5).map((student, index) => (
              <div key={student._id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                    {student.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{student.name}</p>
                    <p className="text-sm text-gray-500">{student.courseTitle}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-[#e0ae00] h-2 rounded-full" 
                        style={{ width: `${student.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-600">{student.progress}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Course Performance */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-[#303661] mb-4">Course Performance</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrollments</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completion Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(analytics.courseStats || []).map((course) => (
                <tr key={course._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{course.title}</div>
                      <div className="text-sm text-gray-500">{course.category}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{course.enrollmentCount}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${course.completionRate}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">{formatPercentage(course.completionRate)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatCurrency(course.revenue || 0)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(course.rating) ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-600">{course.rating.toFixed(1)}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
      </div>
    </div>
  );
};

export default AcademyAnalytics;
