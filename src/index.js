import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import './index.css';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Suppress console logs in production (including XHR network logs)
if (process.env.NODE_ENV === 'production') {
  const noop = () => {};
  
  // Store original console methods for potential future use
  const originalConsole = {
    log: console.log,
    warn: console.warn,
    error: console.error,
    info: console.info,
    debug: console.debug
  };

  // Override all console methods to filter out network/XHR logs
  const shouldSuppress = (args) => {
    if (!args || args.length === 0) return false;
    const message = String(args.join(' ')).toLowerCase();
    return message.includes('xhr') || 
           message.includes('finished loading') || 
           message.includes('finished:') ||
           message.includes('get http') || 
           message.includes('post http') ||
           message.includes('put http') ||
           message.includes('patch http') ||
           message.includes('delete http') ||
           message.includes('fetch') ||
           message.includes('api/blogs') ||
           message.includes('api/') ||
           message.includes('apis.mwangikinyanjuiadvocates.com') ||
           message.includes('mwangikinyanjuiadvocates.com');
  };

  // Override console methods
  const createSuppressedMethod = (originalMethod) => {
    return function(...args) {
      if (!shouldSuppress(args)) {
        originalMethod.apply(console, args);
      }
    };
  };

  console.log = createSuppressedMethod(originalConsole.log);
  console.warn = createSuppressedMethod(originalConsole.warn);
  console.error = createSuppressedMethod(originalConsole.error);
  console.info = createSuppressedMethod(originalConsole.info);
  console.debug = noop;
  
  // Also suppress console.group, console.groupEnd, console.table that might show network info
  console.group = noop;
  console.groupEnd = noop;
  console.groupCollapsed = noop;
  console.table = noop;
  
  // Intercept XMLHttpRequest to prevent browser network logging
  if (typeof XMLHttpRequest !== 'undefined') {
    const OriginalXHR = XMLHttpRequest;
    window.XMLHttpRequest = function() {
      const xhr = new OriginalXHR();
      const originalOpen = xhr.open;
      const originalSend = xhr.send;
      
      xhr.open = function(method, url, ...rest) {
        this._method = method;
        this._url = url;
        return originalOpen.apply(this, [method, url, ...rest]);
      };
      
      xhr.send = function(...args) {
        // Suppress any logging that might happen
        return originalSend.apply(this, args);
      };
      
      return xhr;
    };
    
    // Copy static properties
    Object.setPrototypeOf(window.XMLHttpRequest, OriginalXHR);
    Object.setPrototypeOf(window.XMLHttpRequest.prototype, OriginalXHR.prototype);
  }
}

// Suppress findDOMNode warning from react-quill (known library issue)
if (process.env.NODE_ENV === 'development') {
  const originalError = console.error;
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('findDOMNode is deprecated')
    ) {
      // Suppress this specific warning from react-quill
      return;
    }
    originalError.apply(console, args);
  };
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <AuthProvider>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);
