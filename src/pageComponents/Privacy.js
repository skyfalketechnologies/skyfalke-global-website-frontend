import React from 'react';
import { Helmet } from 'react-helmet-async';
import LegalPage from '../components/legal/LegalPage';

const Privacy = () => {
  const lastUpdated = "July 6, 2026";

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
    },
    {
      title: "Policy Updates",
      content: [
        "We may update this Privacy Policy from time to time",
        "We will notify you of changes by posting the new policy on this page and updating the \"Last updated\" date",
        "We encourage you to review this Privacy Policy periodically for any changes"
      ]
    }
  ];

  return (
    <>
      <Helmet>
        <title>Privacy Policy - Skyfalke</title>
        <meta name="description" content="Skyfalke's Privacy Policy - Learn how we collect, use, and protect your personal information." />
      </Helmet>

      <LegalPage
        eyebrow="Legal"
        title="Privacy Policy"
        intro="This policy explains how Skyfalke collects, uses, and protects your information when you use skyfalke.com, our academy, client portals, and related services. You can exercise access, correction, or deletion rights as described below."
        lastUpdated={lastUpdated}
        sections={sections}
        contactHeading="Contact us about privacy"
        contactText="If you have questions or concerns about this Privacy Policy or our data practices, please contact us:"
        contactEmail="privacy@skyfalke.com"
      />
    </>
  );
};

export default Privacy;
