import React from 'react';
import { Helmet } from 'react-helmet-async';
import LegalPage from '../components/legal/LegalPage';

const Terms = () => {
  const lastUpdated = "July 6, 2026";

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
    },
    {
      title: "Changes to These Terms",
      content: [
        "We may modify these Terms of Service from time to time",
        "When we make material changes, we will provide at least 30 days notice via email or through our services",
        "Your continued use of our services after the effective date constitutes acceptance of the modified terms"
      ]
    }
  ];

  return (
    <>
      <Helmet>
        <title>Terms of Service - Skyfalke</title>
        <meta name="description" content="Skyfalke's Terms of Service - Legal terms and conditions for using our digital marketing, cloud solutions, and business tools." />
      </Helmet>

      <LegalPage
        eyebrow="Legal"
        title="Terms of Service"
        intro="Legal terms and conditions governing the use of Skyfalke's website, digital services, cloud offerings, academy programs, and consulting engagements. Specific project or enterprise agreements may include statements of work that prevail where they conflict with these general terms."
        lastUpdated={lastUpdated}
        sections={sections}
        notice="These terms include important limitations of liability and dispute resolution provisions. By using our services, you agree to resolve disputes through binding arbitration rather than court proceedings, except where prohibited by law."
        contactHeading="Contact us about these terms"
        contactText="If you have questions about these Terms of Service or need clarification on any provision, please contact our legal team:"
        contactEmail="legal@skyfalke.com"
        footNote={`These Terms of Service are effective as of ${lastUpdated} and remain in effect until modified or terminated.`}
      />
    </>
  );
};

export default Terms;
