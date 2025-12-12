/**
 * Server-side data fetching utilities
 * These functions fetch data directly from the database/models
 * instead of making HTTP requests
 */

const Blog = require('../models/Blog');
const CaseStudy = require('../models/CaseStudy');
const Product = require('../models/Product');
const Course = require('../models/Course');
const Event = require('../models/Event');
const Job = require('../models/Job');

/**
 * Fetch blog post by slug
 */
async function fetchBlogPost(slug) {
  try {
    // Try both status formats: 'published' and isPublished: true
    const post = await Blog.findOne({ 
      slug, 
      $or: [
        { status: 'published' },
        { isPublished: true }
      ]
    })
      .populate('author', 'name email')
      .lean();
    
    if (!post) {
      console.log('[fetchBlogPost] No post found for slug:', slug);
      return null;
    }
    
    // Log post data for debugging
    console.log('[fetchBlogPost] Post found:', {
      title: post.title,
      excerpt: post.excerpt ? post.excerpt.substring(0, 50) + '...' : 'NO EXCERPT',
      hasFeaturedImage: !!post.featuredImage?.url,
      featuredImageUrl: post.featuredImage?.url || 'NO IMAGE',
      hasSEO: !!post.seo,
      seoMetaTitle: post.seo?.metaTitle || 'NO SEO TITLE',
      seoMetaDescription: post.seo?.metaDescription ? post.seo.metaDescription.substring(0, 50) + '...' : 'NO SEO DESC',
      author: post.author?.name || 'NO AUTHOR'
    });

    // Fetch related posts
    const relatedPosts = await Blog.find({
      _id: { $ne: post._id },
      status: 'published',
      $or: [
        { category: post.category },
        { tags: { $in: post.tags || [] } }
      ]
    })
      .limit(3)
      .select('title slug excerpt featuredImage publishedAt')
      .sort({ publishedAt: -1 })
      .lean();

    return {
      post,
      relatedPosts
    };
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

/**
 * Fetch case study by slug
 */
async function fetchCaseStudy(slug) {
  try {
    const caseStudy = await CaseStudy.findOne({ slug, status: 'published' }).lean();
    
    if (!caseStudy) {
      return null;
    }

    // Fetch related case studies
    const relatedCaseStudies = await CaseStudy.find({
      _id: { $ne: caseStudy._id },
      status: 'published',
      $or: [
        { industry: caseStudy.industry },
        { services: { $in: caseStudy.services || [] } }
      ]
    })
      .limit(3)
      .select('title slug excerpt featuredImage industry services')
      .sort({ createdAt: -1 })
      .lean();

    return {
      caseStudy,
      relatedCaseStudies
    };
  } catch (error) {
    console.error('Error fetching case study:', error);
    return null;
  }
}

/**
 * Fetch product by slug
 */
async function fetchProduct(slug) {
  try {
    const product = await Product.findOne({ slug, isActive: true }).lean();
    
    if (!product) {
      return null;
    }

    // Fetch related products
    const relatedProducts = await Product.find({
      _id: { $ne: product._id },
      isActive: true,
      category: product.category
    })
      .limit(4)
      .select('name slug currentPrice originalPrice images category stock')
      .sort({ createdAt: -1 })
      .lean();

    return {
      product,
      relatedProducts
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

/**
 * Fetch course by slug
 */
async function fetchCourse(slug) {
  try {
    const course = await Course.findOne({ slug, isActive: true })
      .populate('trainer', 'name bio image')
      .lean();
    
    if (!course) {
      return null;
    }

    // Fetch related courses
    const relatedCourses = await Course.find({
      _id: { $ne: course._id },
      isActive: true,
      category: course.category
    })
      .limit(3)
      .select('title slug description price image category')
      .sort({ createdAt: -1 })
      .lean();

    return {
      course,
      relatedCourses
    };
  } catch (error) {
    console.error('Error fetching course:', error);
    return null;
  }
}

/**
 * Fetch event by slug
 */
async function fetchEvent(slug) {
  try {
    const event = await Event.findOne({ slug, status: 'published' }).lean();
    
    if (!event) {
      return null;
    }

    return { event };
  } catch (error) {
    console.error('Error fetching event:', error);
    return null;
  }
}

/**
 * Fetch job by slug
 */
async function fetchJob(slug) {
  try {
    const job = await Job.findOne({ slug, status: 'active' }).lean();
    
    if (!job) {
      return null;
    }

    // Fetch related jobs
    const relatedJobs = await Job.find({
      _id: { $ne: job._id },
      status: 'active',
      category: job.category
    })
      .limit(3)
      .select('title slug location type category')
      .sort({ createdAt: -1 })
      .lean();

    return {
      job,
      relatedJobs
    };
  } catch (error) {
    console.error('Error fetching job:', error);
    return null;
  }
}

/**
 * Fetch blogs list
 */
async function fetchBlogsList(params = {}) {
  try {
    const {
      page = 1,
      limit = 6,
      category,
      search
    } = params;

    const query = { status: 'published' };
    
    if (category && category !== 'All') {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    
    const [blogs, total] = await Promise.all([
      Blog.find(query)
        .select('title slug excerpt featuredImage publishedAt category tags author')
        .populate('author', 'name')
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Blog.countDocuments(query)
    ]);

    return {
      blogs,
      totalPages: Math.ceil(total / limit),
      total
    };
  } catch (error) {
    console.error('Error fetching blogs list:', error);
    return { blogs: [], totalPages: 1, total: 0 };
  }
}

/**
 * Fetch case studies list
 */
async function fetchCaseStudiesList(params = {}) {
  try {
    const {
      page = 1,
      limit = 12,
      industry,
      service,
      search
    } = params;

    const query = { status: 'published' };
    
    if (industry && industry !== 'All') {
      query.industry = industry;
    }
    
    if (service && service !== 'All') {
      query.services = service;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    
    const [caseStudies, total] = await Promise.all([
      CaseStudy.find(query)
        .select('title slug excerpt featuredImage industry services createdAt')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      CaseStudy.countDocuments(query)
    ]);

    return {
      caseStudies,
      totalPages: Math.ceil(total / limit),
      total
    };
  } catch (error) {
    console.error('Error fetching case studies list:', error);
    return { caseStudies: [], totalPages: 1, total: 0 };
  }
}

/**
 * Fetch products list
 */
async function fetchProductsList(params = {}) {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      search,
      minPrice,
      maxPrice,
      inStock
    } = params;

    const query = { isActive: true };
    
    if (category && category !== 'All') {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (minPrice) {
      query.currentPrice = { ...query.currentPrice, $gte: parseFloat(minPrice) };
    }
    
    if (maxPrice) {
      query.currentPrice = { ...query.currentPrice, $lte: parseFloat(maxPrice) };
    }
    
    if (inStock === 'true') {
      query.stock = { $gt: 0 };
    }

    const skip = (page - 1) * limit;
    
    const [products, total] = await Promise.all([
      Product.find(query)
        .select('name slug currentPrice originalPrice images category stock')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(query)
    ]);

    return {
      products,
      totalPages: Math.ceil(total / limit),
      total
    };
  } catch (error) {
    console.error('Error fetching products list:', error);
    return { products: [], totalPages: 1, total: 0 };
  }
}

module.exports = {
  fetchBlogPost,
  fetchCaseStudy,
  fetchProduct,
  fetchCourse,
  fetchEvent,
  fetchJob,
  fetchBlogsList,
  fetchCaseStudiesList,
  fetchProductsList
};


