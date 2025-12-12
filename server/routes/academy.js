const express = require('express');
const Course = require('../models/Course');
const Trainer = require('../models/Trainer');
const Enrollment = require('../models/Enrollment');
const Coupon = require('../models/Coupon');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Public routes - no authentication required

// Get all courses with filtering and pagination
router.get('/courses', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      level,
      difficulty,
      search,
      sort = 'createdAt',
      order = 'desc',
      featured,
      minPrice,
      maxPrice
    } = req.query;

    const query = { isActive: true };
    
    // Apply filters
    if (category) query.category = category;
    if (level) query.level = level;
    if (difficulty) query.difficulty = difficulty;
    if (featured === 'true') query.isFeatured = true;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (search) {
      query.$text = { $search: search };
    }

    const sortObj = {};
    sortObj[sort] = order === 'desc' ? -1 : 1;

    const courses = await Course.find(query)
      .populate('trainer', 'name bio avatar expertise rating')
      .sort(sortObj)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-syllabus -prerequisites -learningOutcomes');

    const total = await Course.countDocuments(query);

    res.json({
      courses,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single course by slug
router.get('/courses/:slug', async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug, isActive: true })
      .populate('trainer', 'name bio avatar expertise experience education certifications rating reviewCount');

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all trainers
router.get('/trainers', async (req, res) => {
  try {
    const { expertise, search } = req.query;
    
    const query = { isActive: true, isVerified: true };
    
    if (expertise) query.expertise = { $in: [expertise] };
    if (search) {
      query.$text = { $search: search };
    }

    const trainers = await Trainer.find(query)
      .select('-email -phone -linkedin -twitter -website -languages -hourlyRate -availability -timezone')
      .sort({ rating: -1, reviewCount: -1 });

    res.json(trainers);
  } catch (error) {
    console.error('Get trainers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single trainer
router.get('/trainers/:id', async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id)
      .populate('coursesTaught', 'title slug image price duration level');

    if (!trainer || !trainer.isActive) {
      return res.status(404).json({ message: 'Trainer not found' });
    }

    res.json(trainer);
  } catch (error) {
    console.error('Get trainer error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Validate coupon code
router.post('/validate-coupon', async (req, res) => {
  try {
    const { code, courseId } = req.body;

    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      isActive: true,
      validFrom: { $lte: new Date() },
      validUntil: { $gte: new Date() }
    });

    if (!coupon) {
      return res.status(400).json({ message: 'Invalid or expired coupon' });
    }

    // Check usage limit
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ message: 'Coupon usage limit exceeded' });
    }

    // Get course details for validation
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if coupon applies to this course
    if (coupon.applicableCourses.length > 0 && !coupon.applicableCourses.includes(courseId)) {
      return res.status(400).json({ message: 'Coupon not applicable to this course' });
    }

    if (coupon.applicableCategories.length > 0 && !coupon.applicableCategories.includes(course.category)) {
      return res.status(400).json({ message: 'Coupon not applicable to this course category' });
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.type === 'percentage') {
      discountAmount = (course.price * coupon.value) / 100;
      if (coupon.maxDiscount) {
        discountAmount = Math.min(discountAmount, coupon.maxDiscount);
      }
    } else {
      discountAmount = coupon.value;
    }

    const finalPrice = Math.max(0, course.price - discountAmount);

    res.json({
      valid: true,
      discountAmount,
      finalPrice,
      coupon: {
        code: coupon.code,
        name: coupon.name,
        type: coupon.type,
        value: coupon.value
      }
    });
  } catch (error) {
    console.error('Validate coupon error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Protected routes - authentication required

// Enroll in course
router.post('/enroll', auth, async (req, res) => {
  try {
    const { courseId, couponCode } = req.body;
    const userId = req.user._id;

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      student: userId,
      course: courseId
    });

    if (existingEnrollment) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    // Get course details
    const course = await Course.findById(courseId);
    if (!course || !course.isActive) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if course has space
    if (course.currentStudents >= course.maxStudents) {
      return res.status(400).json({ message: 'Course is full' });
    }

    let finalPrice = course.price;
    let discountAmount = 0;
    let appliedCoupon = null;

    // Apply coupon if provided
    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.toUpperCase(),
        isActive: true,
        validFrom: { $lte: new Date() },
        validUntil: { $gte: new Date() }
      });

      if (coupon && coupon.usageLimit && coupon.usedCount < coupon.usageLimit) {
        if (coupon.type === 'percentage') {
          discountAmount = (course.price * coupon.value) / 100;
          if (coupon.maxDiscount) {
            discountAmount = Math.min(discountAmount, coupon.maxDiscount);
          }
        } else {
          discountAmount = coupon.value;
        }
        finalPrice = Math.max(0, course.price - discountAmount);
        appliedCoupon = coupon._id;
      }
    }

    // Create enrollment
    const enrollment = new Enrollment({
      student: userId,
      course: courseId,
      trainer: course.trainer,
      startDate: course.startDate || new Date(),
      endDate: course.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      payment: {
        amount: finalPrice,
        currency: 'USD',
        paymentMethod: 'Online',
        transactionId: `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        status: 'Pending'
      },
      discount: appliedCoupon ? {
        code: couponCode,
        amount: discountAmount
      } : undefined
    });

    await enrollment.save();

    // Update course enrollment count
    await Course.findByIdAndUpdate(courseId, {
      $inc: { currentStudents: 1, enrollmentCount: 1 }
    });

    // Update coupon usage if applied
    if (appliedCoupon) {
      await Coupon.findByIdAndUpdate(appliedCoupon, {
        $inc: { usedCount: 1 },
        $push: {
          usageHistory: {
            user: userId,
            course: courseId,
            discountAmount: discountAmount,
            usedAt: new Date()
          }
        }
      });
    }

    res.status(201).json({
      message: 'Enrollment successful',
      enrollment: {
        id: enrollment._id,
        course: course.title,
        amount: finalPrice,
        transactionId: enrollment.payment.transactionId
      }
    });
  } catch (error) {
    console.error('Enrollment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user enrollments
router.get('/my-enrollments', auth, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id })
      .populate('course', 'title slug image price duration level category')
      .populate('trainer', 'name avatar expertise')
      .sort({ enrollmentDate: -1 });

    res.json(enrollments);
  } catch (error) {
    console.error('Get enrollments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update enrollment progress
router.put('/enrollments/:id/progress', auth, async (req, res) => {
  try {
    const { progress, completedLessons } = req.body;

    const enrollment = await Enrollment.findOne({
      _id: req.params.id,
      student: req.user._id
    });

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    enrollment.progress = progress;
    if (completedLessons) {
      enrollment.completedLessons = completedLessons;
    }

    if (progress >= 100) {
      enrollment.status = 'Completed';
      enrollment.completionDate = new Date();
    }

    await enrollment.save();

    res.json({ message: 'Progress updated successfully' });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit course feedback
router.post('/enrollments/:id/feedback', auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const enrollment = await Enrollment.findOne({
      _id: req.params.id,
      student: req.user._id,
      status: 'Completed'
    });

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found or not completed' });
    }

    enrollment.feedback = {
      rating,
      comment,
      submittedAt: new Date()
    };

    await enrollment.save();

    // Update course rating
    const course = await Course.findById(enrollment.course);
    if (course) {
      const totalRating = (course.rating * course.reviewCount) + rating;
      const newReviewCount = course.reviewCount + 1;
      course.rating = totalRating / newReviewCount;
      course.reviewCount = newReviewCount;
      await course.save();
    }

    // Update trainer rating
    const trainer = await Trainer.findById(enrollment.trainer);
    if (trainer) {
      const totalRating = (trainer.rating * trainer.reviewCount) + rating;
      const newReviewCount = trainer.reviewCount + 1;
      trainer.rating = totalRating / newReviewCount;
      trainer.reviewCount = newReviewCount;
      await trainer.save();
    }

    res.json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    console.error('Submit feedback error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin routes - require authentication
router.get('/admin/courses', auth, async (req, res) => {
  try {
    const courses = await Course.find()
      .populate('trainer', 'name email')
      .sort({ createdAt: -1 });

    res.json(courses);
  } catch (error) {
    console.error('Get admin courses error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/admin/courses', auth, async (req, res) => {
  try {
    const courseData = req.body;
    const course = new Course(courseData);
    await course.save();

    res.status(201).json({
      message: 'Course created successfully',
      course
    });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/admin/courses/:id', auth, async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json({
      message: 'Course updated successfully',
      course
    });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/admin/courses/:id', auth, async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/admin/trainers', auth, async (req, res) => {
  try {
    const trainers = await Trainer.find().sort({ createdAt: -1 });
    res.json(trainers);
  } catch (error) {
    console.error('Get trainers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/admin/trainers', auth, async (req, res) => {
  try {
    const trainerData = req.body;
    const trainer = new Trainer(trainerData);
    await trainer.save();

    res.status(201).json({
      message: 'Trainer created successfully',
      trainer
    });
  } catch (error) {
    console.error('Create trainer error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/admin/enrollments', auth, async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate('student', 'name email')
      .populate('course', 'title')
      .populate('trainer', 'name')
      .sort({ enrollmentDate: -1 });

    res.json(enrollments);
  } catch (error) {
    console.error('Get enrollments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/admin/analytics', auth, async (req, res) => {
  try {
    const [
      totalCourses,
      totalStudents,
      totalRevenue,
      activeEnrollments,
      recentEnrollments
    ] = await Promise.all([
      Course.countDocuments(),
      Enrollment.countDocuments(),
      Enrollment.aggregate([
        { $group: { _id: null, total: { $sum: '$payment.amount' } } }
      ]),
      Enrollment.countDocuments({ status: 'In Progress' }),
      Enrollment.find()
        .populate('student', 'name')
        .populate('course', 'title')
        .sort({ enrollmentDate: -1 })
        .limit(10)
    ]);

    res.json({
      totalCourses,
      totalStudents,
      totalRevenue: totalRevenue[0]?.total || 0,
      activeEnrollments,
      recentEnrollments
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
