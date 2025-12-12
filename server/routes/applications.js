const express = require('express');
const router = express.Router();
const JobApplication = require('../models/JobApplication');
const Job = require('../models/Job');
const { auth, adminAuth } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { sendNotificationToAllAdmins } = require('../socket');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/applications/';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { 
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 5 // Maximum 5 files
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx|jpg|jpeg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, DOCX, JPG, JPEG, and PNG files are allowed!'));
    }
  }
});

// @route   POST /api/applications
// @desc    Submit a job application
// @access  Public
router.post('/', upload.fields([
  { name: 'resume', maxCount: 1 },
  { name: 'additionalFiles', maxCount: 4 }
]), async (req, res) => {
  try {
    const {
      jobId,
      firstName,
      lastName,
      email,
      phone,
      city,
      country,
      linkedin,
      portfolio,
      github,
      yearsOfExperience,
      currentCompany,
      currentPosition,
      expectedSalary,
      noticePeriod,
      highestDegree,
      fieldOfStudy,
      institution,
      graduationYear,
      skills,
      coverLetter,
      source,
      isRemote,
      startDate,
      preferredStartDate,
      references,
      dataProcessing,
      contactForFuture
    } = req.body;

    // Validate required fields
    if (!jobId || !firstName || !lastName || !email || !phone || !coverLetter) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    // Validate education fields (required in model)
    if (!highestDegree || !fieldOfStudy || !institution || !graduationYear) {
      return res.status(400).json({ message: 'Please fill in all education fields (degree, field of study, institution, and graduation year)' });
    }

    // Check if job exists and is active
    const job = await Job.findById(jobId);
    if (!job || !job.isActive) {
      return res.status(404).json({ message: 'Job not found or not active' });
    }

    // Check if resume is uploaded
    if (!req.files || !req.files.resume || !req.files.resume[0]) {
      return res.status(400).json({ message: 'Resume is required' });
    }

    // Parse skills array
    let skillsArray = [];
    if (skills) {
      try {
        skillsArray = JSON.parse(skills);
      } catch (error) {
        skillsArray = skills.split(',').map(skill => ({
          name: skill.trim(),
          level: 'Intermediate'
        }));
      }
    }

    // Parse references array
    let referencesArray = [];
    if (references) {
      try {
        referencesArray = JSON.parse(references);
      } catch (error) {
        // Handle single reference or other formats
        referencesArray = [];
      }
    }

    // Create application object
    const applicationData = {
      jobId,
      applicant: {
        firstName,
        lastName,
        email,
        phone,
        location: { city, country },
        linkedin,
        portfolio,
        github
      },
      experience: {
        yearsOfExperience: parseInt(yearsOfExperience) || 0,
        currentCompany,
        currentPosition,
        expectedSalary: expectedSalary ? {
          amount: parseFloat(expectedSalary),
          currency: 'USD',
          period: 'yearly'
        } : null,
        noticePeriod
      },
      education: {
        highestDegree: highestDegree ? highestDegree.trim() : '',
        fieldOfStudy: fieldOfStudy ? fieldOfStudy.trim() : '',
        institution: institution ? institution.trim() : '',
        graduationYear: graduationYear ? parseInt(graduationYear) : new Date().getFullYear()
      },
      skills: skillsArray,
      coverLetter,
      resume: {
        filename: req.files.resume[0].filename,
        originalName: req.files.resume[0].originalname,
        path: req.files.resume[0].path,
        size: req.files.resume[0].size,
        mimeType: req.files.resume[0].mimetype
      },
      additionalFiles: req.files.additionalFiles ? req.files.additionalFiles.map(file => ({
        filename: file.filename,
        originalName: file.originalname,
        path: file.path,
        size: file.size,
        mimeType: file.mimetype
      })) : [],
      source,
      isRemote: isRemote === 'true',
      availability: {
        startDate: startDate ? new Date(startDate) : null,
        preferredStartDate: preferredStartDate ? new Date(preferredStartDate) : null
      },
      references: referencesArray,
      consent: {
        dataProcessing: dataProcessing === 'true',
        contactForFuture: contactForFuture === 'true'
      },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    };

    const application = new JobApplication(applicationData);
    await application.save();

    // Increment application count for the job
    job.applicationCount += 1;
    await job.save();

    // Send notification to all admins
    try {
      await sendNotificationToAllAdmins({
        title: 'New Job Application',
        message: `New application from ${firstName} ${lastName} for ${job.title} position`,
        type: 'application',
        category: 'application',
        priority: 'medium',
        data: {
          applicationId: application._id,
          jobId: job._id,
          jobTitle: job.title,
          applicantName: `${firstName} ${lastName}`,
          applicantEmail: email
        },
        actionUrl: `/system/dashboard/applications/${application._id}`
      });
    } catch (notificationError) {
      console.error('Error sending notification:', notificationError);
    }

    res.status(201).json({
      message: 'Application submitted successfully',
      applicationId: application._id
    });
  } catch (error) {
    console.error('Error submitting application:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    // Clean up uploaded files if there's an error
    if (req.files) {
      try {
        Object.values(req.files).flat().forEach(file => {
          if (file && file.path && fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        });
      } catch (cleanupError) {
        console.error('Error cleaning up files:', cleanupError);
      }
    }
    
    // Provide more detailed error message in development
    const isDevelopment = process.env.NODE_ENV !== 'production';
    const errorMessage = isDevelopment 
      ? `Server error: ${error.message}` 
      : 'An error occurred while submitting your application. Please try again.';
    
    res.status(500).json({ 
      message: errorMessage,
      ...(isDevelopment && { details: error.message, stack: error.stack })
    });
  }
});

// @route   GET /api/applications
// @desc    Get all applications (Admin only)
// @access  Private
router.get('/', adminAuth, async (req, res) => {
  try {

    const {
      page = 1,
      limit = 10,
      jobId,
      status,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (jobId) {
      filter.jobId = jobId;
    }
    
    if (status) {
      filter.status = status;
    }
    
    if (search) {
      filter.$or = [
        { 'applicant.firstName': { $regex: search, $options: 'i' } },
        { 'applicant.lastName': { $regex: search, $options: 'i' } },
        { 'applicant.email': { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const applications = await JobApplication.find(filter)
      .populate('jobId', 'title category location')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    // Get total count for pagination
    const total = await JobApplication.countDocuments(filter);

    res.json({
      applications,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalApplications: total
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/applications/stats
// @desc    Get application statistics (Admin only)
// @access  Private
router.get('/stats', adminAuth, async (req, res) => {
  try {

    const stats = await JobApplication.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          pending: { $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] } },
          reviewed: { $sum: { $cond: [{ $eq: ['$status', 'Reviewed'] }, 1, 0] } },
          shortlisted: { $sum: { $cond: [{ $eq: ['$status', 'Shortlisted'] }, 1, 0] } },
          rejected: { $sum: { $cond: [{ $eq: ['$status', 'Rejected'] }, 1, 0] } },
          hired: { $sum: { $cond: [{ $eq: ['$status', 'Hired'] }, 1, 0] } }
        }
      }
    ]);

    // Get recent applications (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recent = await JobApplication.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    const statsData = stats[0] || {
      total: 0,
      pending: 0,
      reviewed: 0,
      shortlisted: 0,
      rejected: 0,
      hired: 0
    };
    
    // Add recent count to stats
    statsData.recent = recent;
    
    res.json({
      success: true,
      data: statsData,
      // Also return at root level for backward compatibility
      ...statsData
    });
  } catch (error) {
    console.error('Error fetching application stats:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/applications/stats/overview
// @desc    Get application statistics overview (Admin only)
// @access  Private
router.get('/stats/overview', adminAuth, async (req, res) => {
  try {

    const stats = await JobApplication.aggregate([
      {
        $group: {
          _id: null,
          totalApplications: { $sum: 1 },
          pendingApplications: { $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] } },
          underReviewApplications: { $sum: { $cond: [{ $eq: ['$status', 'Under Review'] }, 1, 0] } },
          shortlistedApplications: { $sum: { $cond: [{ $eq: ['$status', 'Shortlisted'] }, 1, 0] } },
          interviewApplications: { $sum: { $cond: [{ $eq: ['$status', 'Interview Scheduled'] }, 1, 0] } },
          rejectedApplications: { $sum: { $cond: [{ $eq: ['$status', 'Rejected'] }, 1, 0] } },
          hiredApplications: { $sum: { $cond: [{ $eq: ['$status', 'Hired'] }, 1, 0] } }
        }
      }
    ]);

    const recentApplications = await JobApplication.find()
      .populate('jobId', 'title')
      .sort({ createdAt: -1 })
      .limit(5);

    const sourceStats = await JobApplication.aggregate([
      {
        $group: {
          _id: '$source',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      overview: stats[0] || {
        totalApplications: 0,
        pendingApplications: 0,
        underReviewApplications: 0,
        shortlistedApplications: 0,
        interviewApplications: 0,
        rejectedApplications: 0,
        hiredApplications: 0
      },
      recentApplications,
      sourceStats
    });
  } catch (error) {
    console.error('Error fetching application stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/applications/admin
// @desc    Get all applications with admin filtering (Admin only)
// @access  Private
router.get('/admin', adminAuth, async (req, res) => {
  try {

    const {
      page = 1,
      limit = 20,
      jobId,
      status,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (jobId) {
      filter.jobId = jobId;
    }
    
    if (status) {
      filter.status = status;
    }
    
    if (search) {
      filter.$or = [
        { 'applicant.firstName': { $regex: search, $options: 'i' } },
        { 'applicant.lastName': { $regex: search, $options: 'i' } },
        { 'applicant.email': { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const applications = await JobApplication.find(filter)
      .populate('jobId', 'title category location')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    // Get total count for pagination
    const total = await JobApplication.countDocuments(filter);

    res.json({
      success: true,
      data: {
        applications,
        pagination: {
          totalPages: Math.ceil(total / limit),
          currentPage: parseInt(page),
          totalApplications: total
        }
      }
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/applications/:id
// @desc    Get application by ID (Admin only)
// @access  Private
router.get('/:id', adminAuth, async (req, res) => {
  try {

    const application = await JobApplication.findById(req.params.id)
      .populate('jobId', 'title category location description requirements benefits');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json(application);
  } catch (error) {
    console.error('Error fetching application:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PATCH /api/applications/:id/status
// @desc    Update application status (Admin only)
// @access  Private
router.patch('/:id/status', adminAuth, async (req, res) => {
  try {

    const { status, notes } = req.body;

    const application = await JobApplication.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    application.status = status;

    // Add note if provided
    if (notes) {
      application.notes.push({
        content: notes,
        author: req.user.name || req.user.email
      });
    }

    await application.save();

    res.json(application);
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PATCH /api/applications/:id/interview
// @desc    Schedule interview (Admin only)
// @access  Private
router.patch('/:id/interview', adminAuth, async (req, res) => {
  try {

    const { scheduledDate, interviewType, interviewer, notes } = req.body;

    const application = await JobApplication.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    application.interviewSchedule = {
      scheduledDate: new Date(scheduledDate),
      interviewType,
      interviewer,
      notes
    };

    application.status = 'Interview Scheduled';

    await application.save();

    res.json(application);
  } catch (error) {
    console.error('Error scheduling interview:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/applications/:id/notes
// @desc    Add note to application (Admin only)
// @access  Private
router.post('/:id/notes', adminAuth, async (req, res) => {
  try {

    const { content } = req.body;

    const application = await JobApplication.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    application.notes.push({
      content,
      author: req.user.name || req.user.email
    });

    await application.save();

    res.json(application.notes);
  } catch (error) {
    console.error('Error adding note:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/applications/:id
// @desc    Delete application (Admin only)
// @access  Private
router.delete('/:id', adminAuth, async (req, res) => {
  try {

    const application = await JobApplication.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Delete uploaded files
    if (application.resume && fs.existsSync(application.resume.path)) {
      fs.unlinkSync(application.resume.path);
    }

    if (application.additionalFiles) {
      application.additionalFiles.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }

    await JobApplication.findByIdAndDelete(req.params.id);

    res.json({ message: 'Application deleted successfully' });
  } catch (error) {
    console.error('Error deleting application:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PATCH /api/applications/admin/:id
// @desc    Update application (Admin only)
// @access  Private
router.patch('/admin/:id', adminAuth, async (req, res) => {
  try {

    const { status, notes, interviewSchedule } = req.body;

    const application = await JobApplication.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (status) {
      application.status = status;
    }

    if (notes !== undefined) {
      application.notes = notes;
    }

    if (interviewSchedule) {
      application.interviewSchedule = interviewSchedule;
    }

    await application.save();

    res.json({ success: true, data: application });
  } catch (error) {
    console.error('Error updating application:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   DELETE /api/applications/admin/:id
// @desc    Delete application (Admin only)
// @access  Private
router.delete('/admin/:id', adminAuth, async (req, res) => {
  try {

    const application = await JobApplication.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Delete uploaded files
    if (application.resume && fs.existsSync(application.resume.path)) {
      fs.unlinkSync(application.resume.path);
    }

    if (application.additionalFiles) {
      application.additionalFiles.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }

    await JobApplication.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Application deleted successfully' });
  } catch (error) {
    console.error('Error deleting application:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/applications/admin/:id/resume
// @desc    Download application resume (Admin only)
// @access  Private
router.get('/admin/:id/resume', adminAuth, async (req, res) => {
  try {

    const application = await JobApplication.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (!application.resume || !application.resume.path) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    if (!fs.existsSync(application.resume.path)) {
      return res.status(404).json({ message: 'Resume file not found' });
    }

    res.download(application.resume.path, application.resume.originalName);
  } catch (error) {
    console.error('Error downloading resume:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
