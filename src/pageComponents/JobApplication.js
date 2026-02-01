'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { apiGet, apiPost } from '../utils/api';
import { 
  FaArrowLeft,
  FaUpload,
  FaTimes,
  FaCheck,
  FaLinkedin,
  FaGithub,
  FaGlobe,
  FaSpinner,
  FaExclamationTriangle,
  FaFileAlt,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaBriefcase,
  FaGraduationCap,
  FaCalendarAlt,
  FaStar
} from 'react-icons/fa';

const JobApplication = () => {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    country: '',
    linkedin: '',
    portfolio: '',
    github: '',
    yearsOfExperience: '',
    currentCompany: '',
    currentPosition: '',
    expectedSalary: '',
    noticePeriod: '',
    highestDegree: '',
    fieldOfStudy: '',
    institution: '',
    graduationYear: '',
    skills: '',
    coverLetter: '',
    source: 'Website',
    isRemote: false,
    startDate: '',
    preferredStartDate: '',
    dataProcessing: false,
    contactForFuture: false
  });
  const [resume, setResume] = useState(null);
  const [additionalFiles, setAdditionalFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [progress, setProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  const experienceLevels = [
    { value: '0-1', label: '0-1 years' },
    { value: '1-3', label: '1-3 years' },
    { value: '3-5', label: '3-5 years' },
    { value: '5-7', label: '5-7 years' },
    { value: '7-10', label: '7-10 years' },
    { value: '10+', label: '10+ years' }
  ];

  const noticePeriods = [
    { value: 'Immediate', label: 'Immediate' },
    { value: '1 week', label: '1 week' },
    { value: '2 weeks', label: '2 weeks' },
    { value: '1 month', label: '1 month' },
    { value: '2 months', label: '2 months' },
    { value: '3 months', label: '3 months' },
    { value: 'More than 3 months', label: 'More than 3 months' }
  ];

  const educationLevels = [
    { value: 'High School', label: 'High School' },
    { value: 'Diploma', label: 'Diploma' },
    { value: 'Bachelor\'s Degree', label: 'Bachelor\'s Degree' },
    { value: 'Master\'s Degree', label: 'Master\'s Degree' },
    { value: 'PhD', label: 'PhD' },
    { value: 'Other', label: 'Other' }
  ];

  const sources = [
    { value: 'Website', label: 'Company Website' },
    { value: 'LinkedIn', label: 'LinkedIn' },
    { value: 'Indeed', label: 'Indeed' },
    { value: 'Referral', label: 'Employee Referral' },
    { value: 'Other', label: 'Other' }
  ];

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  useEffect(() => {
    calculateProgress();
  }, [formData, resume]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const response = await apiGet(`/api/jobs/${id}`);
      if (response.data) {
        setJob(response.data);
      }
    } catch (error) {
      console.error('Error fetching job details:', error);
      router.push('/careers');
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = () => {
    const requiredFields = [
      'firstName', 
      'lastName', 
      'email', 
      'phone', 
      'city', 
      'country', 
      'yearsOfExperience', 
      'highestDegree',
      'fieldOfStudy',
      'institution',
      'graduationYear',
      'coverLetter'
    ];
    const filledFields = requiredFields.filter(field => {
      const value = formData[field];
      if (field === 'graduationYear') {
        return value && value !== '';
      }
      return value && value.toString().trim() !== '';
    });
    const resumeFilled = resume ? 1 : 0;
    const totalFields = requiredFields.length + 1; // +1 for resume
    const progressPercentage = ((filledFields.length + resumeFilled) / totalFields) * 100;
    setProgress(progressPercentage);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateFile = (file) => {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/jpg', 'image/png'];
    const allowedExtensions = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'];
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    
    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
      return { valid: false, error: 'File type not allowed. Please upload PDF, DOC, DOCX, JPG, JPEG, or PNG files.' };
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB limit (matching server)
      return { valid: false, error: 'File size must be less than 10MB' };
    }
    
    return { valid: true };
  };

  const handleFileChange = (e, type) => {
    const files = Array.from(e.target.files);
    
    if (type === 'resume') {
      if (files.length > 0) {
        const file = files[0];
        const validation = validateFile(file);
        if (!validation.valid) {
          setErrors(prev => ({ ...prev, resume: validation.error }));
        return;
      }
      setResume(file);
      setErrors(prev => ({ ...prev, resume: '' }));
    }
    } else if (type === 'additional') {
      const validFiles = [];
      const invalidFiles = [];
      
      files.forEach(file => {
        const validation = validateFile(file);
        if (validation.valid) {
          validFiles.push(file);
      } else {
          invalidFiles.push({ name: file.name, error: validation.error });
        }
      });
      
      if (invalidFiles.length > 0) {
        setErrors(prev => ({ 
          ...prev, 
          additionalFiles: `Some files are invalid: ${invalidFiles.map(f => f.name).join(', ')}` 
        }));
      } else {
        setAdditionalFiles(prev => [...prev, ...validFiles].slice(0, 4)); // Max 4 additional files
        setErrors(prev => ({ ...prev, additionalFiles: '' }));
      }
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e, type) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const fakeEvent = {
        target: {
          files: e.dataTransfer.files
        }
      };
      handleFileChange(fakeEvent, type);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const removeFile = (index, type) => {
    if (type === 'resume') {
      setResume(null);
    } else {
    setAdditionalFiles(prev => prev.filter((_, i) => i !== index));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.country.trim()) newErrors.country = 'Country is required';
    if (!formData.yearsOfExperience) newErrors.yearsOfExperience = 'Years of experience is required';
    if (!formData.coverLetter.trim()) newErrors.coverLetter = 'Cover letter is required';
    
    // Education validation (required in model)
    if (!formData.highestDegree.trim()) newErrors.highestDegree = 'Highest degree is required';
    if (!formData.fieldOfStudy.trim()) newErrors.fieldOfStudy = 'Field of study is required';
    if (!formData.institution.trim()) newErrors.institution = 'Institution is required';
    if (!formData.graduationYear) newErrors.graduationYear = 'Graduation year is required';
    if (formData.graduationYear && (formData.graduationYear < 1950 || formData.graduationYear > new Date().getFullYear() + 5)) {
      newErrors.graduationYear = 'Please enter a valid graduation year';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (formData.phone && !phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // Resume validation
    if (!resume) {
      newErrors.resume = 'Resume is required';
    }

    // URL validations
    if (formData.linkedin && !isValidUrl(formData.linkedin)) {
      newErrors.linkedin = 'Please enter a valid LinkedIn URL';
    }
    if (formData.portfolio && !isValidUrl(formData.portfolio)) {
      newErrors.portfolio = 'Please enter a valid portfolio URL';
    }
    if (formData.github && !isValidUrl(formData.github)) {
      newErrors.github = 'Please enter a valid GitHub URL';
    }

    // Consent validation
    if (!formData.dataProcessing) {
      newErrors.dataProcessing = 'You must agree to data processing';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      const submitData = new FormData();
      
      // Convert yearsOfExperience from range string to number
      let yearsOfExperience = 0;
      if (formData.yearsOfExperience) {
        const range = formData.yearsOfExperience;
        if (range.includes('+')) {
          yearsOfExperience = 10; // 10+ years
        } else if (range.includes('-')) {
          const [min, max] = range.split('-').map(Number);
          yearsOfExperience = Math.floor((min + max) / 2); // Average of range
        } else {
          yearsOfExperience = parseInt(range) || 0;
        }
      }
      
      // Add form data
      Object.keys(formData).forEach(key => {
        if (key === 'skills') {
          const skillsArray = formData[key].split(',').map(skill => ({
            name: skill.trim(),
            level: 'Intermediate'
          })).filter(skill => skill.name.length > 0);
          submitData.append(key, JSON.stringify(skillsArray));
        } else if (key === 'yearsOfExperience') {
          submitData.append(key, yearsOfExperience.toString());
        } else if (key === 'graduationYear') {
          // Ensure graduationYear is sent as a number string
          submitData.append(key, formData[key] ? formData[key].toString() : '');
        } else if (key === 'isRemote' || key === 'dataProcessing' || key === 'contactForFuture') {
          // Convert boolean to string for FormData
          submitData.append(key, formData[key] ? 'true' : 'false');
        } else {
          submitData.append(key, formData[key] || '');
        }
      });

      // Add files
      if (resume) {
        submitData.append('resume', resume);
      }
      
      additionalFiles.forEach(file => {
        submitData.append('additionalFiles', file);
      });

      // Add job ID
      submitData.append('jobId', id);

      const response = await apiPost('/api/applications', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 201 || response.data.message) {
        router.push(`/careers/${id}/application-success`);
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      console.error('Error response:', error.response?.data);
      
      let errorMessage = 'An error occurred while submitting your application. Please try again.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        const errorMessages = error.response.data.errors.map(err => err.message).join(', ');
        errorMessage = errorMessages;
      } else if (error.response?.data?.details) {
        // In development, show more details
        errorMessage = error.response.data.details;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setErrors(prev => ({ ...prev, submit: errorMessage }));
      
      // Scroll to error message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin h-12 w-12 text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading application form...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaExclamationTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Job Not Found</h2>
          <p className="text-gray-600 mb-4">The job you are applying for does not exist.</p>
          <Link href="/careers"
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300"
          >
            Browse Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Apply for {job.title} - Careers | Skyfalke</title>
        <meta name="description" content={`Apply for the ${job.title} position at Skyfalke`} />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-primary-600 text-white pt-16 md:pt-20">
          {/* Breadcrumb */}
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6 md:pt-8">
            <nav className="flex items-center space-x-2 text-sm text-white/80 mb-6">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <Link href="/careers" className="hover:text-white transition-colors">Careers</Link>
              <span>/</span>
              <Link href={`/careers/${id}`} className="hover:text-white transition-colors">{job.title}</Link>
              <span>/</span>
              <span className="text-white font-medium">Apply</span>
            </nav>
          </div>

          {/* Hero Content */}
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-8 md:pb-12 pt-4">
            <div className="max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center"
              >
                {/* Job Title */}
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                  Apply for {job.title}
                </h1>

                {/* Job Meta Information */}
                <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 mb-6 text-white/90">
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="mr-2 text-secondary-400" />
                    <span>{job.location}</span>
                    {job.isRemote && (
                      <span className="ml-2 text-xs bg-white/20 text-white px-2 py-1 rounded-full">
                        Remote
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center">
                    <FaBriefcase className="mr-2 text-secondary-400" />
                    <span>{job.type}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="max-w-md mx-auto">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-white/80">Application Progress</span>
                    <span className="text-sm font-medium text-white">{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2.5">
                    <div 
                      className="bg-secondary-500 h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Sticky Header with Back Button */}
        <div className="bg-white border-b border-gray-200 sticky top-16 md:top-20 z-40">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4">
            <Link href={`/careers/${id}`}
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
              aria-label="Back to job details"
            >
              <FaArrowLeft className="mr-2" />
              <span className="text-sm md:text-base">Back to Job Details</span>
            </Link>
          </div>
        </div>

        {/* Application Form */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="max-w-4xl mx-auto">
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              onSubmit={handleSubmit}
              className="space-y-6 md:space-y-8"
            >
              {/* Error Message */}
            {errors.submit && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex">
                    <FaExclamationTriangle className="h-5 w-5 text-red-400" />
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">Application Error</h3>
                      <p className="text-sm text-red-700 mt-1">{errors.submit}</p>
                    </div>
                  </div>
              </div>
            )}

            {/* Personal Information */}
            <div className="bg-white rounded-xl shadow-soft p-6 md:p-8">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6 flex items-center">
                <FaUser className="mr-3 text-primary-600" />
                Personal Information
              </h2>
                
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        errors.firstName ? 'border-red-300' : 'border-gray-300'
                    }`}
                      placeholder="Enter your first name"
                  />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                    )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        errors.lastName ? 'border-red-300' : 'border-gray-300'
                    }`}
                      placeholder="Enter your last name"
                  />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                    )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        errors.email ? 'border-red-300' : 'border-gray-300'
                    }`}
                      placeholder="Enter your email address"
                  />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        errors.phone ? 'border-red-300' : 'border-gray-300'
                    }`}
                      placeholder="Enter your phone number"
                  />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                    )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        errors.city ? 'border-red-300' : 'border-gray-300'
                    }`}
                      placeholder="Enter your city"
                  />
                    {errors.city && (
                      <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                    )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country *
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        errors.country ? 'border-red-300' : 'border-gray-300'
                    }`}
                      placeholder="Enter your country"
                  />
                    {errors.country && (
                      <p className="mt-1 text-sm text-red-600">{errors.country}</p>
                    )}
                </div>
              </div>

              {/* Social Links */}
              <div className="mt-4 md:mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    LinkedIn Profile
                  </label>
                  <div className="relative">
                    <FaLinkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="url"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                          errors.linkedin ? 'border-red-300' : 'border-gray-300'
                        }`}
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  </div>
                    {errors.linkedin && (
                      <p className="mt-1 text-sm text-red-600">{errors.linkedin}</p>
                    )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Portfolio Website
                  </label>
                  <div className="relative">
                    <FaGlobe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="url"
                      name="portfolio"
                      value={formData.portfolio}
                      onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                          errors.portfolio ? 'border-red-300' : 'border-gray-300'
                        }`}
                      placeholder="https://yourportfolio.com"
                    />
                  </div>
                    {errors.portfolio && (
                      <p className="mt-1 text-sm text-red-600">{errors.portfolio}</p>
                    )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GitHub Profile
                  </label>
                  <div className="relative">
                    <FaGithub className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="url"
                      name="github"
                      value={formData.github}
                      onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                          errors.github ? 'border-red-300' : 'border-gray-300'
                        }`}
                      placeholder="https://github.com/yourusername"
                    />
                  </div>
                    {errors.github && (
                      <p className="mt-1 text-sm text-red-600">{errors.github}</p>
                    )}
                </div>
              </div>
            </div>

              {/* Professional Experience */}
              <div className="bg-white rounded-xl shadow-soft p-6 md:p-8">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6 flex items-center">
                  <FaBriefcase className="mr-3 text-primary-600" />
                  Professional Experience
                </h2>
                
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Years of Experience *
                  </label>
                    <select
                    name="yearsOfExperience"
                    value={formData.yearsOfExperience}
                    onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        errors.yearsOfExperience ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select experience level</option>
                      {experienceLevels.map(level => (
                        <option key={level.value} value={level.value}>{level.label}</option>
                      ))}
                    </select>
                    {errors.yearsOfExperience && (
                      <p className="mt-1 text-sm text-red-600">{errors.yearsOfExperience}</p>
                    )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Company
                  </label>
                  <input
                    type="text"
                    name="currentCompany"
                    value={formData.currentCompany}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter your current company"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Position
                  </label>
                  <input
                    type="text"
                    name="currentPosition"
                    value={formData.currentPosition}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter your current position"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expected Salary
                  </label>
                  <input
                    type="number"
                    name="expectedSalary"
                    value={formData.expectedSalary}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter expected salary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notice Period
                  </label>
                    <select
                    name="noticePeriod"
                    value={formData.noticePeriod}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Select notice period</option>
                      {noticePeriods.map(period => (
                        <option key={period.value} value={period.value}>{period.label}</option>
                      ))}
                    </select>
                </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      How did you hear about us?
                  </label>
                    <select
                      name="source"
                      value={formData.source}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      {sources.map(source => (
                        <option key={source.value} value={source.value}>{source.label}</option>
                      ))}
                    </select>
                </div>
              </div>
            </div>

            {/* Education */}
            <div className="bg-white rounded-xl shadow-soft p-6 md:p-8">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6 flex items-center">
                <FaGraduationCap className="mr-3 text-primary-600" />
                Education
              </h2>
                
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                      Highest Degree *
                  </label>
                    <select
                    name="highestDegree"
                    value={formData.highestDegree}
                    onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        errors.highestDegree ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select degree level</option>
                      {educationLevels.map(level => (
                        <option key={level.value} value={level.value}>{level.label}</option>
                      ))}
                    </select>
                    {errors.highestDegree && (
                      <p className="mt-1 text-sm text-red-600">{errors.highestDegree}</p>
                    )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                      Field of Study *
                  </label>
                  <input
                    type="text"
                    name="fieldOfStudy"
                    value={formData.fieldOfStudy}
                    onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        errors.fieldOfStudy ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="e.g., Computer Science, Marketing"
                    />
                    {errors.fieldOfStudy && (
                      <p className="mt-1 text-sm text-red-600">{errors.fieldOfStudy}</p>
                    )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                      Institution *
                  </label>
                  <input
                    type="text"
                    name="institution"
                    value={formData.institution}
                    onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        errors.institution ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter institution name"
                    />
                    {errors.institution && (
                      <p className="mt-1 text-sm text-red-600">{errors.institution}</p>
                    )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                      Graduation Year *
                  </label>
                  <input
                    type="number"
                    name="graduationYear"
                    value={formData.graduationYear}
                    onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        errors.graduationYear ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="e.g., 2020"
                    min="1950"
                    max={new Date().getFullYear() + 5}
                  />
                    {errors.graduationYear && (
                      <p className="mt-1 text-sm text-red-600">{errors.graduationYear}</p>
                    )}
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="bg-white rounded-xl shadow-soft p-6 md:p-8">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6 flex items-center">
                <FaStar className="mr-3 text-primary-600" />
                Skills & Expertise
              </h2>
                
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Key Skills
                </label>
                <textarea
                  name="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                    rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter your key skills separated by commas (e.g., React, Node.js, MongoDB, AWS)"
                />
                  <p className="mt-2 text-sm text-gray-500">
                    List your technical skills, tools, and technologies you're proficient with
                  </p>
              </div>
            </div>

            {/* Cover Letter */}
            <div className="bg-white rounded-xl shadow-soft p-6 md:p-8">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6 flex items-center">
                <FaFileAlt className="mr-3 text-primary-600" />
                Cover Letter
              </h2>
                
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Letter *
                </label>
                <textarea
                  name="coverLetter"
                  value={formData.coverLetter}
                  onChange={handleInputChange}
                    rows="8"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      errors.coverLetter ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Tell us why you're interested in this position and why you'd be a great fit for our team..."
                  />
                  {errors.coverLetter && (
                    <p className="mt-1 text-sm text-red-600">{errors.coverLetter}</p>
                  )}
                  <p className="mt-2 text-sm text-gray-500">
                    Explain your interest in the position, relevant experience, and why you'd be a great fit
                  </p>
              </div>
            </div>

              {/* Documents */}
              <div className="bg-white rounded-xl shadow-soft p-6 md:p-8">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6 flex items-center">
                  <FaUpload className="mr-3 text-primary-600" />
                  Documents
                </h2>
                
                <div className="space-y-6">
                  {/* Resume Upload */}
                  <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resume/CV *
                </label>
                    <div 
                      className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg transition-colors duration-200 ${
                        dragActive 
                          ? 'border-primary-500 bg-primary-50' 
                          : 'border-gray-300 hover:border-primary-400'
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={(e) => handleDrop(e, 'resume')}
                    >
                      <div className="space-y-1 text-center">
                        <FaUpload className={`mx-auto h-12 w-12 ${dragActive ? 'text-primary-500' : 'text-gray-400'}`} />
                        <div className="flex text-sm text-gray-600">
                          <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                            <span>Upload a file</span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                              onChange={(e) => handleFileChange(e, 'resume')}
                              className="sr-only"
                  />
                  </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PDF, DOC, DOCX, JPG, JPEG, or PNG up to 10MB</p>
                      </div>
                </div>
                {resume && (
                      <div className="mt-3 flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center flex-1 min-w-0">
                          <FaFileAlt className="text-green-500 mr-2 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <span className="text-sm text-green-700 font-medium block truncate">{resume.name}</span>
                            <span className="text-xs text-green-600">{formatFileSize(resume.size)}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(null, 'resume')}
                          className="text-red-500 hover:text-red-700 ml-2 flex-shrink-0"
                          aria-label="Remove resume"
                        >
                          <FaTimes />
                        </button>
                  </div>
                )}
                    {errors.resume && (
                      <p className="mt-1 text-sm text-red-600">{errors.resume}</p>
                    )}
              </div>

              {/* Additional Files */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Files (Optional) - Max 4 files
                </label>
                    <div 
                      className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg transition-colors duration-200 ${
                        dragActive 
                          ? 'border-primary-500 bg-primary-50' 
                          : 'border-gray-300 hover:border-primary-400'
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={(e) => handleDrop(e, 'additional')}
                    >
                      <div className="space-y-1 text-center">
                        <FaUpload className={`mx-auto h-12 w-12 ${dragActive ? 'text-primary-500' : 'text-gray-400'}`} />
                        <div className="flex text-sm text-gray-600">
                          <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                            <span>Upload files</span>
                  <input
                    type="file"
                    multiple
                              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                              onChange={(e) => handleFileChange(e, 'additional')}
                              className="sr-only"
                              disabled={additionalFiles.length >= 4}
                  />
                  </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">Portfolio, certificates, or other relevant documents (up to 10MB each)</p>
                      </div>
                </div>
                {additionalFiles.length > 0 && (
                      <div className="mt-3 space-y-2">
                    {additionalFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center flex-1 min-w-0">
                              <FaFileAlt className="text-blue-500 mr-2 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <span className="text-sm text-blue-700 font-medium block truncate">{file.name}</span>
                                <span className="text-xs text-blue-600">{formatFileSize(file.size)}</span>
                              </div>
                            </div>
                        <button
                          type="button"
                              onClick={() => removeFile(index, 'additional')}
                          className="text-red-500 hover:text-red-700 ml-2 flex-shrink-0"
                          aria-label={`Remove ${file.name}`}
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                    {errors.additionalFiles && (
                      <p className="mt-1 text-sm text-red-600">{errors.additionalFiles}</p>
                    )}
                    {additionalFiles.length >= 4 && (
                      <p className="mt-1 text-sm text-yellow-600">Maximum 4 additional files allowed</p>
                    )}
                  </div>
              </div>
            </div>

              {/* Availability & Preferences */}
              <div className="bg-white rounded-xl shadow-soft p-6 md:p-8">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6 flex items-center">
                  <FaCalendarAlt className="mr-3 text-primary-600" />
                  Availability & Preferences
                </h2>
                
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Start Date
                  </label>
                  <input
                    type="date"
                    name="preferredStartDate"
                    value={formData.preferredStartDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isRemote"
                      checked={formData.isRemote}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      I'm interested in remote work opportunities
                    </label>
                  </div>
              </div>
            </div>

            {/* Consent */}
            <div className="bg-white rounded-xl shadow-soft p-6 md:p-8">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">Consent & Agreement</h2>
                
              <div className="space-y-4">
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    name="dataProcessing"
                    checked={formData.dataProcessing}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
                  />
                    <label className="ml-2 block text-sm text-gray-900">
                    I consent to the processing of my personal data for recruitment purposes *
                  </label>
                </div>
                  {errors.dataProcessing && (
                    <p className="text-sm text-red-600">{errors.dataProcessing}</p>
                  )}

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    name="contactForFuture"
                    checked={formData.contactForFuture}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
                  />
                    <label className="ml-2 block text-sm text-gray-900">
                      I agree to be contacted about future opportunities that may be of interest
                  </label>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-4 border-t border-gray-200">
              <Link href={`/careers/${id}`}
                className="px-6 md:px-8 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-300 text-center"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 md:px-8 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                {submitting ? (
                  <>
                    <FaSpinner className="animate-spin h-4 w-4" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <FaCheck className="h-4 w-4" />
                    <span>Submit Application</span>
                  </>
                )}
              </button>
            </div>
          </motion.form>
          </div>
        </div>
      </div>
    </>
  );
};

export default JobApplication;


