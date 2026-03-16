'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  FaUsers, 
  FaDollarSign, 
  FaClock, 
  FaUserTie,
  FaSpinner,
  FaPlus,
  FaChartLine
} from 'react-icons/fa';
import { adminApiGet } from '../../utils/adminApi';
import { useAuth } from '../../contexts/AuthContext';

const HRDashboard = () => {
  const { isSuperAdmin } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    totalPayroll: 0,
    pendingPayrolls: 0
  });
  const [attendanceStats, setAttendanceStats] = useState({
    present: 0,
    absent: 0,
    late: 0
  });
  const [recentEmployees, setRecentEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSuperAdmin()) {
      alert('Access denied. Super admin role required to access HR Management.');
      router.push('/system/dashboard');
      return;
    }
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Use Promise.allSettled to handle partial failures gracefully
      const [employeesResult, payrollsResult, attendanceResult, statsResult] = await Promise.allSettled([
        adminApiGet('/api/hr/employees?limit=5'),
        adminApiGet('/api/hr/payrolls?limit=5&status=pending'),
        adminApiGet('/api/hr/attendance/stats'),
        adminApiGet('/api/hr/employees/stats')
      ]);

      // Handle employees response
      if (employeesResult.status === 'fulfilled' && employeesResult.value.success && employeesResult.value.data) {
        const employeesRes = employeesResult.value;
        setRecentEmployees(employeesRes.data.data || []);
        setStats(prev => ({
          ...prev,
          totalEmployees: employeesRes.data.pagination?.total || 0
        }));
      } else if (employeesResult.status === 'rejected') {
        console.warn('Failed to fetch employees:', employeesResult.reason);
      }

      // Handle stats response
      if (statsResult.status === 'fulfilled' && statsResult.value.success && statsResult.value.data) {
        const statsRes = statsResult.value;
        setStats(prev => ({
          ...prev,
          activeEmployees: statsRes.data.active || 0
        }));
      } else if (statsResult.status === 'rejected') {
        console.warn('Failed to fetch employee stats:', statsResult.reason);
      }

      // Handle payrolls response
      if (payrollsResult.status === 'fulfilled' && payrollsResult.value.success && payrollsResult.value.data) {
        const payrollsRes = payrollsResult.value;
        const totalNet = payrollsRes.data.data?.reduce((sum, p) => sum + (p.netSalary || 0), 0) || 0;
        setStats(prev => ({
          ...prev,
          pendingPayrolls: payrollsRes.data.pagination?.total || 0,
          totalPayroll: totalNet
        }));
      } else if (payrollsResult.status === 'rejected') {
        console.warn('Failed to fetch payrolls:', payrollsResult.reason);
      }

      // Handle attendance response
      if (attendanceResult.status === 'fulfilled' && attendanceResult.value.success && attendanceResult.value.data) {
        const attendanceRes = attendanceResult.value;
        const byStatus = attendanceRes.data.byStatus || [];
        setAttendanceStats({
          present: byStatus.find(s => s._id === 'present')?.count || 0,
          absent: byStatus.find(s => s._id === 'absent')?.count || 0,
          late: byStatus.find(s => s._id === 'late')?.count || 0
        });
      } else if (attendanceResult.status === 'rejected') {
        console.warn('Failed to fetch attendance stats:', attendanceResult.reason);
      }
    } catch (error) {
      // This catch block handles unexpected errors
      const isNetworkError = error.code === 'ERR_NETWORK' || error.message?.includes('Network Error') || !error.response;
      if (!isNetworkError) {
        console.error('Unexpected error fetching HR dashboard data:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FaSpinner className="animate-spin text-4xl text-primary-600" />
      </div>
    );
  }

  const statsCards = [
    {
      title: 'Total Employees',
      value: stats.totalEmployees,
      icon: FaUsers,
      color: 'from-blue-500 to-blue-600',
      link: '/system/dashboard/hr/employees'
    },
    {
      title: 'Active Employees',
      value: stats.activeEmployees,
      icon: FaUserTie,
      color: 'from-green-500 to-green-600',
      link: '/system/dashboard/hr/employees?status=active'
    },
    {
      title: 'Total Payroll',
      value: `KES ${stats.totalPayroll.toLocaleString()}`,
      icon: FaDollarSign,
      color: 'from-purple-500 to-purple-600',
      link: '/system/dashboard/hr/payrolls'
    },
    {
      title: 'Pending Payrolls',
      value: stats.pendingPayrolls,
      icon: FaClock,
      color: 'from-orange-500 to-orange-600',
      link: '/system/dashboard/hr/payrolls?status=pending'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold leading-7 text-gray-900 dark:text-gray-100 sm:text-3xl sm:truncate"
          >
            HR Dashboard
          </motion.h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage employees, payroll, and attendance
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
          <Link href="/system/dashboard/hr/employees/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <FaPlus className="mr-2 -ml-1 h-4 w-4" />
            Add Employee
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={stat.link}>
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                            {stat.title}
                          </dt>
                          <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                            {stat.value}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Attendance Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-gray-800 shadow rounded-lg"
      >
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
              Today's Attendance
            </h3>
            <Link href="/system/dashboard/hr/attendance"
              className="text-sm text-primary-600 hover:text-primary-500"
            >
              View all
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {attendanceStats.present}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Present</div>
            </div>
            <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {attendanceStats.absent}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Absent</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {attendanceStats.late}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Late</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Recent Employees */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white dark:bg-gray-800 shadow rounded-lg"
      >
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
              Recent Employees
            </h3>
            <Link href="/system/dashboard/hr/employees"
              className="text-sm text-primary-600 hover:text-primary-500"
            >
              View all
            </Link>
          </div>
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {recentEmployees.length > 0 ? (
                  recentEmployees.map((employee) => (
                    <tr key={employee._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {employee.personalInfo?.firstName} {employee.personalInfo?.lastName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {employee.employeeId}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {employee.employmentInfo?.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {employee.employmentInfo?.jobTitle}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          employee.employmentInfo?.status === 'active' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                        }`}>
                          {employee.employmentInfo?.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                      No employees found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HRDashboard;

