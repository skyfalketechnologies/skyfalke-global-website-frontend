import React, { useMemo } from 'react';
import { 
  FaCheckCircle, 
  FaExclamationTriangle, 
  FaTimesCircle, 
  FaInfoCircle,
  FaChartBar,
  FaSearch,
  FaLink,
  FaImage,
  FaHeading,
  FaFileAlt,
  FaStar,
  FaTrophy
} from 'react-icons/fa';

const SEOAnalyzer = ({ blogData }) => {
  const analyzeSEO = useMemo(() => {
    if (!blogData) return null;

    const issues = [];
    const warnings = [];
    const suggestions = [];
    const passed = [];
    const focusKeywordChecks = [];
    let totalScore = 0;
    let maxScore = 100; // Standard 100-point scale

    // Extract text from HTML content
    const extractText = (html) => {
      if (!html) return '';
      if (typeof document === 'undefined') {
        return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
      }
      const div = document.createElement('div');
      div.innerHTML = html;
      return div.textContent || div.innerText || '';
    };

    // Normalize text for keyword matching
    const normalizeText = (text) => {
      return text.toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    };

    const contentText = extractText(blogData.content || '');
    const normalizedContent = normalizeText(contentText);
    const words = normalizedContent.split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;
    const charCount = contentText.length;

    // Extract headings
    const headingRegex = /<h([1-6])[^>]*>(.*?)<\/h[1-6]>/gi;
    const headings = [];
    let headingMatch;
    while ((headingMatch = headingRegex.exec(blogData.content || '')) !== null) {
      headings.push({ level: parseInt(headingMatch[1]), text: extractText(headingMatch[2]) });
    }

    // Get focus keyword
    const focusKeyword = blogData.seo?.focusKeyword || '';
    const normalizedFocusKeyword = focusKeyword ? normalizeText(focusKeyword) : '';
    const hasFocusKeyword = !!normalizedFocusKeyword;

    // STANDARD SEO SCORING (Industry-standard like Yoast/RankMath)
    // Each check contributes points to a 100-point scale

    // 1. TITLE ANALYSIS (15 points)
    const title = blogData.title || '';
    if (!title) {
      issues.push({ type: 'error', message: 'Title is missing', field: 'title', priority: 'high', points: -15 });
      totalScore -= 15;
    } else {
      if (title.length < 30) {
        warnings.push({ type: 'warning', message: 'Title is too short (recommended: 30-60 characters)', field: 'title', current: title.length, recommended: '30-60', priority: 'medium', points: -5 });
        totalScore += 5; // Partial points
      } else if (title.length > 60) {
        warnings.push({ type: 'warning', message: 'Title is too long (recommended: 30-60 characters)', field: 'title', current: title.length, recommended: '30-60', priority: 'medium', points: -5 });
        totalScore += 5; // Partial points
      } else {
        passed.push({ type: 'success', message: 'Title length is optimal', field: 'title', value: title.length, points: 15 });
        totalScore += 15;
      }
    }

    // 2. META TITLE ANALYSIS (10 points)
    const metaTitle = blogData.seo?.metaTitle || title;
    if (!metaTitle || metaTitle === title) {
      if (!title) {
        warnings.push({ type: 'warning', message: 'Meta title is missing', field: 'metaTitle', priority: 'low', points: -5 });
        totalScore -= 5;
      } else {
        suggestions.push({ type: 'info', message: 'Consider setting a custom meta title', field: 'metaTitle', priority: 'low', points: 0 });
        totalScore += 5; // Partial credit if using title
      }
    } else {
      if (metaTitle.length < 30) {
        warnings.push({ type: 'warning', message: 'Meta title is too short (recommended: 30-60 characters)', field: 'metaTitle', current: metaTitle.length, recommended: '30-60', priority: 'medium', points: -3 });
        totalScore += 5;
      } else if (metaTitle.length > 60) {
        warnings.push({ type: 'warning', message: 'Meta title is too long (recommended: 30-60 characters)', field: 'metaTitle', current: metaTitle.length, recommended: '30-60', priority: 'medium', points: -3 });
        totalScore += 5;
      } else {
        passed.push({ type: 'success', message: 'Meta title length is optimal', field: 'metaTitle', value: metaTitle.length, points: 10 });
        totalScore += 10;
      }
    }

    // 3. META DESCRIPTION ANALYSIS (10 points)
    const metaDescription = blogData.seo?.metaDescription || blogData.excerpt || '';
    if (!metaDescription) {
      warnings.push({ type: 'warning', message: 'Meta description is missing', field: 'metaDescription', priority: 'medium', points: -5 });
      totalScore -= 5;
    } else {
      if (metaDescription.length < 120) {
        warnings.push({ type: 'warning', message: 'Meta description is too short (recommended: 120-160 characters)', field: 'metaDescription', current: metaDescription.length, recommended: '120-160', priority: 'medium', points: -3 });
        totalScore += 5;
      } else if (metaDescription.length > 160) {
        warnings.push({ type: 'warning', message: 'Meta description is too long (recommended: 120-160 characters)', field: 'metaDescription', current: metaDescription.length, recommended: '120-160', priority: 'medium', points: -3 });
        totalScore += 5;
      } else {
        passed.push({ type: 'success', message: 'Meta description length is optimal', field: 'metaDescription', value: metaDescription.length, points: 10 });
        totalScore += 10;
      }
    }

    // 4. EXCERPT ANALYSIS (5 points)
    const excerpt = blogData.excerpt || '';
    if (!excerpt) {
      issues.push({ type: 'error', message: 'Excerpt is missing', field: 'excerpt', priority: 'high', points: -5 });
      totalScore -= 5;
    } else {
      if (excerpt.length < 120) {
        warnings.push({ type: 'warning', message: 'Excerpt is too short (recommended: 120-160 characters)', field: 'excerpt', current: excerpt.length, recommended: '120-160', priority: 'medium', points: -2 });
        totalScore += 2;
      } else if (excerpt.length > 160) {
        warnings.push({ type: 'warning', message: 'Excerpt is too long (recommended: 120-160 characters)', field: 'excerpt', current: excerpt.length, recommended: '120-160', priority: 'medium', points: -2 });
        totalScore += 2;
      } else {
        passed.push({ type: 'success', message: 'Excerpt length is optimal', field: 'excerpt', value: excerpt.length, points: 5 });
        totalScore += 5;
      }
    }

    // 5. CONTENT LENGTH ANALYSIS (10 points)
    if (wordCount < 300) {
      issues.push({ type: 'error', message: 'Content is too short (recommended: at least 300 words)', field: 'content', current: wordCount, recommended: '300+', priority: 'high', points: -10 });
      totalScore -= 10;
    } else if (wordCount < 1000) {
      warnings.push({ type: 'warning', message: 'Content could be longer for better SEO (recommended: 1000+ words)', field: 'content', current: wordCount, recommended: '1000+', priority: 'low', points: -3 });
      totalScore += 5;
    } else {
      passed.push({ type: 'success', message: `Content length is good (${wordCount} words)`, field: 'content', value: wordCount, points: 10 });
      totalScore += 10;
    }

    // 6. HEADING STRUCTURE ANALYSIS (10 points)
    const h1Count = headings.filter(h => h.level === 1).length;
    const h2Count = headings.filter(h => h.level === 2).length;
    
    if (h1Count === 0) {
      warnings.push({ type: 'warning', message: 'No H1 heading found in content', field: 'content', priority: 'high', points: -5 });
      totalScore -= 5;
    } else if (h1Count > 1) {
      warnings.push({ type: 'warning', message: `Multiple H1 headings found (${h1Count}). Use only one H1.`, field: 'content', current: h1Count, recommended: '1', priority: 'medium', points: -3 });
      totalScore += 3;
    } else {
      if (h2Count > 0) {
        passed.push({ type: 'success', message: `Good heading structure (1 H1, ${h2Count} H2)`, field: 'content', value: h2Count, points: 10 });
        totalScore += 10;
      } else if (wordCount > 500) {
        suggestions.push({ type: 'info', message: 'Consider adding H2 headings to structure your content', field: 'content', priority: 'low', points: 0 });
        totalScore += 5;
      } else {
        passed.push({ type: 'success', message: 'H1 heading structure is correct', field: 'content', points: 7 });
        totalScore += 7;
      }
    }

    // 7. FEATURED IMAGE ANALYSIS (8 points)
    if (!blogData.featuredImage?.url) {
      warnings.push({ type: 'warning', message: 'No featured image set', field: 'featuredImage', priority: 'medium', points: -4 });
      totalScore -= 4;
    } else {
      if (!blogData.featuredImage.alt || blogData.featuredImage.alt.trim() === '') {
        issues.push({ type: 'error', message: 'Featured image is missing alt text', field: 'featuredImage.alt', priority: 'high', points: -4 });
        totalScore += 2; // Partial credit for having image
      } else {
        passed.push({ type: 'success', message: 'Featured image has alt text', field: 'featuredImage.alt', points: 8 });
        totalScore += 8;
      }
    }

    // 8. CONTENT IMAGES ANALYSIS (5 points)
    const imageRegex = /<img[^>]+>/gi;
    const images = [];
    let imageMatch;
    while ((imageMatch = imageRegex.exec(blogData.content || '')) !== null) {
      const imgTag = imageMatch[0];
      const altMatch = imgTag.match(/alt=["']([^"']*)["']/i);
      images.push({ alt: altMatch ? altMatch[1] : '' });
    }
    
    const imagesWithoutAlt = images.filter(img => !img.alt || img.alt.trim() === '');
    if (images.length > 0) {
      if (imagesWithoutAlt.length > 0) {
        issues.push({ type: 'error', message: `${imagesWithoutAlt.length} image(s) in content missing alt text`, field: 'content', priority: 'high', points: -3 });
        totalScore += 2; // Partial credit
      } else {
        passed.push({ type: 'success', message: `All ${images.length} image(s) have alt text`, field: 'content', points: 5 });
        totalScore += 5;
      }
    }

    // 9. CATEGORY ANALYSIS (5 points)
    if (!blogData.category) {
      issues.push({ type: 'error', message: 'Category is missing', field: 'category', priority: 'high', points: -5 });
      totalScore -= 5;
    } else {
      passed.push({ type: 'success', message: `Category is set: ${blogData.category}`, field: 'category', points: 5 });
      totalScore += 5;
    }

    // 10. TAGS ANALYSIS (3 points)
    const tags = blogData.tags || [];
    if (tags.length === 0) {
      warnings.push({ type: 'warning', message: 'No tags specified', field: 'tags', priority: 'low', points: -1 });
      totalScore -= 1;
    } else if (tags.length < 3) {
      suggestions.push({ type: 'info', message: 'Consider adding more tags (recommended: 3-10)', field: 'tags', current: tags.length, recommended: '3-10', priority: 'low', points: 0 });
      totalScore += 1;
    } else {
      passed.push({ type: 'success', message: `Tags specified (${tags.length})`, field: 'tags', value: tags.length, points: 3 });
      totalScore += 3;
    }

    // 11. INTERNAL LINKS ANALYSIS (7 points)
    const linkRegex = /<a[^>]+href=["']([^"']*)["'][^>]*>(.*?)<\/a>/gi;
    const links = [];
    let linkMatch;
    while ((linkMatch = linkRegex.exec(blogData.content || '')) !== null) {
      links.push({ url: linkMatch[1], text: extractText(linkMatch[2]) });
    }

    const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
    const internalLinks = links.filter(link => 
      link.url.startsWith('/') || 
      (hostname && link.url.includes(hostname)) ||
      !link.url.startsWith('http')
    );

    if (wordCount > 500) {
      if (internalLinks.length === 0) {
        suggestions.push({ type: 'info', message: 'Consider adding internal links to improve SEO', field: 'content', priority: 'low', points: 0 });
        totalScore += 0;
      } else if (internalLinks.length >= 3 && internalLinks.length <= 10) {
        passed.push({ type: 'success', message: `Good internal linking (${internalLinks.length} links)`, field: 'content', value: internalLinks.length, points: 7 });
        totalScore += 7;
      } else if (internalLinks.length > 0) {
        passed.push({ type: 'success', message: `Content has ${internalLinks.length} internal link(s)`, field: 'content', value: internalLinks.length, points: 4 });
        totalScore += 4;
      } else {
        warnings.push({ type: 'warning', message: 'Too many internal links may hurt user experience', field: 'content', priority: 'low', points: -2 });
        totalScore += 3;
      }
    }

    // 12. READABILITY ANALYSIS (5 points)
    const sentences = contentText.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgWordsPerSentence = sentences.length > 0 ? wordCount / sentences.length : 0;
    
    if (avgWordsPerSentence > 20) {
      warnings.push({ type: 'warning', message: 'Average sentence length is high. Consider shorter sentences for better readability.', field: 'content', current: Math.round(avgWordsPerSentence), recommended: '<20', priority: 'low', points: -2 });
      totalScore += 2;
    } else if (avgWordsPerSentence > 0 && avgWordsPerSentence <= 20) {
      passed.push({ type: 'success', message: `Readability is good (avg ${Math.round(avgWordsPerSentence)} words per sentence)`, field: 'content', value: Math.round(avgWordsPerSentence), points: 5 });
      totalScore += 5;
    }

    // FOCUS KEYWORD ANALYSIS (if set) - 25 points total
    let focusKeywordScore = 0;
    let maxFocusKeywordScore = 25;
    
    if (hasFocusKeyword) {
      // 1. Focus Keyword in Title (5 points)
      const normalizedTitle = normalizeText(title);
      if (normalizedTitle.includes(normalizedFocusKeyword)) {
        focusKeywordChecks.push({ 
          check: 'Focus keyword in title', 
          status: 'success', 
          score: 5,
          message: 'Focus keyword found in title',
          field: 'title'
        });
        focusKeywordScore += 5;
        passed.push({ type: 'success', message: 'Focus keyword found in title', field: 'title' });
      } else {
        focusKeywordChecks.push({ 
          check: 'Focus keyword in title', 
          status: 'error', 
          score: 0,
          message: 'Focus keyword not found in title',
          field: 'title',
          priority: 'high'
        });
        issues.push({ type: 'error', message: `Focus keyword "${focusKeyword}" not found in title`, field: 'title', priority: 'high' });
      }

      // 2. Focus Keyword in Meta Title (4 points)
      const normalizedMetaTitle = normalizeText(metaTitle);
      if (normalizedMetaTitle.includes(normalizedFocusKeyword)) {
        focusKeywordChecks.push({ 
          check: 'Focus keyword in meta title', 
          status: 'success', 
          score: 4,
          message: 'Focus keyword found in meta title',
          field: 'metaTitle'
        });
        focusKeywordScore += 4;
        passed.push({ type: 'success', message: 'Focus keyword found in meta title', field: 'metaTitle' });
      } else {
        focusKeywordChecks.push({ 
          check: 'Focus keyword in meta title', 
          status: 'warning', 
          score: 0,
          message: 'Focus keyword not found in meta title',
          field: 'metaTitle',
          priority: 'medium'
        });
        warnings.push({ type: 'warning', message: `Focus keyword "${focusKeyword}" not found in meta title`, field: 'metaTitle', priority: 'medium' });
      }

      // 3. Focus Keyword in H1 (5 points)
      const h1Headings = headings.filter(h => h.level === 1);
      const h1WithKeyword = h1Headings.some(h => normalizeText(h.text).includes(normalizedFocusKeyword));
      if (h1WithKeyword) {
        focusKeywordChecks.push({ 
          check: 'Focus keyword in H1', 
          status: 'success', 
          score: 5,
          message: 'Focus keyword found in H1 heading',
          field: 'content'
        });
        focusKeywordScore += 5;
        passed.push({ type: 'success', message: 'Focus keyword found in H1 heading', field: 'content' });
      } else if (h1Headings.length > 0) {
        focusKeywordChecks.push({ 
          check: 'Focus keyword in H1', 
          status: 'warning', 
          score: 0,
          message: 'Focus keyword not found in H1 heading',
          field: 'content',
          priority: 'high'
        });
        warnings.push({ type: 'warning', message: `Focus keyword "${focusKeyword}" not found in H1 heading`, field: 'content', priority: 'high' });
      }

      // 4. Focus Keyword in First Paragraph (3 points)
      const firstParagraph = contentText.split(/\n\n|\. /)[0] || contentText.substring(0, 200);
      const normalizedFirstParagraph = normalizeText(firstParagraph);
      if (normalizedFirstParagraph.includes(normalizedFocusKeyword)) {
        focusKeywordChecks.push({ 
          check: 'Focus keyword in first paragraph', 
          status: 'success', 
          score: 3,
          message: 'Focus keyword found in first paragraph',
          field: 'content'
        });
        focusKeywordScore += 3;
        passed.push({ type: 'success', message: 'Focus keyword found in first paragraph', field: 'content' });
      } else {
        focusKeywordChecks.push({ 
          check: 'Focus keyword in first paragraph', 
          status: 'warning', 
          score: 0,
          message: 'Focus keyword not found in first paragraph',
          field: 'content',
          priority: 'medium'
        });
        warnings.push({ type: 'warning', message: `Focus keyword "${focusKeyword}" not found in first paragraph`, field: 'content', priority: 'medium' });
      }

      // 5. Focus Keyword in Meta Description (4 points)
      const normalizedMetaDesc = normalizeText(metaDescription);
      if (normalizedMetaDesc.includes(normalizedFocusKeyword)) {
        focusKeywordChecks.push({ 
          check: 'Focus keyword in meta description', 
          status: 'success', 
          score: 4,
          message: 'Focus keyword found in meta description',
          field: 'metaDescription'
        });
        focusKeywordScore += 4;
        passed.push({ type: 'success', message: 'Focus keyword found in meta description', field: 'metaDescription' });
      } else {
        focusKeywordChecks.push({ 
          check: 'Focus keyword in meta description', 
          status: 'warning', 
          score: 0,
          message: 'Focus keyword not found in meta description',
          field: 'metaDescription',
          priority: 'medium'
        });
        warnings.push({ type: 'warning', message: `Focus keyword "${focusKeyword}" not found in meta description`, field: 'metaDescription', priority: 'medium' });
      }

      // 6. Focus Keyword Density (4 points)
      const phraseMatches = (normalizedContent.match(new RegExp(normalizedFocusKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')) || []).length;
      const density = wordCount > 0 ? (phraseMatches / wordCount) * 100 : 0;
      if (density >= 0.5 && density <= 2.5) {
        focusKeywordChecks.push({ 
          check: 'Focus keyword density', 
          status: 'success', 
          score: 4,
          message: `Focus keyword density is optimal (${density.toFixed(2)}%)`,
          field: 'content',
          value: density.toFixed(2) + '%'
        });
        focusKeywordScore += 4;
        passed.push({ type: 'success', message: `Focus keyword density is optimal (${density.toFixed(2)}%)`, field: 'content' });
      } else if (density < 0.5) {
        focusKeywordChecks.push({ 
          check: 'Focus keyword density', 
          status: 'warning', 
          score: 0,
          message: `Focus keyword density is too low (${density.toFixed(2)}%, recommended: 0.5-2.5%)`,
          field: 'content',
          priority: 'medium',
          value: density.toFixed(2) + '%'
        });
        warnings.push({ type: 'warning', message: `Focus keyword density is too low (${density.toFixed(2)}%, recommended: 0.5-2.5%)`, field: 'content', priority: 'medium' });
      } else {
        focusKeywordChecks.push({ 
          check: 'Focus keyword density', 
          status: 'warning', 
          score: 0,
          message: `Focus keyword density is too high (${density.toFixed(2)}%, recommended: 0.5-2.5%)`,
          field: 'content',
          priority: 'medium',
          value: density.toFixed(2) + '%'
        });
        warnings.push({ type: 'warning', message: `Focus keyword density is too high (${density.toFixed(2)}%, recommended: 0.5-2.5%)`, field: 'content', priority: 'medium' });
      }
    } else {
      warnings.push({ type: 'warning', message: 'No focus keyword set. Set a focus keyword for better SEO analysis.', field: 'focusKeyword', priority: 'medium' });
    }

    // Calculate final score
    // Base score (75 points max) + Focus keyword score (25 points max) = 100 points
    let baseScore = Math.max(0, Math.min(75, totalScore));
    
    // Add focus keyword score if available
    if (hasFocusKeyword) {
      baseScore = Math.max(0, Math.min(75, baseScore)); // Cap base at 75
      const focusKeywordPercentage = (focusKeywordScore / maxFocusKeywordScore) * 25;
      baseScore += focusKeywordPercentage;
    }
    
    const finalScore = Math.round(Math.max(0, Math.min(100, baseScore)));

    // Get score color and label
    const getScoreColor = (score) => {
      if (score >= 80) return { color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900', label: 'Excellent' };
      if (score >= 60) return { color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900', label: 'Good' };
      if (score >= 40) return { color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900', label: 'Fair' };
      return { color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900', label: 'Needs Improvement' };
    };

    const scoreInfo = getScoreColor(finalScore);

    // Enhanced Internal Linking Analysis
    const internalLinkAnalysis = {
      total: internalLinks.length,
      withAnchorText: internalLinks.filter(link => link.text && link.text.trim().length > 0).length,
      withoutAnchorText: internalLinks.filter(link => !link.text || link.text.trim().length === 0).length,
      emptyLinks: internalLinks.filter(link => !link.url || link.url.trim().length === 0).length,
      relativeLinks: internalLinks.filter(link => link.url.startsWith('/')).length,
      absoluteLinks: internalLinks.filter(link => link.url.startsWith('http')).length,
      links: internalLinks
    };

    // Internal Linking Checks
    if (wordCount > 500) {
      if (internalLinkAnalysis.total === 0) {
        warnings.push({ 
          type: 'warning', 
          message: 'No internal links found. Internal links help with SEO and user navigation.', 
          field: 'content', 
          priority: 'medium' 
        });
      } else if (internalLinkAnalysis.total < 3) {
        suggestions.push({ 
          type: 'info', 
          message: `Only ${internalLinkAnalysis.total} internal link(s) found. Consider adding more internal links (recommended: 3-5 for articles over 500 words)`, 
          field: 'content', 
          current: internalLinkAnalysis.total,
          recommended: '3-5',
          priority: 'low' 
        });
      } else if (internalLinkAnalysis.total >= 3 && internalLinkAnalysis.total <= 10) {
        // Already counted in scoring above
      } else {
        warnings.push({ 
          type: 'warning', 
          message: `Too many internal links (${internalLinkAnalysis.total}). Consider reducing to 3-10 for better user experience.`, 
          field: 'content', 
          current: internalLinkAnalysis.total,
          recommended: '3-10',
          priority: 'low' 
        });
      }

      // Check for links without anchor text
      if (internalLinkAnalysis.withoutAnchorText > 0) {
        warnings.push({ 
          type: 'warning', 
          message: `${internalLinkAnalysis.withoutAnchorText} internal link(s) missing descriptive anchor text. Use descriptive text instead of "click here" or generic phrases.`, 
          field: 'content', 
          priority: 'medium' 
        });
      }

      // Check for empty or broken links
      if (internalLinkAnalysis.emptyLinks > 0) {
        issues.push({ 
          type: 'error', 
          message: `${internalLinkAnalysis.emptyLinks} internal link(s) appear to be empty or broken.`, 
          field: 'content', 
          priority: 'high' 
        });
      }

      // Check anchor text quality
      const genericAnchorTexts = ['click here', 'read more', 'here', 'link', 'this', 'more'];
      const genericLinks = internalLinks.filter(link => {
        const anchorText = normalizeText(link.text || '');
        return genericAnchorTexts.some(generic => anchorText.includes(generic));
      });
      
      if (genericLinks.length > 0) {
        suggestions.push({ 
          type: 'info', 
          message: `${genericLinks.length} internal link(s) use generic anchor text. Use descriptive, keyword-rich anchor text for better SEO.`, 
          field: 'content', 
          priority: 'low' 
        });
      }
    }

    // Open Graph Analysis
    if (!blogData.seo?.ogTitle) {
      suggestions.push({ type: 'info', message: 'Open Graph title is missing', field: 'ogTitle', priority: 'low' });
    } else {
      passed.push({ type: 'success', message: 'Open Graph title is set', field: 'ogTitle' });
    }

    if (!blogData.seo?.ogDescription) {
      suggestions.push({ type: 'info', message: 'Open Graph description is missing', field: 'ogDescription', priority: 'low' });
    } else {
      passed.push({ type: 'success', message: 'Open Graph description is set', field: 'ogDescription' });
    }

    // Twitter Card Analysis
    if (!blogData.seo?.twitterTitle) {
      suggestions.push({ type: 'info', message: 'Twitter card title is missing', field: 'twitterTitle', priority: 'low' });
    } else {
      passed.push({ type: 'success', message: 'Twitter card title is set', field: 'twitterTitle' });
    }

    if (!blogData.seo?.twitterDescription) {
      suggestions.push({ type: 'info', message: 'Twitter card description is missing', field: 'twitterDescription', priority: 'low' });
    } else {
      passed.push({ type: 'success', message: 'Twitter card description is set', field: 'twitterDescription' });
    }

    return {
      score: finalScore,
      scoreInfo,
      focusKeyword,
      focusKeywordChecks,
      focusKeywordScore,
      maxFocusKeywordScore,
      issues,
      warnings,
      suggestions,
      passed,
      internalLinkAnalysis,
      stats: {
        wordCount,
        charCount,
        imagesCount: images.length + (blogData.featuredImage?.url ? 1 : 0),
        linksCount: links.length,
        internalLinksCount: internalLinks.length,
        externalLinksCount: links.length - internalLinks.length,
        headingsCount: headings.length,
        h1Count: headings.filter(h => h.level === 1).length,
        h2Count: headings.filter(h => h.level === 2).length,
        sentencesCount: sentences.length,
        avgWordsPerSentence: Math.round(avgWordsPerSentence * 10) / 10,
        avgCharsPerWord: Math.round((charCount / wordCount) * 10) / 10
      }
    };
  }, [blogData]);

  if (!analyzeSEO) {
    return (
      <div className="p-8 text-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
        <FaSearch className="mx-auto text-5xl text-primary-500 mb-4 opacity-50" />
        <p className="text-gray-600 dark:text-gray-400 font-medium">Start filling in the blog form to see SEO analysis</p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">The analyzer will check keywords, content quality, and SEO best practices</p>
      </div>
    );
  }

  const { score, scoreInfo, focusKeyword, focusKeywordChecks, focusKeywordScore, maxFocusKeywordScore, issues, warnings, suggestions, passed, internalLinkAnalysis, stats } = analyzeSEO;

  return (
    <div className="space-y-6">
      {/* SEO Score Card */}
      <div className={`p-6 rounded-xl border-2 ${scoreInfo.bg} ${scoreInfo.color.replace('text-', 'border-')} shadow-lg`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-full ${scoreInfo.bg}`}>
              {score >= 80 ? (
                <FaTrophy className="text-3xl text-yellow-500" />
              ) : score >= 60 ? (
                <FaStar className="text-3xl text-blue-500" />
              ) : (
                <FaChartBar className="text-3xl text-gray-500" />
              )}
            </div>
            <div>
              <h3 className="text-2xl font-bold">SEO Score</h3>
              <p className="text-sm opacity-75">{scoreInfo.label}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-5xl font-bold">{score}</div>
            <div className="text-sm opacity-75">/ 100</div>
          </div>
        </div>
        
        {focusKeyword && (
          <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium mb-1">Focus Keyword: <span className="font-bold">{focusKeyword}</span></p>
                {maxFocusKeywordScore > 0 && (
                  <p className="text-xs opacity-75">
                    Focus Keyword Score: {Math.round((focusKeywordScore / maxFocusKeywordScore) * 100)}% ({focusKeywordScore}/{maxFocusKeywordScore} points)
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Focus Keyword Analysis */}
      {focusKeyword && focusKeywordChecks.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <FaSearch className="mr-2 text-primary-500" />
            Focus Keyword Analysis
          </h3>
          <div className="space-y-3">
            {focusKeywordChecks.map((check, index) => (
              <div key={index} className={`p-4 rounded-lg border ${
                check.status === 'success' ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' :
                check.status === 'error' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' :
                check.status === 'warning' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' :
                'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {check.status === 'success' ? (
                      <FaCheckCircle className="text-green-600 dark:text-green-400 text-xl" />
                    ) : check.status === 'error' ? (
                      <FaTimesCircle className="text-red-600 dark:text-red-400 text-xl" />
                    ) : check.status === 'warning' ? (
                      <FaExclamationTriangle className="text-yellow-600 dark:text-yellow-400 text-xl" />
                    ) : (
                      <FaInfoCircle className="text-blue-600 dark:text-blue-400 text-xl" />
                    )}
                    <div>
                      <p className="font-medium">{check.check}</p>
                      <p className="text-sm opacity-75">{check.message}</p>
                      {check.value && (
                        <p className="text-xs mt-1 opacity-60">Value: {check.value}</p>
                      )}
                    </div>
                  </div>
                  {check.score > 0 && check.status === 'success' && (
                    <div className="text-right">
                      <span className="text-sm font-bold text-green-600 dark:text-green-400">+{check.score} pts</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2 mb-2">
            <FaFileAlt className="text-primary-500" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Words</span>
          </div>
          <p className="text-2xl font-bold">{stats.wordCount}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2 mb-2">
            <FaHeading className="text-primary-500" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Headings</span>
          </div>
          <p className="text-2xl font-bold">{stats.headingsCount}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2 mb-2">
            <FaImage className="text-primary-500" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Images</span>
          </div>
          <p className="text-2xl font-bold">{stats.imagesCount}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2 mb-2">
            <FaLink className="text-primary-500" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Links</span>
          </div>
          <p className="text-2xl font-bold">{stats.linksCount}</p>
        </div>
      </div>

      {/* Issues */}
      {issues.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6 border border-red-200 dark:border-red-800">
          <h3 className="text-xl font-bold mb-4 flex items-center text-red-600 dark:text-red-400">
            <FaTimesCircle className="mr-2" />
            Critical Issues ({issues.length})
          </h3>
          <div className="space-y-2">
            {issues.map((issue, index) => (
              <div key={index} className="p-3 bg-white dark:bg-gray-800 rounded border border-red-200 dark:border-red-800">
                <p className="font-medium">{issue.message}</p>
                {issue.field && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Field: {issue.field}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6 border border-yellow-200 dark:border-yellow-800">
          <h3 className="text-xl font-bold mb-4 flex items-center text-yellow-600 dark:text-yellow-400">
            <FaExclamationTriangle className="mr-2" />
            Warnings ({warnings.length})
          </h3>
          <div className="space-y-2">
            {warnings.map((warning, index) => (
              <div key={index} className="p-3 bg-white dark:bg-gray-800 rounded border border-yellow-200 dark:border-yellow-800">
                <p className="font-medium">{warning.message}</p>
                {warning.field && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Field: {warning.field}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
          <h3 className="text-xl font-bold mb-4 flex items-center text-blue-600 dark:text-blue-400">
            <FaInfoCircle className="mr-2" />
            Suggestions ({suggestions.length})
          </h3>
          <div className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="p-3 bg-white dark:bg-gray-800 rounded border border-blue-200 dark:border-blue-800">
                <p className="font-medium">{suggestion.message}</p>
                {suggestion.field && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Field: {suggestion.field}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Internal Linking Analysis */}
      {internalLinkAnalysis && internalLinkAnalysis.total > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <FaLink className="mr-2 text-primary-500" />
            Internal Linking Analysis
          </h3>
          
          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Links</div>
              <div className="text-2xl font-bold">{internalLinkAnalysis.total}</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">With Anchor Text</div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{internalLinkAnalysis.withAnchorText}</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Without Anchor</div>
              <div className={`text-2xl font-bold ${internalLinkAnalysis.withoutAnchorText > 0 ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-400'}`}>
                {internalLinkAnalysis.withoutAnchorText}
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Relative Links</div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{internalLinkAnalysis.relativeLinks}</div>
            </div>
          </div>

          {/* Link Details */}
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Internal Links Found:</h4>
            {internalLinkAnalysis.links.slice(0, 10).map((link, index) => (
              <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-sm text-gray-900 dark:text-white mb-1">
                      {link.text && link.text.trim() ? (
                        <span className="text-primary-600 dark:text-primary-400">"{link.text}"</span>
                      ) : (
                        <span className="text-yellow-600 dark:text-yellow-400 italic">No anchor text</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 break-all">
                      {link.url}
                    </div>
                  </div>
                  <div className="ml-2">
                    {link.text && link.text.trim() ? (
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded">
                        ✓
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs rounded">
                        ⚠
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {internalLinkAnalysis.links.length > 10 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                ... and {internalLinkAnalysis.links.length - 10} more link(s)
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SEOAnalyzer;
