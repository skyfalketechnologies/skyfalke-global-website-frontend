/**
 * SEO Score Calculator
 * Calculates SEO score using industry-standard algorithm (similar to Yoast/RankMath)
 * Base SEO: 75 points max, Focus Keyword: 25 points max = 100 points total
 */

export const calculateSEOScore = (blogData) => {
  if (!blogData) return 0;

  let totalScore = 0;
  const maxScore = 100;

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

  // BASE SEO SCORING (75 points max)
  
  // 1. TITLE ANALYSIS (15 points)
  const title = blogData.title || '';
  if (!title) {
    totalScore -= 15;
  } else {
    if (title.length < 30) {
      totalScore += 5; // Partial points
    } else if (title.length > 60) {
      totalScore += 5; // Partial points
    } else {
      totalScore += 15;
    }
  }

  // 2. META TITLE ANALYSIS (10 points)
  const metaTitle = blogData.seo?.metaTitle || title;
  if (!metaTitle || metaTitle === title) {
    if (!title) {
      totalScore -= 5;
    } else {
      totalScore += 5; // Partial credit if using title
    }
  } else {
    if (metaTitle.length < 30 || metaTitle.length > 60) {
      totalScore += 5;
    } else {
      totalScore += 10;
    }
  }

  // 3. META DESCRIPTION ANALYSIS (10 points)
  const metaDescription = blogData.seo?.metaDescription || blogData.excerpt || '';
  if (!metaDescription) {
    totalScore -= 5;
  } else {
    if (metaDescription.length < 120 || metaDescription.length > 160) {
      totalScore += 5;
    } else {
      totalScore += 10;
    }
  }

  // 4. EXCERPT ANALYSIS (5 points)
  const excerpt = blogData.excerpt || '';
  if (!excerpt) {
    totalScore -= 5;
  } else {
    if (excerpt.length < 120 || excerpt.length > 160) {
      totalScore += 2;
    } else {
      totalScore += 5;
    }
  }

  // 5. CONTENT LENGTH ANALYSIS (10 points)
  if (wordCount < 300) {
    totalScore -= 10;
  } else if (wordCount < 1000) {
    totalScore += 5;
  } else {
    totalScore += 10;
  }

  // 6. HEADING STRUCTURE ANALYSIS (10 points)
  const h1Count = headings.filter(h => h.level === 1).length;
  const h2Count = headings.filter(h => h.level === 2).length;
  
  if (h1Count === 0) {
    totalScore -= 5;
  } else if (h1Count > 1) {
    totalScore += 3;
  } else {
    if (h2Count > 0) {
      totalScore += 10;
    } else if (wordCount > 500) {
      totalScore += 5;
    } else {
      totalScore += 7;
    }
  }

  // 7. FEATURED IMAGE ANALYSIS (8 points)
  if (!blogData.featuredImage?.url) {
    totalScore -= 4;
  } else {
    if (!blogData.featuredImage.alt || blogData.featuredImage.alt.trim() === '') {
      totalScore += 2; // Partial credit for having image
    } else {
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
      totalScore += 2; // Partial credit
    } else {
      totalScore += 5;
    }
  }

  // 9. CATEGORY ANALYSIS (5 points)
  if (!blogData.category) {
    totalScore -= 5;
  } else {
    totalScore += 5;
  }

  // 10. TAGS ANALYSIS (3 points)
  const tags = blogData.tags || [];
  if (tags.length === 0) {
    totalScore -= 1;
  } else if (tags.length < 3) {
    totalScore += 1;
  } else {
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
      totalScore += 0;
    } else if (internalLinks.length >= 3 && internalLinks.length <= 10) {
      totalScore += 7;
    } else if (internalLinks.length > 0) {
      totalScore += 4;
    } else {
      totalScore += 3;
    }
  }

  // 12. READABILITY ANALYSIS (5 points)
  const sentences = contentText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const avgWordsPerSentence = sentences.length > 0 ? wordCount / sentences.length : 0;
  
  if (avgWordsPerSentence > 20) {
    totalScore += 2;
  } else if (avgWordsPerSentence > 0 && avgWordsPerSentence <= 20) {
    totalScore += 5;
  }

  // Calculate base score (capped at 75)
  let baseScore = Math.max(0, Math.min(75, totalScore));

  // FOCUS KEYWORD SCORING (25 points max)
  let focusKeywordScore = 0;
  const maxFocusKeywordScore = 25;

  if (hasFocusKeyword) {
    // 1. Focus Keyword in Title (5 points)
    const normalizedTitle = normalizeText(title);
    if (normalizedTitle.includes(normalizedFocusKeyword)) {
      focusKeywordScore += 5;
    }

    // 2. Focus Keyword in Meta Title (4 points)
    const normalizedMetaTitle = normalizeText(metaTitle);
    if (normalizedMetaTitle.includes(normalizedFocusKeyword)) {
      focusKeywordScore += 4;
    }

    // 3. Focus Keyword in H1 (5 points)
    const h1Headings = headings.filter(h => h.level === 1);
    const h1WithKeyword = h1Headings.some(h => normalizeText(h.text).includes(normalizedFocusKeyword));
    if (h1WithKeyword) {
      focusKeywordScore += 5;
    }

    // 4. Focus Keyword in First Paragraph (3 points)
    const firstParagraph = contentText.split(/\n\n|\. /)[0] || contentText.substring(0, 200);
    const normalizedFirstParagraph = normalizeText(firstParagraph);
    if (normalizedFirstParagraph.includes(normalizedFocusKeyword)) {
      focusKeywordScore += 3;
    }

    // 5. Focus Keyword in Meta Description (4 points)
    const normalizedMetaDesc = normalizeText(metaDescription);
    if (normalizedMetaDesc.includes(normalizedFocusKeyword)) {
      focusKeywordScore += 4;
    }

    // 6. Focus Keyword Density (4 points)
    const phraseMatches = (normalizedContent.match(new RegExp(normalizedFocusKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')) || []).length;
    const density = wordCount > 0 ? (phraseMatches / wordCount) * 100 : 0;
    if (density >= 0.5 && density <= 2.5) {
      focusKeywordScore += 4;
    }
  }

  // Calculate final score
  // Base score (75 points max) + Focus keyword score (25 points max) = 100 points
  const finalScore = Math.max(0, Math.min(100, baseScore + focusKeywordScore));

  return Math.round(finalScore);
};
