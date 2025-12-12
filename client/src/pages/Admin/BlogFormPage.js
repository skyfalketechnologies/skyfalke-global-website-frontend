import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import BlogForm from '../../components/Admin/BlogForm';

const BlogFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const handleClose = () => {
    navigate('/system/dashboard/blogs');
  };

  const handleSave = () => {
    navigate('/system/dashboard/blogs');
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

