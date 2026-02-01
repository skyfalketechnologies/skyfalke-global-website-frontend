import React, { useState, useEffect } from 'react';
import { FaTwitter, FaFacebook, FaLinkedin, FaWhatsapp, FaShare } from 'react-icons/fa';

/**
 * Social Share Component - Floating social share buttons
 * SEO-friendly with proper link attributes
 */
const SocialShare = ({ url, title }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  if (!isVisible) return null;

  return (
    <aside 
      className="fixed left-4 top-1/2 transform -translate-y-1/2 z-50 transition-all duration-300"
      aria-label="Share this article"
    >
      <div className="flex flex-col gap-3 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg border border-gray-200">
        <a
          href={shareLinks.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#1DA1F2] hover:scale-110 transition-transform"
          title="Share on Twitter"
          aria-label="Share on Twitter"
        >
          <FaTwitter className="w-6 h-6" />
        </a>
        <a
          href={shareLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#4267B2] hover:scale-110 transition-transform"
          title="Share on Facebook"
          aria-label="Share on Facebook"
        >
          <FaFacebook className="w-6 h-6" />
        </a>
        <a
          href={shareLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#0077B5] hover:scale-110 transition-transform"
          title="Share on LinkedIn"
          aria-label="Share on LinkedIn"
        >
          <FaLinkedin className="w-6 h-6" />
        </a>
        <a
          href={shareLinks.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#25D366] hover:scale-110 transition-transform"
          title="Share on WhatsApp"
          aria-label="Share on WhatsApp"
        >
          <FaWhatsapp className="w-6 h-6" />
        </a>
        <button
          onClick={copyToClipboard}
          className="text-gray-600 hover:scale-110 transition-transform"
          title="Copy link"
          aria-label="Copy link to clipboard"
        >
          {copied ? (
            <span className="text-green-600 text-xs">✓</span>
          ) : (
            <FaShare className="w-6 h-6" />
          )}
        </button>
      </div>
    </aside>
  );
};

export default SocialShare;

