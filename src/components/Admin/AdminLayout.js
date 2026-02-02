'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  FaTachometerAlt,
  FaBlog,
  FaFileAlt,
  FaEnvelope,
  FaChartBar,
  FaBriefcase,
  FaUsers,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaBell,
  FaSearch,
  FaHandshake,
  FaCalendar,
  FaSun,
  FaMoon,
  FaRss,
  FaUserTie,
  FaClipboardList,
  FaShoppingCart,
  FaBox,
  FaBuilding,
  FaSitemap,
  FaFileInvoice,
  FaGraduationCap,
  FaBookOpen,
  FaDollarSign,
  FaClock,
  FaWallet,
  FaChartLine,
  FaChevronDown,
  FaChevronRight,
  FaWhatsapp,
  FaProjectDiagram,
  FaTasks,
  FaUsersCog,
  FaFileContract
} from 'react-icons/fa';
import NotificationDropdown from './NotificationDropdown';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, isAuthenticated, isSuperAdmin } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();

  // Initialize expanded groups based on active routes
  const getInitialExpandedGroups = () => {
    const groups = {
      overview: true, // Always expanded
      content: false,
      communication: false,
      projects: false,
      academy: false,
      careers: false,
      ecommerce: false,
      hr: false,
      accounting: false,
      system: false
    };

    // Auto-expand HR if any HR route is active
    if (pathname.startsWith('/system/dashboard/hr')) {
      groups.hr = true;
    }

    // Auto-expand Accounting if any Accounting route is active
    if (pathname.startsWith('/system/dashboard/accounting') || 
        pathname.startsWith('/system/dashboard/invoices')) {
      groups.accounting = true;
    }

    // Auto-expand Projects if any Projects route is active
    if (pathname.startsWith('/system/dashboard/projects')) {
      groups.projects = true;
    }

    // Auto-expand System if any System route is active
    if (pathname.startsWith('/system/dashboard/staff') ||
        pathname.startsWith('/system/dashboard/sitemap') ||
        pathname.startsWith('/system/dashboard/settings')) {
      groups.system = true;
    }

    return groups;
  };

  const [expandedGroups, setExpandedGroups] = useState(getInitialExpandedGroups());

  // Update expanded groups when location changes
  useEffect(() => {
    setExpandedGroups(prev => {
      const updated = { ...prev };
      
      // Auto-expand HR if any HR route is active
      if (pathname.startsWith('/system/dashboard/hr')) {
        updated.hr = true;
      }

      // Auto-expand Accounting if any Accounting route is active
      if (pathname.startsWith('/system/dashboard/accounting') || 
          pathname.startsWith('/system/dashboard/invoices')) {
        updated.accounting = true;
      }

      // Auto-expand Projects if any Projects route is active
      if (pathname.startsWith('/system/dashboard/projects')) {
        updated.projects = true;
      }

      // Auto-expand System if any System route is active
      if (pathname.startsWith('/system/dashboard/staff') ||
          pathname.startsWith('/system/dashboard/sitemap') ||
          pathname.startsWith('/system/dashboard/settings')) {
        updated.system = true;
      }

      return updated;
    });
  }, [pathname]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/system/portal/access');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated()) {
    return null; // Will redirect via useEffect
  }

  const navigationGroups = [
    {
      id: 'overview',
      name: 'Overview & Analytics',
      icon: FaChartBar,
      items: [
        { name: 'Dashboard', href: '/system/dashboard', icon: FaTachometerAlt, current: pathname === '/system/dashboard' },
        { name: 'Analytics', href: '/system/dashboard/analytics', icon: FaChartBar, current: pathname === '/system/dashboard/analytics' },
      ]
    },
    {
      id: 'content',
      name: 'Content Management',
      icon: FaFileAlt,
      items: [
        // { name: 'Content', href: '/system/dashboard/content', icon: FaFileAlt, current: pathname === '/system/dashboard/content' },
        { name: 'Blogs', href: '/system/dashboard/blogs', icon: FaBlog, current: pathname === '/system/dashboard/blogs' },
        { name: 'Events', href: '/system/dashboard/events', icon: FaCalendar, current: pathname === '/system/dashboard/events' },
        { name: 'Case Studies', href: '/system/dashboard/case-studies', icon: FaBuilding, current: pathname === '/system/dashboard/case-studies' },
      ]
    },
    {
      id: 'communication',
      name: 'Communications',
      icon: FaEnvelope,
      items: [
        { name: 'Leads', href: '/system/dashboard/leads', icon: FaUser, current: pathname.startsWith('/system/dashboard/leads') },
        { name: 'Tenders & Opportunities', href: '/system/dashboard/tenders', icon: FaFileContract, current: pathname.startsWith('/system/dashboard/tenders') },
        { name: 'Contacts', href: '/system/dashboard/contacts', icon: FaEnvelope, current: pathname === '/system/dashboard/contacts' },
        { name: 'WhatsApp', href: '/system/dashboard/whatsapp', icon: FaWhatsapp, current: pathname.startsWith('/system/dashboard/whatsapp') },
        { name: 'Email Campaigns', href: '/system/dashboard/campaigns', icon: FaEnvelope, current: pathname.startsWith('/system/dashboard/campaigns') },
        { name: 'Partnerships', href: '/system/dashboard/partnerships', icon: FaHandshake, current: pathname === '/system/dashboard/partnerships' },
        { name: 'Subscriptions', href: '/system/dashboard/subscriptions', icon: FaRss, current: pathname === '/system/dashboard/subscriptions' },
      ]
    },
    {
      id: 'projects',
      name: 'Project Management',
      icon: FaProjectDiagram,
      items: [
        { name: 'Projects', href: '/system/dashboard/projects', icon: FaProjectDiagram, current: pathname.startsWith('/system/dashboard/projects') },
      ]
    },
    {
      id: 'academy',
      name: 'Academy',
      icon: FaGraduationCap,
      items: [
        { name: 'Academy Dashboard', href: '/system/dashboard/academy', icon: FaGraduationCap, current: pathname === '/system/dashboard/academy' },
        { name: 'Courses', href: '/system/dashboard/academy/courses', icon: FaBookOpen, current: pathname === '/system/dashboard/academy/courses' },
        { name: 'Trainers', href: '/system/dashboard/academy/trainers', icon: FaUserTie, current: pathname === '/system/dashboard/academy/trainers' },
        { name: 'Students', href: '/system/dashboard/academy/students', icon: FaUsers, current: pathname === '/system/dashboard/academy/students' },
        { name: 'Enrollments', href: '/system/dashboard/academy/enrollments', icon: FaClipboardList, current: pathname === '/system/dashboard/academy/enrollments' },
        { name: 'Academy Analytics', href: '/system/dashboard/academy/analytics', icon: FaChartBar, current: pathname === '/system/dashboard/academy/analytics' },
      ]
    },
    {
      id: 'careers',
      name: 'Careers',
      icon: FaBriefcase,
      items: [
        { name: 'Careers Dashboard', href: '/system/dashboard/careers', icon: FaBriefcase, current: pathname === '/system/dashboard/careers' },
        { name: 'Jobs', href: '/system/dashboard/jobs', icon: FaUserTie, current: pathname === '/system/dashboard/jobs' },
        { name: 'Applications', href: '/system/dashboard/applications', icon: FaClipboardList, current: pathname === '/system/dashboard/applications' },
      ]
    },
    {
      id: 'ecommerce',
      name: 'E-Commerce',
      icon: FaShoppingCart,
      items: [
        { name: 'Shop Dashboard', href: '/system/dashboard/shop', icon: FaShoppingCart, current: pathname === '/system/dashboard/shop' },
        { name: 'Products', href: '/system/dashboard/shop/products', icon: FaBox, current: pathname === '/system/dashboard/shop/products' },
        { name: 'Orders', href: '/system/dashboard/orders', icon: FaClipboardList, current: pathname === '/system/dashboard/orders' },
        { name: 'Quotations', href: '/system/dashboard/quotations', icon: FaFileInvoice, current: pathname.startsWith('/system/dashboard/quotations') },
      ]
    },
    {
      id: 'hr',
      name: 'HR Management',
      icon: FaUserTie,
      items: [
        { name: 'HR Dashboard', href: '/system/dashboard/hr', icon: FaUserTie, current: pathname === '/system/dashboard/hr' },
        { name: 'Employees', href: '/system/dashboard/hr/employees', icon: FaUsers, current: pathname.startsWith('/system/dashboard/hr/employees') },
        { name: 'Payroll', href: '/system/dashboard/hr/payrolls', icon: FaDollarSign, current: pathname.startsWith('/system/dashboard/hr/payrolls') },
        { name: 'Attendance', href: '/system/dashboard/hr/attendance', icon: FaClock, current: pathname.startsWith('/system/dashboard/hr/attendance') },
      ]
    },
    {
      id: 'accounting',
      name: 'Accounting & Finance',
      icon: FaWallet,
      items: [
        { name: 'Accounting Dashboard', href: '/system/dashboard/accounting', icon: FaChartBar, current: pathname === '/system/dashboard/accounting' },
        { name: 'Expenses', href: '/system/dashboard/accounting/expenses', icon: FaFileInvoice, current: pathname.startsWith('/system/dashboard/accounting/expenses') },
        { name: 'Accounts', href: '/system/dashboard/accounting/accounts', icon: FaWallet, current: pathname.startsWith('/system/dashboard/accounting/accounts') },
        { name: 'Transactions', href: '/system/dashboard/accounting/transactions', icon: FaChartLine, current: pathname.startsWith('/system/dashboard/accounting/transactions') },
        { name: 'Financial Reports', href: '/system/dashboard/accounting/reports', icon: FaFileAlt, current: pathname.startsWith('/system/dashboard/accounting/reports') },
        { name: 'Invoices', href: '/system/dashboard/invoices', icon: FaFileInvoice, current: pathname.startsWith('/system/dashboard/invoices') },
      ]
    },
    {
      id: 'system',
      name: 'System',
      icon: FaCog,
      items: [
        { name: 'Staff Management', href: '/system/dashboard/staff', icon: FaUsers, current: pathname.startsWith('/system/dashboard/staff') },
        { name: 'Sitemap Manager', href: '/system/dashboard/sitemap', icon: FaSitemap, current: pathname === '/system/dashboard/sitemap' },
        { name: 'Settings', href: '/system/dashboard/settings', icon: FaCog, current: pathname === '/system/dashboard/settings' },
      ]
    },
  ];

  const toggleGroup = (groupId) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | Skyfalke</title>
        {/* Set favicon for admin pages */}
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="icon" href="/favicon-16x16.png" sizes="16x16" type="image/png" />
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="icon" href="/favicon-96x96.png" sizes="96x96" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon-192x192.png" sizes="192x192" />
        <link rel="apple-touch-icon" href="/favicon-512x512.png" sizes="512x512" />
      </Helmet>
      <div className="h-screen flex overflow-hidden bg-gray-100 dark:bg-gray-900">
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex z-40 md:hidden"
          >
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-gray-800"
            >
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  onClick={() => setSidebarOpen(false)}
                >
                  <FaTimes className="h-6 w-6 text-white" />
                </button>
              </div>
              <SidebarContent 
                navigationGroups={navigationGroups} 
                expandedGroups={expandedGroups}
                toggleGroup={toggleGroup}
                user={user} 
                onLogout={handleLogout}
                isSuperAdmin={isSuperAdmin}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <SidebarContent 
            navigationGroups={navigationGroups} 
            expandedGroups={expandedGroups}
            toggleGroup={toggleGroup}
            user={user} 
            onLogout={handleLogout}
            isSuperAdmin={isSuperAdmin}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Top navigation */}
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white dark:bg-gray-800 shadow dark:shadow-gray-700">
          <button
            className="px-4 border-r border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <FaBars className="h-6 w-6" />
          </button>
          
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex">
              <div className="w-full flex md:ml-0">
                <div className="relative w-full text-gray-400 dark:text-gray-500 focus-within:text-gray-600 dark:focus-within:text-gray-300">
                  <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                    <FaSearch className="h-5 w-5" />
                  </div>
                  <input
                    className="block w-full h-full pl-8 pr-3 py-2 border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 bg-transparent focus:outline-none focus:placeholder-gray-400 dark:focus:placeholder-gray-500 focus:ring-0 focus:border-transparent"
                    placeholder="Search..."
                    type="search"
                  />
                </div>
              </div>
            </div>
            
            <div className="ml-4 flex items-center md:ml-6 space-x-3">
              {/* Theme Toggle */}
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 transition-colors duration-200"
              >
                {isDarkMode ? <FaSun className="h-5 w-5" /> : <FaMoon className="h-5 w-5" />}
              </button>

              {/* Notifications */}
              <NotificationDropdown />

              {/* Profile dropdown */}
              <div className="ml-3 relative">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {user?.name?.charAt(0) || 'A'}
                    </span>
                  </div>
                  <div className="hidden md:block">
                    <div className="text-base font-medium text-gray-800 dark:text-gray-200">{user?.name}</div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400 capitalize">{user?.role}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
    </>
  );
};

const SidebarContent = ({ navigationGroups, expandedGroups, toggleGroup, user, onLogout, isSuperAdmin }) => {
  // Filter navigation groups based on user role
  // Ensure isSuperAdmin is a function and navigationGroups is an array
  const checkIsSuperAdmin = () => {
    if (typeof isSuperAdmin === 'function') {
      return isSuperAdmin();
    }
    return false;
  };

  const filteredNavigationGroups = (navigationGroups || []).map(group => {
    // Only show HR Management and Accounting & Finance to super admins
    if (group.id === 'hr' || group.id === 'accounting') {
      if (!checkIsSuperAdmin()) {
        return null;
      }
    }
    // Filter Staff Management from System group for non-super admins
    if (group.id === 'system') {
      if (!checkIsSuperAdmin()) {
        // For non-super admins, remove Staff Management from items
        return {
          ...group,
          items: group.items.filter(item => item.href !== '/system/dashboard/staff')
        };
      }
      // For super admins, show all items including Staff Management
    }
    return group;
  }).filter(group => group !== null);

  return (
  <div className="flex flex-col h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
    {/* Logo */}
    <div className="flex items-center h-16 flex-shrink-0 px-4 bg-primary-600">
      <div className="flex items-center space-x-3">
        <img 
          src="/images/logos/logo.svg" 
          alt="Skyfalke Logo" 
          className="h-8 w-auto filter brightness-0 invert"
        />
      </div>
    </div>

    {/* Navigation */}
    <div className="flex-1 flex flex-col overflow-y-auto">
      <nav className="flex-1 px-2 py-4 space-y-1">
        {filteredNavigationGroups.map((group) => {
          const GroupIcon = group.icon;
          const isExpanded = expandedGroups[group.id];
          const hasActiveItem = group.items.some(item => item.current);
          
          return (
            <div key={group.id} className="mb-1">
              {/* Group Header */}
              <button
                onClick={() => toggleGroup(group.id)}
                className={`w-full flex items-center justify-between px-2 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${
                  hasActiveItem
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center">
                  <GroupIcon
                    className={`${
                      hasActiveItem ? 'text-primary-500 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'
                    } mr-3 flex-shrink-0 h-4 w-4`}
                  />
                  <span>{group.name}</span>
                </div>
                {isExpanded ? (
                  <FaChevronDown className="h-3 w-3 text-gray-400 dark:text-gray-500" />
                ) : (
                  <FaChevronRight className="h-3 w-3 text-gray-400 dark:text-gray-500" />
                )}
              </button>

              {/* Group Items */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="pl-4 mt-1 space-y-1">
                      {group.items.map((item) => {
                        if (!item.href) return null; // Skip items without href
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            className={`${
                              item.current
                                ? 'bg-primary-100 dark:bg-primary-900 border-r-2 border-primary-600 text-primary-700 dark:text-primary-300'
                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
                            } group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-all duration-200`}
                          >
                            <Icon
                              className={`${
                                item.current ? 'text-primary-500 dark:text-primary-400' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400'
                              } mr-3 flex-shrink-0 h-4 w-4`}
                            />
                            {item.name}
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>

      {/* User info and logout */}
      <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold">
              {user?.name?.charAt(0) || 'A'}
            </span>
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{user?.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role}</p>
          </div>
        </div>
        
        <div className="mt-3 space-y-1">
          <Link href="/system/dashboard/profile"
            className="flex items-center px-2 py-2 text-sm text-gray-600 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200"
          >
            <FaUser className="mr-3 h-4 w-4" />
            Profile
          </Link>
          <Link href="/system/dashboard/settings"
            className="flex items-center px-2 py-2 text-sm text-gray-600 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200"
          >
            <FaCog className="mr-3 h-4 w-4" />
            Settings
          </Link>
          <button
            onClick={onLogout}
            className="w-full flex items-center px-2 py-2 text-sm text-gray-600 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200"
          >
            <FaSignOutAlt className="mr-3 h-4 w-4" />
            Sign out
          </button>
        </div>
      </div>
    </div>
  </div>
  );
};

export default AdminLayout;
