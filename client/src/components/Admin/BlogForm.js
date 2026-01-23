import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { FaSave, FaGlobe, FaTwitter, FaFacebook, FaUpload, FaImage, FaSearch, FaArrowLeft } from 'react-icons/fa';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Strike from '@tiptap/extension-strike';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { apiPost, apiPut, apiGet } from '../../utils/api';
import SEOAnalyzer from './SEOAnalyzer';

const BlogForm = ({ blogId, onClose, onSave }) => {
  const router = useRouter();
  const [blog, setBlog] = useState(null);
  const [loadingBlog, setLoadingBlog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const [activeTab, setActiveTab] = useState('content');
  const [featuredImage, setFeaturedImage] = useState(null);
  const [featuredImageAlt, setFeaturedImageAlt] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
    setError,
    clearErrors
  } = useForm({
    defaultValues: {
      title: blog?.title || '',
      excerpt: blog?.excerpt || '',
      category: blog?.category || '',
      status: blog?.status || 'draft',
      tags: blog?.tags || [],
      isFeatured: blog?.isFeatured || false,
      seo: {
        focusKeyword: blog?.seo?.focusKeyword || '',
        metaTitle: blog?.seo?.metaTitle || '',
        metaDescription: blog?.seo?.metaDescription || '',
        keywords: blog?.seo?.keywords || [],
        canonicalUrl: blog?.seo?.canonicalUrl || '',
        ogTitle: blog?.seo?.ogTitle || '',
        ogDescription: blog?.seo?.ogDescription || '',
        twitterTitle: blog?.seo?.twitterTitle || '',
        twitterDescription: blog?.seo?.twitterDescription || ''
      },
      socialSharing: {
        enableSharing: blog?.socialSharing?.enableSharing ?? true,
        customMessage: blog?.socialSharing?.customMessage || ''
      }
    }
  });

  // Tiptap editor configuration
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: false,
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary-600 hover:text-primary-800 underline',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      Strike,
      Color,
      TextStyle,
    ],
    content: content || '',
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setContent(html);
      // Clear error when content is added
      const textContent = editor.getText().trim();
      if (textContent) {
        clearErrors('content');
      }
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] p-4',
        'data-placeholder': 'Write your blog content here...',
      },
    },
  });

  // Handle image upload for editor content
  const handleEditorImageUpload = async () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;

      // Prompt for alt text
      const altText = prompt('Enter alt text for this image (for accessibility and SEO):', '');
      if (altText === null) return; // User cancelled

      setUploadingImage(true);
      try {
        const formData = new FormData();
        formData.append('image', file);

        const response = await apiPost('/api/blogs/upload-image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        });

        if (response.data && response.data.image && editor) {
          const imageUrl = response.data.image.url;
          editor.chain().focus().setImage({ 
            src: imageUrl, 
            alt: altText || '' 
          }).run();
        }
      } catch (error) {
        console.error('Image upload error:', error);
        alert('Failed to upload image. Please try again.');
      } finally {
        setUploadingImage(false);
      }
    };
  };

  // Fetch blog data if editing
  useEffect(() => {
    if (blogId) {
      const fetchBlog = async () => {
        setLoadingBlog(true);
        try {
          const response = await apiGet(`/api/blogs/admin/${blogId}`);
          if (response.data) {
            setBlog(response.data);
          }
        } catch (error) {
          console.error('Error fetching blog:', error);
          alert('Failed to load blog data');
          if (onClose) onClose();
        } finally {
          setLoadingBlog(false);
        }
      };
      fetchBlog();
    } else {
      setBlog(null);
    }
  }, [blogId, onClose]);

  // Update editor content when blog content changes
  useEffect(() => {
    if (editor) {
      if (blog?.content) {
        const currentContent = editor.getHTML();
        const blogContent = blog.content || '';
        // Only update if content is different to avoid infinite loops
        if (currentContent !== blogContent && blogContent.trim() !== '') {
          editor.commands.setContent(blogContent);
          setContent(blogContent);
        }
      } else if (!blog && !blogId) {
        // Clear editor when creating new blog
        editor.commands.clearContent();
        setContent('');
      }
    }
  }, [blog?.content, blog, blogId, editor]);

  // Cleanup editor on unmount
  useEffect(() => {
    return () => {
      if (editor) {
        editor.destroy();
      }
    };
  }, [editor]);

  // Tiptap editor styles
  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'blog-form-tiptap-styles';
    style.textContent = `
      /* Tiptap Editor Styles */
      .ProseMirror {
        outline: none;
        min-height: 300px;
        padding: 16px;
        color: #374151;
        font-size: 16px;
        line-height: 1.6;
      }
      .dark .ProseMirror {
        color: #f3f4f6;
      }
      .ProseMirror p.is-editor-empty:first-child::before {
        content: attr(data-placeholder);
        float: left;
        color: #9ca3af;
        pointer-events: none;
        height: 0;
      }
      .dark .ProseMirror p.is-editor-empty:first-child::before {
        color: #6b7280;
      }
      .ProseMirror h1 {
        font-size: 2em;
        font-weight: bold;
        margin: 0.67em 0;
      }
      .ProseMirror h2 {
        font-size: 1.5em;
        font-weight: bold;
        margin: 0.75em 0;
      }
      .ProseMirror h3 {
        font-size: 1.17em;
        font-weight: bold;
        margin: 0.83em 0;
      }
      .ProseMirror h4 {
        font-size: 1em;
        font-weight: bold;
        margin: 1.12em 0;
      }
      .ProseMirror h5 {
        font-size: 0.83em;
        font-weight: bold;
        margin: 1.5em 0;
      }
      .ProseMirror h6 {
        font-size: 0.67em;
        font-weight: bold;
        margin: 1.67em 0;
      }
      .ProseMirror img {
        max-width: 100%;
        height: auto;
        border-radius: 8px;
        margin: 16px 0;
      }
      .ProseMirror a {
        color: #303661;
        text-decoration: underline;
      }
      .dark .ProseMirror a {
        color: #e0ae00;
      }
      .ProseMirror ul, .ProseMirror ol {
        padding-left: 24px;
        margin: 16px 0;
      }
      .ProseMirror ul {
        list-style-type: disc;
      }
      .ProseMirror ol {
        list-style-type: decimal;
      }
      .ProseMirror li {
        margin: 8px 0;
      }
      .ProseMirror blockquote {
        border-left: 4px solid #303661;
        padding-left: 16px;
        margin: 16px 0;
        font-style: italic;
      }
      .dark .ProseMirror blockquote {
        border-left-color: #e0ae00;
      }
    `;
    // Remove existing style if present
    const existingStyle = document.getElementById('blog-form-tiptap-styles');
    if (existingStyle) {
      existingStyle.remove();
    }
    document.head.appendChild(style);
    return () => {
      const styleToRemove = document.getElementById('blog-form-tiptap-styles');
      if (styleToRemove) {
        styleToRemove.remove();
      }
    };
  }, []);


  useEffect(() => {
    if (blog) {
      console.log('Loading blog data for editing:', blog);
      reset({
        ...blog,
        seo: blog.seo || {
          metaTitle: '',
          metaDescription: '',
          keywords: [],
          canonicalUrl: '',
          ogTitle: '',
          ogDescription: '',
          twitterTitle: '',
          twitterDescription: ''
        },
        socialSharing: blog.socialSharing || {
          enableSharing: true,
          customMessage: ''
        }
      });
      
      // Set content - ensure it's properly loaded
      const blogContent = blog.content || '';
      console.log('Setting blog content:', blogContent ? `${blogContent.substring(0, 100)}...` : 'empty');
      setContent(blogContent);
      
      // Set featured image preview if exists
      if (blog.featuredImage?.url) {
        setImagePreview(blog.featuredImage.url);
        setFeaturedImage(blog.featuredImage);
        setFeaturedImageAlt(blog.featuredImage.alt || '');
      } else {
        setImagePreview('');
        setFeaturedImage(null);
        setFeaturedImageAlt('');
      }
    } else {
      // Reset form when no blog (creating new)
      reset({
        title: '',
        excerpt: '',
        category: '',
        status: 'draft',
        tags: [],
        isFeatured: false,
        seo: {
          focusKeyword: '',
          metaTitle: '',
          metaDescription: '',
          keywords: [],
          canonicalUrl: '',
          ogTitle: '',
          ogDescription: '',
          twitterTitle: '',
          twitterDescription: ''
        },
        socialSharing: {
          enableSharing: true,
          customMessage: ''
        }
      });
      setContent('');
      setImagePreview('');
      setFeaturedImage(null);
      setFeaturedImageAlt('');
    }
  }, [blog, reset]);

  // Update form content when content changes
  useEffect(() => {
    setValue('content', content);
    // Clear content error when content is added
    if (content && content.trim()) {
      clearErrors('content');
    }
  }, [content, setValue, clearErrors]);

  // Handle featured image upload
  const handleImageUpload = async (file) => {
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      // Use the API utility instead of direct fetch
      const response = await apiPost('/api/blogs/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      // Server returns { success: true, image: {...} }
      if (response.data && response.data.image) {
        // Prompt for alt text when uploading featured image
        const altText = prompt('Enter alt text for the featured image (for accessibility and SEO):', 'Blog post featured image');
        let imageData;
        if (altText === null) {
          // User cancelled, but we still set the image
          imageData = {
            ...response.data.image,
            alt: ''
          };
          setFeaturedImage(imageData);
          setFeaturedImageAlt('');
          setImagePreview(imageData.url);
        } else {
          imageData = {
            ...response.data.image,
            alt: altText || ''
          };
          setFeaturedImage(imageData);
          setFeaturedImageAlt(altText || '');
          setImagePreview(imageData.url);
        }
        console.log('Image uploaded successfully:', imageData);
      } else {
        throw new Error('Invalid response from image upload');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      let errorMessage = 'Failed to upload image';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(`Image upload failed: ${errorMessage}`);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    
    // Validate content manually since it's not directly connected to react-hook-form
    // Check if content has actual text (not just HTML tags)
    const textContent = content ? content.replace(/<[^>]*>/g, '').trim() : '';
    if (!content || !textContent) {
      setError('content', { type: 'required', message: 'Content is required' });
      setActiveTab('content'); // Switch to content tab to show error
      setLoading(false);
      return;
    }
    
    // Additional validation for required fields
    if (!data.title || !data.title.trim()) {
      setError('title', { type: 'required', message: 'Title is required' });
      setLoading(false);
      return;
    }
    
    if (!data.excerpt || !data.excerpt.trim()) {
      setError('excerpt', { type: 'required', message: 'Excerpt is required' });
      setLoading(false);
      return;
    }
    
    // Validate excerpt length
    const trimmedExcerpt = data.excerpt.trim();
    if (trimmedExcerpt.length < 10) {
      setError('excerpt', { type: 'minLength', message: 'Excerpt must be at least 10 characters' });
      setLoading(false);
      return;
    }
    
    if (trimmedExcerpt.length > 200) {
      setError('excerpt', { type: 'maxLength', message: 'Excerpt must be 200 characters or less' });
      setLoading(false);
      return;
    }
    
    if (!data.category) {
      setError('category', { type: 'required', message: 'Category is required' });
      setLoading(false);
      return;
    }
    
    if (!data.status) {
      setError('status', { type: 'required', message: 'Status is required' });
      setLoading(false);
      return;
    }
    
    try {
      // Ensure all required fields are present and properly formatted
      const formData = {
        title: data.title.trim(),
        excerpt: trimmedExcerpt, // Use the already validated and trimmed excerpt
        content: content.trim(),
        category: data.category,
        status: data.status,
        tags: data.tags || [],
        isFeatured: data.isFeatured || false,
        featuredImage: featuredImage ? {
          url: featuredImage.url || '',
          imageKitId: featuredImage.imageKitId || '',
          alt: featuredImageAlt || featuredImage.alt || ''
        } : data.featuredImage || {
          url: '',
          imageKitId: '',
          alt: ''
        },
        seo: {
          focusKeyword: data.seo?.focusKeyword || '',
          metaTitle: data.seo?.metaTitle || '',
          metaDescription: data.seo?.metaDescription || '',
          keywords: data.seo?.keywords || [],
          canonicalUrl: data.seo?.canonicalUrl || '',
          ogTitle: data.seo?.ogTitle || '',
          ogDescription: data.seo?.ogDescription || '',
          twitterTitle: data.seo?.twitterTitle || '',
          twitterDescription: data.seo?.twitterDescription || ''
        },
        socialSharing: {
          enableSharing: data.socialSharing?.enableSharing ?? true,
          customMessage: data.socialSharing?.customMessage || ''
        }
      };

      console.log('Submitting blog data:', formData);

      let response;
      if (blog) {
        // Update existing blog
        response = await apiPut(`/api/blogs/${blog._id}`, formData);
      } else {
        // Create new blog
        response = await apiPost('/api/blogs', formData);
      }

      // Handle different response structures
      if (response.data && response.data._id) {
        // Some APIs return the created/updated object directly
        if (onSave) {
          onSave();
        } else {
          router.push('/system/dashboard/blogs');
        }
      } else if (response.status === 200 || response.status === 201) {
        // HTTP success status
        if (onSave) {
          onSave();
        } else {
          router.push('/system/dashboard/blogs');
        }
      } else {
        alert(`Failed to save blog: ${response.data?.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Blog submission error:', error);
      let errorMessage = 'Failed to save blog. Please try again.';
      
      if (error.response?.status === 400) {
        // Handle validation errors
        if (error.response.data?.errors) {
          const validationErrors = error.response.data.errors;
          errorMessage = `Validation failed:\n${validationErrors.map(err => `- ${err.field}: ${err.message}`).join('\n')}`;
        } else if (error.response.data?.message) {
          errorMessage = `Validation failed: ${error.response.data.message}`;
        } else {
          errorMessage = 'Please check all required fields and try again.';
        }
      } else if (error.response?.data?.message) {
        errorMessage = `Failed to save blog: ${error.response.data.message}`;
      } else if (error.message) {
        errorMessage = `Failed to save blog: ${error.message}`;
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loadingBlog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading blog data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => onClose ? onClose() : router.push('/system/dashboard/blogs')}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
          >
            <FaArrowLeft className="mr-2" />
            Back to Blogs
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {blog ? 'Edit Blog Post' : 'Create New Blog Post'}
          </h1>
        </div>

        {/* Main Content Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6">
              <button
                type="button"
                onClick={() => setActiveTab('content')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'content'
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Content
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('seo')}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === 'seo'
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <FaGlobe className="mr-2 h-4 w-4" />
                SEO & Meta
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('social')}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === 'social'
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <FaFacebook className="mr-2 h-4 w-4" />
                Social
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('seo-analyzer')}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === 'seo-analyzer'
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <FaSearch className="mr-2 h-4 w-4" />
                SEO Analyzer
              </button>
            </nav>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            {activeTab === 'content' && (
              <>
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    {...register('title', { required: 'Title is required' })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Enter blog title..."
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title.message}</p>
                  )}
                </div>

                                 {/* Excerpt */}
                 <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Excerpt * <span className="text-xs text-gray-500">(Max 200 characters)</span>
                   </label>
                   <textarea
                    {...register('excerpt', { 
                      required: 'Excerpt is required',
                      maxLength: {
                        value: 200,
                        message: 'Excerpt must be 200 characters or less'
                      },
                      validate: {
                        notEmpty: (value) => value.trim().length > 0 || 'Excerpt cannot be empty',
                        minLength: (value) => value.trim().length >= 10 || 'Excerpt must be at least 10 characters'
                      }
                    })}
                     rows={3}
                    maxLength={200}
                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Enter a brief excerpt (10-200 characters)..."
                   />
                  <div className="flex justify-between items-center mt-1">
                   {errors.excerpt && (
                      <p className="text-sm text-red-600 dark:text-red-400">{errors.excerpt.message}</p>
                   )}
                    <p className="text-xs text-gray-500 ml-auto">
                      {watch('excerpt')?.length || 0}/200 characters
                    </p>
                  </div>
                 </div>

                 {/* Featured Image */}
                 <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                     Featured Image
                   </label>
                   <div className="space-y-4">
                     {/* Image Upload */}
                     <div className="flex items-center space-x-4">
                       <label className="flex items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                         <div className="text-center">
                           {uploadingImage ? (
                             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
                           ) : (
                             <>
                               <FaUpload className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                               <p className="text-xs text-gray-500">Upload Image</p>
                             </>
                           )}
                         </div>
                         <input
                           type="file"
                           accept="image/*"
                           onChange={handleImageChange}
                           className="hidden"
                           disabled={uploadingImage}
                         />
                       </label>
                       
                       {/* Image Preview */}
                       {imagePreview && (
                         <div className="relative">
                           <img
                             src={imagePreview}
                             alt="Featured"
                            className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200 dark:border-gray-600"
                           />
                          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                           <button
                             type="button"
                             onClick={() => {
                               setImagePreview('');
                               setFeaturedImage(null);
                               setFeaturedImageAlt('');
                             }}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors duration-200"
                              title="Remove image"
                           >
                             ×
                           </button>
                          </div>
                          {featuredImage && (
                            <div className="absolute -bottom-2 left-0 right-0 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs px-2 py-1 rounded text-center">
                              ✓ Uploaded
                            </div>
                          )}
                         </div>
                       )}
                     </div>
                     
                     {/* Image Alt Text */}
                     <div>
                       <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                         Alt Text (for accessibility and SEO) *
                       </label>
                       <input
                         type="text"
                         value={featuredImageAlt}
                         onChange={(e) => {
                           setFeaturedImageAlt(e.target.value);
                           if (featuredImage) {
                             setFeaturedImage({ ...featuredImage, alt: e.target.value });
                           }
                         }}
                         className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
                         placeholder="Describe the image for screen readers and SEO..."
                         disabled={!featuredImage}
                       />
                       <p className="mt-1 text-xs text-gray-500">
                         {featuredImageAlt.length > 0 ? `${featuredImageAlt.length} characters` : 'Alt text is required for SEO and accessibility'}
                       </p>
                     </div>
                   </div>
                 </div>

                 {/* Content */}
                 <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                     Content *
                   </label>
                   
                   {/* Toolbar */}
                   {editor && (
                     <div className="border border-b-0 rounded-t-lg bg-gray-50 dark:bg-gray-700 p-2 flex flex-wrap gap-2">
                       {/* Headings */}
                       <select
                         onChange={(e) => {
                           const value = e.target.value;
                           if (value === 'paragraph') {
                             editor.chain().focus().setParagraph().run();
                           } else {
                             editor.chain().focus().toggleHeading({ level: parseInt(value) }).run();
                           }
                         }}
                         value={
                           editor.isActive('heading', { level: 1 }) ? '1' :
                           editor.isActive('heading', { level: 2 }) ? '2' :
                           editor.isActive('heading', { level: 3 }) ? '3' :
                           editor.isActive('heading', { level: 4 }) ? '4' :
                           editor.isActive('heading', { level: 5 }) ? '5' :
                           editor.isActive('heading', { level: 6 }) ? '6' :
                           'paragraph'
                         }
                         className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                       >
                         <option value="paragraph">Paragraph</option>
                         <option value="1">Heading 1</option>
                         <option value="2">Heading 2</option>
                         <option value="3">Heading 3</option>
                         <option value="4">Heading 4</option>
                         <option value="5">Heading 5</option>
                         <option value="6">Heading 6</option>
                       </select>
                       
                       <div className="border-l border-gray-300 dark:border-gray-600 mx-1"></div>
                       
                       {/* Text Formatting */}
                       <button
                         type="button"
                         onClick={() => editor.chain().focus().toggleBold().run()}
                         className={`px-3 py-1 text-sm rounded ${editor.isActive('bold') ? 'bg-primary-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                       >
                         <strong>B</strong>
                       </button>
                       <button
                         type="button"
                         onClick={() => editor.chain().focus().toggleItalic().run()}
                         className={`px-3 py-1 text-sm rounded ${editor.isActive('italic') ? 'bg-primary-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                       >
                         <em>I</em>
                       </button>
                       <button
                         type="button"
                         onClick={() => editor.chain().focus().toggleUnderline().run()}
                         className={`px-3 py-1 text-sm rounded ${editor.isActive('underline') ? 'bg-primary-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                       >
                         <u>U</u>
                       </button>
                       <button
                         type="button"
                         onClick={() => editor.chain().focus().toggleStrike().run()}
                         className={`px-3 py-1 text-sm rounded ${editor.isActive('strike') ? 'bg-primary-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                       >
                         <s>S</s>
                       </button>
                       
                       <div className="border-l border-gray-300 dark:border-gray-600 mx-1"></div>
                       
                       {/* Lists */}
                       <button
                         type="button"
                         onClick={() => editor.chain().focus().toggleBulletList().run()}
                         className={`px-3 py-1 text-sm rounded ${editor.isActive('bulletList') ? 'bg-primary-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                         title="Bullet List"
                       >
                         <span className="font-bold">•</span>
                       </button>
                       <button
                         type="button"
                         onClick={() => editor.chain().focus().toggleOrderedList().run()}
                         className={`px-3 py-1 text-sm rounded ${editor.isActive('orderedList') ? 'bg-primary-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                         title="Numbered List"
                       >
                         <span className="font-bold">1.</span>
                       </button>
                       <button
                         type="button"
                         onClick={() => editor.chain().focus().liftListItem('listItem').run()}
                         className="px-3 py-1 text-sm rounded bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                         title="Decrease Indent"
                         disabled={!editor.isActive('bulletList') && !editor.isActive('orderedList')}
                       >
                         ↶
                       </button>
                       <button
                         type="button"
                         onClick={() => editor.chain().focus().sinkListItem('listItem').run()}
                         className="px-3 py-1 text-sm rounded bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                         title="Increase Indent"
                         disabled={!editor.isActive('bulletList') && !editor.isActive('orderedList')}
                       >
                         ↷
                       </button>
                       
                       <div className="border-l border-gray-300 dark:border-gray-600 mx-1"></div>
                       
                       {/* Blockquote */}
                       <button
                         type="button"
                         onClick={() => editor.chain().focus().toggleBlockquote().run()}
                         className={`px-3 py-1 text-sm rounded ${editor.isActive('blockquote') ? 'bg-primary-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                         title="Quote"
                       >
                         "
                       </button>
                       
                       {/* Code Block */}
                       <button
                         type="button"
                         onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                         className={`px-3 py-1 text-sm rounded ${editor.isActive('codeBlock') ? 'bg-primary-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                         title="Code Block"
                       >
                         &lt;/&gt;
                       </button>
                       
                       {/* Inline Code */}
                       <button
                         type="button"
                         onClick={() => editor.chain().focus().toggleCode().run()}
                         className={`px-3 py-1 text-sm rounded ${editor.isActive('code') ? 'bg-primary-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                         title="Inline Code"
                       >
                         &lt;code&gt;
                       </button>
                       
                       {/* Horizontal Rule */}
                       <button
                         type="button"
                         onClick={() => editor.chain().focus().setHorizontalRule().run()}
                         className="px-3 py-1 text-sm rounded bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                         title="Horizontal Line"
                       >
                         ─
                       </button>
                       
                       <div className="border-l border-gray-300 dark:border-gray-600 mx-1"></div>
                       
                       {/* Alignment */}
                       <button
                         type="button"
                         onClick={() => editor.chain().focus().setTextAlign('left').run()}
                         className={`px-3 py-1 text-sm rounded ${editor.isActive({ textAlign: 'left' }) ? 'bg-primary-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                       >
                         ⬅
                       </button>
                       <button
                         type="button"
                         onClick={() => editor.chain().focus().setTextAlign('center').run()}
                         className={`px-3 py-1 text-sm rounded ${editor.isActive({ textAlign: 'center' }) ? 'bg-primary-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                       >
                         ⬌
                       </button>
                       <button
                         type="button"
                         onClick={() => editor.chain().focus().setTextAlign('right').run()}
                         className={`px-3 py-1 text-sm rounded ${editor.isActive({ textAlign: 'right' }) ? 'bg-primary-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                       >
                         ➡
                       </button>
                       
                       <div className="border-l border-gray-300 dark:border-gray-600 mx-1"></div>
                       
                       {/* Link */}
                       <button
                         type="button"
                         onClick={() => {
                           const url = window.prompt('Enter URL:');
                           if (url) {
                             editor.chain().focus().setLink({ href: url }).run();
                           }
                         }}
                         className={`px-3 py-1 text-sm rounded ${editor.isActive('link') ? 'bg-primary-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                       >
                         🔗
                       </button>
                       
                       {/* Image */}
                       <button
                         type="button"
                         onClick={handleEditorImageUpload}
                         disabled={uploadingImage}
                         className="px-3 py-1 text-sm rounded bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                       >
                         {uploadingImage ? '⏳' : '🖼️'}
                       </button>
                       
                       <div className="border-l border-gray-300 dark:border-gray-600 mx-1"></div>
                       
                       {/* Clear Formatting */}
                       <button
                         type="button"
                         onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
                         className="px-3 py-1 text-sm rounded bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                       >
                         Clear
                       </button>
                     </div>
                   )}
                   
                   {/* Editor */}
                   <div className={`border rounded-b-lg bg-white dark:bg-gray-800 ${errors.content ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'}`}>
                     {editor ? (
                       <EditorContent 
                         editor={editor}
                         className="min-h-[300px] p-4 prose prose-sm max-w-none dark:prose-invert"
                       />
                     ) : (
                       <div className="h-64 flex items-center justify-center">
                         <div className="text-center">
                           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-2"></div>
                           <p className="text-sm text-gray-500 dark:text-gray-400">Loading editor...</p>
                         </div>
                       </div>
                     )}
                   </div>
                   <div className="mt-2 flex items-center justify-between">
                     <div className="flex-1">
                       <p className="text-xs text-gray-500">
                         Tip: Use headings (H1-H6) to structure your content. When adding images, you'll be prompted to enter alt text for better SEO and accessibility.
                       </p>
                       {errors.content && (
                         <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.content.message}</p>
                       )}
                     </div>
                     {content && (
                       <p className="text-xs text-gray-500 ml-4">
                         {content.replace(/<[^>]*>/g, '').trim().length} characters
                       </p>
                     )}
                   </div>
                 </div>

                                 {/* Category and Status */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                       Category *
                     </label>
                     <select
                       {...register('category', { required: 'Category is required' })}
                       className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                     >
                       <option value="">Select category</option>
                       <option value="Digital Marketing">Digital Marketing</option>
                       <option value="Cloud Solutions">Cloud Solutions</option>
                       <option value="Technology">Technology</option>
                       <option value="Business">Business</option>
                       <option value="Industry Insights">Industry Insights</option>
                       <option value="Data Analytics">Data Analytics</option>
                       <option value="Creative Services">Creative Services</option>
                       <option value="Earned Media">Earned Media</option>
                       <option value="Paid Media">Paid Media</option>
                     </select>
                     {errors.category && (
                       <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.category.message}</p>
                     )}
                   </div>

                   <div>
                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                       Status *
                     </label>
                     <select
                       {...register('status', { required: 'Status is required' })}
                       className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                     >
                       <option value="draft">Draft</option>
                       <option value="review">Review</option>
                       <option value="published">Published</option>
                       <option value="archived">Archived</option>
                     </select>
                     {errors.status && (
                       <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.status.message}</p>
                     )}
                   </div>
                 </div>

                 {/* Tags */}
                 <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                     Tags
                   </label>
                   <input
                     type="text"
                     placeholder="Enter tags separated by commas..."
                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                     onChange={(e) => {
                       const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
                       setValue('tags', tags);
                     }}
                     defaultValue={watch('tags')?.join(', ')}
                   />
                   <p className="mt-1 text-xs text-gray-500">
                     Separate tags with commas (e.g., marketing, technology, business)
                   </p>
                 </div>

                {/* Featured */}
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      {...register('isFeatured')}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Mark as featured post
                    </span>
                  </label>
                </div>
              </>
            )}

            {activeTab === 'seo' && (
              <>
                {/* SEO Meta Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Meta Title
                      <span className="text-xs text-gray-500 ml-2">(Max 60 characters)</span>
                    </label>
                    <input
                      type="text"
                      {...register('seo.metaTitle')}
                      maxLength={60}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="SEO meta title..."
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      {watch('seo.metaTitle')?.length || 0}/60 characters
                    </p>
                  </div>

                {/* SEO Meta Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Meta Description
                      <span className="text-xs text-gray-500 ml-2">(Max 160 characters)</span>
                    </label>
                    <textarea
                      {...register('seo.metaDescription')}
                      maxLength={160}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="SEO meta description..."
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      {watch('seo.metaDescription')?.length || 0}/160 characters
                    </p>
                  </div>

                  {/* Focus Keyword */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Focus Keyword *
                      <span className="text-xs text-gray-500 ml-2">(Primary keyword for SEO ranking)</span>
                    </label>
                    <input
                      type="text"
                      {...register('seo.focusKeyword', { required: false })}
                      placeholder="Enter your primary focus keyword..."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      The main keyword you want to rank for. This will be used for SEO analysis and scoring.
                    </p>
                  </div>

                  {/* Keywords */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Additional Keywords
                    </label>
                    <input
                      type="text"
                      placeholder="Enter keywords separated by commas..."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      onChange={(e) => {
                        const keywords = e.target.value.split(',').map(keyword => keyword.trim()).filter(keyword => keyword);
                        setValue('seo.keywords', keywords);
                      }}
                      defaultValue={watch('seo.keywords')?.join(', ')}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Separate keywords with commas (secondary keywords)
                    </p>
                  </div>

                  {/* Canonical URL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Canonical URL
                    </label>
                    <input
                      type="url"
                      {...register('seo.canonicalUrl')}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="https://example.com/blog-post"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      The preferred URL for this content (optional)
                    </p>
                  </div>

                  {/* Open Graph Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Open Graph Title
                      <span className="text-xs text-gray-500 ml-2">(Max 60 characters)</span>
                    </label>
                    <input
                      type="text"
                      {...register('seo.ogTitle')}
                      maxLength={60}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Title for social media sharing..."
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      {watch('seo.ogTitle')?.length || 0}/60 characters
                    </p>
                  </div>

                  {/* Open Graph Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Open Graph Description
                      <span className="text-xs text-gray-500 ml-2">(Max 160 characters)</span>
                    </label>
                    <textarea
                      {...register('seo.ogDescription')}
                      maxLength={160}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Description for social media sharing..."
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      {watch('seo.ogDescription')?.length || 0}/160 characters
                    </p>
                  </div>

                  {/* Twitter Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Twitter Title
                      <span className="text-xs text-gray-500 ml-2">(Max 60 characters)</span>
                    </label>
                    <input
                      type="text"
                      {...register('seo.twitterTitle')}
                      maxLength={60}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Title for Twitter cards..."
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      {watch('seo.twitterTitle')?.length || 0}/60 characters
                    </p>
                  </div>

                  {/* Twitter Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Twitter Description
                      <span className="text-xs text-gray-500 ml-2">(Max 160 characters)</span>
                    </label>
                    <textarea
                      {...register('seo.twitterDescription')}
                      maxLength={160}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Description for Twitter cards..."
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      {watch('seo.twitterDescription')?.length || 0}/160 characters
                    </p>
                  </div>
              </>
            )}

            {activeTab === 'social' && (
              <>
                  {/* Social Sharing Settings */}
                  <div className="space-y-4">
                    <h4 className="text-md font-medium text-gray-900 dark:text-white">Social Sharing Settings</h4>
                    
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          {...register('socialSharing.enableSharing')}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          Enable social sharing buttons
                        </span>
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Custom Social Message
                      </label>
                      <textarea
                        {...register('socialSharing.customMessage')}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="Custom message for social sharing (optional)..."
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        This message will be included when users share your post
                      </p>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'seo-analyzer' && (
              <div>
                <SEOAnalyzer 
                  blogData={{
                    title: watch('title'),
                    excerpt: watch('excerpt'),
                    content: content,
                    category: watch('category'),
                    tags: watch('tags') || [],
                    featuredImage: {
                      url: featuredImage?.url || '',
                      alt: featuredImageAlt || featuredImage?.alt || ''
                    },
                    seo: {
                      focusKeyword: watch('seo.focusKeyword') || '',
                      metaTitle: watch('seo.metaTitle'),
                      metaDescription: watch('seo.metaDescription'),
                      keywords: watch('seo.keywords') || [],
                      ogTitle: watch('seo.ogTitle'),
                      ogDescription: watch('seo.ogDescription'),
                      twitterTitle: watch('seo.twitterTitle'),
                      twitterDescription: watch('seo.twitterDescription')
                    }
                  }}
                />
              </div>
            )}

            {/* Form Actions */}
            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700 px-6 pb-6">
              <button
                type="button"
                onClick={() => onClose ? onClose() : router.push('/system/dashboard/blogs')}
                className="px-6 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <FaSave className="h-4 w-4" />
                    <span>Save Blog Post</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BlogForm;
