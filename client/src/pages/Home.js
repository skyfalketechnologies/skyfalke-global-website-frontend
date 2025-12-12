import React from 'react';
import SEOHead from '../components/SEO/SEOHead';

// Components
import HeroSlider from '../components/Home/HeroSlider';
import CustomerMarquee from '../components/Home/CustomerMarquee';
import ServicesOverview from '../components/Home/ServicesOverview';
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
        title="Skyfalke • Helping Businesses Succeed Online"
        description="Skyfalke is a digital firm based in Nairobi, Kenya, offering web hosting, domain registration, cloud computing, IT consultancy, and digital marketing services."
        keywords="digital firm, marketing agency, advertisement agency, Marketing agency in Nairobi, Marketing agency in Kenya, Marketing agency in Africa, SSL certificates, sectigo, SSL certificates,  hosting, eco-friendly web hosting, renewable energy servers, sustainable hosting, domain names, cloud computing, reliable hosting, carbon-neutral hosting, IT consultancy, AI agency, SME business solutions, cloud computing services, digital marketing agency, IT services, business technology solutions, enterprise IT support, technology consulting"
        canonical="https://skyfalke.com/"
        ogTitle="Helping Businesses Succeed Online"
      />

      {/* Hero Section */}
      <HeroSlider />

      {/* Customer Marquee */}
      <CustomerMarquee />

      {/* Services Overview */}
      <ServicesOverview />

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
