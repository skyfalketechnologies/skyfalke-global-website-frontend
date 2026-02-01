'use client';

import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  FaDownload, 
  FaExternalLinkAlt, 
  FaSearch, 
  FaFilter, 
  FaFilePdf, 
  FaFileWord, 
  FaFileExcel, 
  FaFilePowerpoint,
  FaVideo,
  FaImage,
  FaCode,
  FaChartBar,
  FaUsers,
  FaLightbulb,
  FaTools,
  FaBook,
  FaGraduationCap,
  FaArrowRight,
  FaClock,
  FaEye,
  FaHeart,
  FaShare,
  FaShoppingCart
} from 'react-icons/fa';
import SEOHead from '../components/SEO/SEOHead';
import LoadingSpinner from '../components/LoadingSpinner';

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [filteredResources, setFilteredResources] = useState([]);

  const categories = [
    'All',
    'Digital Marketing',
    'Web Design',
    'SEO & Analytics',
    'Cloud Computing',
    'Business Strategy',
    'Content Marketing',
    'Social Media',
    'E-commerce',
    'Data Analytics'
  ];

  const resourceTypes = [
    'All',
    'Templates',
    'Guides',
    'Tools',
    'Checklists',
    'E-books',
    'Webinars',
    'Videos',
    'Infographics',
    'Code Snippets'
  ];

  // Sample resources data - in production, this would come from an API
  const sampleResources = [
    {
      id: 1,
      title: 'Complete Digital Marketing Strategy Template',
      description: 'A comprehensive template to plan and execute your digital marketing campaigns across all channels.',
      category: 'Digital Marketing',
      type: 'Templates',
      fileType: 'pdf',
      downloadCount: 1250,
      rating: 4.8,
      tags: ['strategy', 'planning', 'marketing', 'template'],
      url: '/resources/digital-marketing-strategy-template.pdf',
      image: '/images/resources/marketing-strategy.jpg',
      featured: true
    },
    {
      id: 2,
      title: 'Website Speed Optimization Checklist',
      description: 'A detailed checklist to improve your website loading speed and performance.',
      category: 'SEO & Analytics',
      type: 'Checklists',
      fileType: 'pdf',
      downloadCount: 890,
      rating: 4.6,
      tags: ['performance', 'speed', 'optimization', 'checklist'],
      url: '/resources/website-speed-checklist.pdf',
      image: '/images/resources/speed-optimization.jpg',
      featured: true
    },
    {
      id: 3,
      title: 'Social Media Content Calendar Template',
      description: 'Plan and organize your social media content with this comprehensive calendar template.',
      category: 'Social Media',
      type: 'Templates',
      fileType: 'excel',
      downloadCount: 2100,
      rating: 4.9,
      tags: ['social media', 'content', 'calendar', 'planning'],
      url: '/resources/social-media-calendar.xlsx',
      image: '/images/resources/social-calendar.jpg',
      featured: false
    },
    {
      id: 4,
      title: 'E-commerce Conversion Rate Optimization Guide',
      description: 'Learn proven strategies to increase your e-commerce conversion rates and boost sales.',
      category: 'E-commerce',
      type: 'Guides',
      fileType: 'pdf',
      downloadCount: 1560,
      rating: 4.7,
      tags: ['ecommerce', 'conversion', 'optimization', 'sales'],
      url: '/resources/ecommerce-cro-guide.pdf',
      image: '/images/resources/ecommerce-guide.jpg',
      featured: true
    },
    {
      id: 5,
      title: 'Cloud Migration Planning Tool',
      description: 'Interactive tool to help you plan and execute your cloud migration strategy.',
      category: 'Cloud Computing',
      type: 'Tools',
      fileType: 'web',
      downloadCount: 450,
      rating: 4.5,
      tags: ['cloud', 'migration', 'planning', 'tool'],
      url: '/tools/cloud-migration-planner',
      image: '/images/resources/cloud-migration.jpg',
      featured: false
    },
    {
      id: 6,
      title: 'Data Analytics Dashboard Templates',
      description: 'Ready-to-use dashboard templates for Google Analytics, social media, and business metrics.',
      category: 'Data Analytics',
      type: 'Templates',
      fileType: 'excel',
      downloadCount: 980,
      rating: 4.4,
      tags: ['analytics', 'dashboard', 'metrics', 'reporting'],
      url: '/resources/analytics-dashboard-templates.xlsx',
      image: '/images/resources/analytics-dashboard.jpg',
      featured: false
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setResources(sampleResources);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    filterResources();
  }, [resources, searchTerm, selectedCategory, selectedType]);

  const filterResources = () => {
    let filtered = resources;

    if (searchTerm) {
      filtered = filtered.filter(resource =>
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(resource => resource.category === selectedCategory);
    }

    if (selectedType !== 'All') {
      filtered = filtered.filter(resource => resource.type === selectedType);
    }

    setFilteredResources(filtered);
  };

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'pdf': return <FaFilePdf className="text-red-500" />;
      case 'word': return <FaFileWord className="text-blue-500" />;
      case 'excel': return <FaFileExcel className="text-green-500" />;
      case 'powerpoint': return <FaFilePowerpoint className="text-orange-500" />;
      case 'video': return <FaVideo className="text-purple-500" />;
      case 'image': return <FaImage className="text-pink-500" />;
      case 'code': return <FaCode className="text-gray-500" />;
      case 'web': return <FaExternalLinkAlt className="text-blue-500" />;
      default: return <FaFilePdf className="text-gray-500" />;
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Digital Marketing': return <FaChartBar className="text-blue-500" />;
      case 'Web Design': return <FaCode className="text-purple-500" />;
      case 'SEO & Analytics': return <FaSearch className="text-green-500" />;
      case 'Cloud Computing': return <FaTools className="text-orange-500" />;
      case 'Business Strategy': return <FaLightbulb className="text-yellow-500" />;
      case 'Content Marketing': return <FaBook className="text-indigo-500" />;
      case 'Social Media': return <FaUsers className="text-pink-500" />;
      case 'E-commerce': return <FaShoppingCart className="text-red-500" />;
      case 'Data Analytics': return <FaChartBar className="text-teal-500" />;
      default: return <FaFilePdf className="text-gray-500" />;
    }
  };

  const handleDownload = (resource) => {
    // Track download in analytics
    console.log('Downloaded:', resource.title);
    // In production, this would track the download event
  };

  const handleShare = (resource) => {
    // Implement sharing functionality
    console.log('Shared:', resource.title);
  };

  if (loading) {
    return <LoadingSpinner text="Loading resources..." />;
  }

  return (
    <>
      <SEOHead
        pageType="resources"
        title="Free Marketing & Business Resources | Skyfalke"
        description="Download free templates, guides, tools, and resources for digital marketing, web design, SEO, and business growth. Expert-created resources to help you succeed online."
        keywords="free marketing templates, business resources, digital marketing guides, SEO tools, web design templates, business strategy, content marketing, social media tools"
        canonical="https://skyfalke.com/resources"
      />

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white py-20">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto text-center">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-5xl font-bold mb-6"
              >
                Free Resources & Tools
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xl md:text-2xl text-blue-100 mb-8"
              >
                Expert-created templates, guides, and tools to help your business grow online
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-wrap justify-center gap-4 text-sm"
              >
                <span className="bg-white/20 px-4 py-2 rounded-full">100+ Free Resources</span>
                <span className="bg-white/20 px-4 py-2 rounded-full">Expert-Created</span>
                <span className="bg-white/20 px-4 py-2 rounded-full">Regular Updates</span>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="py-8 bg-white border-b border-gray-200">
          <div className="container-custom">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search resources..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="lg:w-64">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Type Filter */}
              <div className="lg:w-64">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {resourceTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Resources Grid */}
        <section className="py-16">
          <div className="container-custom">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                {filteredResources.length} Resource{filteredResources.length !== 1 ? 's' : ''} Found
              </h2>
              <div className="text-sm text-gray-600">
                Showing {filteredResources.length} of {resources.length} resources
              </div>
            </div>

            {filteredResources.length === 0 ? (
              <div className="text-center py-16">
                <FaFilePdf className="mx-auto text-6xl text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No resources found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('All');
                    setSelectedType('All');
                  }}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredResources.map((resource, index) => (
                  <motion.div
                    key={resource.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                  >
                    {/* Resource Image */}
                    <div className="relative h-48 bg-gray-200 overflow-hidden">
                      {resource.image ? (
                        <img
                          src={resource.image}
                          alt={resource.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
                          {getCategoryIcon(resource.category)}
                        </div>
                      )}
                      
                      {/* Featured Badge */}
                      {resource.featured && (
                        <div className="absolute top-4 left-4">
                          <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                            Featured
                          </span>
                        </div>
                      )}

                      {/* File Type Icon */}
                      <div className="absolute top-4 right-4">
                        <div className="bg-white/90 backdrop-blur-sm p-2 rounded-full">
                          {getFileIcon(resource.fileType)}
                        </div>
                      </div>
                    </div>

                    {/* Resource Content */}
                    <div className="p-6">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                          {resource.category}
                        </span>
                        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                          {resource.type}
                        </span>
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {resource.title}
                      </h3>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {resource.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {resource.tags.slice(0, 3).map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center">
                            <FaDownload className="mr-1" />
                            {resource.downloadCount.toLocaleString()}
                          </span>
                          <span className="flex items-center">
                            <FaEye className="mr-1" />
                            {resource.rating}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleDownload(resource)}
                          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                        >
                          <FaDownload />
                          <span>Download</span>
                        </button>
                        <button
                          onClick={() => handleShare(resource)}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <FaShare />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-blue-900 text-white py-16">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">
                Need Custom Resources?
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Our team can create custom templates, tools, and resources tailored to your specific business needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact"
                  className="bg-white text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center space-x-2"
                >
                  <span>Get Custom Resources</span>
                  <FaArrowRight />
                </Link>
                <Link href="/services"
                  className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
                >
                  View Our Services
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Resources;
