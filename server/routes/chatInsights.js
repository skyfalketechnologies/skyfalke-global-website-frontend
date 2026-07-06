const express = require('express');
const rateLimit = require('express-rate-limit');
const axios = require('axios');
const mongoose = require('mongoose');
const Blog = require('../models/Blog');

const router = express.Router();

const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 24,
  message: { success: false, message: 'Too many messages. Please try again in a few minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

function stripHtml(html) {
  if (!html || typeof html !== 'string') return '';
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function sanitizeMessages(body) {
  const raw = body && Array.isArray(body.messages) ? body.messages : [];
  const out = [];
  for (const m of raw.slice(-14)) {
    if (!m || typeof m !== 'object') continue;
    const role = m.role === 'assistant' ? 'assistant' : m.role === 'user' ? 'user' : null;
    if (!role) continue;
    let content = typeof m.content === 'string' ? m.content.trim() : '';
    if (!content) continue;
    content = content.slice(0, 4000);
    out.push({ role, content });
  }
  return out;
}

function publicSiteOrigin() {
  const raw = process.env.PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || '';
  if (raw) {
    try {
      return new URL(raw.startsWith('http') ? raw : `https://${raw}`).origin;
    } catch {
      /* fall through */
    }
  }
  const cors = (process.env.CORS_ORIGIN || '').split(',')[0].trim();
  if (cors) return cors.replace(/\/$/, '');
  return 'https://skyfalke.com';
}

async function loadInsightsContext() {
  const blogs = await Blog.find({ status: 'published' })
    .sort({ publishedAt: -1 })
    .limit(16)
    .select('title slug excerpt category tags publishedAt')
    .lean();

  if (!blogs.length) {
    return 'No published Skyfalke Insights articles are available in the database yet. Answer from general Skyfalke positioning only, and invite the visitor to check back on /blog or to use /contact.';
  }

  return blogs
    .map((b, i) => {
      const excerpt = stripHtml(b.excerpt || '').slice(0, 220);
      const tags = Array.isArray(b.tags) ? b.tags.filter(Boolean).slice(0, 6).join(', ') : '';
      return [
        `[${i + 1}] ${b.title}`,
        `Category: ${b.category || 'General'}`,
        tags ? `Tags: ${tags}` : null,
        `URL path: /blog/${b.slug}`,
        `Excerpt: ${excerpt}`,
      ]
        .filter(Boolean)
        .join('\n');
    })
    .join('\n\n');
}

router.post('/insights', chatLimiter, async (req, res) => {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({
        success: false,
        code: 'CHAT_DISABLED',
        message: 'AI chat is not configured on the server. Set OPENAI_API_KEY.',
      });
    }

    const messages = sanitizeMessages(req.body);
    if (!messages.length) {
      return res.status(400).json({
        success: false,
        message: 'Send a non-empty messages array with user and assistant turns.',
      });
    }
    if (messages[messages.length - 1].role !== 'user') {
      return res.status(400).json({
        success: false,
        message: 'The last message must be from the user.',
      });
    }

    let insightsBlock = '';
    try {
      if (mongoose.connection.readyState === 1) {
        insightsBlock = await loadInsightsContext();
      } else {
        insightsBlock =
          'Database is offline; do not claim specific article titles. Give high-level Skyfalke guidance and point to /blog and /contact.';
      }
    } catch (e) {
      console.error('chatInsights: blog load error', e.message);
      insightsBlock =
        'Published insights could not be loaded. Answer briefly with general Skyfalke guidance and suggest /contact.';
    }

    const site = publicSiteOrigin();
    const contactUrl = `${site}/contact`;

    const systemPrompt = `You are the Skyfalke website assistant. Skyfalke is a digital growth and automation firm helping organizations with marketing, cloud, data, creative, and business tools—rooted in Africa and working globally.

Your answers must be grounded in the following "Skyfalke Insights" excerpts from our published blog whenever they are relevant. If the visitor asks something not covered there, say so briefly, avoid inventing article quotes, and you may add sensible general guidance aligned with Skyfalke's positioning.

Rules:
- Write in clear, professional plain text (no markdown, no bullet markdown syntax—use short paragraphs if needed).
- When an article fits, mention its topic naturally and include the path like /blog/your-slug (use only slugs from the list below).
- For pricing, legal, or bespoke commitments, direct people to ${contactUrl} (or say "our contact page") rather than inventing numbers.
- Keep responses concise (roughly under 180 words unless the user asks for depth).
- Never claim Skyfalke said something in an article unless it appears in an excerpt below.

--- Skyfalke Insights (blog excerpts) ---
${insightsBlock}`;

    const openaiMessages = [{ role: 'system', content: systemPrompt }, ...messages];

    const completion = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: process.env.OPENAI_CHAT_MODEL || 'gpt-4o-mini',
        messages: openaiMessages,
        temperature: 0.45,
        max_tokens: 700,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 55000,
      }
    );

    const reply = completion.data?.choices?.[0]?.message?.content?.trim();
    if (!reply) {
      return res.status(502).json({
        success: false,
        message: 'The model returned an empty response. Please try again.',
      });
    }

    return res.json({ success: true, reply });
  } catch (err) {
    const status = err.response?.status;
    const detail = err.response?.data?.error?.message || err.message;
    console.error('chatInsights error:', status || err.code, detail);

    if (status === 401 || status === 403) {
      return res.status(503).json({
        success: false,
        message: 'AI assistant is misconfigured. Please contact the site owner.',
      });
    }
    if (status === 429) {
      return res.status(429).json({
        success: false,
        message: 'The assistant is busy. Please wait a moment and try again.',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Something went wrong generating a reply. Please try again shortly.',
    });
  }
});

module.exports = router;
