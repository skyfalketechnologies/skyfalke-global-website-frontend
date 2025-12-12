import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  FaGoogle, 
  FaMobile, 
  FaImage, 
  FaVideo, 
  FaBullhorn,
  FaRocket,
  FaChartLine,
  FaCrosshairs,
  FaDollarSign,
  FaArrowRight
} from 'react-icons/fa';

const PaidMedia = () => {
  const services = [
    {
      icon: FaGoogle,
      title: "Google Ads",
      description: "Drive targeted traffic and conversions with strategic Google Ads campaigns.",
      features: [
        "Search engine marketing (SEM)",
        "Display advertising campaigns",
        "Shopping ads optimization",
        "Performance tracking and optimization"
      ]
    },
    {
      icon: FaMobile,
      title: "Social Media Ads",
      description: "Reach your audience where they spend time with engaging social media advertising.",
      features: [
        "Facebook and Instagram ads",
        "LinkedIn advertising campaigns",
        "Twitter and TikTok ads",
        "Audience targeting and retargeting"
      ]
    },
    {
      icon: FaImage,
      title: "Display Advertising",
      description: "Increase brand awareness and reach with visually compelling display ads.",
      features: [
        "Banner ad design and placement",
        "Programmatic advertising",
        "Remarketing campaigns",
        "Brand awareness campaigns"
      ]
    },
    {
      icon: FaVideo,
      title: "Video Advertising",
      description: "Engage your audience with compelling video content and advertising.",
      features: [
        "YouTube advertising campaigns",
        "Video ad production and editing",
        "In-stream and out-stream ads",
        "Video performance optimization"
      ]
    },
    {
      icon: FaBullhorn,
      title: "Retargeting Campaigns",
      description: "Re-engage potential customers and increase conversion rates with smart retargeting.",
      features: [
        "Cross-platform retargeting",
        "Dynamic remarketing ads",
        "Abandoned cart campaigns",
        "Customer lifetime value optimization"
      ]
    }
  ];

  const benefits = [
    {
      icon: FaCrosshairs,
      title: "Precise Targeting",
      description: "Reach the right audience at the right time with advanced targeting capabilities."
    },
    {
      icon: FaChartLine,
      title: "Measurable Results",
      description: "Track performance and ROI with comprehensive analytics and reporting."
    },
    {
      icon: FaRocket,
      title: "Quick Results",
      description: "See immediate impact and results from your advertising investments."
    },
    {
      icon: FaDollarSign,
      title: "Scalable Growth",
      description: "Scale your campaigns up or down based on performance and budget."
    }
  ];

  return (
    <>
      <Helmet>
        <title>Paid Media & Digital Advertising Services | Skyfalke - Drive ROI with Strategic Campaigns</title>
        <meta name="description" content="Drive targeted traffic and conversions with Skyfalke's paid media services. From Google Ads to social media advertising, we maximize your ROI." />
        <meta name="keywords" content="paid media, Google Ads, social media advertising, display advertising, video advertising, retargeting campaigns" />
        <meta property="og:title" content="Paid Media & Digital Advertising Services | Skyfalke - Drive ROI with Strategic Campaigns" />
        <meta property="og:description" content="Drive targeted traffic and conversions with our paid media services." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://skyfalke.com/services/paid-media" />
        <meta property="og:image" content="/favicon.ico" />
        <link rel="canonical" href="https://skyfalke.com/services/paid-media" />
      </Helmet>

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative bg-slate-900 text-white py-16 sm:py-20 md:py-24">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80')`
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
                Paid Media
                <span className="block text-secondary-500 mt-2">Solutions</span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-slate-200 max-w-4xl mx-auto mb-6 sm:mb-8 px-4">
                Drive targeted traffic, increase conversions, and maximize ROI with strategic paid advertising campaigns.
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
                Our Paid Media Services
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
                Comprehensive paid advertising solutions designed to drive results and maximize your marketing ROI.
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
                Why Choose Our Paid Media?
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
                Experience the power of targeted advertising with measurable results and maximum ROI.
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
                Ready to Drive Results with Paid Media?
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-slate-200 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
                Let's discuss how our paid advertising strategies can help you reach your target audience and achieve your business goals.
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

export default PaidMedia;
