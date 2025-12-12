import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  FaNewspaper, 
  FaUsers, 
  FaBullhorn, 
  FaShareAlt, 
  FaGlobe,
  FaRocket,
  FaChartLine,
  FaHeart,
  FaStar,
  FaArrowRight
} from 'react-icons/fa';

const EarnedMedia = () => {
  const services = [
    {
      icon: FaNewspaper,
      title: "Public Relations",
      description: "Build your brand reputation and credibility through strategic public relations campaigns.",
      features: [
        "Media relations and press releases",
        "Crisis communication management",
        "Brand storytelling and messaging",
        "Industry thought leadership"
      ]
    },
    {
      icon: FaUsers,
      title: "Influencer Marketing",
      description: "Leverage the power of influential voices to amplify your brand message and reach.",
      features: [
        "Influencer identification and outreach",
        "Campaign strategy and execution",
        "Content collaboration and co-creation",
        "Performance tracking and ROI measurement"
      ]
    },
    {
      icon: FaBullhorn,
      title: "Content Marketing",
      description: "Create valuable, engaging content that attracts and retains your target audience.",
      features: [
        "Content strategy development",
        "Blog writing and management",
        "Social media content creation",
        "Email marketing campaigns"
      ]
    },
    {
      icon: FaShareAlt,
      title: "Social Media Management",
      description: "Build meaningful connections with your audience through strategic social media presence.",
      features: [
        "Platform strategy and optimization",
        "Community engagement and moderation",
        "Social media advertising",
        "Analytics and performance reporting"
      ]
    },
    {
      icon: FaGlobe,
      title: "Brand Awareness",
      description: "Increase your brand visibility and recognition across multiple channels and platforms.",
      features: [
        "Brand positioning and messaging",
        "Multi-channel awareness campaigns",
        "Event marketing and sponsorships",
        "Partnership and collaboration strategies"
      ]
    }
  ];

  const benefits = [
    {
      icon: FaRocket,
      title: "Increased Brand Visibility",
      description: "Expand your reach and get your brand in front of more potential customers."
    },
    {
      icon: FaHeart,
      title: "Authentic Engagement",
      description: "Build genuine relationships with your audience through organic, earned media."
    },
    {
      icon: FaStar,
      title: "Enhanced Credibility",
      description: "Establish trust and authority in your industry through third-party validation."
    },
    {
      icon: FaChartLine,
      title: "Sustainable Growth",
      description: "Create long-term value through relationships and reputation building."
    }
  ];

  return (
    <>
      <Helmet>
        <title>Earned Media & PR Services | Skyfalke - Build Authentic Brand Awareness & Trust</title>
        <meta name="description" content="Build authentic brand awareness and credibility with Skyfalke's earned media services. From PR to influencer marketing, we help you earn trust and recognition." />
        <meta name="keywords" content="earned media, public relations, influencer marketing, content marketing, social media management, brand awareness" />
        <meta property="og:title" content="Earned Media & PR Services | Skyfalke - Build Authentic Brand Awareness & Trust" />
        <meta property="og:description" content="Build authentic brand awareness and credibility with our earned media services." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://skyfalke.com/services/earned-media" />
        <meta property="og:image" content="/favicon.ico" />
        <link rel="canonical" href="https://skyfalke.com/services/earned-media" />
      </Helmet>

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative bg-slate-900 text-white py-16 sm:py-20 md:py-24">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
            }}
          ></div>
          <div className="absolute inset-0 bg-slate-900/80"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
                Earned Media
                <span className="block text-secondary-500 mt-2">Solutions</span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-slate-200 max-w-4xl mx-auto mb-6 sm:mb-8 px-4">
                Build authentic brand awareness, credibility, and trust through strategic earned media campaigns.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <button className="bg-secondary-500 hover:bg-secondary-400 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base">
                  Get Started
                </button>
                <button className="border-2 border-white text-white hover:bg-white hover:text-slate-900 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold transition-all duration-300 text-sm sm:text-base">
                  View Case Studies
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12 sm:mb-16"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
                Our Earned Media Services
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
                Comprehensive earned media solutions designed to build authentic relationships and enhance your brand reputation.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 sm:p-8"
                >
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-secondary-500 rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
                    <service.icon className="text-white text-lg sm:text-2xl" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">{service.title}</h3>
                  <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">{service.description}</p>
                  <ul className="space-y-2 sm:space-y-3">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-700 text-sm sm:text-base">
                        <div className="w-2 h-2 bg-secondary-500 rounded-full mr-3 flex-shrink-0"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12 sm:mb-16"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
                Why Choose Our Earned Media?
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
                Experience the power of authentic, organic brand growth through strategic earned media campaigns.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="flex items-start space-x-3 sm:space-x-4"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-secondary-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="text-white text-lg sm:text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
                    <p className="text-gray-600 text-sm sm:text-base">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
                Ready to Build Authentic Brand Awareness?
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-slate-200 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
                Let's discuss how our earned media strategies can help you build genuine relationships and enhance your brand reputation.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <button className="bg-secondary-500 text-white hover:bg-secondary-400 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center text-sm sm:text-base">
                  <span>Get Free Consultation</span>
                  <FaArrowRight className="ml-2" />
                </button>
                <button className="border-2 border-white text-white hover:bg-white hover:text-slate-900 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold transition-all duration-300 text-sm sm:text-base">
                  View Our Portfolio
                </button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default EarnedMedia;




