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
  FaArrowRight
} from 'react-icons/fa';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, isAuthenticated, loading } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register, handleSubmit, formState: { errors }, setError, watch } = useForm();

  const from = searchParams?.get('from') || '/system/dashboard';
  const watchedEmail = watch('email');

  useEffect(() => {
    if (isAuthenticated() && !loading) {
      router.push(from);
    }
  }, [isAuthenticated, loading, router, from]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
    const result = await login(data.email, data.password);
    
    if (result.success) {
      router.push(from);
    } else {
      setError('root', {
        type: 'manual',
        message: result.message
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

  // If user is already authenticated, redirect
  if (isAuthenticated() && !loading) {
    return null; // Will redirect via useEffect
  }

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
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
        <title>Admin Access - Skyfalke</title>
        <meta name="description" content="Secure admin access to Skyfalke dashboard" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
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
              Admin Access
            </h1>
            <p className="text-blue-200 text-lg font-medium">
              Secure dashboard login
            </p>
            <div className="flex items-center justify-center mt-4 space-x-2 text-yellow-300">
              <FaShieldAlt className="h-4 w-4" />
              <span className="text-sm font-medium">Protected Area</span>
          </div>
          </motion.div>

          {/* Login Form */}
          <motion.div 
            className="bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white border-opacity-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
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
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaUser className="h-5 w-5 text-yellow-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    {...register('email', {
                      required: 'Email address is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Please enter a valid email address'
                      }
                    })}
                    className={`appearance-none relative block w-full pl-12 pr-4 py-4 border-2 ${
                      errors.email ? 'border-red-400' : 'border-yellow-400 border-opacity-30'
                    } placeholder-yellow-300 text-white bg-white bg-opacity-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm`}
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
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-yellow-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters'
                      }
                    })}
                    className={`appearance-none relative block w-full pl-12 pr-12 py-4 border-2 ${
                      errors.password ? 'border-red-400' : 'border-yellow-400 border-opacity-30'
                    } placeholder-yellow-300 text-white bg-white bg-opacity-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-yellow-400 hover:text-white transition-colors duration-200"
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

              {/* Remember Me */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-yellow-500 focus:ring-yellow-400 border-yellow-400 rounded bg-white bg-opacity-10"
                  />
                  <label htmlFor="remember-me" className="ml-3 block text-sm text-white font-medium">
                    Keep me signed in
                  </label>
                </div>

                <div className="text-sm">
                  <button 
                    type="button"
                    className="font-medium text-yellow-400 hover:text-white transition-colors duration-200"
                  >
                    Forgot password?
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative w-full flex justify-center items-center py-4 px-6 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-yellow-500 to-blue-600 hover:from-yellow-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="animate-spin mr-3 h-5 w-5" />
                      Authenticating...
                    </>
                  ) : (
                    <>
                      Access Dashboard
                      <FaArrowRight className="ml-3 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Security Notice */}
            <div className="mt-8 p-4 bg-white bg-opacity-5 rounded-xl border border-white border-opacity-10">
              <div className="flex items-start space-x-3">
                <FaShieldAlt className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-semibold text-white mb-1">Security Notice</h4>
                  <p className="text-xs text-blue-200 leading-relaxed">
                    This is a secure admin area. All login attempts are logged and monitored for security purposes.
              </p>
            </div>
          </div>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <p className="text-blue-300 text-sm font-medium">
              © 2024 Skyfalke. All rights reserved.
            </p>
            <p className="text-yellow-400 text-xs mt-1">
              Secure • Professional • Reliable
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

export default Login;
