'use client';

import React, { useState, useEffect } from 'react';
import SEOHead from '../components/SEO/SEOHead';

// Components
import AcademyHero from '../components/Academy/AcademyHero';
import AcademyAbout from '../components/Academy/AcademyAbout';
import AcademyCourses from '../components/Academy/AcademyCourses';
import AcademyLearning from '../components/Academy/AcademyLearning';
import AcademyTestimonials from '../components/Academy/AcademyTestimonials';
import AcademyCTA from '../components/Academy/AcademyCTA';

const Academy = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('/api/academy/courses?featured=true&limit=6');
        const data = await response.json();
        setCourses(data.courses || []);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <>
      <SEOHead
        pageType="academy"
        title="Skyfalke Academy – Online ICT & AI Learning for the Modern Professional"
        description="Empowering businesses and professionals through short courses and masterclasses in ICT, AI, Cloud, and Digital Transformation. Learn from industry experts with hands-on training."
        keywords="online learning, ICT courses, AI training, digital transformation, cloud computing, professional development, online education, tech skills, business training, Skyfalke Academy"
        canonical="https://skyfalke.com/academy"
        ogTitle="Skyfalke Academy – Online ICT & AI Learning for the Modern Professional"
        ogDescription="Empowering businesses and professionals through short courses and masterclasses in ICT, AI, Cloud, and Digital Transformation."
      />

      {/* Hero Section */}
      <AcademyHero />

      {/* About Section */}
      <AcademyAbout />

      {/* Courses & Masterclasses Section */}
      <AcademyCourses courses={courses} loading={loading} />

      {/* Learning Experience Section */}
      <AcademyLearning />

      {/* Testimonials Section */}
      {/* <AcademyTestimonials /> */}

      {/* Call to Action */}
      <AcademyCTA />
    </>
  );
};

export default Academy;
