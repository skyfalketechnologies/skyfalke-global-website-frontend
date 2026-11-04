const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const Service = require('../models/Service');
const { accountingAuth } = require('../middleware/auth');

// Get all saved customers (most recently invoiced first)
router.get('/', accountingAuth, async (req, res) => {
  try {
    const filter = {};
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
        { company: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    const customers = await Customer.find(filter)
      .sort({ lastInvoicedAt: -1, name: 1 })
      .limit(parseInt(req.query.limit) || 200);

    res.json({ success: true, data: customers });
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch customers' });
  }
});

// Create or update a customer manually
router.post('/', accountingAuth, async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Name and email are required' });
    }
    const customer = await Customer.findOneAndUpdate(
      { email: email.toLowerCase() },
      { $set: req.body },
      { new: true, upsert: true, runValidators: true }
    );
    res.status(201).json({ success: true, data: customer });
  } catch (error) {
    console.error('Error saving customer:', error);
    res.status(500).json({ success: false, message: 'Failed to save customer' });
  }
});

// Delete a saved customer
router.delete('/:id', accountingAuth, async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }
    res.json({ success: true, message: 'Customer deleted successfully' });
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).json({ success: false, message: 'Failed to delete customer' });
  }
});

// Get all saved services (most recently used first)
router.get('/services', accountingAuth, async (req, res) => {
  try {
    const services = await Service.find({})
      .sort({ lastUsedAt: -1, description: 1 })
      .limit(parseInt(req.query.limit) || 200);
    res.json({ success: true, data: services });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch services' });
  }
});

// Delete a saved service
router.delete('/services/:id', accountingAuth, async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    res.json({ success: true, message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ success: false, message: 'Failed to delete service' });
  }
});

module.exports = router;
