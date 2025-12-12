const express = require('express');
const router = express.Router();
const CaseStudy = require('../models/CaseStudy');
const { auth, adminAuth } = require('../middleware/auth');
const dbCheck = require('../middleware/dbCheck');
const multer = require('multer');
const ImageKitService = require('../services/imageKitService');

// Configure multer for image uploads
const imageKitUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

// Public Routes

// Get all published case studies with pagination and filtering
router.get('/', dbCheck, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      search,
      industry,
      service,
      featured,
      sortBy = 'publishedAt',
      sortOrder = 'desc'
    } = req.query;

    const query = { status: 'published' };
    
    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { summary: { $regex: search, $options: 'i' } },
        { 'client.name': { $regex: search, $options: 'i' } },
        { 'client.industry': { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Filter by industry
    if (industry) {
      query['client.industry'] = industry;
    }

    // Filter by service
    if (service) {
      query.services = service;
    }

    // Filter by featured
    if (featured === 'true') {
      query.featured = true;
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (page - 1) * limit;
    
    const caseStudies = await CaseStudy.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .exec();

    const total = await CaseStudy.countDocuments(query);

    res.json({
      success: true,
      data: {
        caseStudies,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalCaseStudies: total,
          hasNextPage: page * limit < total,
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching case studies:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch case studies'
    });
  }
});

// Get featured case studies
router.get('/featured', dbCheck, async (req, res) => {
  try {
    const { limit = 6 } = req.query;
    const caseStudies = await CaseStudy.getFeatured(parseInt(limit));
    
    res.json({
      success: true,
      data: caseStudies
    });
  } catch (error) {
    console.error('Error fetching featured case studies:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured case studies'
    });
  }
});

// Get case study by slug
router.get('/:slug', dbCheck, async (req, res) => {
  try {
    const { slug } = req.params;
    const caseStudy = await CaseStudy.findOne({ 
      slug, 
      status: 'published' 
    });

    if (!caseStudy) {
      return res.status(404).json({
        success: false,
        message: 'Case study not found'
      });
    }

    // Get related case studies
    const relatedCaseStudies = await CaseStudy.find({
      _id: { $ne: caseStudy._id },
      status: 'published',
      $or: [
        { 'client.industry': caseStudy.client.industry },
        { services: { $in: caseStudy.services } }
      ]
    })
    .limit(3)
    .sort({ publishedAt: -1 });

    res.json({
      success: true,
      data: {
        caseStudy,
        relatedCaseStudies
      }
    });
  } catch (error) {
    console.error('Error fetching case study:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch case study'
    });
  }
});

// Get industries for filtering
router.get('/industries/list', dbCheck, async (req, res) => {
  try {
    const industries = await CaseStudy.distinct('client.industry', { status: 'published' });
    res.json({
      success: true,
      data: industries.sort()
    });
  } catch (error) {
    console.error('Error fetching industries:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch industries'
    });
  }
});

// Get services for filtering
router.get('/services/list', dbCheck, async (req, res) => {
  try {
    const services = await CaseStudy.distinct('services', { status: 'published' });
    res.json({
      success: true,
      data: services.sort()
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch services'
    });
  }
});

// Admin Routes

// Get all case studies (admin)
router.get('/admin/all', adminAuth, dbCheck, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query = {};
    
    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { 'client.name': { $regex: search, $options: 'i' } },
        { 'client.industry': { $regex: search, $options: 'i' } }
      ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (page - 1) * limit;
    
    const caseStudies = await CaseStudy.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .exec();

    const total = await CaseStudy.countDocuments(query);

    res.json({
      success: true,
      data: {
        caseStudies,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalCaseStudies: total
        }
      }
    });
  } catch (error) {
    console.error('Error fetching case studies (admin):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch case studies'
    });
  }
});

// Get case study stats (admin)
router.get('/admin/stats', adminAuth, dbCheck, async (req, res) => {
  try {
    const total = await CaseStudy.countDocuments();
    const published = await CaseStudy.countDocuments({ status: 'published' });
    const draft = await CaseStudy.countDocuments({ status: 'draft' });
    const archived = await CaseStudy.countDocuments({ status: 'archived' });
    const featured = await CaseStudy.countDocuments({ featured: true });

    const industries = await CaseStudy.aggregate([
      { $group: { _id: '$client.industry', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    const services = await CaseStudy.aggregate([
      { $unwind: '$services' },
      { $group: { _id: '$services', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      data: {
        total,
        published,
        draft,
        archived,
        featured,
        industries,
        services
      }
    });
  } catch (error) {
    console.error('Error fetching case study stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch case study stats'
    });
  }
});

// Create new case study (admin)
router.post('/admin', adminAuth, dbCheck, async (req, res) => {
  try {
    const caseStudyData = {
      ...req.body,
      author: req.user._id
    };

    // Handle budget field - if empty string, set to undefined
    if (caseStudyData.budget === '' || caseStudyData.budget === null) {
      caseStudyData.budget = undefined;
    }

    const caseStudy = new CaseStudy(caseStudyData);
    await caseStudy.save();

    res.status(201).json({
      success: true,
      message: 'Case study created successfully',
      data: caseStudy
    });
  } catch (error) {
    console.error('Error creating case study:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => ({
          field: err.path,
          message: err.message
        }))
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to create case study'
    });
  }
});

// Update case study (admin)
router.put('/admin/:id', adminAuth, dbCheck, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Handle budget field - if empty string, set to undefined
    const updateData = { ...req.body };
    if (updateData.budget === '' || updateData.budget === null) {
      updateData.budget = undefined;
    }
    
    const caseStudy = await CaseStudy.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!caseStudy) {
      return res.status(404).json({
        success: false,
        message: 'Case study not found'
      });
    }

    res.json({
      success: true,
      message: 'Case study updated successfully',
      data: caseStudy
    });
  } catch (error) {
    console.error('Error updating case study:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => ({
          field: err.path,
          message: err.message
        }))
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to update case study'
    });
  }
});

// Delete case study (admin)
router.delete('/admin/:id', adminAuth, dbCheck, async (req, res) => {
  try {
    const { id } = req.params;
    const caseStudy = await CaseStudy.findByIdAndDelete(id);

    if (!caseStudy) {
      return res.status(404).json({
        success: false,
        message: 'Case study not found'
      });
    }

    // Delete images from ImageKit if they exist
    if (caseStudy.images && caseStudy.images.length > 0) {
      for (const image of caseStudy.images) {
        if (image.imageKitId) {
          try {
            await ImageKitService.deleteFile(image.imageKitId);
          } catch (deleteError) {
            console.error('Error deleting image from ImageKit:', deleteError);
          }
        }
      }
    }

    res.json({
      success: true,
      message: 'Case study deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting case study:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete case study'
    });
  }
});

// Upload images for case study (admin)
router.post('/admin/upload-images', adminAuth, dbCheck, imageKitUpload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No images uploaded'
      });
    }

    const uploadedImages = [];

    for (const file of req.files) {
      try {
        const uploadResult = await ImageKitService.uploadFile(
          file.buffer,
          file.originalname,
          'case-studies'
        );

        uploadedImages.push({
          url: uploadResult.url,
          imageKitId: uploadResult.fileId,
          caption: req.body.caption || '',
          isPrimary: false
        });
      } catch (uploadError) {
        console.error('Error uploading image:', uploadError);
        return res.status(500).json({
          success: false,
          message: 'Failed to upload image'
        });
      }
    }

    res.json({
      success: true,
      message: 'Images uploaded successfully',
      data: uploadedImages
    });
  } catch (error) {
    console.error('Error uploading images:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload images'
    });
  }
});

// Get single case study for editing (admin)
router.get('/admin/:id', adminAuth, dbCheck, async (req, res) => {
  try {
    const { id } = req.params;
    const caseStudy = await CaseStudy.findById(id);

    if (!caseStudy) {
      return res.status(404).json({
        success: false,
        message: 'Case study not found'
      });
    }

    res.json({
      success: true,
      data: caseStudy
    });
  } catch (error) {
    console.error('Error fetching case study (admin):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch case study'
    });
  }
});

module.exports = router;
