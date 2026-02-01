import React from 'react';
import { FaExclamationTriangle, FaHome, FaSyncAlt } from 'react-icons/fa';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo
    });
    
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error Boundary caught an error:', error, errorInfo);
    }
  }

  handleRefresh = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
            {/* Icon */}
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaExclamationTriangle className="text-2xl text-red-600" />
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Oops! Something went wrong
            </h1>

            {/* Description */}
            <p className="text-gray-600 mb-8 leading-relaxed">
              We're sorry for the inconvenience. An unexpected error occurred while loading this page.
            </p>

            {/* Error Details (Development Only) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="bg-gray-100 rounded-lg p-4 mb-6 text-left">
                <h3 className="font-semibold text-gray-900 mb-2">Error Details:</h3>
                <p className="text-sm text-gray-700 font-mono">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={this.handleRefresh}
                className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 group"
              >
                <FaSyncAlt className="mr-2 group-hover:rotate-180 transition-transform duration-300" />
                Try Again
              </button>
              
              <button
                onClick={this.handleGoHome}
                className="flex-1 inline-flex items-center justify-center px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-300"
              >
                <FaHome className="mr-2" />
                Go Home
              </button>
            </div>

            {/* Support Info */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-2">
                If this problem persists, please contact our support team:
              </p>
              <a
                href="mailto:support@skyfalke.com"
                className="text-blue-600 hover:text-blue-700 transition-colors duration-300 text-sm font-medium"
              >
                developer@skyfalke.com
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
