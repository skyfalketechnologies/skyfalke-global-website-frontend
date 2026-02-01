'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const AcademyEnrollments = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'All',
    course: 'All',
    search: ''
  });

  useEffect(() => {
    fetchEnrollments();
  }, [filters]);

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.status !== 'All') params.append('status', filters.status);
      if (filters.course !== 'All') params.append('course', filters.course);
      if (filters.search) params.append('search', filters.search);

      const response = await fetch(`/api/academy/enrollments?${params}`);
      const data = await response.json();
      setEnrollments(data.enrollments || []);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (enrollmentId, newStatus) => {
    try {
      const response = await fetch(`/api/academy/enrollments/${enrollmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setEnrollments(enrollments.map(enrollment => 
          enrollment._id === enrollmentId 
            ? { ...enrollment, status: newStatus }
            : enrollment
        ));
      } else {
        alert('Failed to update enrollment status');
      }
    } catch (error) {
      console.error('Error updating enrollment:', error);
      alert('Error updating enrollment');
    }
  };

  const handleProgressUpdate = async (enrollmentId, newProgress) => {
    try {
      const response = await fetch(`/api/academy/enrollments/${enrollmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ progress: newProgress })
      });

      if (response.ok) {
        setEnrollments(enrollments.map(enrollment => 
          enrollment._id === enrollmentId 
            ? { ...enrollment, progress: newProgress }
            : enrollment
        ));
      } else {
        alert('Failed to update progress');
      }
    } catch (error) {
      console.error('Error updating progress:', error);
      alert('Error updating progress');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Enrolled': return 'bg-blue-100 text-blue-800';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Dropped': return 'bg-red-100 text-red-800';
      case 'Suspended': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#303661] mb-2">Manage Enrollments</h1>
        <p className="text-gray-600">View and manage student enrollments</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e0ae00] focus:border-transparent"
            >
              <option value="All">All Statuses</option>
              <option value="Enrolled">Enrolled</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Dropped">Dropped</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
            <select
              value={filters.course}
              onChange={(e) => setFilters(prev => ({ ...prev, course: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e0ae00] focus:border-transparent"
            >
              <option value="All">All Courses</option>
              {/* Add course options here */}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              placeholder="Search by student name..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e0ae00] focus:border-transparent"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={() => setFilters({ status: 'All', course: 'All', search: '' })}
              className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
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
                  Enrollment Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {enrollments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    No enrollments found.
                  </td>
                </tr>
              ) : (
                enrollments.map((enrollment) => (
                  <tr key={enrollment._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-[#e0ae00] flex items-center justify-center">
                            <span className="text-[#303661] font-semibold text-sm">
                              {enrollment.student?.name?.charAt(0) || 'S'}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {enrollment.student?.name || 'Unknown Student'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {enrollment.student?.email || 'No email'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{enrollment.course?.title || 'Unknown Course'}</div>
                      <div className="text-sm text-gray-500">{enrollment.course?.category || ''}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(enrollment.enrollmentDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={enrollment.status}
                        onChange={(e) => handleStatusChange(enrollment._id, e.target.value)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(enrollment.status)}`}
                      >
                        <option value="Enrolled">Enrolled</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Dropped">Dropped</option>
                        <option value="Suspended">Suspended</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-[#e0ae00] h-2 rounded-full" 
                            style={{ width: `${enrollment.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{enrollment.progress}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={enrollment.progress}
                        onChange={(e) => handleProgressUpdate(enrollment._id, parseInt(e.target.value))}
                        className="w-full mt-1"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ${enrollment.payment?.amount || 0}
                      </div>
                      <div className="text-sm text-gray-500">
                        {enrollment.payment?.status || 'Unknown'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link href={`/system/dashboard/academy/enrollments/${enrollment._id}`}
                          className="text-[#e0ae00] hover:text-[#d4a000]"
                        >
                          View Details
                        </Link>
                        {enrollment.status === 'Completed' && !enrollment.certificateIssued && (
                          <button
                            onClick={() => {
                              // Handle certificate issuance
                              console.log('Issue certificate for', enrollment._id);
                            }}
                            className="text-green-600 hover:text-green-900"
                          >
                            Issue Certificate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AcademyEnrollments;

