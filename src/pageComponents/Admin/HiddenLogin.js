'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  FaUser,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaExclamationTriangle,
  FaSpinner,
  FaSun,
  FaMoon,
  FaShieldAlt,
  FaArrowRight,
  FaFingerprint,
  FaServer,
  FaKey
} from 'react-icons/fa';

const HiddenLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [showAccessForm, setShowAccessForm] = useState(false);
  const { login, isAuthenticated, loading } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register, handleSubmit, formState: { errors }, setError, watch } = useForm();

  const from = searchParams?.get('from') || '/system/dashboard';
  const watchedEmail = watch('email');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated() && !loading) {
      router.push(from);
    }
  }, [isAuthenticated, loading, router, from]);

  const handleAccessCodeSubmit = (e) => {
    e.preventDefault();
    // Simple access code validation - you can make this more complex
    const validCodes = ['SKY2024', 'ADMIN2024', 'SECURE2024'];
    if (validCodes.includes(accessCode.toUpperCase())) {
      setShowAccessForm(true);
      setAccessCode('');
    } else {
      alert('Invalid access code.');
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const result = await login(data.email, data.password);
      
      if (result.success) {
        router.push(from);
      } else {
        setError('root', {
          type: 'manual',
          message: result.message || 'Invalid credentials. Please try again.'
        });
      }
    } catch (error) {
      setError('root', {
        type: 'manual',
        message: 'An unexpected error occurred. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading while checking authentication or if already authenticated (redirecting)
  if (loading || (isAuthenticated() && !loading)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-white text-lg font-medium">Verifying credentials...</p>
        </div>
      </div>
    );
  }


  return (
    <>
      <Helmet>
        <title>System Access - Skyfalke</title>
        <meta name="description" content="System access portal" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
        
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="absolute top-6 right-6 p-3 rounded-xl text-white hover:bg-white hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all duration-300 backdrop-blur-sm"
          aria-label="Toggle theme"
        >
          {isDarkMode ? <FaSun className="h-5 w-5" /> : <FaMoon className="h-5 w-5" />}
        </button>
        
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-md w-full space-y-8 relative z-10"
        >
          {/* Header */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <div className="w-24 h-24 flex items-center justify-center p-3 bg-white bg-opacity-10 rounded-2xl backdrop-blur-sm">
                <img 
                  src="/images/logos/logo.svg" 
                  alt="Skyfalke Logo" 
                  className="h-12 w-auto filter brightness-0 invert"
                />
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
              System Access
            </h1>
            <p className="text-purple-200 text-lg font-medium">
              Restricted portal
            </p>
            <div className="flex items-center justify-center mt-4 space-x-2 text-purple-300">
              <FaShieldAlt className="h-4 w-4" />
              <span className="text-sm font-medium">Authorized Personnel Only</span>
            </div>
          </motion.div>

          {/* Access Code Form */}
          {!showAccessForm && (
            <motion.div 
              className="bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white border-opacity-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <div className="space-y-6">
                <div className="text-center">
                  <FaKey className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Access Verification Required</h3>
                  <p className="text-purple-200 text-sm">Enter your access code to proceed</p>
                </div>

                <form onSubmit={handleAccessCodeSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="accessCode" className="block text-sm font-semibold text-white mb-2">
                      Access Code
                    </label>
                    <input
                      id="accessCode"
                      type="password"
                      value={accessCode}
                      onChange={(e) => setAccessCode(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-purple-400 border-opacity-30 placeholder-purple-300 text-white bg-white bg-opacity-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                      placeholder="Enter access code"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex justify-center items-center py-3 px-4 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <FaArrowRight className="mr-2 h-4 w-4" />
                    Verify Access
                  </button>
                </form>

              </div>
            </motion.div>
          )}

          {/* Login Form */}
          {showAccessForm && (
            <motion.div 
              className="bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white border-opacity-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {/* Security Status */}
              <div className="mb-6 p-4 bg-white bg-opacity-5 rounded-xl border border-white border-opacity-10">
                <div className="flex items-center space-x-3">
                  <FaServer className="h-5 w-5 text-green-400" />
                  <div>
                    <h4 className="text-sm font-semibold text-white">Security Status</h4>
                    <p className="text-xs text-green-300">Access verified</p>
                  </div>
                </div>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                {/* Global Error */}
                {errors.root && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-500 bg-opacity-20 border border-red-400 text-red-100 px-4 py-3 rounded-xl flex items-center space-x-3 backdrop-blur-sm"
                  >
                    <FaExclamationTriangle className="h-5 w-5 flex-shrink-0" />
                    <span className="text-sm font-medium">{errors.root.message}</span>
                  </motion.div>
                )}

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-white mb-3">
                    Administrator Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaUser className="h-5 w-5 text-purple-400" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      {...register('email', {
                        required: 'Administrator email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Please enter a valid email address'
                        }
                      })}
                      className={`appearance-none relative block w-full pl-12 pr-4 py-4 border-2 ${
                        errors.email ? 'border-red-400' : 'border-purple-400 border-opacity-30'
                      } placeholder-purple-300 text-white bg-white bg-opacity-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed`}
                      placeholder="admin@skyfalke.com"
                    />
                  </div>
                  {errors.email && (
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-2 text-sm text-red-300 font-medium"
                    >
                      {errors.email.message}
                    </motion.p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-white mb-3">
                    Security Credentials
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaLock className="h-5 w-5 text-purple-400" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      {...register('password', {
                        required: 'Security credentials are required',
                        minLength: {
                          value: 6,
                          message: 'Credentials must be at least 6 characters'
                        }
                      })}
                      className={`appearance-none relative block w-full pl-12 pr-12 py-4 border-2 ${
                        errors.password ? 'border-red-400' : 'border-purple-400 border-opacity-30'
                      } placeholder-purple-300 text-white bg-white bg-opacity-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed`}
                      placeholder="Enter security credentials"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-purple-400 hover:text-white transition-colors duration-200"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <FaEyeSlash className="h-5 w-5" />
                      ) : (
                        <FaEye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-2 text-sm text-red-300 font-medium"
                    >
                      {errors.password.message}
                    </motion.p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group relative w-full flex justify-center items-center py-4 px-6 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    {isSubmitting ? (
                      <>
                        <FaSpinner className="animate-spin mr-3 h-5 w-5" />
                        Authenticating...
                      </>
                    ) : (
                      <>
                        <FaFingerprint className="mr-3 h-4 w-4" />
                        Authenticate Access
                        <FaArrowRight className="ml-3 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Security Notice */}
              <div className="mt-8 p-4 bg-white bg-opacity-5 rounded-xl border border-white border-opacity-10">
                <div className="flex items-start space-x-3">
                  <FaShieldAlt className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-1">Maximum Security Protocol</h4>
                    <p className="text-xs text-purple-200 leading-relaxed">
                      This is a restricted access area. All activities are monitored and logged for security purposes.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Footer */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <p className="text-purple-300 text-sm font-medium">
              © 2024 Skyfalke. All rights reserved.
            </p>
            <p className="text-purple-400 text-xs mt-1">
              Secure • Restricted • Monitored
            </p>
          </motion.div>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </>
  );
};

export default HiddenLogin;
