'use client';

import React from 'react';
import SEOHead from '../components/SEO/SEOHead';

// Components
import HeroSlider from '../components/Home/HeroSlider';
import CustomerMarquee from '../components/Home/CustomerMarquee';
import ServicesOverview from '../components/Home/ServicesOverview';
import WhoWeWorkWith from '../components/Home/WhoWeWorkWith';
import FeaturedCaseStudies from '../components/Home/FeaturedCaseStudies';
import BlogSection from '../components/Home/BlogSection';
import CTASection from '../components/Home/CTASection';
import PartnersMarquee from '../components/Home/PartnersMarquee';
import CreativeVideoSection from '../components/Home/CreativeVideoSection';
import ProductsParallaxSlider from '../components/Home/ProductsParallaxSlider';

const Home = () => {
  return (
    <>
      <SEOHead pageType="home" canonical="https://skyfalke.com/" />

      {/* Hero Section */}
      <HeroSlider />

      {/* Customer Marquee */}
      <CustomerMarquee />

      {/* Services Overview */}
      <ServicesOverview />

      {/* Who We Work With */}
      <WhoWeWorkWith />

      {/* Partners Marquee */}
      <PartnersMarquee />

      {/* Creative Video Section */}
      <CreativeVideoSection />

      {/* Featured Case Studies */}
      {/* <FeaturedCaseStudies /> */}

      {/* Products Parallax Slider */}
      <ProductsParallaxSlider />

      {/* Blog Section */}
      <BlogSection />

      {/* Call to Action */}
      <CTASection />
    </>
  );
};

export default Home;
