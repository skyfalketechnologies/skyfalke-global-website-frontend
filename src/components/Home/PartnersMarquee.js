import React from 'react';
import { motion } from 'framer-motion';

const PartnersMarquee = () => {
  // Partner logos data
  const partners = [
    {
      id: 1,
      name: "Meta Platforms",
      logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg",
      alt: "Meta Platforms"
    },
    {
      id: 2,
      name: "Google Cloud",
      logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/Google_Cloud_logo.svg",
      alt: "Google Cloud"
    },
    {
      id: 3,
      name: "DigitalOcean",
      logo: "https://upload.wikimedia.org/wikipedia/commons/f/ff/DigitalOcean_logo.svg",
      alt: "DigitalOcean"
    },
    {
      id: 4,
      name: "Amazon Web Services",
      logo: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg",
      alt: "Amazon Web Services"
    },
    {
      id: 5,
      name: "Acronis",
      logo: "/images/partners/acronis.svg",
      alt: "Acronis"
    },
    {
      id: 6,
      name: "Microsoft Advertising",
      logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
      alt: "Microsoft Advertising"
    },
    {
      id: 7,
      name: "TikTok Marketing Partner",
      logo: "/images/partners/tiktok.svg",
      alt: "TikTok Marketing Partner"
    },
    {
      id: 8,
      name: "Cloudflare",
      logo: "/images/partners/cloudflare.svg",
      alt: "Cloudflare"
    },
    {
      id: 8,
      name: "Backblaze",
      logo: "/images/partners/backblaze.svg",
      alt: "Backbaze"
    }
    
  ];

  // Duplicate the array multiple times to create seamless loop
  const duplicatedPartners = [...partners, ...partners, ...partners];

  // Calculate the scroll distance for seamless loop
  const itemWidth = 200 + 64; // 200px (w-48) + 64px (space-x-16)
  const scrollDistance = partners.length * itemWidth;

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Working With Industry Leaders
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We partner with the world's leading technology companies to deliver exceptional solutions for our clients.
          </p>
        </motion.div>

        {/* Marquee Container */}
        <div className="relative">
          {/* Gradient Overlays for smooth fade effect */}
          <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-gray-50 to-transparent z-10"></div>
          <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-gray-50 to-transparent z-10"></div>

          {/* Scrolling Marquee */}
          <div className="flex overflow-hidden">
            <motion.div
              className="flex items-center space-x-16 md:space-x-20"
              animate={{
                x: [0, -scrollDistance],
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 30,
                  ease: "linear",
                },
              }}
              style={{ minWidth: 'fit-content' }}
            >
              {duplicatedPartners.map((partner, index) => (
                <div
                  key={`${partner.id}-${index}`}
                  className="flex-shrink-0 w-48 md:w-56 h-20 md:h-24 flex items-center justify-center"
                >
                  {/* Partner Logo */}
                  <div className="w-full h-full bg-white rounded-xl border border-gray-200 shadow-sm flex items-center justify-center p-6 hover:shadow-lg hover:border-gray-300 transition-all duration-300 group">
                    <img
                      src={partner.logo}
                      alt={partner.alt}
                      className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300 opacity-70 group-hover:opacity-100"
                      loading="lazy"
                      onError={(e) => {
                        // Fallback for broken images
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    {/* Fallback text for broken images */}
                    <div className="hidden items-center justify-center w-full h-full text-gray-400 font-semibold text-sm text-center">
                      {partner.name}
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnersMarquee;
