import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FaFileContract, FaEnvelope, FaPhone, FaExclamationTriangle } from 'react-icons/fa';

const Terms = () => {
  const lastUpdated = "December 15, 2024";

  const sections = [
    {
      title: "Acceptance of Terms",
      content: [
        "By accessing and using Skyfalke's services, you accept and agree to be bound by these Terms of Service",
        "If you do not agree to these terms, please do not use our services",
        "We reserve the right to modify these terms at any time with notice to users",
        "Your continued use of our services constitutes acceptance of any modifications"
      ]
    },
    {
      title: "Description of Services",
      content: [
        "Digital Marketing: SEO optimization, social media marketing, content strategy, and analytics services",
        "Cloud Solutions: Infrastructure management, hosting services, security, and technical support",
        "Business Tools: SEO tools, business intelligence platforms, and custom software solutions",
        "Consulting: Technology consulting, digital transformation, and strategic advisory services"
      ]
    },
    {
      title: "User Responsibilities",
      content: [
        "Provide accurate and complete information when using our services",
        "Maintain the security of your account credentials and notify us of any unauthorized access",
        "Use our services in compliance with applicable laws and regulations",
        "Respect intellectual property rights and not engage in any fraudulent or harmful activities"
      ]
    },
    {
      title: "Payment Terms",
      content: [
        "Fees are due in advance according to your selected billing cycle",
        "All payments are non-refundable unless otherwise specified in writing",
        "We reserve the right to suspend services for non-payment after 30 days notice",
        "Prices may change with 30 days advance notice to existing customers"
      ]
    },
    {
      title: "Intellectual Property",
      content: [
        "Skyfalke retains all rights to our proprietary tools, software, and methodologies",
        "You retain ownership of your content and data provided to us",
        "We grant you a limited license to use our services during the term of your agreement",
        "Any custom work developed specifically for you becomes your intellectual property upon full payment"
      ]
    },
    {
      title: "Service Level Agreement",
      content: [
        "We strive to maintain 99.9% uptime for our cloud services",
        "Scheduled maintenance will be announced at least 48 hours in advance",
        "Support response times: Critical issues within 2 hours, general inquiries within 24 hours",
        "Service credits may be provided for extended outages as outlined in your service agreement"
      ]
    },
    {
      title: "Data Protection and Privacy",
      content: [
        "We implement industry-standard security measures to protect your data",
        "Your data will not be shared with third parties without your consent, except as required by law",
        "We comply with applicable data protection regulations including GDPR",
        "You have the right to request access, correction, or deletion of your personal data"
      ]
    },
    {
      title: "Limitation of Liability",
      content: [
        "Our liability is limited to the amount paid for services in the 12 months preceding any claim",
        "We are not liable for indirect, incidental, or consequential damages",
        "Force majeure events beyond our reasonable control are excluded from liability",
        "Some jurisdictions do not allow limitation of liability, so these limits may not apply to you"
      ]
    },
    {
      title: "Termination",
      content: [
        "Either party may terminate services with 30 days written notice",
        "We may terminate immediately for breach of terms or non-payment",
        "Upon termination, you will have 30 days to retrieve your data",
        "Certain obligations and limitations will survive termination of the agreement"
      ]
    },
    {
      title: "Governing Law",
      content: [
        "These terms are governed by the laws of Kenya",
        "Any disputes will be resolved through binding arbitration in Nairobi, Kenya",
        "If arbitration is not enforceable, disputes will be heard in Kenyan courts",
        "The prevailing party in any dispute is entitled to reasonable attorney fees"
      ]
    }
  ];

  return (
    <>
      <Helmet>
        <title>Terms of Service - Skyfalke</title>
        <meta name="description" content="Skyfalke's Terms of Service - Legal terms and conditions for using our digital marketing, cloud solutions, and business tools." />
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
                <FaFileContract className="text-5xl mx-auto mb-4" />
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl font-bold mb-6"
              >
                Terms of Service
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-gray-300"
              >
                Legal terms and conditions governing the use of Skyfalke's services
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
                  These Terms of Service ("Terms") govern your use of Skyfalke's digital marketing solutions, 
                  cloud services, business tools, and related services. By using our services, you agree to 
                  these terms. Please read them carefully as they contain important information about your 
                  rights and obligations, as well as limitations and exclusions that may apply to you.
                </p>
              </motion.div>

              {/* Important Notice */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8"
              >
                <div className="flex items-start space-x-3">
                  <FaExclamationTriangle className="text-red-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-red-800 mb-2">Important Notice</h3>
                    <p className="text-red-700">
                      These terms include important limitations of liability and dispute resolution provisions. 
                      By using our services, you agree to resolve disputes through binding arbitration rather 
                      than court proceedings, except where prohibited by law.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Terms Sections */}
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
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Us About These Terms</h2>
                <p className="text-gray-600 mb-6">
                  If you have questions about these Terms of Service or need clarification on any provision, 
                  please contact our legal team:
                </p>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <FaEnvelope className="text-primary-600" />
                    <span className="text-gray-700">legal@skyfalke.com</span>
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
                className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-8"
              >
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Terms Updates</h3>
                <p className="text-blue-700">
                  We may modify these Terms of Service from time to time. When we make material changes, 
                  we will provide at least 30 days notice via email or through our services. Your continued 
                  use of our services after the effective date constitutes acceptance of the modified terms.
                </p>
              </motion.div>

              {/* Effective Date */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="text-center mt-12 py-8 border-t border-gray-200"
              >
                <p className="text-gray-500">
                  These Terms of Service are effective as of {lastUpdated} and remain in effect until modified or terminated.
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Terms;
