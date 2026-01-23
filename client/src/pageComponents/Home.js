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
      <SEOHead
        pageType="home"
        title="Skyfalke • Digital Growth & Automation Systems for Modern Organizations"
        description="We help organizations simplify operations, automate workflows, and make better decisions by combining technology, AI, cloud, data, and digital marketing. End-to-end digital systems that support growth and efficiency."
        keywords="digital systems, automation systems, business automation, digital transformation, workflow automation, end-to-end digital systems, systems integration, digital growth, business efficiency, SME digital solutions, startup technology, NGO digital tools, consulting firm automation, data integration, process automation, cloud systems, AI business solutions, digital marketing automation, business intelligence, technology consulting, digital operations, business systems design, organizational efficiency, digital tools integration"
        canonical="https://skyfalke.com/"
        ogTitle="Digital Growth & Automation Systems for Modern Organizations"
      />

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
