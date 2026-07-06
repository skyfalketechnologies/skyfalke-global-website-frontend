'use client';

import React from 'react';
import SEOHead from '../components/SEO/SEOHead';
import { SITE_META_DESCRIPTION } from '../utils/metadata';

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

const HOME_TITLE = 'Digital Growth Partner in Africa | Skyfalke';
const HOME_DESCRIPTION = SITE_META_DESCRIPTION;
const HOME_KEYWORDS =  'digital growth partner, business automation, SEO and ads, CRM workflows, AI roadmap, digital transformation Kenya, Skyfalke';
const HOME_OG_TITLE = 'Digital Growth Partner in Africa | Skyfalke';
const HOME_OG_DESC = SITE_META_DESCRIPTION;
const HOME_TWITTER_DESC = SITE_META_DESCRIPTION;

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
