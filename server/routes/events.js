const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const { authenticateToken, requireRole } = require('../middleware/auth');

// Public routes

// Get all published events
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      eventType,
      search,
      featured,
      upcoming,
      sortBy = 'startDate',
      sortOrder = 'asc'
    } = req.query;

    // Build query
    const query = { status: 'published' };
    
    if (category) query.category = category;
    if (eventType) query.eventType = eventType;
    if (featured === 'true') query.featured = true;
    
    if (upcoming === 'true') {
      query.startDate = { $gt: new Date() };
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const events = await Event.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    // Get total count
    const total = await Event.countDocuments(query);

    res.json({
      success: true,
      data: events,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get featured events
router.get('/featured', async (req, res) => {
  try {
    const events = await Event.getFeatured();
    res.json({
      success: true,
      data: events
    });
  } catch (error) {
    console.error('Get featured events error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get upcoming events
router.get('/upcoming', async (req, res) => {
  try {
    const { limit = 6 } = req.query;
    const events = await Event.getUpcoming(parseInt(limit));
    res.json({
      success: true,
      data: events
    });
  } catch (error) {
    console.error('Get upcoming events error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get event by slug
router.get('/:slug', async (req, res) => {
  try {
    const event = await Event.findOne({ 
      slug: req.params.slug,
      status: 'published'
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      data: event
    });

  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Register for event
router.post('/:slug/register', async (req, res) => {
  try {
    const { name, email, company } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required'
      });
    }

    const event = await Event.findOne({ 
      slug: req.params.slug,
      status: 'published'
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if already registered
    const alreadyRegistered = event.registeredAttendees.find(
      attendee => attendee.email === email
    );

    if (alreadyRegistered) {
      return res.status(400).json({
        success: false,
        message: 'You are already registered for this event'
      });
    }

    // Register attendee
    const result = event.registerAttendee({ name, email, company });
    await event.save();

    res.json({
      success: true,
      message: result.message,
      status: result.status
    });

  } catch (error) {
    console.error('Event registration error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
});

// Cancel event registration
router.post('/:slug/cancel-registration', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const event = await Event.findOne({ 
      slug: req.params.slug,
      status: 'published'
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    const result = event.cancelRegistration(email);
    await event.save();

    res.json({
      success: true,
      message: result.message
    });

  } catch (error) {
    console.error('Cancel registration error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
});

// Admin routes (protected)

// Get all events (admin)
router.get('/admin/all', authenticateToken, requireRole(['admin', 'manager']), async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      category,
      eventType,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = {};
    
    if (status) query.status = status;
    if (category) query.category = category;
    if (eventType) query.eventType = eventType;
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const events = await Event.find(query)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    // Get total count
    const total = await Event.countDocuments(query);

    res.json({
      success: true,
      data: events,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get admin events error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create new event
router.post('/admin', authenticateToken, requireRole(['admin', 'manager']), async (req, res) => {
  try {
    const eventData = {
      ...req.body,
      createdBy: req.user.id
    };

    const event = new Event(eventData);
    await event.save();

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: event
    });

  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
});

// Get event by ID (admin)
router.get('/admin/:id', authenticateToken, requireRole(['admin', 'manager']), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      data: event
    });

  } catch (error) {
    console.error('Get admin event error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update event
router.put('/admin/:id', authenticateToken, requireRole(['admin', 'manager']), async (req, res) => {
  try {
    const eventData = {
      ...req.body,
      updatedBy: req.user.id
    };

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      eventData,
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      message: 'Event updated successfully',
      data: event
    });

  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
});

// Delete event
router.delete('/admin/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });

  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get event statistics
router.get('/admin/stats/overview', authenticateToken, requireRole(['admin', 'manager']), async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();
    const publishedEvents = await Event.countDocuments({ status: 'published' });
    const draftEvents = await Event.countDocuments({ status: 'draft' });
    const upcomingEvents = await Event.countDocuments({
      status: 'published',
      startDate: { $gt: new Date() }
    });

    // Get events by category
    const byCategory = await Event.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get events by type
    const byType = await Event.aggregate([
      {
        $group: {
          _id: '$eventType',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get total registrations
    const totalRegistrations = await Event.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: { $size: '$registeredAttendees' } }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        totalEvents,
        publishedEvents,
        draftEvents,
        upcomingEvents,
        byCategory,
        byType,
        totalRegistrations: totalRegistrations[0]?.total || 0
      }
    });

  } catch (error) {
    console.error('Get event stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get event registrations
router.get('/admin/:id/registrations', authenticateToken, requireRole(['admin', 'manager']), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      data: {
        registeredAttendees: event.registeredAttendees,
        waitlist: event.waitlist,
        totalRegistered: event.registeredAttendees.length,
        totalWaitlist: event.waitlist.length,
        capacity: event.capacity,
        maxRegistrations: event.maxRegistrations
      }
    });

  } catch (error) {
    console.error('Get event registrations error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update attendee status
router.patch('/admin/:id/attendee/:email/status', authenticateToken, requireRole(['admin', 'manager']), async (req, res) => {
  try {
    const { status } = req.body;
    const { email } = req.params;

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    const attendee = event.registeredAttendees.find(a => a.email === email);
    if (!attendee) {
      return res.status(404).json({
        success: false,
        message: 'Attendee not found'
      });
    }

    attendee.status = status;
    await event.save();

    res.json({
      success: true,
      message: 'Attendee status updated successfully'
    });

  } catch (error) {
    console.error('Update attendee status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
