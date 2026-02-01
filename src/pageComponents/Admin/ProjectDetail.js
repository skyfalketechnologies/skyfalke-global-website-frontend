'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  FaArrowLeft,
  FaEdit,
  FaPlus,
  FaUsers,
  FaTasks,
  FaCheckCircle,
  FaSpinner,
  FaCalendar,
  FaTag,
  FaComment,
  FaPaperclip,
  FaTrash,
  FaGripVertical,
  FaEllipsisV
} from 'react-icons/fa';
import { apiGet, apiPost, apiPut, apiDelete } from '../../utils/api';

const ProjectDetail = () => {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('board'); // 'board' or 'list'
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskForm, setTaskForm] = useState({
    name: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    assignees: [],
    dueDate: '',
    tags: []
  });

  useEffect(() => {
    fetchProject();
    fetchTasks();
  }, [id]);

  const fetchProject = async () => {
    try {
      const response = await apiGet(`/api/projects/${id}`);
      if (response.data.success) {
        setProject(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching project:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await apiGet(`/api/projects/${id}/tasks`);
      if (response.data.success) {
        setTasks(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const response = await apiPost(`/api/projects/${id}/tasks`, taskForm);
      if (response.data.success) {
        setShowTaskForm(false);
        setTaskForm({
          name: '',
          description: '',
          status: 'todo',
          priority: 'medium',
          assignees: [],
          dueDate: '',
          tags: []
        });
        fetchTasks();
        fetchProject();
      }
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Failed to create task');
    }
  };

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      await apiPut(`/api/projects/${id}/tasks/${taskId}`, { status: newStatus });
      fetchTasks();
      fetchProject();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await apiDelete(`/api/projects/${id}/tasks/${taskId}`);
      fetchTasks();
      fetchProject();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const columns = [
    { id: 'todo', name: 'To Do', color: 'bg-gray-100' },
    { id: 'in-progress', name: 'In Progress', color: 'bg-blue-100' },
    { id: 'in-review', name: 'In Review', color: 'bg-yellow-100' },
    { id: 'completed', name: 'Completed', color: 'bg-green-100' }
  ];

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status && !task.parentTask);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FaSpinner className="animate-spin text-4xl text-primary-600" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-6">
        <p>Project not found</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push('/system/dashboard/projects')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
        >
          <FaArrowLeft /> Back to Projects
        </button>

        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: project.color || '#6366f1' }}
              />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {project.name}
              </h1>
              <button
                onClick={() => router.push(`/system/dashboard/projects/${id}/edit`)}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600"
              >
                <FaEdit />
              </button>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {project.description || 'No description'}
            </p>

            {/* Project Stats */}
            <div className="flex items-center gap-6 text-sm">
              <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <FaUsers /> {project.members?.length || 0} members
              </span>
              <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <FaTasks /> {tasks.length} tasks
              </span>
              <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <FaCheckCircle /> {project.progress || 0}% complete
              </span>
              {project.dueDate && (
                <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <FaCalendar /> Due {new Date(project.dueDate).toLocaleDateString()}
                </span>
              )}
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all"
                  style={{ width: `${project.progress || 0}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setView(view === 'board' ? 'list' : 'board')}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300"
            >
              {view === 'board' ? 'List View' : 'Board View'}
            </button>
            <button
              onClick={() => setShowTaskForm(true)}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
            >
              <FaPlus /> New Task
            </button>
          </div>
        </div>
      </div>

      {/* Task Form Modal */}
      {showTaskForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Create New Task</h2>
            <form onSubmit={handleCreateTask}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Task Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={taskForm.name}
                    onChange={(e) => setTaskForm({ ...taskForm, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={taskForm.description}
                    onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Status
                    </label>
                    <select
                      value={taskForm.status}
                      onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="in-review">In Review</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Priority
                    </label>
                    <select
                      value={taskForm.priority}
                      onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={taskForm.dueDate}
                    onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowTaskForm(false)}
                  className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Create Task
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Kanban Board */}
      {view === 'board' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {columns.map((column) => {
            const columnTasks = getTasksByStatus(column.id);
            return (
              <div key={column.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {column.name}
                  </h3>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {columnTasks.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {columnTasks.map((task) => (
                    <motion.div
                      key={task._id}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setSelectedTask(task)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900 dark:text-white flex-1">
                          {task.name}
                        </h4>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTask(task._id);
                          }}
                          className="text-gray-400 hover:text-red-600"
                        >
                          <FaTrash className="text-sm" />
                        </button>
                      </div>
                      {task.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                          {task.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-3 text-xs">
                        <span className={`px-2 py-1 rounded ${
                          task.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                          task.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                          task.priority === 'medium' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {task.priority}
                        </span>
                        {task.dueDate && (
                          <span className="text-gray-600 dark:text-gray-400">
                            <FaCalendar className="inline mr-1" />
                            {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      {task.assignees && task.assignees.length > 0 && (
                        <div className="flex items-center gap-2 mt-2">
                          {task.assignees.slice(0, 3).map((assignee) => (
                            <div
                              key={assignee._id}
                              className="w-6 h-6 rounded-full bg-primary-600 text-white flex items-center justify-center text-xs"
                              title={assignee.name}
                            >
                              {assignee.name.charAt(0)}
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))}
                  <button
                    onClick={() => {
                      setTaskForm({ ...taskForm, status: column.id });
                      setShowTaskForm(true);
                    }}
                    className="w-full py-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary-600 transition-colors"
                  >
                    + Add Task
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Task</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Assignees</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {tasks.map((task) => (
                <tr key={task._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{task.name}</div>
                      {task.description && (
                        <div className="text-sm text-gray-500 dark:text-gray-400">{task.description}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={task.status}
                      onChange={(e) => handleUpdateTaskStatus(task._id, e.target.value)}
                      className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800"
                    >
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="in-review">In Review</option>
                      <option value="completed">Completed</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      task.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                      task.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                      task.priority === 'medium' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex -space-x-2">
                      {task.assignees?.slice(0, 3).map((assignee) => (
                        <div
                          key={assignee._id}
                          className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center text-xs border-2 border-white dark:border-gray-800"
                          title={assignee.name}
                        >
                          {assignee.name.charAt(0)}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDeleteTask(task._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;

