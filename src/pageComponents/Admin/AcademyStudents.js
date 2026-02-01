'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const AcademyStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'All',
    course: 'All',
    search: ''
  });

  useEffect(() => {
    fetchStudents();
  }, [filters]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.status !== 'All') params.append('status', filters.status);
      if (filters.course !== 'All') params.append('course', filters.course);
      if (filters.search) params.append('search', filters.search);

      const response = await fetch(`/api/academy/students?${params}`);
      const data = await response.json();
      setStudents(data.students || []);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (studentId, newStatus) => {
    try {
      const response = await fetch(`/api/academy/students/${studentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setStudents(students.map(student => 
          student._id === studentId 
            ? { ...student, status: newStatus }
            : student
        ));
      } else {
        alert('Failed to update student status');
      }
    } catch (error) {
      console.error('Error updating student:', error);
      alert('Error updating student');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Inactive': return 'bg-gray-100 text-gray-800';
      case 'Suspended': return 'bg-red-100 text-red-800';
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
        <h1 className="text-3xl font-bold text-[#303661] mb-2">Manage Students</h1>
        <p className="text-gray-600">View and manage academy students</p>
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
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
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
              placeholder="Search by name or email..."
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
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Enrollments
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completed Courses
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Join Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    No students found.
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {student.avatar ? (
                            <img className="h-10 w-10 rounded-full" src={student.avatar} alt={student.name} />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-[#e0ae00] flex items-center justify-center">
                              <span className="text-[#303661] font-semibold text-sm">
                                {student.name?.charAt(0) || 'S'}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{student.name}</div>
                          <div className="text-sm text-gray-500">ID: {student.studentId || 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{student.email}</div>
                      <div className="text-sm text-gray-500">{student.phone || 'No phone'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{student.totalEnrollments || 0}</div>
                      <div className="text-sm text-gray-500">
                        {student.activeEnrollments || 0} active
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{student.completedCourses || 0}</div>
                      <div className="text-sm text-gray-500">
                        {student.certificates || 0} certificates
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={student.status || 'Active'}
                        onChange={(e) => handleStatusChange(student._id, e.target.value)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(student.status || 'Active')}`}
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Suspended">Suspended</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(student.joinDate || student.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link href={`/system/dashboard/academy/students/${student._id}`}
                          className="text-[#e0ae00] hover:text-[#d4a000]"
                        >
                          View Profile
                        </Link>
                        <Link href={`/system/dashboard/academy/students/${student._id}/enrollments`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Enrollments
                        </Link>
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

export default AcademyStudents;

