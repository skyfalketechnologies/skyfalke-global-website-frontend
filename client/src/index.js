import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import './index.css';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Suppress console logs (including XHR, WebSocket, and socket.io errors)
const noop = () => {};
const isProduction = process.env.NODE_ENV === 'production';

// Store original console methods for potential future use
const originalConsole = {
  log: console.log,
  warn: console.warn,
  error: console.error,
  info: console.info,
  debug: console.debug
};

// Override all console methods to filter out network/XHR/WebSocket logs
const shouldSuppress = (args) => {
  if (!args || args.length === 0) return false;
  const message = String(args.join(' ')).toLowerCase();
  
  // Suppress socket.io and WebSocket errors
  if (message.includes('websocket') || 
      message.includes('socket.io') || 
      message.includes('socketio') ||
      message.includes('wss://') ||
      message.includes('transport=websocket') ||
      message.includes('transport=polling') ||
      message.includes('eio=4') ||
      message.includes('failed to load resource') ||
      message.includes('400 (bad request)') ||
      message.includes('400') && message.includes('bad request') ||
      message.includes('createSocket') ||
      message.includes('doOpen') ||
      message.includes('onHandshake') ||
      message.includes('_onPacket') ||
      message.includes('doPoll') ||
      message.includes('_poll') ||
      message.includes('onData') ||
      message.includes('_onLoad') ||
      message.includes('onreadystatechange') ||
      message.includes('doWrite') ||
      message.includes('doClose') ||
      message.includes('_onClose') ||
      message.includes('_onError') ||
      message.includes('onError') ||
      message.includes('reconnect_error') ||
      message.includes('connect_error') ||
      message.includes('xhr failed loading') ||
      message.includes('get https://apis.mwangikinyanjuiadvocates.com/socket.io') ||
      message.includes('post https://apis.mwangikinyanjuiadvocates.com/socket.io') ||
      message.includes('understand this error') ||
      message.includes('understand this warning')) {
    return true;
  }
  
  // Suppress XHR and network logs
  if (message.includes('xhr') || 
      message.includes('finished loading') || 
      message.includes('finished:') ||
      message.includes('failed loading') ||
      message.includes('get http') || 
      message.includes('post http') ||
      message.includes('put http') ||
      message.includes('patch http') ||
      message.includes('delete http') ||
      message.includes('fetch') ||
      message.includes('api/blogs') ||
      message.includes('api/') ||
      message.includes('apis.mwangikinyanjuiadvocates.com') ||
      message.includes('mwangikinyanjuiadvocates.com')) {
    return true;
  }
  
  // Suppress CSS preload warnings
  if (message.includes('preloaded using link preload') ||
      message.includes('not used within a few seconds') ||
      message.includes('appropriate `as` value')) {
    return true;
  }
  
  return false;
};

// Override console methods
const createSuppressedMethod = (originalMethod) => {
  return function(...args) {
    if (!shouldSuppress(args)) {
      originalMethod.apply(console, args);
    }
  };
};

// Apply suppression in both development and production
console.log = createSuppressedMethod(originalConsole.log);
console.warn = createSuppressedMethod(originalConsole.warn);
console.error = createSuppressedMethod(originalConsole.error);
console.info = createSuppressedMethod(originalConsole.info);
console.debug = isProduction ? noop : createSuppressedMethod(originalConsole.debug);

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
    const originalOnError = xhr.onerror;
    
    xhr.open = function(method, url, ...rest) {
      this._method = method;
      this._url = url;
      return originalOpen.apply(this, [method, url, ...rest]);
    };
    
    xhr.send = function(...args) {
      // Suppress error logging for socket.io requests
      const url = this._url || '';
      if (url.includes('socket.io') || url.includes('apis.mwangikinyanjuiadvocates.com')) {
        this.onerror = noop;
      }
      return originalSend.apply(this, args);
    };
    
    return xhr;
  };
  
  // Copy static properties
  Object.setPrototypeOf(window.XMLHttpRequest, OriginalXHR);
  Object.setPrototypeOf(window.XMLHttpRequest.prototype, OriginalXHR.prototype);
}

// Suppress global error events for socket.io and WebSocket errors
if (typeof window !== 'undefined') {
  const originalErrorHandler = window.onerror;
  window.onerror = function(message, source, lineno, colno, error) {
    const errorMessage = String(message || '').toLowerCase();
    
    // Suppress socket.io and WebSocket errors
    if (errorMessage.includes('websocket') ||
        errorMessage.includes('socket.io') ||
        errorMessage.includes('socketio') ||
        errorMessage.includes('wss://') ||
        errorMessage.includes('failed to load resource') ||
        (errorMessage.includes('400') && errorMessage.includes('bad request')) ||
        errorMessage.includes('apis.mwangikinyanjuiadvocates.com') ||
        errorMessage.includes('socket.io')) {
      return true; // Suppress the error
    }
    
    // Call original handler if not suppressed
    if (originalErrorHandler) {
      return originalErrorHandler.apply(this, arguments);
    }
    return false;
  };
  
  // Suppress unhandled promise rejections for socket.io
  const originalUnhandledRejection = window.onunhandledrejection;
  window.onunhandledrejection = function(event) {
    const reason = event.reason;
    const errorMessage = String(reason?.message || reason || '').toLowerCase();
    
    // Suppress socket.io related rejections
    if (errorMessage.includes('websocket') ||
        errorMessage.includes('socket.io') ||
        errorMessage.includes('socketio') ||
        errorMessage.includes('wss://') ||
        (errorMessage.includes('400') && errorMessage.includes('bad request')) ||
        errorMessage.includes('apis.mwangikinyanjuiadvocates.com') ||
        errorMessage.includes('socket.io')) {
      event.preventDefault();
      return;
    }
    
    // Call original handler if not suppressed
    if (originalUnhandledRejection) {
      return originalUnhandledRejection.apply(this, arguments);
    }
  };
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
