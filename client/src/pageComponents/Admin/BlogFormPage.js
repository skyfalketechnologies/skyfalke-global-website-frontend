'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Helmet } from 'react-helmet-async';
import BlogForm from '../../components/Admin/BlogForm';

const BlogFormPage = () => {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const isEditing = !!id;

  const handleClose = () => {
    router.push('/system/dashboard/blogs');
  };

  const handleSave = () => {
    router.push('/system/dashboard/blogs');
  };

  return (
    <>
      <Helmet>
        <title>{isEditing ? 'Edit Blog Post' : 'Create New Blog Post'} - Admin Dashboard</title>
      </Helmet>
      <BlogForm
        blogId={id}
        onClose={handleClose}
        onSave={handleSave}
      />
    </>
  );
};

export default BlogFormPage;

