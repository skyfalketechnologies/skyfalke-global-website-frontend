'use client';

import React from 'react';
import SEOHead from '../components/SEO/SEOHead';

import HeroSlider from '../components/Home/HeroSlider';
import HomeProblemSection from '../components/Home/HomeProblemSection';
import HomeSolutionSection from '../components/Home/HomeSolutionSection';
import HomeHowItWorks from '../components/Home/HomeHowItWorks';
import HomeServicesGrid from '../components/Home/HomeServicesGrid';
import HomeDifferentiation from '../components/Home/HomeDifferentiation';
import HomeSocialProof from '../components/Home/HomeSocialProof';
import HomeFeaturedArticles from '../components/Home/HomeFeaturedArticles';
import HomeLeadMagnet from '../components/Home/HomeLeadMagnet';
import CreativeVideoSection from '@/components/Home/CreativeVideoSection';
import CTASection from '../components/Home/CTASection';

const HOME_TITLE = 'Skyfalke | Turn Your Business Into a High-Performing Digital Asset';
const HOME_DESCRIPTION = 'Growth-focused digital partner: websites, branding, SEO, ads, CRM, automation, and AI roadmaps; one clear strategy to scale revenue.';
const HOME_KEYWORDS =  'digital growth partner, business automation, SEO and ads, CRM workflows, AI roadmap, digital transformation Kenya, Skyfalke';
const HOME_OG_TITLE = 'Skyfalke | High-Performing Digital Growth Systems';
const HOME_OG_DESC = 'Build online presence, acquire customers, and streamline operations with strategic technology — not fragmented vendors.';
const HOME_TWITTER_DESC = 'Websites, marketing, automation, and AI - unified into one growth engine for serious businesses.';

const Home = () => {
  return (
    <>
      <SEOHead
        skipBaseMeta
        pageType="home"
        canonical="https://skyfalke.com/"
        title={HOME_TITLE}
        description={HOME_DESCRIPTION}
        keywords={HOME_KEYWORDS}
        ogTitle={HOME_OG_TITLE}
        ogDescription={HOME_OG_DESC}
        twitterTitle={HOME_OG_TITLE}
        twitterDescription={HOME_TWITTER_DESC}
        image="https://ik.imagekit.io/g3nahgeeu/hero/skyfalke-digital-tech-firm.webp?tr=w-1200,h-630,f-auto,q-auto:good"
      />

      <HeroSlider />
      <HomeProblemSection />
      <HomeSolutionSection />
      <HomeHowItWorks />
      <HomeServicesGrid />
      <HomeDifferentiation />
      <HomeSocialProof />
      <HomeFeaturedArticles />
      <CreativeVideoSection />
      <HomeLeadMagnet />
      <CTASection />
    </>
  );
};

export default Home;
