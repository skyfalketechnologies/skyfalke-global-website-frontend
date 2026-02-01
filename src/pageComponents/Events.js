'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  FaSearch, 
  FaCalendar, 
  FaMapMarkerAlt, 
  FaUsers, 
  FaClock,
  FaFilter,
  FaArrowRight,
  FaTag,
  FaStar,
  FaPlay,
  FaGlobe,
  FaBuilding,
  FaUser,
  FaRegClock
} from 'react-icons/fa';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12
  });

  // Filters
  const [filters, setFilters] = useState({
    category: '',
    eventType: '',
    search: '',
    featured: false,
    upcoming: true,
    sortBy: 'startDate',
    sortOrder: 'asc'
  });

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'Technology', label: 'Technology' },
    { value: 'Business', label: 'Business' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Development', label: 'Development' },
    { value: 'Design', label: 'Design' },
    { value: 'AI/ML', label: 'AI/ML' },
    { value: 'Cloud Computing', label: 'Cloud Computing' },
    { value: 'Cybersecurity', label: 'Cybersecurity' },
    { value: 'Data Science', label: 'Data Science' },
    { value: 'Startup', label: 'Startup' },
    { value: 'Other', label: 'Other' }
  ];

  const eventTypes = [
    { value: '', label: 'All Types' },
    { value: 'Webinar', label: 'Webinar' },
    { value: 'Conference', label: 'Conference' },
    { value: 'Workshop', label: 'Workshop' },
    { value: 'Meetup', label: 'Meetup' },
    { value: 'Hackathon', label: 'Hackathon' },
    { value: 'Training', label: 'Training' },
    { value: 'Networking', label: 'Networking' },
    { value: 'Product Launch', label: 'Product Launch' },
    { value: 'Award Ceremony', label: 'Award Ceremony' },
    { value: 'Other', label: 'Other' }
  ];

  useEffect(() => {
    fetchEvents();
  }, [filters, pagination.currentPage]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: pagination.currentPage,
        limit: pagination.itemsPerPage,
        ...filters
      });

      const response = await fetch(`/api/events?${queryParams}`);
      const data = await response.json();

      if (data.success) {
        setEvents(data.data);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEventStatus = (event) => {
    const now = new Date();
    if (event.endDate < now) return 'completed';
    if (event.startDate <= now && event.endDate >= now) return 'ongoing';
    if (event.startDate > now) return 'upcoming';
    return 'unknown';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLocationIcon = (locationType) => {
    switch (locationType) {
      case 'virtual': return <FaGlobe className="text-blue-500" />;
      case 'physical': return <FaMapMarkerAlt className="text-red-500" />;
      case 'hybrid': return <FaBuilding className="text-purple-500" />;
      default: return <FaMapMarkerAlt className="text-gray-500" />;
    }
  };

  const getLocationText = (event) => {
    if (event.location.type === 'virtual') {
      return event.location.virtualPlatform || 'Virtual Event';
    } else if (event.location.type === 'physical') {
      return event.location.venue || `${event.location.city}, ${event.location.country}`;
    } else if (event.location.type === 'hybrid') {
      return `${event.location.venue} + Virtual`;
    }
    return 'Location TBD';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPriceText = (pricing) => {
    if (pricing.isFree) return 'Free';
    if (pricing.earlyBird && new Date() < new Date(pricing.earlyBird.validUntil)) {
      return `$${pricing.earlyBird.price}`;
    }
    if (pricing.regular) return `$${pricing.regular.price}`;
    return 'Contact for pricing';
  };

  return (
    <>
      <Helmet>
        <title>Events - Skyfalke | Technology Events & Conferences</title>
        <meta name="description" content="Discover upcoming technology events, conferences, workshops, and webinars hosted by Skyfalke. Join our community of tech professionals and innovators." />
        <meta name="keywords" content="technology events, conferences, workshops, webinars, tech meetups, skyfalke events" />
        <link rel="canonical" href="https://skyfalke.com/events" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            alt="Technology events and conferences"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary-800/80"></div>
        </div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-secondary-400 to-accent-500"></div>
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Technology Events
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Join our community of innovators, developers, and tech professionals at cutting-edge events, conferences, and workshops
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                onClick={() => {
                  document.getElementById('events-section').scrollIntoView({ 
                    behavior: 'smooth' 
                  });
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-secondary-500 text-primary-800 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-secondary-400 transition-colors flex items-center justify-center gap-2"
              >
                Explore Events
                <FaArrowRight className="text-sm" />
              </motion.button>
              <motion.button
                onClick={() => setFilters({ ...filters, featured: true })}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-primary-800 transition-colors flex items-center justify-center gap-2"
              >
                <FaStar />
                Featured Events
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Events Section */}
      <section id="events-section" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Filters */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search events..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {categories.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Event Type</label>
                <select
                  value={filters.eventType}
                  onChange={(e) => setFilters({ ...filters, eventType: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {eventTypes.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="startDate">Date</option>
                  <option value="title">Title</option>
                  <option value="createdAt">Newest</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
                <select
                  value={filters.sortOrder}
                  onChange={(e) => setFilters({ ...filters, sortOrder: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>

              <div className="flex items-end">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.featured}
                    onChange={(e) => setFilters({ ...filters, featured: e.target.checked })}
                    className="mr-2 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">Featured Only</span>
                </label>
              </div>
            </div>
          </div>

          {/* Events Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading events...</p>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-12">
              <FaCalendar className="text-6xl text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No events found</h3>
              <p className="text-gray-600">Try adjusting your filters or check back later for new events.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {events.map((event, index) => (
                  <motion.div
                    key={event._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 group cursor-pointer"
                    onClick={() => window.location.href = `/events/${event.slug}`}
                  >
                    {/* Event Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={event.featuredImage}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {event.featured && (
                        <div className="absolute top-4 left-4">
                          <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                            <FaStar />
                            Featured
                          </span>
                        </div>
                      )}
                      <div className="absolute top-4 right-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(getEventStatus(event))}`}>
                          {getEventStatus(event)}
                        </span>
                      </div>
                    </div>

                    {/* Event Content */}
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-xs font-semibold">
                          {event.eventType}
                        </span>
                        <span className="bg-secondary-100 text-secondary-800 px-2 py-1 rounded-full text-xs font-semibold">
                          {event.category}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors duration-300">
                        {event.title}
                      </h3>

                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {event.shortDescription || event.description}
                      </p>

                      {/* Event Details */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <FaCalendar className="text-primary-500" />
                          <span>{formatDate(event.startDate)}</span>
                          {event.startDate !== event.endDate && (
                            <span> - {formatDate(event.endDate)}</span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <FaClock className="text-primary-500" />
                          <span>{formatTime(event.startDate)}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          {getLocationIcon(event.location.type)}
                          <span>{getLocationText(event)}</span>
                        </div>

                        {event.capacity && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FaUsers className="text-primary-500" />
                            <span>{event.registeredAttendees?.length || 0} / {event.capacity} registered</span>
                          </div>
                        )}
                      </div>

                      {/* Price */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-lg font-bold text-primary-600">
                          {getPriceText(event.pricing)}
                        </span>
                        {event.speakers && event.speakers.length > 0 && (
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <FaUser />
                            <span>{event.speakers.length} speaker{event.speakers.length !== 1 ? 's' : ''}</span>
                          </div>
                        )}
                      </div>

                      {/* Tags */}
                      {event.tags && event.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {event.tags.slice(0, 3).map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                          {event.tags.length > 3 && (
                            <span className="text-gray-500 text-xs">+{event.tags.length - 3} more</span>
                          )}
                        </div>
                      )}

                      {/* CTA Button */}
                      <button className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors duration-300 flex items-center justify-center gap-2">
                        View Details
                        <FaArrowRight className="text-sm" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="mt-12 flex justify-center">
                  <nav className="flex items-center space-x-2">
                    <button
                      onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage - 1 })}
                      disabled={pagination.currentPage === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setPagination({ ...pagination, currentPage: page })}
                        className={`px-4 py-2 border rounded-lg ${
                          page === pagination.currentPage
                            ? 'bg-primary-600 text-white border-primary-600'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage + 1 })}
                      disabled={pagination.currentPage === pagination.totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default Events;
