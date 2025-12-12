const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth, adminAuth, superAdminAuth } = require('../middleware/auth');
const dbCheck = require('../middleware/dbCheck');

const router = express.Router();

// Register admin user (only for initial setup)
router.post('/register', dbCheck, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      role: role || 'editor'
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    // Return full user object (excluding password)
    const userObject = user.toObject();
    delete userObject.password;
    
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: userObject
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login
router.post('/login', dbCheck, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email, isActive: true });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    // Return full user object (excluding password)
    const userObject = user.toObject();
    delete userObject.password;
    
    res.json({
      message: 'Login successful',
      token,
      user: userObject
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true, runValidators: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    console.error('Update profile error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Change password
router.put('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long' });
    }

    // Get user with password
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users (for admin/project management)
router.get('/users', adminAuth, dbCheck, async (req, res) => {
  try {
    const users = await User.find({ isActive: true })
      .select('name email avatar role')
      .sort({ name: 1 });
    
    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
});

// ========== STAFF MANAGEMENT ROUTES (Super Admin Only) ==========

// Get all staff accounts
router.get('/staff', superAdminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, role, search, isActive } = req.query;
    const query = {};

    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get staff error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch staff accounts' });
  }
});

// Get single staff account
router.get('/staff/:id', superAdminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'Staff account not found' });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    console.error('Get staff error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch staff account' });
  }
});

// Create staff account
router.post('/staff', superAdminAuth, async (req, res) => {
  try {
    const { name, email, password, role, isActive } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    // Validate role
    const validRoles = ['super_admin', 'admin', 'editor'];
    if (role && !validRoles.includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    // Don't allow creating another super_admin
    if (role === 'super_admin') {
      return res.status(403).json({ success: false, message: 'Cannot create super admin account' });
    }

    const user = new User({
      name,
      email,
      password: password || 'password123', // Default password
      role: role || 'editor',
      isActive: isActive !== undefined ? isActive : true
    });

    await user.save();
    const userObject = user.toObject();
    delete userObject.password;

    res.status(201).json({ success: true, data: userObject });
  } catch (error) {
    console.error('Create staff error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update staff account
router.put('/staff/:id', superAdminAuth, async (req, res) => {
  try {
    const { name, email, role, isActive, password } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'Staff account not found' });
    }

    // Don't allow changing super_admin role
    if (user.role === 'super_admin' && role && role !== 'super_admin') {
      return res.status(403).json({ success: false, message: 'Cannot change super admin role' });
    }

    // Don't allow creating another super_admin
    if (role === 'super_admin' && user.role !== 'super_admin') {
      return res.status(403).json({ success: false, message: 'Cannot assign super admin role' });
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (isActive !== undefined) user.isActive = isActive;
    if (password) user.password = password; // Will be hashed by pre-save hook

    await user.save();
    const userObject = user.toObject();
    delete userObject.password;

    res.json({ success: true, data: userObject });
  } catch (error) {
    console.error('Update staff error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }
    res.status(400).json({ success: false, message: error.message });
  }
});

// Delete staff account (soft delete by setting isActive to false)
router.delete('/staff/:id', superAdminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'Staff account not found' });
    }

    // Don't allow deleting super_admin
    if (user.role === 'super_admin') {
      return res.status(403).json({ success: false, message: 'Cannot delete super admin account' });
    }

    // Soft delete
    user.isActive = false;
    await user.save();

    res.json({ success: true, message: 'Staff account deactivated successfully' });
  } catch (error) {
    console.error('Delete staff error:', error);
    res.status(500).json({ success: false, message: 'Failed to deactivate staff account' });
  }
});

// Reactivate staff account
router.post('/staff/:id/reactivate', superAdminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'Staff account not found' });
    }

    user.isActive = true;
    await user.save();

    const userObject = user.toObject();
    delete userObject.password;

    res.json({ success: true, data: userObject });
  } catch (error) {
    console.error('Reactivate staff error:', error);
    res.status(500).json({ success: false, message: 'Failed to reactivate staff account' });
  }
});

module.exports = router;
