'use client';

import React, { useState, useRef } from 'react';
import { FaUpload, FaTimes, FaSpinner, FaImage, FaCheck } from 'react-icons/fa';

const ImageUpload = ({ 
  onImageUpload, 
  onImageRemove, 
  images = [], 
  maxImages = 10,
  maxSize = 5 * 1024 * 1024, // 5MB
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (files) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => {
      if (!acceptedTypes.includes(file.type)) {
        alert(`File ${file.name} is not a supported image type.`);
        return false;
      }
      if (file.size > maxSize) {
        alert(`File ${file.name} is too large. Maximum size is ${maxSize / (1024 * 1024)}MB.`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    if (images.length + validFiles.length > maxImages) {
      alert(`Maximum ${maxImages} images allowed.`);
      return;
    }

    setUploading(true);

    try {
      for (const file of validFiles) {
        const imageData = await uploadImage(file);
        onImageUpload(imageData);
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Error uploading images. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const uploadImage = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const imageData = {
          url: e.target.result,
          file: file,
          caption: '',
          isPrimary: images.length === 0, // First image is primary by default
          uploading: true
        };
        resolve(imageData);
      };
      
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  const handleFileInputChange = (e) => {
    const files = e.target.files;
    handleFileSelect(files);
    e.target.value = ''; // Reset input
  };

  const removeImage = (index) => {
    onImageRemove(index);
  };

  const setPrimaryImage = (index) => {
    // This will be handled by the parent component
    const updatedImages = images.map((img, i) => ({
      ...img,
      isPrimary: i === index
    }));
    // Call parent to update images
    images.forEach((_, i) => {
      if (i !== index) {
        onImageRemove(i);
      }
    });
    // Re-add all images with updated primary status
    updatedImages.forEach((img, i) => {
      if (i === 0) {
        onImageUpload({ ...img, isPrimary: i === index });
      }
    });
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragOver
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-primary-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileInputChange}
          className="hidden"
        />
        
        <div className="flex flex-col items-center">
          {uploading ? (
            <FaSpinner className="animate-spin h-8 w-8 text-primary-600 mb-2" />
          ) : (
            <FaUpload className="h-8 w-8 text-gray-400 mb-2" />
          )}
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {uploading ? 'Uploading images...' : 'Drag and drop images here, or click to select'}
          </p>
          
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || images.length >= maxImages}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <FaImage />
            Select Images
          </button>
          
          <p className="text-xs text-gray-500 mt-2">
            Supports: JPEG, PNG, WebP, GIF (max {maxSize / (1024 * 1024)}MB each)
          </p>
          <p className="text-xs text-gray-500">
            {images.length}/{maxImages} images uploaded
          </p>
        </div>
      </div>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative group bg-white dark:bg-gray-700 rounded-lg overflow-hidden shadow-md"
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={image.url}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPrimaryImage(index)}
                    className={`p-2 rounded-full text-white ${
                      image.isPrimary
                        ? 'bg-green-600'
                        : 'bg-gray-600 hover:bg-gray-700'
                    }`}
                    title={image.isPrimary ? 'Primary Image' : 'Set as Primary'}
                  >
                    {image.isPrimary ? <FaCheck /> : <FaImage />}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="p-2 rounded-full bg-red-600 text-white hover:bg-red-700"
                    title="Remove Image"
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>
              
              {/* Primary Badge */}
              {image.isPrimary && (
                <div className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                  Primary
                </div>
              )}
              
              {/* Uploading Indicator */}
              {image.uploading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <FaSpinner className="animate-spin h-6 w-6 text-white" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
