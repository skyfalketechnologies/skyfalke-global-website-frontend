'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  FaPalette, 
  FaLaptop, 
  FaImage, 
  FaVideo, 
  FaBullhorn,
  FaRocket,
  FaHeart,
  FaStar,
  FaLightbulb,
  FaArrowRight
} from 'react-icons/fa';

const Creative = () => {
  const services = [
    {
      icon: FaPalette,
      title: "Brand Design",
      description: "Create a memorable and distinctive brand identity that resonates with your audience.",
      features: [
        "Logo design and brand identity",
        "Brand guidelines and style guides",
        "Visual identity systems",
        "Brand positioning and messaging"
      ]
    },
    {
      icon: FaLaptop,
      title: "UI/UX Design",
      description: "Design intuitive and engaging user experiences that drive conversions and satisfaction.",
      features: [
        "User interface design",
        "User experience optimization",
        "Wireframing and prototyping",
        "Usability testing and research"
      ]
    },
    {
      icon: FaImage,
      title: "Graphic Design",
      description: "Create compelling visual content that communicates your message effectively.",
      features: [
        "Marketing materials design",
        "Social media graphics",
        "Print and digital collateral",
        "Infographics and data visualization"
      ]
    },
    {
      icon: FaVideo,
      title: "Video Production",
      description: "Tell your story through compelling video content that engages and converts.",
      features: [
        "Video concept and scripting",
        "Professional video production",
        "Animation and motion graphics",
        "Video editing and post-production"
      ]
    },
    {
      icon: FaBullhorn,
      title: "Content Creation",
      description: "Develop engaging content that connects with your audience and drives results.",
      features: [
        "Content strategy development",
        "Copywriting and content writing",
        "Visual content creation",
        "Content marketing campaigns"
      ]
    }
  ];

  const benefits = [
    {
      icon: FaHeart,
      title: "Emotional Connection",
      description: "Create designs that resonate emotionally with your target audience."
    },
    {
      icon: FaStar,
      title: "Brand Recognition",
      description: "Build a distinctive brand that stands out in your market."
    },
    {
      icon: FaRocket,
      title: "Increased Engagement",
      description: "Drive higher engagement and conversion rates with compelling creative."
    },
    {
      icon: FaLightbulb,
      title: "Innovation",
      description: "Stay ahead of the competition with innovative and creative solutions."
    }
  ];

  return (
    <>
      <Helmet>
        <title>Creative Design & Branding Services | Skyfalke - Elevate Your Brand with Compelling Visual Experiences</title>
        <meta name="description" content="Elevate your brand with Skyfalke's creative services. From brand design to video production, we create compelling visual experiences." />
        <meta name="keywords" content="creative services, brand design, UI/UX design, graphic design, video production, content creation" />
        <meta property="og:title" content="Creative Design & Branding Services | Skyfalke - Elevate Your Brand with Compelling Visual Experiences" />
        <meta property="og:description" content="Elevate your brand with our creative design services." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://skyfalke.com/services/creative" />
        <meta property="og:image" content="/favicon.ico" />
        <link rel="canonical" href="https://skyfalke.com/services/creative" />
      </Helmet>

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative section-padding bg-gradient-to-br from-primary-500 to-primary-800 text-white pt-32 pb-16">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600/95 to-primary-800/95"></div>
          <div className="container-custom relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Creative Services
                <span className="block text-secondary-500 mt-3">That Captivate & Convert</span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-primary-100 max-w-4xl mx-auto mb-8 leading-relaxed">
                From brand identity to video production, we craft visual experiences that resonate deeply with audiences. Our designs have helped brands increase engagement by 60%+ and boost conversion rates through compelling storytelling.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-secondary-500 hover:bg-secondary-400 text-primary-900 px-8 py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  Get Started Today
                </button>
                <button className="border-2 border-white text-white hover:bg-white hover:text-primary-900 px-8 py-4 rounded-lg font-semibold transition-all duration-300">
                  View Portfolio
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Services Section */}
        <section className="section-padding bg-gray-50">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Our Creative Services
              </h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Every pixel, every frame, every word is crafted to tell your story and drive meaningful connections with your target audience.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 transform hover:-translate-y-2"
                >
                  <div className="w-16 h-16 bg-secondary-500 rounded-2xl flex items-center justify-center mb-6">
                    <service.icon className="text-white text-2xl" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
                  <ul className="space-y-3">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start text-gray-700">
                        <div className="w-2 h-2 bg-secondary-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                        <span className="leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="section-padding bg-white">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Why Choose Our Creative Services?
              </h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                We combine artistic vision with strategic thinking to create designs that don't just look good—they drive results.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex items-start space-x-4 bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors"
                >
                  <div className="w-14 h-14 bg-secondary-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding bg-gradient-to-br from-primary-600 to-primary-800 text-white">
          <div className="container-custom text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                Ready to Elevate Your Brand?
              </h2>
              <p className="text-lg md:text-xl text-primary-100 mb-8 max-w-3xl mx-auto leading-relaxed">
                Let's collaborate to create visual experiences that not only capture attention but drive meaningful engagement and conversions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-secondary-500 text-primary-900 hover:bg-secondary-400 px-8 py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center transform hover:-translate-y-1">
                  <span>Get Free Consultation</span>
                  <FaArrowRight className="ml-2" />
                </button>
                <button className="border-2 border-white text-white hover:bg-white hover:text-primary-900 px-8 py-4 rounded-lg font-semibold transition-all duration-300">
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

export default Creative;
