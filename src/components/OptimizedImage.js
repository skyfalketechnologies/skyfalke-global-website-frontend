import React, { useState, useRef, useEffect } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const OptimizedImage = ({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
  placeholder = '/images/placeholder.webp',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  quality = 85,
  format = 'webp',
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);

  // Generate optimized image URL with ImageKit transformations
  const getOptimizedSrc = (originalSrc, width, height, quality, format) => {
    if (!originalSrc) return placeholder;
    
    // If it's already an ImageKit URL, add transformations
    if (originalSrc.includes('ik.imagekit.io')) {
      const params = new URLSearchParams();
      if (width) params.append('w', width);
      if (height) params.append('h', height);
      if (quality) params.append('q', quality);
      if (format) params.append('f', format);
      params.append('tr', 'f-auto'); // Auto format selection
      params.append('tr', 'c-at_max'); // Crop at max for better display
      
      const separator = originalSrc.includes('?') ? '&' : '?';
      return `${originalSrc}${separator}${params.toString()}`;
    }
    
    // For local images, return as-is (they should be optimized during build)
    return originalSrc;
  };

  const optimizedSrc = getOptimizedSrc(src, width, height, quality, format);

  // Preload critical images
  useEffect(() => {
    if (priority && optimizedSrc) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = optimizedSrc;
      document.head.appendChild(link);
    }
  }, [priority, optimizedSrc]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  // For priority images, render immediately without lazy loading
  if (priority) {
    return (
      <img
        ref={imgRef}
        src={optimizedSrc}
        alt={alt}
        className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        width={width}
        height={height}
        sizes={sizes}
        loading="eager"
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    );
  }

  return (
    <LazyLoadImage
      src={optimizedSrc}
      alt={alt}
      className={className}
      width={width}
      height={height}
      sizes={sizes}
      effect="blur"
      placeholderSrc={placeholder}
      threshold={100}
      onLoad={handleLoad}
      onError={handleError}
      {...props}
    />
  );
};

export default OptimizedImage;
