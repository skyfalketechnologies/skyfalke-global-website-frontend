'use client';

import { useMemo, useState, useEffect, useRef } from 'react';

// Import polyfill first to ensure react-dom compatibility
import '../lib/react-dom-polyfill';

// Import CSS statically - Next.js will handle it properly
import 'react-quill/dist/quill.snow.css';

const ReactQuillWrapper = ({ value, onChange, modules, formats, placeholder, style, ...props }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [ReactQuill, setReactQuill] = useState(null);
  const quillRef = useRef(null);

  // Ensure component only loads and renders on client side
  useEffect(() => {
    // Only import ReactQuill on the client side after mount
    // Ensure polyfill is set up before importing react-quill
    if (typeof window !== 'undefined') {
      // Import polyfill first to ensure react-dom is patched
      import('../lib/react-dom-polyfill').then(() => {
        // Small delay to ensure polyfill is applied
        return new Promise(resolve => setTimeout(resolve, 0));
      }).then(() => {
        return import('react-quill');
      }).then((module) => {
        setReactQuill(() => module.default);
        setIsMounted(true);
      }).catch((error) => {
        console.error('Failed to load react-quill:', error);
      });
    }
  }, []);

  // Memoize modules and formats to prevent unnecessary re-renders
  const memoizedModules = useMemo(() => modules || {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      ['link', 'blockquote'],
      [{ 'align': [] }],
      ['clean']
    ],
  }, [modules]);

  const memoizedFormats = useMemo(() => formats || [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'indent', 'link', 'blockquote', 'align'
  ], [formats]);

  // Don't render ReactQuill until component is mounted and loaded on client
  if (!isMounted || !ReactQuill) {
    return (
      <div className="border border-gray-300 dark:border-gray-600 rounded-md p-4 min-h-[200px] bg-gray-50 dark:bg-gray-800 animate-pulse">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      </div>
    );
  }

  return (
    <div ref={quillRef}>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={memoizedModules}
        formats={memoizedFormats}
        placeholder={placeholder}
        style={style}
        {...props}
      />
    </div>
  );
};

export default ReactQuillWrapper;

