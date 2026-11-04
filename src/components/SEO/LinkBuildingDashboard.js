import React, { useState, useEffect } from 'react';
import { 
  FaLink, 
  FaExternalLinkAlt, 
  FaChartLine, 
  FaSearch, 
  FaFilter, 
  FaDownload, 
  FaUpload, 
  FaEye, 
  FaEdit, 
  FaTrash, 
  FaPlus, 
  FaCheck, 
  FaTimes, 
  FaExclamationTriangle,
  FaArrowUp,
  FaArrowDown,
  FaMinus,
  FaGlobe,
  FaShieldAlt,
  FaFlag,
  FaCalendarAlt,
  FaUsers,
  FaTarget,
  FaTrophy,
  FaLightbulb
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { getBacklinks, getInternalLinks, getLinkAnalytics } from '../../utils/linkTracking';
import InternalLinkingSuggestions from './InternalLinkingSuggestions';

const LinkBuildingDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [backlinks, setBacklinks] = useState([]);
  const [internalLinks, setInternalLinks] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterQuality, setFilterQuality] = useState('all');
  const [selectedLinks, setSelectedLinks] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [backlinksData, internalLinksData, analyticsData] = await Promise.all([
        getBacklinks(),
        getInternalLinks(),
        getLinkAnalytics('30d')
      ]);
      
      setBacklinks(backlinksData.data || []);
      setInternalLinks(internalLinksData.data || []);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error fetching link data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBacklinks = backlinks.filter(link => {
    const matchesSearch = link.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         link.anchorText.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         link.domain.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || link.status === filterStatus;
    const matchesQuality = filterQuality === 'all' || link.quality === filterQuality;
    
    return matchesSearch && matchesStatus && matchesQuality;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <FaCheck className="text-green-500" />;
      case 'broken': return <FaTimes className="text-red-500" />;
      case 'redirected': return <FaArrowUp className="text-yellow-500" />;
      case 'removed': return <FaMinus className="text-gray-500" />;
      default: return <FaExclamationTriangle className="text-orange-500" />;
    }
  };

  const getQualityColor = (quality) => {
    switch (quality) {
      case 'high': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-red-600 bg-red-50 border-red-200';
      case 'spam': return 'text-red-800 bg-red-100 border-red-300';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getLinkTypeIcon = (linkType) => {
    switch (linkType) {
      case 'external': return <FaExternalLinkAlt className="text-blue-500" />;
      case 'internal': return <FaLink className="text-green-500" />;
      case 'nofollow': return <FaShieldAlt className="text-orange-500" />;
      case 'sponsored': return <FaFlag className="text-purple-500" />;
      default: return <FaLink className="text-gray-500" />;
    }
  };

  const handleLinkSelect = (linkId) => {
    if (selectedLinks.includes(linkId)) {
      setSelectedLinks(selectedLinks.filter(id => id !== linkId));
    } else {
      setSelectedLinks([...selectedLinks, linkId]);
    }
  };

  const handleBulkAction = (action) => {
    console.log(`Bulk action: ${action} on links:`, selectedLinks);
    // Implement bulk actions
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading link building dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Link Building Dashboard</h1>
          <p className="text-gray-600">Monitor and manage your backlinks and internal linking strategy</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FaLink className="text-blue-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Backlinks</p>
                <p className="text-2xl font-bold text-gray-900">{backlinks.length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <FaChartLine className="text-green-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Links</p>
                <p className="text-2xl font-bold text-gray-900">
                  {backlinks.filter(link => link.status === 'active').length}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <FaTrophy className="text-yellow-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">High Quality</p>
                <p className="text-2xl font-bold text-gray-900">
                  {backlinks.filter(link => link.quality === 'high').length}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FaGlobe className="text-purple-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Referring Domains</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(backlinks.map(link => link.domain)).size}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: FaChartLine },
                { id: 'backlinks', label: 'Backlinks', icon: FaExternalLinkAlt },
                { id: 'internal', label: 'Internal Links', icon: FaLink },
                { id: 'outreach', label: 'Outreach', icon: FaUsers },
                { id: 'suggestions', label: 'Suggestions', icon: FaLightbulb }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Link Quality Distribution</h3>
                    <div className="space-y-3">
                      {['high', 'medium', 'low', 'spam'].map(quality => {
                        const count = backlinks.filter(link => link.quality === quality).length;
                        const percentage = backlinks.length > 0 ? (count / backlinks.length) * 100 : 0;
                        return (
                          <div key={quality} className="flex items-center justify-between">
                            <span className="capitalize font-medium">{quality}</span>
                            <div className="flex items-center space-x-3">
                              <div className="w-32 bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${
                                    quality === 'high' ? 'bg-green-500' :
                                    quality === 'medium' ? 'bg-yellow-500' :
                                    quality === 'low' ? 'bg-red-500' : 'bg-red-800'
                                  }`}
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-600">{count}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                      {backlinks.slice(0, 5).map(link => (
                        <div key={link.id} className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            {getStatusIcon(link.status)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {link.domain}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(link.lastChecked).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex-shrink-0">
                            <span className={`px-2 py-1 text-xs rounded-full ${getQualityColor(link.quality)}`}>
                              {link.quality}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Backlinks Tab */}
            {activeTab === 'backlinks' && (
              <div className="space-y-6">
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search backlinks..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="broken">Broken</option>
                    <option value="redirected">Redirected</option>
                    <option value="removed">Removed</option>
                  </select>
                  <select
                    value={filterQuality}
                    onChange={(e) => setFilterQuality(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Quality</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                    <option value="spam">Spam</option>
                  </select>
                </div>

                {/* Bulk Actions */}
                {selectedLinks.length > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-blue-800">
                        {selectedLinks.length} link{selectedLinks.length !== 1 ? 's' : ''} selected
                      </span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleBulkAction('export')}
                          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Export
                        </button>
                        <button
                          onClick={() => handleBulkAction('check')}
                          className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          Check Status
                        </button>
                        <button
                          onClick={() => setSelectedLinks([])}
                          className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Backlinks Table */}
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left">
                            <input
                              type="checkbox"
                              checked={selectedLinks.length === filteredBacklinks.length && filteredBacklinks.length > 0}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedLinks(filteredBacklinks.map(link => link.id));
                                } else {
                                  setSelectedLinks([]);
                                }
                              }}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Link
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Quality
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Type
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            DA
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredBacklinks.map(link => (
                          <tr key={link.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="checkbox"
                                checked={selectedLinks.includes(link.id)}
                                onChange={() => handleLinkSelect(link.id)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                    <FaGlobe className="text-gray-500" />
                                  </div>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {link.domain}
                                  </div>
                                  <div className="text-sm text-gray-500 truncate max-w-xs">
                                    {link.anchorText || 'No anchor text'}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                {getStatusIcon(link.status)}
                                <span className="ml-2 text-sm text-gray-900 capitalize">
                                  {link.status}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs rounded-full ${getQualityColor(link.quality)}`}>
                                {link.quality}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                {getLinkTypeIcon(link.linkType)}
                                <span className="ml-2 text-sm text-gray-900 capitalize">
                                  {link.linkType}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {link.metrics?.domainAuthority || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <button className="text-blue-600 hover:text-blue-900">
                                  <FaEye />
                                </button>
                                <button className="text-green-600 hover:text-green-900">
                                  <FaEdit />
                                </button>
                                <button className="text-red-600 hover:text-red-900">
                                  <FaTrash />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Internal Links Tab */}
            {activeTab === 'internal' && (
              <div className="space-y-6">
                <div className="text-center py-12">
                  <FaLink className="mx-auto text-6xl text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Internal Links</h3>
                  <p className="text-gray-600 mb-6">Manage your internal linking strategy</p>
                  <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <FaPlus className="inline mr-2" />
                    Add Internal Link
                  </button>
                </div>
              </div>
            )}

            {/* Outreach Tab */}
            {activeTab === 'outreach' && (
              <div className="space-y-6">
                <div className="text-center py-12">
                  <FaUsers className="mx-auto text-6xl text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Outreach Campaigns</h3>
                  <p className="text-gray-600 mb-6">Manage your link building outreach efforts</p>
                  <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <FaPlus className="inline mr-2" />
                    Start New Campaign
                  </button>
                </div>
              </div>
            )}

            {/* Suggestions Tab */}
            {activeTab === 'suggestions' && (
              <div className="space-y-6">
                <InternalLinkingSuggestions
                  pageType="overview"
                  content=""
                  keywords={['digital marketing', 'cloud hosting', 'web design']}
                  onLinkSelect={(suggestion, selected) => {
                    console.log('Link selected:', suggestion, selected);
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkBuildingDashboard;
