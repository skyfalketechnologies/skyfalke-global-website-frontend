import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { 
  FaChartBar, 
  FaUsers, 
  FaRocket, 
  FaShieldAlt, 
  FaLightbulb,
  FaArrowRight,
  FaCheck,
  FaDatabase,
  FaChartLine,
  FaEye,
  FaCog
} from 'react-icons/fa';

const BusinessIntelligence = () => {
  const features = [
    {
      icon: FaChartBar,
      title: "Interactive Dashboards",
      description: "Real-time, interactive dashboards that provide instant insights into your business performance."
    },
    {
      icon: FaDatabase,
      title: "Data Integration",
      description: "Seamlessly integrate data from multiple sources for comprehensive business intelligence."
    },
    {
      icon: FaChartLine,
      title: "KPI Tracking",
      description: "Monitor key performance indicators with automated tracking and alerting systems."
    },
    {
      icon: FaEye,
      title: "Visual Analytics",
      description: "Transform complex data into clear, actionable visualizations and reports."
    },
    {
      icon: FaCog,
      title: "Custom Solutions",
      description: "Tailored business intelligence solutions designed for your specific industry and needs."
    }
  ];

  const benefits = [
    {
      icon: FaUsers,
      title: "Informed Decision Making",
      description: "Make strategic decisions based on real-time data and comprehensive insights."
    },
    {
      icon: FaRocket,
      title: "Operational Efficiency",
      description: "Identify bottlenecks and optimization opportunities to streamline operations."
    },
    {
      icon: FaShieldAlt,
      title: "Risk Management",
      description: "Proactively identify and mitigate risks through data-driven analysis."
    },
    {
      icon: FaLightbulb,
      title: "Strategic Planning",
      description: "Develop data-backed strategies for growth and competitive advantage."
    }
  ];

  const process = [
    {
      step: "01",
      title: "Data Assessment",
      description: "Evaluate your current data infrastructure and identify improvement opportunities."
    },
    {
      step: "02",
      title: "Solution Design",
      description: "Design custom BI solutions tailored to your business objectives and requirements."
    },
    {
      step: "03",
      title: "Implementation",
      description: "Deploy and configure your business intelligence platform with expert guidance."
    },
    {
      step: "04",
      title: "Training & Support",
      description: "Provide comprehensive training and ongoing support for your BI solution."
    }
  ];

  return (
    <>
      <Helmet>
        <title>Business Intelligence Solutions | Skyfalke</title>
        <meta name="description" content="Transform your business with comprehensive business intelligence solutions. Get real-time insights, interactive dashboards, and data-driven decision making capabilities." />
        <meta name="keywords" content="business intelligence, BI, data analytics, dashboards, KPI tracking, data visualization" />
      </Helmet>

             {/* Hero Section */}
       <section className="relative min-h-screen md:h-screen flex items-center overflow-hidden py-12 md:py-0">
         {/* Background Image */}
         <div className="absolute inset-0">
           <img 
             src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
             alt="Business Intelligence Dashboard with charts and analytics"
             className="w-full h-full object-cover"
           />
           <div className="absolute inset-0 bg-primary-800/80"></div>
         </div>
         
         {/* Background Pattern */}
         <div className="absolute inset-0 opacity-10">
           <div className="absolute inset-0 bg-gradient-to-br from-secondary-400 to-accent-500"></div>
           <div className="absolute top-0 left-0 w-full h-full" style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
           }}></div>
         </div>
         
         <div className="container mx-auto px-4 sm:px-6 relative z-10">
           <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
             {/* Text Content */}
             <motion.div
               initial={{ opacity: 0, x: -30 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.8 }}
               className="text-left text-white"
             >
               <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
                 Business Intelligence
               </h1>
               <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 text-primary-100">
                 Transform raw data into actionable insights with our comprehensive business intelligence solutions
               </p>
               <Link to="/schedule-consultation?service=Business Intelligence">
                 <motion.button
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   className="bg-secondary-500 text-primary-800 px-6 py-3 md:px-8 md:py-4 rounded-lg font-semibold text-base md:text-lg hover:bg-secondary-400 transition-colors w-full sm:w-auto"
                 >
                   Get Started Today
                 </motion.button>
               </Link>
             </motion.div>
             
             {/* Floating Elements */}
             <motion.div
               initial={{ opacity: 0, x: 30 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.8, delay: 0.2 }}
               className="relative hidden lg:block"
             >
               <div className="absolute -top-4 -right-4 w-16 h-16 bg-secondary-400 rounded-full opacity-20 animate-pulse"></div>
               <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-accent-500 rounded-full opacity-20 animate-pulse delay-1000"></div>
             </motion.div>
           </div>
         </div>
       </section>

      {/* Features Section */}
      <section className="py-12 md:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8 md:mb-12 lg:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6">
              Powerful Business Intelligence Features
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Our comprehensive BI solutions provide everything you need to make data-driven decisions and drive business growth.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gray-50 p-6 md:p-8 rounded-xl hover:shadow-lg transition-shadow"
              >
                <div className="text-primary-500 text-3xl md:text-4xl mb-3 md:mb-4">
                  <feature.icon />
                </div>
                <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3 md:mb-4">
                  {feature.title}
                </h3>
                <p className="text-sm md:text-base text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 md:py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8 md:mb-12 lg:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6">
              Why Choose Our Business Intelligence?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Experience the transformative power of data-driven decision making with our advanced BI solutions.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex items-start space-x-3 md:space-x-4"
              >
                <div className="text-primary-500 text-2xl md:text-3xl mt-1 flex-shrink-0">
                  <benefit.icon />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2 md:mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-sm md:text-base text-gray-600">
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-12 md:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8 md:mb-12 lg:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6">
              Our Implementation Process
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              We follow a proven methodology to ensure successful BI implementation and maximum ROI.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {process.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="bg-primary-600 text-white w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center text-xl md:text-2xl font-bold mx-auto mb-4 md:mb-6">
                  {step.step}
                </div>
                <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3 md:mb-4">
                  {step.title}
                </h3>
                <p className="text-sm md:text-base text-gray-600">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 lg:py-20 bg-primary-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
              Ready to Transform Your Business?
            </h2>
            <p className="text-base sm:text-lg md:text-xl mb-6 md:mb-8 text-primary-100 max-w-3xl mx-auto px-4">
              Start your journey towards data-driven success with our comprehensive business intelligence solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/schedule-consultation?service=Business Intelligence" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-secondary-500 text-primary-800 px-6 py-3 md:px-8 md:py-4 rounded-lg font-semibold text-base md:text-lg hover:bg-secondary-400 transition-colors w-full sm:w-auto"
                >
                  Schedule Consultation
                </motion.button>
              </Link>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white text-white px-6 py-3 md:px-8 md:py-4 rounded-lg font-semibold text-base md:text-lg hover:bg-white hover:text-primary-600 transition-colors w-full sm:w-auto"
              >
                Learn More
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default BusinessIntelligence;
