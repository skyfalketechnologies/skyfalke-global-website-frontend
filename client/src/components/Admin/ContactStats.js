import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaEnvelope, 
  FaUsers, 
  FaBuilding, 
  FaRocket,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaTimes,
  FaCalendarAlt
} from 'react-icons/fa';

const ContactStats = ({ stats }) => {
  const statCards = [
    {
      title: 'Total Contacts',
      value: stats.total || 0,
      icon: FaEnvelope,
      color: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      title: 'New',
      value: stats.new || 0,
      icon: FaExclamationTriangle,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600'
    },
    {
      title: 'In Progress',
      value: stats.inProgress || 0,
      icon: FaClock,
      color: 'bg-orange-500',
      textColor: 'text-orange-600'
    },
    {
      title: 'Responded',
      value: stats.responded || 0,
      icon: FaCheckCircle,
      color: 'bg-green-500',
      textColor: 'text-green-600'
    },
    {
      title: 'Closed',
      value: stats.closed || 0,
      icon: FaTimes,
      color: 'bg-gray-500',
      textColor: 'text-gray-600'
    },
    {
      title: 'Spam',
      value: stats.spam || 0,
      icon: FaTimes,
      color: 'bg-red-500',
      textColor: 'text-red-600'
    }
  ];

  const typeStats = [
    {
      title: 'General Contact',
      value: stats.contact || 0,
      icon: FaEnvelope,
      color: 'bg-blue-100',
      textColor: 'text-blue-600'
    },
    {
      title: 'Consultations',
      value: stats.consultation || 0,
      icon: FaCalendarAlt,
      color: 'bg-indigo-100',
      textColor: 'text-indigo-600'
    },
    {
      title: 'Hire Us',
      value: stats.hireUs || 0,
      icon: FaUsers,
      color: 'bg-green-100',
      textColor: 'text-green-600'
    },
    {
      title: 'Quote Requests',
      value: stats.quoteRequest || 0,
      icon: FaBuilding,
      color: 'bg-purple-100',
      textColor: 'text-purple-600'
    },
    {
      title: 'Partnership',
      value: stats.partnership || 0,
      icon: FaRocket,
      color: 'bg-orange-100',
      textColor: 'text-orange-600'
    }
  ];

  return (
    <div className="mb-8">
      {/* Main Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-soft p-6"
          >
            <div className="flex items-center">
              <div className={`flex-shrink-0 w-8 h-8 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="text-white text-sm" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Type Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {typeStats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
            className="bg-white rounded-lg shadow-soft p-6"
          >
            <div className="flex items-center">
              <div className={`flex-shrink-0 w-8 h-8 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className={`${stat.textColor} text-sm`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className={`text-xl font-bold ${stat.textColor}`}>{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ContactStats;
