'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  FaPlus, 
  FaSearch, 
  FaFilter,
  FaProjectDiagram,
  FaUsers,
  FaTasks,
  FaCheckCircle,
  FaClock,
  FaSpinner,
  FaEdit,
  FaTrash,
  FaEye,
  FaCalendar,
  FaTag,
  FaChartLine
} from 'react-icons/fa';
import { apiGet, apiDelete } from '../../utils/api';

const Projects = () => {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    priority: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    completed: 0,
    onHold: 0
  });

  useEffect(() => {
    fetchProjects();
    fetchStats();
  }, [currentPage, searchTerm, filters]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 12,
        ...(searchTerm && { search: searchTerm }),
        ...(filters.status && { status: filters.status }),
        ...(filters.priority && { priority: filters.priority })
      });

      const response = await apiGet(`/api/projects?${params}`);
      if (response.data.success) {
        setProjects(response.data.data);
        setTotalPages(response.data.pagination.pages);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await apiGet('/api/projects?limit=1000');
      if (response.data.success) {
        const allProjects = response.data.data;
        setStats({
          total: allProjects.length,
          active: allProjects.filter(p => p.status === 'active').length,
          completed: allProjects.filter(p => p.status === 'completed').length,
          onHold: allProjects.filter(p => p.status === 'on-hold').length
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project? This will also delete all tasks, comments, and attachments.')) {
      return;
    }

    try {
      await apiDelete(`/api/projects/${id}`);
      fetchProjects();
      fetchStats();
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'planning': 'bg-gray-100 text-gray-800',
      'active': 'bg-green-100 text-green-800',
      'on-hold': 'bg-yellow-100 text-yellow-800',
      'completed': 'bg-blue-100 text-blue-800',
      'archived': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || colors.planning;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'low': 'bg-gray-100 text-gray-800',
      'medium': 'bg-blue-100 text-blue-800',
      'high': 'bg-orange-100 text-orange-800',
      'urgent': 'bg-red-100 text-red-800'
    };
    return colors[priority] || colors.medium;
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FaProjectDiagram className="text-primary-600" />
              Project Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage your projects, tasks, and team collaboration
            </p>
          </div>
          <button
            onClick={() => router.push('/system/dashboard/projects/new')}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <FaPlus /> New Project
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Projects</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              </div>
              <FaProjectDiagram className="text-3xl text-primary-600" />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <FaChartLine className="text-3xl text-green-600" />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
                <p className="text-2xl font-bold text-blue-600">{stats.completed}</p>
              </div>
              <FaCheckCircle className="text-3xl text-blue-600" />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">On Hold</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.onHold}</p>
              </div>
              <FaClock className="text-3xl text-yellow-600" />
            </div>
          </motion.div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="">All Status</option>
            <option value="planning">Planning</option>
            <option value="active">Active</option>
            <option value="on-hold">On Hold</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>
          <select
            value={filters.priority}
            onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <FaSpinner className="animate-spin text-4xl text-primary-600" />
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12">
          <FaProjectDiagram className="text-6xl text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No projects found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Get started by creating your first project</p>
          <button
            onClick={() => router.push('/system/dashboard/projects/new')}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg"
          >
            Create Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
            >
              {/* Project Color Bar */}
              <div 
                className="h-2 w-full"
                style={{ backgroundColor: project.color || '#6366f1' }}
              />

              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <Link href={`/system/dashboard/projects/${project._id}`}
                      className="text-xl font-bold text-gray-900 dark:text-white hover:text-primary-600 transition-colors"
                    >
                      {project.name}
                    </Link>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                      {project.description || 'No description'}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-2">
                    <button
                      onClick={() => router.push(`/system/dashboard/projects/${project._id}/edit`)}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(project._id)}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>

                {/* Tags */}
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full flex items-center gap-1"
                      >
                        <FaTag className="text-xs" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Status and Priority */}
                <div className="flex gap-2 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(project.priority)}`}>
                    {project.priority}
                  </span>
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Progress</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{project.progress || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all"
                      style={{ width: `${project.progress || 0}%` }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <FaUsers /> {project.members?.length || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaTasks /> {project.taskCount || 0}
                    </span>
                  </div>
                  {project.dueDate && (
                    <span className="flex items-center gap-1">
                      <FaCalendar />
                      {new Date(project.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Projects;

