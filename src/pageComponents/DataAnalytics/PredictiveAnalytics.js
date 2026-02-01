'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import Link from 'next/link';
import { 
  FaBrain, 
  FaUsers, 
  FaRocket, 
  FaShieldAlt, 
  FaLightbulb,
  FaArrowRight,
  FaCheck,
  FaDatabase,
  FaChartLine,
  FaEye,
  FaCog,
  FaChartBar,
  FaRobot
} from 'react-icons/fa';

const PredictiveAnalytics = () => {
  const features = [
    {
      icon: FaBrain,
      title: "Machine Learning Models",
      description: "Advanced ML algorithms that learn from your data to predict future outcomes and trends."
    },
    {
      icon: FaChartBar,
      title: "Risk Assessment",
      description: "Identify and quantify potential risks with sophisticated predictive risk modeling."
    },
    {
      icon: FaUsers,
      title: "Customer Behavior Prediction",
      description: "Anticipate customer needs and behaviors to improve engagement and retention strategies."
    },
    {
      icon: FaChartLine,
      title: "Market Trend Forecasting",
      description: "Predict market trends and opportunities to stay ahead of the competition."
    },
    {
      icon: FaRobot,
      title: "AI-Powered Insights",
      description: "Leverage artificial intelligence to uncover hidden patterns and generate actionable predictions."
    }
  ];

  const benefits = [
    {
      icon: FaUsers,
      title: "Proactive Decision Making",
      description: "Make informed decisions before events occur, giving you a competitive advantage."
    },
    {
      icon: FaRocket,
      title: "Optimized Operations",
      description: "Streamline operations by predicting demand, resource needs, and potential bottlenecks."
    },
    {
      icon: FaShieldAlt,
      title: "Risk Mitigation",
      description: "Identify potential risks early and develop strategies to minimize their impact."
    },
    {
      icon: FaLightbulb,
      title: "Strategic Planning",
      description: "Develop data-backed strategies for growth and competitive positioning."
    }
  ];

  const useCases = [
    {
      title: "Sales Forecasting",
      description: "Predict future sales volumes and revenue to optimize inventory and resource allocation.",
      icon: FaChartBar
    },
    {
      title: "Customer Churn Prediction",
      description: "Identify customers at risk of leaving and implement retention strategies proactively.",
      icon: FaUsers
    },
    {
      title: "Demand Planning",
      description: "Forecast product demand to optimize supply chain and inventory management.",
      icon: FaChartLine
    },
    {
      title: "Fraud Detection",
      description: "Detect fraudulent activities and transactions in real-time using predictive models.",
      icon: FaShieldAlt
    }
  ];

  const process = [
    {
      step: "01",
      title: "Data Preparation",
      description: "Clean, validate, and prepare historical data for model training and validation."
    },
    {
      step: "02",
      title: "Model Development",
      description: "Build and train predictive models using advanced machine learning algorithms."
    },
    {
      step: "03",
      title: "Validation & Testing",
      description: "Validate model accuracy and performance using historical data and testing sets."
    },
    {
      step: "04",
      title: "Deployment & Monitoring",
      description: "Deploy models in production and continuously monitor their performance and accuracy."
    }
  ];

  return (
    <>
      <Helmet>
        <title>Predictive Analytics Solutions | Skyfalke</title>
        <meta name="description" content="Anticipate future trends and make data-driven decisions with AI-powered predictive analytics. Get machine learning models and forecasting capabilities." />
        <meta name="keywords" content="predictive analytics, machine learning, forecasting, risk assessment, customer behavior prediction, AI analytics" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative section-padding bg-gradient-to-br from-primary-500 to-primary-800 text-white pt-32 pb-16">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
            alt="AI Prediction Engine with machine learning models"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600/95 to-primary-800/95"></div>
        </div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Predictive Analytics
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 leading-relaxed">
              Anticipate future trends and make data-driven decisions with AI-powered predictive analytics. Our models help organizations reduce risks by 45%+ and identify opportunities before competitors.
            </p>
            <Link href="/schedule-consultation?service=Predictive Analytics">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-secondary-500 text-primary-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-secondary-400 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Explore Predictions
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8 md:mb-12 lg:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6">
              Advanced Predictive Capabilities
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Our predictive analytics solutions leverage cutting-edge AI and machine learning to forecast future outcomes.
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

      {/* Use Cases Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8 md:mb-12 lg:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6">
              Predictive Analytics Use Cases
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Discover how predictive analytics can transform your business operations and decision-making processes.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {useCases.map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-6 md:p-8 rounded-xl shadow-lg"
              >
                <div className="text-primary-500 text-3xl md:text-4xl mb-3 md:mb-4">
                  <useCase.icon />
                </div>
                <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3 md:mb-4">
                  {useCase.title}
                </h3>
                <p className="text-sm md:text-base text-gray-600">
                  {useCase.description}
                </p>
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
            transition={{ duration: 0.8 }}
            className="text-center mb-8 md:mb-12 lg:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6">
              Why Choose Our Predictive Analytics?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Experience the power of AI-driven predictions and stay ahead of the competition with proactive insights.
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
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8 md:mb-12 lg:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6">
              Our Predictive Analytics Process
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              We follow a proven methodology to develop accurate and reliable predictive models for your business.
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
      <section className="section-padding bg-primary-600 text-white">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
              Ready to Predict the Future?
            </h2>
            <p className="text-base sm:text-lg md:text-xl mb-6 md:mb-8 text-primary-100 max-w-3xl mx-auto px-4">
              Start your journey towards predictive success with our AI-powered analytics solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/schedule-consultation?service=Predictive Analytics" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-secondary-500 text-primary-800 px-6 py-3 md:px-8 md:py-4 rounded-lg font-semibold text-base md:text-lg hover:bg-secondary-400 transition-colors w-full sm:w-auto"
                >
                  Start Predictive Project
                </motion.button>
              </Link>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white text-white px-6 py-3 md:px-8 md:py-4 rounded-lg font-semibold text-base md:text-lg hover:bg-white hover:text-primary-600 transition-colors w-full sm:w-auto"
              >
                Schedule Demo
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default PredictiveAnalytics;
