import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaEnvelope, FaPhone } from 'react-icons/fa';

const Privacy = () => {
  const lastUpdated = "December 15, 2024";

  const sections = [
    {
      title: "Information We Collect",
      content: [
        "Personal Information: When you use our services, we may collect personal information such as your name, email address, phone number, and company details.",
        "Usage Data: We automatically collect information about how you interact with our services, including IP addresses, browser type, and usage patterns.",
        "Cookies and Tracking: We use cookies and similar technologies to enhance your experience and analyze website performance."
      ]
    },
    {
      title: "How We Use Your Information",
      content: [
        "Provide and improve our digital marketing, cloud solutions, and business tools",
        "Communicate with you about our services, updates, and promotional offers",
        "Analyze usage patterns to enhance user experience and service performance",
        "Comply with legal obligations and protect our rights and interests"
      ]
    },
    {
      title: "Information Sharing",
      content: [
        "We do not sell, trade, or rent your personal information to third parties",
        "We may share information with trusted service providers who assist in our operations",
        "We may disclose information when required by law or to protect our rights",
        "Business transfers: Information may be transferred in connection with mergers or acquisitions"
      ]
    },
    {
      title: "Data Security",
      content: [
        "We implement industry-standard security measures to protect your information",
        "All data transmissions are encrypted using SSL/TLS protocols",
        "Access to personal information is restricted to authorized personnel only",
        "We regularly update our security practices to address emerging threats"
      ]
    },
    {
      title: "Your Rights",
      content: [
        "Access: You can request access to your personal information we hold",
        "Correction: You can request correction of inaccurate or incomplete information",
        "Deletion: You can request deletion of your personal information, subject to legal requirements",
        "Portability: You can request a copy of your data in a structured, machine-readable format"
      ]
    },
    {
      title: "Cookies Policy",
      content: [
        "Essential Cookies: Required for basic website functionality",
        "Analytics Cookies: Help us understand how visitors use our website",
        "Marketing Cookies: Used to deliver relevant advertisements",
        "You can control cookie preferences through your browser settings"
      ]
    },
    {
      title: "International Transfers",
      content: [
        "Your information may be processed in countries outside your residence",
        "We ensure appropriate safeguards are in place for international transfers",
        "We comply with applicable data protection laws including GDPR and local regulations",
        "Cross-border transfers are conducted with adequate protection measures"
      ]
    },
    {
      title: "Children's Privacy",
      content: [
        "Our services are not intended for children under 13 years of age",
        "We do not knowingly collect personal information from children under 13",
        "If we become aware of such collection, we will delete the information promptly",
        "Parents can contact us to request deletion of their child's information"
      ]
    }
  ];

  return (
    <>
      <Helmet>
        <title>Privacy Policy - Skyfalke</title>
        <meta name="description" content="Skyfalke's Privacy Policy - Learn how we collect, use, and protect your personal information." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gray-900 text-white py-20">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <FaShieldAlt className="text-5xl mx-auto mb-4" />
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl font-bold mb-6"
              >
                Privacy Policy
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-gray-300"
              >
                Your privacy is important to us. This policy explains how we collect, use, and protect your information.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-sm text-gray-400 mt-4"
              >
                Last updated: {lastUpdated}
              </motion.p>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              {/* Introduction */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl p-8 shadow-lg mb-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
                <p className="text-gray-600 leading-relaxed">
                  Skyfalke ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains 
                  how we collect, use, disclose, and safeguard your information when you visit our website or use our 
                  services, including digital marketing solutions, cloud services, and business tools. Please read this 
                  privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not 
                  access our services.
                </p>
              </motion.div>

              {/* Policy Sections */}
              {sections.map((section, index) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl p-8 shadow-lg mb-8"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">{section.title}</h2>
                  <ul className="space-y-4">
                    {section.content.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-gray-600 leading-relaxed">{item}</p>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}

              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="bg-primary-50 rounded-xl p-8 border border-primary-200"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Us About Privacy</h2>
                <p className="text-gray-600 mb-6">
                  If you have questions or concerns about this Privacy Policy or our data practices, 
                  please contact us using the information below:
                </p>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <FaEnvelope className="text-primary-600" />
                    <span className="text-gray-700">privacy@skyfalke.com</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FaPhone className="text-primary-600" />
                    <span className="text-gray-700">+254 (0) 717 797 238</span>
                  </div>
                </div>
              </motion.div>

              {/* Updates Notice */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mt-8"
              >
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">Policy Updates</h3>
                <p className="text-yellow-700">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by 
                  posting the new Privacy Policy on this page and updating the "Last updated" date. 
                  We encourage you to review this Privacy Policy periodically for any changes.
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Privacy;
