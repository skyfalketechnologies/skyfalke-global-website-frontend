'use client';

import { useParams } from 'next/navigation';
import BlogFormPage from '@/pageComponents/Admin/BlogFormPage';

export default function EditBlogPage() {
  const params = useParams();
  const id = params?.id;

  return <BlogFormPage id={id} />;
}

